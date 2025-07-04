import axios from "axios"

class LicitacaoService {
  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || "https://licitei-backend-56315dca6f6b.herokuapp.com/",
      timeout: 5000,
      headers: {
        "Content-Type": "application/json",
      },
    })

    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error("Erro na API:", error)
        return Promise.reject(this.handleError(error))
      },
    )
  }

  handleError(error) {
    if (error.response) {
      console.error("Detalhes do erro do servidor:", JSON.stringify(error.response.data, null, 2));
      return {
        message: error.response.data?.message || "Erro no servidor",
        status: error.response.status,
      }
    } else if (error.request) {
      return {
        message: "Erro de conexão com o servidor",
        status: 0,
      }
    } else {
      return {
        message: "Erro inesperado",
        status: -1,
      }
    }
  }

  async buscarLicitacoes(filtros = {}) {
    try {
      const params = new URLSearchParams()

      Object.entries(filtros).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, value.toString())
        }
      })

      const response = await this.api.get(`/api/licitacoes?${params.toString()}`)
      console.log("URL de buscarLicitacoes:", `/api/licitacoes?${params.toString()}`);
      return response.data
    } catch (error) {
      throw error
    }
  }

  async buscarLicitacaoPorId(id) {
    try {
      const response = await this.api.get(`/api/licitacoes/${id}`)
      return response.data
    } catch (error) {
      throw error
    }
  }

  async marcarComoLida(id, lida) {
    try {
      const url = `/api/licitacoes/${id}/toggle-read`;
      const payload = { lida };
      console.log("URL de marcarComoLida:", url);
      console.log("Payload de marcarComoLida:", payload);
      const response = await this.api.patch(url, payload)
      return response.data
    } catch (error) {
      throw error
    }
  }

  async obterEstatisticas() {
    try {
      const response = await this.api.get("/api/licitacoes/estatisticas")
      return response.data
    } catch (error) {
      throw error
    }
  }

  gerarDadosMock() {
    return [
      {
        id: 1,
        codigoUasg: "153073",
        numeroPregao: "2024001",
        objeto: "Aquisição de equipamentos de informática para modernização do parque tecnológico",
        orgao: "MINISTÉRIO DA EDUCAÇÃO",
        modalidade: "Pregão Eletrônico",
        dataAbertura: "2024-07-15T10:00:00",
        valorEstimado: 150000.0,
        situacao: "Em andamento",
      },
      {
        id: 2,
        codigoUasg: "153074",
        numeroPregao: "2024002",
        objeto: "Contratação de serviços de manutenção predial",
        orgao: "MINISTÉRIO DA SAÚDE",
        modalidade: "Pregão Eletrônico",
        dataAbertura: "2024-07-20T14:30:00",
        valorEstimado: 75000.0,
        situacao: "Publicado",
      },
      {
        id: 3,
        codigoUasg: "153075",
        numeroPregao: "2024003",
        objeto: "Fornecimento de materiais de escritório",
        orgao: "MINISTÉRIO DA JUSTIÇA",
        modalidade: "Pregão Eletrônico",
        dataAbertura: "2024-07-25T09:15:00",
        valorEstimado: 25000.0,
        situacao: "Em andamento",
      },
      {
        id: 4,
        codigoUasg: "153076",
        numeroPregao: "2024004",
        objeto: "Aquisição de veículos para a frota oficial",
        orgao: "MINISTÉRIO DOS TRANSPORTES",
        modalidade: "Concorrência",
        dataAbertura: "2024-08-01T11:00:00",
        valorEstimado: 500000.0,
        situacao: "Publicado",
      },
      {
        id: 5,
        codigoUasg: "153077",
        numeroPregao: "2024005",
        objeto: "Contratação de empresa para desenvolvimento de sistema",
        orgao: "MINISTÉRIO DA DEFESA",
        modalidade: "Pregão Eletrônico",
        dataAbertura: "2024-08-05T16:00:00",
        valorEstimado: 300000.0,
        situacao: "Em andamento",
      },
    ]
  }
}

export const licitacaoService = new LicitacaoService()
