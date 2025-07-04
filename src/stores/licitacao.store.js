import { defineStore } from "pinia"
import { ref, computed } from "vue"
import { licitacaoService } from "@services/licitacao.service"
import { decodeHtmlEntities, parseDateDDMMYYYY, trimAndCleanText } from "@utils/formatters"

export const useLicitacaoStore = defineStore("licitacao", () => {
  const licitacoes = ref([])
  const loading = ref(false)
  const error = ref("")
  const leituraStatus = ref(new Map())

  const filtros = ref({
    codigoUasg: "",
    numeroPregao: "",
    statusLeitura: "",
  })

  const licitacoesFiltradas = computed(() => {
    let resultado = licitacoes.value

    if (filtros.value.statusLeitura) {
      resultado = resultado.filter((licitacao) => {
        const lida = leituraStatus.value.get(licitacao.id) || false
        if (filtros.value.statusLeitura === "lida") return lida
        if (filtros.value.statusLeitura === "nao-lida") return !lida
        return true
      })
    }

    return resultado.map((licitacao) => ({
      ...licitacao,
      lida: leituraStatus.value.get(licitacao.id) || false,
    }))
  })

  const licitacoesLidas = computed(() => licitacoesFiltradas.value.filter((l) => l.lida))

  const licitacoesNaoLidas = computed(() => licitacoesFiltradas.value.filter((l) => !l.lida))

  const estatisticas = computed(() => ({
    total: licitacoesFiltradas.value.length,
    lidas: licitacoesLidas.value.length,
    naoLidas: licitacoesNaoLidas.value.length,
  }))

  async function carregarLicitacoes() {
    console.log("Carregando licitações...");
    loading.value = true
    error.value = ""

    try {
      const params = {}
      if (filtros.value.codigoUasg) params.codigoUasg = filtros.value.codigoUasg
      if (filtros.value.numeroPregao) params.numeroPregao = filtros.value.numeroPregao

      const dados = await licitacaoService.buscarLicitacoes(params)
      console.log("Dados recebidos da API (originais):", dados); // Debug 1

      licitacoes.value = (dados.content && dados.content.length > 0)
        ? dados.content.map(licitacao => {
            console.log("Processando licitação:", licitacao.id);
            console.log("  Original objeto:", licitacao.objeto);
            console.log("  Original endereco:", licitacao.endereco);
            console.log("  Original dataAbertura:", licitacao.dataAbertura);

            const cleanedObjeto = trimAndCleanText(licitacao.objeto);
            const cleanedEndereco = licitacao.endereco ? trimAndCleanText(licitacao.endereco) : 'N/A';
            const parsedDate = licitacao.dataAbertura ? parseDateDDMMYYYY(licitacao.dataAbertura) : null;
            const formattedDate = parsedDate ? parsedDate.toISOString() : 'N/A';

            console.log("  Cleaned objeto:", cleanedObjeto);
            console.log("  Cleaned endereco:", cleanedEndereco);
            console.log("  Parsed dataAbertura (Date object):", parsedDate);
            console.log("  Formatted dataAbertura (ISO string):", formattedDate);

            return {
              ...licitacao,
              objeto: cleanedObjeto,
              endereco: cleanedEndereco,
              orgao: licitacao.orgao || 'N/A',
              situacao: licitacao.situacao || 'N/A',
              valorEstimado: licitacao.valorEstimado || 0,
              dataAbertura: formattedDate,
            };
          })
        : [];
      console.log("Licitações após processamento da API (final):", licitacoes.value); // Debug 2

      if (licitacoes.value.length === 0) {
        console.log("Nenhum dado da API, usando dados mock."); // Debug 3
        licitacoes.value = licitacaoService.gerarDadosMock().map(licitacao => ({
          ...licitacao,
          objeto: trimAndCleanText(licitacao.objeto),
          endereco: licitacao.endereco ? trimAndCleanText(licitacao.endereco) : 'N/A',
          orgao: licitacao.orgao || 'N/A',
          situacao: licitacao.situacao || 'N/A',
          valorEstimado: licitacao.valorEstimado || 0,
          dataAbertura: licitacao.dataAbertura ? new Date(licitacao.dataAbertura).toISOString() : 'N/A',
        }))
        console.log("Licitações após processamento mock:", licitacoes.value); // Debug 4
      }
    } catch (err) {
      console.error("Erro ao carregar licitações (catch block):", err); // Debug 5
      error.value = err.message || "Erro ao carregar licitações."
      licitacoes.value = licitacaoService.gerarDadosMock().map(licitacao => ({
        ...licitacao,
        objeto: trimAndCleanText(licitacao.objeto),
        endereco: licitacao.endereco ? trimAndCleanText(licitacao.endereco) : 'N/A',
        orgao: licitacao.orgao || 'N/A',
        situacao: licitacao.situacao || 'N/A',
        valorEstimado: licitacao.valorEstimado || 0,
        dataAbertura: licitacao.dataAbertura ? new Date(licitacao.dataAbertura).toISOString() : 'N/A',
      }))
    } finally {
      loading.value = false
    }
  }

  function aplicarFiltros() {
    carregarLicitacoes()
  }

  function limparFiltros() {
    filtros.value = {
      codigoUasg: "",
      numeroPregao: "",
      statusLeitura: "",
    }
    carregarLicitacoes()
  }

  async function toggleLeitura(licitacaoId) {
    const statusAtual = leituraStatus.value.get(licitacaoId) || false
    leituraStatus.value.set(licitacaoId, !statusAtual)

    console.log(`Tentando marcar licitação ${licitacaoId} como lida: ${!statusAtual}`); // Debug Toggle
    try {
      await licitacaoService.marcarComoLida(licitacaoId, !statusAtual)
      console.log(`Licitação ${licitacaoId} marcada com sucesso no backend.`); // Debug Toggle Success
    } catch (err) {
      console.error("Erro ao atualizar status de leitura no backend:", err)
      leituraStatus.value.set(licitacaoId, statusAtual)
      error.value = "Erro ao atualizar status de leitura."
    }
  }

  return {
    licitacoes,
    loading,
    error,
    filtros,
    leituraStatus,

    licitacoesFiltradas,
    licitacoesLidas,
    licitacoesNaoLidas,
    estatisticas,

    carregarLicitacoes,
    aplicarFiltros,
    limparFiltros,
    toggleLeitura,
  }
})
