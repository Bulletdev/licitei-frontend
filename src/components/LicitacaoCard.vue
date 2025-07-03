<template>
  <div
    class="licitacao-card"
    :class="{ 'lida': licitacao.lida, 'expanded': isExpanded }"
  >
    <div class="licitacao-header" @click="toggleExpand">
      <div>
        <div class="licitacao-title">
          Pregão {{ licitacao.numeroPregao || 'N/A' }}
        </div>
        <div class="licitacao-subtitle">
          {{ truncarTexto(licitacao.objeto || 'Objeto não informado', isExpanded ? 500 : 80) }}
        </div>
      </div>
      <div class="header-actions">
        <div class="status-badge" :class="licitacao.lida ? 'status-lida' : 'status-nao-lida'">
          {{ licitacao.lida ? 'Lida' : 'Não Lida' }}
        </div>
        <div class="expand-icon">
          {{ isExpanded ? '∧' : '∨' }}
        </div>
      </div>
    </div>

    <div class="licitacao-info">
      <div class="info-item">
        <div class="info-label">Código UASG</div>
        <div class="info-value">{{ licitacao.codigoUasg || 'N/A' }}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Órgão</div>
        <div class="info-value">{{ licitacao.orgao || 'N/A' }}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Modalidade</div>
        <div class="info-value">{{ licitacao.modalidade || 'N/A' }}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Data de Abertura</div>
        <div class="info-value">{{ formatarData(licitacao.dataAbertura) }}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Valor Estimado</div>
        <div class="info-value">{{ formatarValor(licitacao.valorEstimado) }}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Situação</div>
        <div class="info-value">{{ licitacao.situacao || 'N/A' }}</div>
      </div>
      <div class="info-item" v-if="licitacao.endereco">
        <div class="info-label">Endereço</div>
        <div class="info-value">{{ licitacao.endereco }}</div>
      </div>
    </div>

    <div class="licitacao-details" v-if="isExpanded">
      <h3>Itens Licitados</h3>
      <ul v-if="licitacao.itens && licitacao.itens.length">
        <li v-for="item in licitacao.itens" :key="item.id">
          <strong>Item {{ item.numeroItem }}:</strong> {{ item.descricao }} ({{ item.quantidade }} {{ item.unidadeFornecimento }})
        </li>
      </ul>
      <p v-else>Nenhum item licitado disponível.</p>
    </div>

    <div class="licitacao-actions">
      <button
        class="btn btn-toggle btn-small"
        @click="$emit('toggle-leitura', licitacao.id)"
      >
        {{ licitacao.lida ? '📖 Marcar como Não Lida' : '✅ Marcar como Lida' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { formatarData, formatarValor, truncarTexto } from '@utils/formatters'

const isExpanded = ref(false)

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}

const props = defineProps({
  licitacao: {
    type: Object,
    required: true
  }
})

defineEmits(['toggle-leitura'])
</script>

<style scoped>
.licitacao-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 25px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.licitacao-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.licitacao-card.lida {
  opacity: 0.7;
  background: rgba(236, 240, 241, 0.95);
}

.licitacao-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
  flex-wrap: wrap;
  gap: 10px;
  cursor: pointer;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.licitacao-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 5px;
}

.licitacao-subtitle {
  color: #7f8c8d;
  font-size: 0.9rem;
  word-wrap: break-word;
  max-width: 100%;
}

.status-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-lida {
  background: linear-gradient(135deg, #95a5a6, #7f8c8d);
  color: white;
}

.status-nao-lida {
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  color: white;
}

.expand-icon {
  font-size: 1.5rem;
  font-weight: bold;
  color: #3498db;
  transition: transform 0.3s ease;
}

.licitacao-card.expanded .expand-icon {
  transform: rotate(180deg);
}

.licitacao-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
}

.info-item {
  display: flex;
  flex-direction: column;
}

.info-label {
  font-size: 0.8rem;
  color: #7f8c8d;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 5px;
}

.info-value {
  font-size: 1rem;
  color: #2c3e50;
  font-weight: 500;
}

.licitacao-details {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px dashed rgba(0, 0, 0, 0.1);
}

.licitacao-details h3 {
  font-size: 1.1rem;
  color: #2c3e50;
  margin-bottom: 10px;
}

.licitacao-details ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.licitacao-details li {
  background-color: rgba(236, 240, 241, 0.5);
  padding: 10px 15px;
  border-radius: 8px;
  margin-bottom: 8px;
  font-size: 0.95rem;
  color: #34495e;
}

.licitacao-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
  flex-wrap: wrap;
  justify-content: flex-end;
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

.btn-small {
  padding: 8px 16px;
  font-size: 0.9rem;
}

.btn-toggle {
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
}

.btn-toggle:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(52, 152, 219, 0.3);
}
</style>
