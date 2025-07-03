<template>
  <div class="filters-card">
    <h3 class="filters-title">
      🔍 Filtros de Pesquisa
    </h3>
    <div class="filters-grid">
      <div class="form-group">
        <label for="codigoUasg">Código da UASG</label>
        <input
          type="text"
          id="codigoUasg"
          class="form-control"
          v-model="filtros.codigoUasg"
          placeholder="Digite o código da UASG"
        >
      </div>
      <div class="form-group">
        <label for="numeroPregao">Número do Pregão</label>
        <input
          type="text"
          id="numeroPregao"
          class="form-control"
          v-model="filtros.numeroPregao"
          placeholder="Digite o número do pregão"
        >
      </div>
      <div class="form-group">
        <label for="statusLeitura">Status de Leitura</label>
        <select
          id="statusLeitura"
          class="form-control"
          v-model="filtros.statusLeitura"
        >
          <option value="">Todos</option>
          <option value="lida">Lidas</option>
          <option value="nao-lida">Não Lidas</option>
        </select>
      </div>
    </div>
    <div class="actions">
      <button
        class="btn btn-primary"
        @click="$emit('aplicar')"
        :disabled="loading"
      >
        {{ loading ? 'Buscando...' : 'Aplicar Filtros' }}
      </button>
      <button
        class="btn btn-secondary"
        @click="$emit('limpar')"
      >
        Limpar Filtros
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  filtros: {
    type: Object,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})

defineEmits(['aplicar', 'limpar'])
</script>

<style scoped>
.filters-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.filters-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: 600;
  color: #34495e;
  margin-bottom: 8px;
  font-size: 0.9rem;
}

.form-control {
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.8);
}

.form-control:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  transform: translateY(-2px);
}

.actions {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.btn-secondary {
  background: linear-gradient(135deg, #95a5a6, #7f8c8d);
  color: white;
}

.btn-secondary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(149, 165, 166, 0.3);
}
</style>
