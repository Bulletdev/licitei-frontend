export interface Licitacao {
  id: number
  codigoUasg: string
  numeroPregao: string
  objeto: string
  orgao?: string
  modalidade?: string
  dataAbertura: string
  valorEstimado?: number
  situacao?: string
  lida?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface FiltrosLicitacao {
  codigoUasg?: string
  numeroPregao?: string
  statusLeitura?: "lida" | "nao-lida" | ""
  modalidade?: string
  situacao?: string
  dataInicio?: string
  dataFim?: string
}

export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface PaginacaoResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
}
