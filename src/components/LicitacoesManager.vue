<template>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <h1>Sistema de Gestão de Licitações</h1>
      <p>Gerencie e acompanhe licitações públicas de forma eficiente</p>
    </div>

    <!-- Filtros -->
    <FiltrosCard
      :filtros="filtros"
      :loading="loading"
      @aplicar="aplicarFiltros"
      @limpar="limparFiltros"
    />

    <!-- Estatísticas -->
    <EstatisticasCard :estatisticas="estatisticas" />

    <!-- Mensagem de Erro -->
    <div v-if="error" class="error-message">
      ❌ {{ error }}
    </div>

    <div v-if="loading" class="loading">
      Carregando licitações...
    </div>
    <div v-else>
      <!-- Debug visual -->
      <pre>licitacoes: {{ licitacoes }}</pre>
<pre>licitacoes.value: {{ licitacoes.value }}</pre>

      <transition-group 
        name="slide-fade" 
        tag="div" 
        class="licitacoes-grid" 
        v-if="licitacoes.length > 0"
      >
        <LicitacaoCard
          v-for="licitacao in licitacoes"
          :key="licitacao.id"
          :licitacao="licitacao"
          @toggle-leitura="toggleLeitura"
        />
      </transition-group>

      <div v-else class="empty-state">
        <div class="empty-icon">📋</div>
        <div class="empty-title">Nenhuma licitação encontrada</div>
        <div class="empty-text">
          {{ mensagemEstadoVazio }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useLicitacaoStore } from '@/stores/licitacao.store'
const store = useLicitacaoStore()
import { onMounted } from 'vue'
import { useLicitacoes } from '@/composables/useLicitacoes'
import FiltrosCard from './FiltrosCard.vue'
import EstatisticasCard from './EstatisticasCard.vue'
import LicitacaoCard from './LicitacaoCard.vue'

const {
  licitacoes,
  licitacoesFiltradas,
  loading,
  error,
  filtros,
  estatisticas,
  mensagemEstadoVazio,
  carregarLicitacoes,
  aplicarFiltros,
  limparFiltros,
  toggleLeitura
} = useLicitacoes()

onMounted(() => {
  carregarLicitacoes()
})
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.header h1 {
  color: #2c3e50;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 10px;
  background: linear-gradient(135deg, #e9ecef, #667eea);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.header p {
  color: #7f8c8d;
  font-size: 1.1rem;
}

.licitacoes-grid {
  display: grid;
  gap: 20px;
}

.loading {
  text-align: center;
  padding: 60px;
  color: #7f8c8d;
  font-size: 1.1rem;
}

.loading::after {
  content: '';
  display: inline-block;
  width: 40px;
  height: 40px;
  border: 4px solid #667eca;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-left: 15px;
  vertical-align: middle;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.empty-icon {
  font-size: 4rem;
  color: #bdc3c7;
  margin-bottom: 20px;
}

.empty-title {
  font-size: 1.5rem;
  color: #34495e;
  margin-bottom: 10px;
}

.empty-text {
  color: #7f8c8d;
  font-size: 1.1rem;
}

.error-message {
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  color: white;
  padding: 15px;
  border-radius: 12px;
  margin-bottom: 20px;
  font-weight: 500;
}

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(20px);
  opacity: 0;
}

@media (max-width: 768px) {
  .container {
    padding: 10px;
  }
  
  .header h1 {
    font-size: 2rem;
  }
}
</style>
