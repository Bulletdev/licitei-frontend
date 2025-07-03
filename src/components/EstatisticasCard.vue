<template>
  <div class="stats">
    <div class="stat-card">
      <span class="stat-number">{{ formatarNumero(estatisticas.total) }}</span>
      <div class="stat-label">Total de Licitações</div>
    </div>
    <div class="stat-card">
      <span class="stat-number">{{ formatarNumero(estatisticas.lidas) }}</span>
      <div class="stat-label">Licitações Lidas</div>
    </div>
    <div class="stat-card">
      <span class="stat-number">{{ formatarNumero(estatisticas.naoLidas) }}</span>
      <div class="stat-label">Não Lidas</div>
    </div>
  </div>
</template>

<script setup>
import { formatarNumero } from '@utils/formatters'

defineProps({
  estatisticas: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
.stats {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.stat-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 20px;
  flex: 1;
  min-width: 200px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-number {
  font-size: 2.2rem;
  font-weight: 700;
  color: #667eea;
  display: block;
}

.stat-label {
  color: #7f8c8d;
  font-size: 0.9rem;
  font-weight: 500;
  margin-top: 5px;
}
</style>
