<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Sistema de Licitações</h1>
            <p class="text-sm text-gray-600 mt-1">Gestão de Propostas para Licitações Públicas</p>
          </div>
          <div class="flex items-center gap-4">
            <div class="text-sm text-gray-500">
              <Clock class="inline w-4 h-4 mr-1" />
              Última atualização: {{ ultimaAtualizacao }}
            </div>
            <button
              @click="recarregarDados"
              :disabled="loading"
              class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <RefreshCw class="w-4 h-4" :class="{ 'animate-spin': loading }" />
              Atualizar
            </button>
          </div>
        </div>
      </div>
    </header>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Estatísticas -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow-sm p-6 border">
          <div class="flex items-center">
            <div class="p-2 bg-blue-100 rounded-lg">
              <FileText class="w-6 h-6 text-blue-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total de Licitações</p>
              <p class="text-2xl font-bold text-gray-900">{{ estatisticas.total }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6 border">
          <div class="flex items-center">
            <div class="p-2 bg-green-100 rounded-lg">
              <CheckCircle class="w-6 h-6 text-green-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Lidas</p>
              <p class="text-2xl font-bold text-gray-900">{{ estatisticas.lidas }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6 border">
          <div class="flex items-center">
            <div class="p-2 bg-yellow-100 rounded-lg">
              <AlertCircle class="w-6 h-6 text-yellow-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Não Lidas</p>
              <p class="text-2xl font-bold text-gray-900">{{ estatisticas.naoLidas }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6 border">
          <div class="flex items-center">
            <div class="p-2 bg-purple-100 rounded-lg">
              <TrendingUp class="w-6 h-6 text-purple-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Hoje</p>
              <p class="text-2xl font-bold text-gray-900">{{ estatisticas.hoje }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Filtros -->
      <div class="bg-white rounded-lg shadow-sm border mb-8">
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Filter class="w-5 h-5" />
              Filtros de Busca
            </h3>
            <div class="flex items-center gap-2">
              <span v-if="filtrosAtivos > 0" class="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                {{ filtrosAtivos }} filtro(s) ativo(s)
              </span>
              <button
                @click="mostrarFiltrosAvancados = !mostrarFiltrosAvancados"
                class="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
              >
                {{ mostrarFiltrosAvancados ? 'Ocultar' : 'Mostrar' }} filtros avançados
                <ChevronDown class="w-4 h-4" :class="{ 'rotate-180': mostrarFiltrosAvancados }" />
              </button>
            </div>
          </div>

          <form @submit.prevent="aplicarFiltros" class="space-y-6">
            <!-- Filtros Básicos -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Código UASG *
                </label>
                <input
                  v-model="filtros.codigoUasg"
                  type="text"
                  placeholder="Ex: 123456"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  @input="buscarComDebounce"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Número do Pregão *
                </label>
                <input
                  v-model="filtros.numeroPregao"
                  type="text"
                  placeholder="Ex: 001/2024"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  @input="buscarComDebounce"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Status de Leitura
                </label>
                <select
                  v-model="filtros.statusLeitura"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  @change="aplicarFiltros"
                >
                  <option value="">Todos</option>
                  <option value="lida">Apenas Lidas</option>
                  <option value="nao-lida">Apenas Não Lidas</option>
                </select>
              </div>
            </div>

            <!-- Filtros Avançados -->
            <div v-if="mostrarFiltrosAvancados" class="border-t pt-6 space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Modalidade
                  </label>
                  <select
                    v-model="filtros.modalidade"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    @change="aplicarFiltros"
                  >
                    <option value="">Todas</option>
                    <option value="PREGAO_ELETRONICO">Pregão Eletrônico</option>
                    <option value="PREGAO_PRESENCIAL">Pregão Presencial</option>
                    <option value="CONCORRENCIA">Concorrência</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Situação
                  </label>
                  <select
                    v-model="filtros.situacao"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    @change="aplicarFiltros"
                  >
                    <option value="">Todas</option>
                    <option value="ABERTA">Aberta</option>
                    <option value="ENCERRADA">Encerrada</option>
                    <option value="SUSPENSA">Suspensa</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Data de Abertura
                  </label>
                  <input
                    v-model="filtros.dataAbertura"
                    type="date"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    @change="aplicarFiltros"
                  />
                </div>
              </div>
            </div>

            <!-- Ações dos Filtros -->
            <div class="flex gap-3 pt-4 border-t">
              <button
                type="submit"
                :disabled="loading"
                class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2"
              >
                <Search class="w-4 h-4" />
                Buscar
              </button>
              
              <button
                type="button"
                @click="limparFiltros"
                class="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Limpar Filtros
              </button>

              <button
                type="button"
                @click="exportarDados"
                :disabled="licitacoes.length === 0"
                class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center gap-2"
              >
                <Download class="w-4 h-4" />
                Exportar CSV
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Ações em Lote -->
      <div v-if="licitacoesSelecionadas.length > 0" class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div class="flex items-center justify-between">
          <span class="text-sm text-blue-800 font-medium">
            {{ licitacoesSelecionadas.length }} licitação(ões) selecionada(s)
          </span>
          <div class="flex gap-2">
            <button
              @click="marcarSelecionadasComoLidas(true)"
              class="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              Marcar como Lidas
            </button>
            <button
              @click="marcarSelecionadasComoLidas(false)"
              class="px-3 py-1 text-xs bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
            >
              Marcar como Não Lidas
            </button>
            <button
              @click="limparSelecao"
              class="px-3 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              Limpar Seleção
            </button>
          </div>
        </div>
      </div>

      <!-- Lista de Licitações -->
      <div class="bg-white rounded-lg shadow-sm border">
        <!-- Header da Lista -->
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <label class="flex items-center">
                <input
                  type="checkbox"
                  :checked="todasSelecionadas"
                  @change="alternarSelecaoTodas"
                  class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span class="ml-2 text-sm text-gray-700">Selecionar todas</span>
              </label>
              
              <span class="text-sm text-gray-600">
                Exibindo {{ licitacoesFiltradas.length }} de {{ licitacoes.length }} licitações
              </span>
            </div>

            <div class="flex items-center gap-2">
              <label class="text-sm text-gray-700">Ordenar por:</label>
              <select
                v-model="ordenacao"
                @change="aplicarOrdenacao"
                class="text-sm border border-gray-300 rounded px-2 py-1"
              >
                <option value="dataAbertura-desc">Data de Abertura (Mais recente)</option>
                <option value="dataAbertura-asc">Data de Abertura (Mais antiga)</option>
                <option value="objeto-asc">Objeto (A-Z)</option>
                <option value="objeto-desc">Objeto (Z-A)</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center py-12">
          <div class="text-center">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p class="text-gray-600">Carregando licitações...</p>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-12">
          <div class="text-red-600 mb-4">
            <AlertTriangle class="mx-auto h-12 w-12" />
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Erro ao carregar licitações</h3>
          <p class="text-gray-600 mb-4">{{ error }}</p>
          <button
            @click="recarregarDados"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Tentar Novamente
          </button>
        </div>

        <!-- Empty State -->
        <div v-else-if="licitacoesFiltradas.length === 0" class="text-center py-12">
          <div class="text-gray-400 mb-4">
            <Search class="mx-auto h-12 w-12" />
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Nenhuma licitação encontrada</h3>
          <p class="text-gray-600 mb-4">
            {{ temFiltrosAtivos ? 'Tente ajustar os filtros para encontrar licitações.' : 'Não há licitações disponíveis no momento.' }}
          </p>
          <button
            v-if="temFiltrosAtivos"
            @click="limparFiltros"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Limpar Filtros
          </button>
        </div>

        <!-- Lista de Licitações -->
        <div v-else class="divide-y divide-gray-200">
          <div
            v-for="licitacao in licitacoesPaginadas"
            :key="licitacao.id"
            :class="[
              'p-6 hover:bg-gray-50 transition-colors',
              licitacao.lida ? 'bg-gray-50/50' : 'bg-white'
            ]"
          >
            <div class="flex items-start gap-4">
              <!-- Checkbox de Seleção -->
              <input
                type="checkbox"
                :checked="licitacoesSelecionadas.includes(licitacao.id)"
                @change="alternarSelecaoLicitacao(licitacao.id)"
                class="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />

              <!-- Conteúdo da Licitação -->
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between mb-3">
                  <div class="flex-1">
                    <!-- Tags -->
                    <div class="flex flex-wrap items-center gap-2 mb-3">
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        UASG: {{ licitacao.codigoUasg }}
                      </span>
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        Pregão: {{ licitacao.numeroPregao }}
                      </span>
                      <span :class="getStatusClass(licitacao.situacao)">
                        {{ formatarSituacao(licitacao.situacao) }}
                      </span>
                      <span
                        :class="[
                          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                          licitacao.lida ? 'bg-gray-100 text-gray-800' : 'bg-green-100 text-green-800'
                        ]"
                      >
                        {{ licitacao.lida ? 'Lida' : 'Não Lida' }}
                      </span>
                    </div>

                    <!-- Título -->
                    <h3 class="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {{ licitacao.objeto }}
                    </h3>

                    <!-- Informações -->
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div class="flex items-center gap-2">
                        <Calendar class="w-4 h-4" />
                        <span><strong>Abertura:</strong> {{ formatarData(licitacao.dataAbertura) }}</span>
                      </div>
                      <div class="flex items-center gap-2">
                        <Building class="w-4 h-4" />
                        <span><strong>Órgão:</strong> {{ licitacao.orgao || 'N/A' }}</span>
                      </div>
                      <div class="flex items-center gap-2">
                        <MapPin class="w-4 h-4" />
                        <span><strong>Local:</strong> {{ licitacao.cidade || 'N/A' }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- Ações -->
                  <div class="flex items-center gap-2 ml-4">
                    <button
                      @click="alternarStatusLeitura(licitacao)"
                      :class="[
                        'px-3 py-1 text-xs rounded-md transition-colors',
                        licitacao.lida
                          ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      ]"
                    >
                      {{ licitacao.lida ? 'Marcar como Não Lida' : 'Marcar como Lida' }}
                    </button>
                    
                    <button
                      @click="visualizarDetalhes(licitacao)"
                      class="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                    >
                      Ver Detalhes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Paginação -->
        <div v-if="totalPaginas > 1" class="px-6 py-4 border-t border-gray-200">
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-700">
              Mostrando {{ (paginaAtual - 1) * itensPorPagina + 1 }} a {{ Math.min(paginaAtual * itensPorPagina, licitacoesFiltradas.length) }} de {{ licitacoesFiltradas.length }} resultados
            </div>
            
            <div class="flex items-center gap-2">
              <button
                @click="irParaPagina(paginaAtual - 1)"
                :disabled="paginaAtual === 1"
                class="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              
              <div class="flex gap-1">
                <button
                  v-for="pagina in paginasVisiveis"
                  :key="pagina"
                  @click="irParaPagina(pagina)"
                  :class="[
                    'px-3 py-1 text-sm border rounded-md',
                    pagina === paginaAtual
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-300 hover:bg-gray-50'
                  ]"
                >
                  {{ pagina }}
                </button>
              </div>
              
              <button
                @click="irParaPagina(paginaAtual + 1)"
                :disabled="paginaAtual === totalPaginas"
                class="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Próxima
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Detalhes -->
    <div v-if="modalDetalhes" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-bold text-gray-900">Detalhes da Licitação</h2>
            <button
              @click="fecharModal"
              class="text-gray-400 hover:text-gray-600"
            >
              <X class="w-6 h-6" />
            </button>
          </div>
        </div>
        
        <div class="p-6" v-if="licitacaoSelecionada">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 class="font-semibold text-gray-900 mb-2">Informações Básicas</h3>
              <dl class="space-y-2 text-sm">
                <div>
                  <dt class="font-medium text-gray-700">Código UASG:</dt>
                  <dd class="text-gray-600">{{ licitacaoSelecionada.codigoUasg }}</dd>
                </div>
                <div>
                  <dt class="font-medium text-gray-700">Número do Pregão:</dt>
                  <dd class="text-gray-600">{{ licitacaoSelecionada.numeroPregao }}</dd>
                </div>
                <div>
                  <dt class="font-medium text-gray-700">Modalidade:</dt>
                  <dd class="text-gray-600">{{ licitacaoSelecionada.modalidade || 'N/A' }}</dd>
                </div>
                <div>
                  <dt class="font-medium text-gray-700">Situação:</dt>
                  <dd class="text-gray-600">{{ formatarSituacao(licitacaoSelecionada.situacao) }}</dd>
                </div>
              </dl>
            </div>
            
            <div>
              <h3 class="font-semibold text-gray-900 mb-2">Datas e Local</h3>
              <dl class="space-y-2 text-sm">
                <div>
                  <dt class="font-medium text-gray-700">Data de Abertura:</dt>
                  <dd class="text-gray-600">{{ formatarData(licitacaoSelecionada.dataAbertura) }}</dd>
                </div>
                <div>
                  <dt class="font-medium text-gray-700">Órgão:</dt>
                  <dd class="text-gray-600">{{ licitacaoSelecionada.orgao || 'N/A' }}</dd>
                </div>
                <div>
                  <dt class="font-medium text-gray-700">Cidade:</dt>
                  <dd class="text-gray-600">{{ licitacaoSelecionada.cidade || 'N/A' }}</dd>
                </div>
              </dl>
            </div>
          </div>
          
          <div class="mt-6">
            <h3 class="font-semibold text-gray-900 mb-2">Objeto</h3>
            <p class="text-sm text-gray-600 leading-relaxed">{{ licitacaoSelecionada.objeto }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import {
  Clock, RefreshCw, FileText, CheckCircle, AlertCircle, TrendingUp,
  Filter, ChevronDown, Search, Download, AlertTriangle, Calendar,
  Building, MapPin, X
} from 'lucide-vue-next'

// Estado da aplicação
const licitacoes = ref([])
const loading = ref(false)
const error = ref(null)
const ultimaAtualizacao = ref('')

// Filtros
const filtros = ref({
  codigoUasg: '',
  numeroPregao: '',
  statusLeitura: '',
  modalidade: '',
  situacao: '',
  dataAbertura: ''
})

const mostrarFiltrosAvancados = ref(false)

// Seleção e ações em lote
const licitacoesSelecionadas = ref([])

// Paginação
const paginaAtual = ref(1)
const itensPorPagina = ref(10)
const ordenacao = ref('dataAbertura-desc')

// Modal
const modalDetalhes = ref(false)
const licitacaoSelecionada = ref(null)

// Debounce para busca
let debounceTimer = null

// API Configuration
const API_BASE_URL = 'http://localhost:9991/api'

// Computed Properties
const estatisticas = computed(() => {
  const total = licitacoes.value.length
  const lidas = licitacoes.value.filter(l => l.lida).length
  const naoLidas = total - lidas
  const hoje = licitacoes.value.filter(l => {
    const hoje = new Date().toDateString()
    return new Date(l.dataAbertura).toDateString() === hoje
  }).length

  return { total, lidas, naoLidas, hoje }
})

const filtrosAtivos = computed(() => {
  return Object.values(filtros.value).filter(v => v !== '').length
})

const temFiltrosAtivos = computed(() => filtrosAtivos.value > 0)

const licitacoesFiltradas = computed(() => {
  let resultado = [...licitacoes.value]

  // Aplicar filtros
  if (filtros.value.codigoUasg) {
    resultado = resultado.filter(l => 
      l.codigoUasg.toString().includes(filtros.value.codigoUasg)
    )
  }

  if (filtros.value.numeroPregao) {
    resultado = resultado.filter(l => 
      l.numeroPregao.toString().includes(filtros.value.numeroPregao)
    )
  }

  if (filtros.value.statusLeitura) {
    const isLida = filtros.value.statusLeitura === 'lida'
    resultado = resultado.filter(l => l.lida === isLida)
  }

  if (filtros.value.modalidade) {
    resultado = resultado.filter(l => l.modalidade === filtros.value.modalidade)
  }

  if (filtros.value.situacao) {
    resultado = resultado.filter(l => l.situacao === filtros.value.situacao)
  }

  if (filtros.value.dataAbertura) {
    resultado = resultado.filter(l => {
      const dataLicitacao = new Date(l.dataAbertura).toDateString()
      const dataFiltro = new Date(filtros.value.dataAbertura).toDateString()
      return dataLicitacao === dataFiltro
    })
  }

  // Aplicar ordenação
  const [campo, direcao] = ordenacao.value.split('-')
  resultado.sort((a, b) => {
    let valorA = a[campo]
    let valorB = b[campo]

    if (campo === 'dataAbertura') {
      valorA = new Date(valorA)
      valorB = new Date(valorB)
    }

    if (typeof valorA === 'string') {
      valorA = valorA.toLowerCase()
      valorB = valorB.toLowerCase()
    }

    if (direcao === 'asc') {
      return valorA > valorB ? 1 : -1
    } else {
      return valorA < valorB ? 1 : -1
    }
  })

  return resultado
})

const totalPaginas = computed(() => {
  return Math.ceil(licitacoesFiltradas.value.length / itensPorPagina.value)
})

const licitacoesPaginadas = computed(() => {
  const inicio = (paginaAtual.value - 1) * itensPorPagina.value
  const fim = inicio + itensPorPagina.value
  return licitacoesFiltradas.value.slice(inicio, fim)
})

const paginasVisiveis = computed(() => {
  const total = totalPaginas.value
  const atual = paginaAtual.value
  const paginas = []

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      paginas.push(i)
    }
  } else {
    if (atual <= 4) {
      for (let i = 1; i <= 5; i++) {
        paginas.push(i)
      }
      paginas.push('...', total)
    } else if (atual >= total - 3) {
      paginas.push(1, '...')
      for (let i = total - 4; i <= total; i++) {
        paginas.push(i)
      }
    } else {
      paginas.push(1, '...')
      for (let i = atual - 1; i <= atual + 1; i++) {
        paginas.push(i)
      }
      paginas.push('...', total)
    }
  }

  return paginas.filter(p => p !== '...' || paginas.indexOf(p) === paginas.lastIndexOf(p))
})

const todasSelecionadas = computed(() => {
  return licitacoesPaginadas.value.length > 0 && 
         licitacoesPaginadas.value.every(l => licitacoesSelecionadas.value.includes(l.id))
})

// Methods
const buscarLicitacoes = async () => {
  loading.value = true
  error.value = null

  try {
    const params = new URLSearchParams()
    
    if (filtros.value.codigoUasg) params.append('codigoUasg', filtros.value.codigoUasg)
    if (filtros.value.numeroPregao) params.append('numeroPregao', filtros.value.numeroPregao)
    if (filtros.value.modalidade) params.append('modalidade', filtros.value.modalidade)
    if (filtros.value.situacao) params.append('situacao', filtros.value.situacao)
    if (filtros.value.dataAbertura) params.append('dataAbertura', filtros.value.dataAbertura)

    const url = `${API_BASE_URL}/licitacoes${params.toString() ? '?' + params.toString() : ''}`
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Erro ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    licitacoes.value = data.map(licitacao => ({
      ...licitacao,
      lida: licitacao.lida || false
    }))

    ultimaAtualizacao.value = new Date().toLocaleString('pt-BR')
  } catch (err) {
    error.value = err.message || 'Erro ao conectar com a API'
    console.error('Erro ao buscar licitações:', err)
  } finally {
    loading.value = false
  }
}

const buscarComDebounce = () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    aplicarFiltros()
  }, 500)
}

const aplicarFiltros = () => {
  paginaAtual.value = 1
  buscarLicitacoes()
}

const limparFiltros = () => {
  filtros.value = {
    codigoUasg: '',
    numeroPregao: '',
    statusLeitura: '',
    modalidade: '',
    situacao: '',
    dataAbertura: ''
  }
  paginaAtual.value = 1
  buscarLicitacoes()
}

const aplicarOrdenacao = () => {
  paginaAtual.value = 1
}

const recarregarDados = () => {
  buscarLicitacoes()
}

const alternarStatusLeitura = async (licitacao) => {
  const statusAnterior = licitacao.lida
  licitacao.lida = !licitacao.lida

  try {
    const response = await fetch(`${API_BASE_URL}/licitacoes/${licitacao.id}/toggle-read`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ lida: licitacao.lida })
    })

    if (!response.ok) {
      throw new Error('Erro ao atualizar status')
    }
  } catch (err) {
    licitacao.lida = statusAnterior
    console.error('Erro ao atualizar status:', err)
    error.value = 'Erro ao atualizar status de leitura'
  }
}

const alternarSelecaoLicitacao = (id) => {
  const index = licitacoesSelecionadas.value.indexOf(id)
  if (index > -1) {
    licitacoesSelecionadas.value.splice(index, 1)
  } else {
    licitacoesSelecionadas.value.push(id)
  }
}

const alternarSelecaoTodas = () => {
  if (todasSelecionadas.value) {
    licitacoesSelecionadas.value = licitacoesSelecionadas.value.filter(
      id => !licitacoesPaginadas.value.some(l => l.id === id)
    )
  } else {
    licitacoesPaginadas.value.forEach(licitacao => {
      if (!licitacoesSelecionadas.value.includes(licitacao.id)) {
        licitacoesSelecionadas.value.push(licitacao.id)
      }
    })
  }
}

const marcarSelecionadasComoLidas = async (lida) => {
  const promises = licitacoesSelecionadas.value.map(async (id) => {
    const licitacao = licitacoes.value.find(l => l.id === id)
    if (licitacao && licitacao.lida !== lida) {
      await alternarStatusLeitura(licitacao)
    }
  })

  try {
    await Promise.all(promises)
    licitacoesSelecionadas.value = []
  } catch (err) {
    console.error('Erro ao atualizar licitações selecionadas:', err)
  }
}

const limparSelecao = () => {
  licitacoesSelecionadas.value = []
}

const irParaPagina = (pagina) => {
  if (pagina >= 1 && pagina <= totalPaginas.value) {
    paginaAtual.value = pagina
  }
}

const visualizarDetalhes = (licitacao) => {
  licitacaoSelecionada.value = licitacao
  modalDetalhes.value = true
}

const fecharModal = () => {
  modalDetalhes.value = false
  licitacaoSelecionada.value = null
}

const exportarDados = () => {
  const csvContent = [
    ['Código UASG', 'Número Pregão', 'Objeto', 'Data Abertura', 'Situação', 'Status Leitura'],
    ...licitacoesFiltradas.value.map(l => [
      l.codigoUasg,
      l.numeroPregao,
      l.objeto,
      formatarData(l.dataAbertura),
      formatarSituacao(l.situacao),
      l.lida ? 'Lida' : 'Não Lida'
    ])
  ].map(row => row.map(field => `"${field}"`).join(',')).join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `licitacoes_${new Date().toISOString().split('T')[0]}.csv`
  link.click()
}

// Utility Functions
const formatarData = (data) => {
  if (!data) return 'N/A'
  
  try {
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return data
  }
}

const formatarSituacao = (situacao) => {
  const situacoes = {
    'ABERTA': 'Aberta',
    'ENCERRADA': 'Encerrada',
    'SUSPENSA': 'Suspensa',
    'CANCELADA': 'Cancelada'
  }
  return situacoes[situacao] || situacao
}

const getStatusClass = (situacao) => {
  const classes = {
    'ABERTA': 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800',
    'ENCERRADA': 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800',
    'SUSPENSA': 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800',
    'CANCELADA': 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800'
  }
  return classes[situacao] || 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800'
}

// Lifecycle
onMounted(() => {
  buscarLicitacoes()
})

// Watchers
watch(() => licitacoesFiltradas.value.length, () => {
  if (paginaAtual.value > totalPaginas.value && totalPaginas.value > 0) {
    paginaAtual.value = totalPaginas.value
  }
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.rotate-180 {
  transform: rotate(180deg);
}

.transition-colors {
  transition-property: color, background-color, border-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
</style>
