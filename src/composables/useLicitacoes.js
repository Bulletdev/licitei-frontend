import { computed } from "vue"
import { useLicitacaoStore } from '@/stores/licitacao.store'
import { formatarData, formatarValor } from "@/utils/formatters"

export function useLicitacoes() {
  const store = useLicitacaoStore()

  const licitacoes = computed(() => store.licitacoes)

  const {
    licitacoesFiltradas,
    licitacoesLidas,
    licitacoesNaoLidas,
    loading,
    error,
    filtros,
    estatisticas,
    carregarLicitacoes,
    aplicarFiltros,
    limparFiltros,
    toggleLeitura,
  } = store

  const temFiltrosAtivos = computed(() => {
    return Object.values(filtros).some((valor) => valor !== "")
  })

  const mensagemEstadoVazio = computed(() => {
    if (licitacoes.value.length === 0) {
      return "Não há licitações cadastradas no sistema."
    }
    return "Tente ajustar os filtros para encontrar as licitações desejadas."
  })

  return {
    licitacoes,
    licitacoesFiltradas,
    licitacoesLidas,
    licitacoesNaoLidas,
    loading,
    error,
    filtros,
    estatisticas,
    temFiltrosAtivos,
    mensagemEstadoVazio,
    carregarLicitacoes,
    aplicarFiltros,
    limparFiltros,
    toggleLeitura,
    formatarData,
    formatarValor,
  }
}
