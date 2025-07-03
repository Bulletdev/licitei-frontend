# Sistema de Gestão de Licitações

Sistema moderno para gestão e acompanhamento de licitações públicas 

##  Funcionalidades

- ✅ Listagem de licitações com dados da API
- ✅ Filtros por Código UASG e Número do Pregão
- ✅ Filtro por status de leitura
- ✅ Marcar licitações como lida/não lida
- ✅ Estatísticas em tempo real
- ✅ Interface responsiva e moderna
- ✅ Estados de loading e erro
- ✅ Animações suaves

##  Tecnologias

- **Vue.js 3** - Framework JavaScript reativo
- **Composition API** - API moderna do Vue
- **Pinia** - Gerenciamento de estado
- **Axios** - Cliente HTTP
- **Vite** - Build tool moderna
- **CSS3** - Estilização avançada



## 🚀 Como Executar

### Pré-requisitos
- Node.js 16+
- npm ou yarn

### Instalação

# Clonar o repositório

```
git clone <url-do-repositorio>
```

# Instalar dependências
npm install

# Executar em desenvolvimento
```
npm run dev
```
### Build para Produção

```
npm run build
```

## 🧪 Testes


# Testes unitários

```
npm run test
```
# Testes E2E
```
npm run test:e2e
```
## 📋 Requisitos Atendidos

### ✅ Obrigatórios
- [x] Listagem de licitações da API
- [x] Filtro por Código UASG
- [x] Filtro por Número do Pregão
- [x] Mensagem amigável sem resultados

### ✅ Bônus
- [x] Marcar como lida/não lida
- [x] Estilização moderna com CSS

### ✅ Extras Implementados
- [x] Gerenciamento de estado com Pinia
- [x] Composables para lógica reutilizável
- [x] Componentes modulares
- [x] Tratamento de erros
- [x] Interface responsiva
- [x] Animações e transições
- [x] Dados mock para demonstração

##  Configuração da API

O sistema espera uma API REST em `http://localhost:9991/api` com os endpoints:

- `GET /licitacoes` - Listar licitações
- `GET /licitacoes?codigoUasg=X&numeroPregao=Y` - Filtrar licitações
- `PATCH /licitacoes/:id/toggle-read` - Marcar como lida

## 📱 Responsividade

O sistema é totalmente responsivo e funciona em:
- 📱 Mobile (320px+)
- 📱 Tablet (768px+)
- 💻 Desktop (1024px+)

## 🎨 Design

- Interface com glassmorphism
- Gradientes e animações suaves
- Feedback visual para todas as ações
- Estados de loading e erro bem definidos
