package com.effecti.licitacoes.infrastructure.service;

import com.effecti.licitacoes.domain.entity.Licitacao;
import com.effecti.licitacoes.domain.entity.ItemLicitacao;
import com.effecti.licitacoes.domain.repository.LicitacaoRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.context.annotation.DependsOn;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@DependsOn("entityManagerFactory")
public class ComprasNetScrapingService {

    private static final Logger logger = LoggerFactory.getLogger(ComprasNetScrapingService.class);
    private static final String COMPRASNET_BASE_URL = "http://comprasnet.gov.br";
    private static final String COMPRASNET_LICITACOES_URL = COMPRASNET_BASE_URL + "/ConsultaLicitacoes/ConsLicitacaoDia.asp";
    private static final String COMPRASNET_DETALHES_URL_FORMAT = COMPRASNET_BASE_URL + "/ConsultaLicitacoes/download/download_editais_detalhe.asp?coduasg=%s&modprp=%s&numprp=%s";

    private final LicitacaoRepository repository;

    public ComprasNetScrapingService(LicitacaoRepository repository) {
        this.repository = repository;
    }

    @Scheduled(fixedDelay = 30, timeUnit = TimeUnit.MINUTES)
    @Transactional
    public void capturarLicitacoes() {
        logger.info("Iniciando captura de licitações do site ComprasNet via scraping");

        try {
            Document doc = Jsoup.connect(COMPRASNET_LICITACOES_URL)
                    .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36")
                    .timeout(10 * 1000) // 10 segundos de timeout
                    .get();

            logger.info("HTML da página de licitações do ComprasNet (primeiros 500 caracteres):\n{}", doc.html().substring(0, Math.min(doc.html().length(), 500)));

            List<Licitacao> novasLicitacoes = new ArrayList<>();

            Elements licitacaoForms = doc.select("form[name^=Form]");

            if (licitacaoForms.isEmpty()) {
                logger.warn("Nenhum formulário de licitação encontrado. Verifique o HTML da página ou o seletor.");
            }

            for (Element form : licitacaoForms) {
                try {
                    // Extrair dados da Licitacao
                    Element tdTex3 = form.selectFirst("table.td");
                    if (tdTex3 != null) {
                        tdTex3 = tdTex3.selectFirst("tbody");
                        if (tdTex3 != null) {
                            tdTex3 = tdTex3.selectFirst("tr.tex3");
                            if (tdTex3 != null) {
                                tdTex3 = tdTex3.selectFirst("td");
                            }
                        }
                    }

                    if (tdTex3 == null) {
                        logger.warn("TD com classe tex3 não encontrado no formulário: {}", form.html());
                        continue;
                    }

                    String htmlContent = tdTex3.html();
                    logger.trace("Conteúdo HTML do TD (completo):\n{}", htmlContent);

                    String codigoUasgStr = extractTextByRegex(htmlContent, "C\\u00F3digo da UASG: (\\d+)");
                    logger.trace("Codigo UASG extraído: {}", codigoUasgStr);
                    Integer codigoUasg = codigoUasgStr != null ? Integer.parseInt(codigoUasgStr) : null;

                    String numeroPregao = extractTextByRegex(htmlContent, "Preg\\u00E3o Eletr\\u00F4nico N\\u00BA\\s*(\\d+\\/\\d{4})");
                    logger.trace("Numero Pregão extraído: {}", numeroPregao);

                    String objeto = extractTextByRegex(htmlContent, "<b>Objeto:</b>\\s*.*?\\s*([\\s\\S]*?)(?=<br><b>Edital a partir de:</b>)");
                    if (objeto != null) { objeto = objeto.trim(); }
                    logger.trace("Objeto extraído: {}", objeto);

                    String dataAbertura = extractTextByRegex(htmlContent, "Edital a partir de:</b>&nbsp;(\\d{2}\\/\\d{2}\\/\\d{4})");
                    logger.trace("Data Abertura extraída: {}", dataAbertura);
                    String modalidade = "Pregão Eletrônico";
                    String endereco = extractTextByRegex(htmlContent, "Endere\\u00E7o:</b>\\s*([\\s\\S]*?)(?=<br><b>Telefone:</b>)");
                    if (endereco != null) { endereco = endereco.trim().replaceAll("\\s{2,}", " ").replace("-", "").trim(); }
                    logger.trace("Endereço extraído: {}", endereco);

                    Element itensButton = form.selectFirst("input[name=itens]");
                    String codUasgItem = null;
                    String modPrpItem = null;
                    String numPrpItem = null;

                    if (itensButton != null) {
                        String onClick = itensButton.attr("onClick");
                        Pattern pattern = Pattern.compile("coduasg=(\\d+)&modprp=(\\d+)&numprp=(\\d+)");
                        Matcher matcher = pattern.matcher(onClick);
                        if (matcher.find()) {
                            codUasgItem = matcher.group(1);
                            modPrpItem = matcher.group(2);
                            numPrpItem = matcher.group(3);
                        }
                    }

                    if (codigoUasg != null && numeroPregao != null && objeto != null && dataAbertura != null && endereco != null) {
                        if (!repository.existsByCodigoUasgAndNumeroPregao(codigoUasg, numeroPregao)) {
                            Licitacao licitacao = new Licitacao(
                                    codigoUasg, numeroPregao, objeto, dataAbertura, modalidade, endereco);

                            if (codUasgItem != null && modPrpItem != null && numPrpItem != null) {
                                List<ItemLicitacao> itens = extrairItensLicitacao(codUasgItem, modPrpItem, numPrpItem);
                                for (ItemLicitacao item : itens) {
                                    licitacao.addItem(item);
                                }
                            }
                            novasLicitacoes.add(licitacao);
                        } else {
                            logger.info("Licitação já existe no banco de dados e será ignorada: UASG={}, Pregão={}",
                                    codigoUasg, numeroPregao);
                        }

                    } else {
                        logger.warn("Dados incompletos para uma licitação (UASG, Pregão, Objeto, Data Abertura ou Endereço ausente).");
                        logger.debug("HTML da licitação incompleta: {}", htmlContent);
                    }

                } catch (Exception e) {
                    logger.error("Erro ao parsear formulário de licitação: {}", form.html(), e);
                }
            }

            logger.info("Total de novas licitações para salvar: {}", novasLicitacoes.size());

            if (!novasLicitacoes.isEmpty()) {
                repository.saveAll(novasLicitacoes);
                logger.info("Capturadas {} novas licitações do ComprasNet", novasLicitacoes.size());
            } else {
                logger.info("Nenhuma nova licitação encontrada no ComprasNet");
            }

        } catch (IOException e) {
            logger.error("Erro ao conectar ou ler a página do ComprasNet", e);
        } catch (Exception e) {
            logger.error("Erro inesperado ao capturar licitações via scraping", e);
        }
    }

    private String extractTextByRegex(String html, String regex) {
        Pattern pattern = Pattern.compile(regex);
        Matcher matcher = pattern.matcher(html);
        if (matcher.find()) {
            return matcher.group(1).trim();
        }
        return null;
    }

    private List<ItemLicitacao> extrairItensLicitacao(String codUasg, String modPrp, String numPrp) throws IOException {
        String itemDetailsUrl = String.format(COMPRASNET_DETALHES_URL_FORMAT, codUasg, modPrp, numPrp);
        logger.info("Acessando URL de detalhes dos itens: {}", itemDetailsUrl);

        Document itemDoc = Jsoup.connect(itemDetailsUrl)
                .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36")
                .timeout(10 * 1000)
                .get();

        List<ItemLicitacao> itens = new ArrayList<>();

        Elements itemTableRows = itemDoc.select("table.tex3 > tbody > tr");

        for (Element row : itemTableRows) {
            Elements tdElements = row.select("td");
            if (tdElements.size() > 1) {
                Element itemCell = tdElements.get(1);

                String numeroItemDescricao = itemCell.selectFirst("span.tex3b") != null ? itemCell.selectFirst("span.tex3b").text() : null;
                String descricaoDetalhadaCompleta = itemCell.selectFirst("span.tex3") != null ? itemCell.selectFirst("span.tex3").html() : null;

                if (numeroItemDescricao == null || descricaoDetalhadaCompleta == null) continue;

                Integer numeroItem = null;
                Pattern itemNumPattern = Pattern.compile("(\\d+) - [\\s\\S]*");
                Matcher itemNumMatcher = itemNumPattern.matcher(numeroItemDescricao);
                if (itemNumMatcher.find()) {
                    try {
                        numeroItem = Integer.parseInt(itemNumMatcher.group(1));
                    } catch (NumberFormatException e) {
                        logger.warn("Não foi possível parsear o número do item de: {}", numeroItemDescricao);
                    }
                }

                Integer quantidade = null;
                String unidadeFornecimento = null;
                Pattern quantUnidadePattern = Pattern.compile("Quantidade:\\s*(\\d+)<br>Unidade de fornecimento:\\s*([^<]+)");
                Matcher quantUnidadeMatcher = quantUnidadePattern.matcher(descricaoDetalhadaCompleta);
                if (quantUnidadeMatcher.find()) {
                    try {
                        quantidade = Integer.parseInt(quantUnidadeMatcher.group(1));
                        unidadeFornecimento = quantUnidadeMatcher.group(2).trim();
                    } catch (NumberFormatException e) {
                        logger.warn("Não foi possível parsear quantidade de: {}", descricaoDetalhadaCompleta);
                    }
                }

                String descricaoParaSalvar = descricaoDetalhadaCompleta.replaceAll("Quantidade:\\s*\\d+<br>Unidade de fornecimento:\\s*[^<]+", "").trim();

                if (numeroItem != null && quantidade != null && unidadeFornecimento != null) {
                    ItemLicitacao item = new ItemLicitacao();
                    item.setNumeroItem(numeroItem);
                    item.setDescricao(descricaoParaSalvar);
                    item.setQuantidade(quantidade);
                    item.setUnidadeFornecimento(unidadeFornecimento);
                    itens.add(item);
                } else {
                    logger.warn("Dados de item incompletos para: {}. Quantidade={}, Unidade={}",
                            numeroItemDescricao, quantidade, unidadeFornecimento);
                }
            }
        }

        return itens;
    }
} 