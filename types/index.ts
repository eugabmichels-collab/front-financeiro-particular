// =====================================
// SISTEMA DE CONTROLE FINANCEIRO PESSOAL
// TypeScript Types & Interfaces
// =====================================

// =====================================
// ENUMS E TIPOS BASE
// =====================================

export type TipoLancamento = 'receita' | 'despesa' | 'investimento' | 'transferencia'
export type StatusLancamento = 'pago' | 'pendente' | 'previsto' | 'atrasado'
export type FormaPagamento = 'pix' | 'debito' | 'credito' | 'dinheiro' | 'transferencia' | 'boleto'
export type TipoInvestimento = 'cdb' | 'fgts' | 'previdencia' | 'tesouro' | 'fundos' | 'acoes' | 'outros'
export type CategoriaApartamento = 
  | 'entrada' 
  | 'parcelas' 
  | 'financiamento' 
  | 'documentacao'
  | 'cartorio' 
  | 'itbi' 
  | 'escritura' 
  | 'obra' 
  | 'reforma'
  | 'moveis' 
  | 'eletrodomesticos' 
  | 'condominio' 
  | 'reserva' 
  | 'outros'

// =====================================
// CATEGORIAS
// =====================================

export interface Subcategoria {
  id: string
  nome: string
  categoriaId: string
}

export interface Categoria {
  id: string
  nome: string
  tipo: 'receita' | 'despesa' | 'investimento' | 'apartamento'
  cor: string
  icone: string
  subcategorias: Subcategoria[]
}

// =====================================
// CARTÕES DE CRÉDITO
// =====================================

export interface Cartao {
  id: string
  nome: string
  bandeira: 'visa' | 'mastercard' | 'elo' | 'amex' | 'hipercard' | 'outro'
  banco: string
  limite: number
  limiteDisponivel: number
  diaFechamento: number
  diaVencimento: number
  cor: string
  ativo: boolean
}

export interface FaturaCartao {
  cartaoId: string
  mes: number
  ano: number
  valorTotal: number
  valorPago: number
  status: 'aberta' | 'fechada' | 'paga'
  lancamentos: Lancamento[]
}

// =====================================
// CONTAS BANCÁRIAS
// =====================================

export interface Conta {
  id: string
  nome: string
  banco: string
  tipo: 'corrente' | 'poupanca' | 'investimento' | 'carteira'
  saldoAtual: number
  cor: string
  ativo: boolean
}

// =====================================
// LANÇAMENTOS
// =====================================

export interface Lancamento {
  id: string
  data: Date
  tipo: TipoLancamento
  categoriaId: string
  subcategoriaId?: string
  descricao: string
  valor: number
  formaPagamento: FormaPagamento
  contaId?: string
  cartaoId?: string
  parcelado: boolean
  parcelaAtual?: number
  totalParcelas?: number
  isFixo: boolean
  gastoFixoId?: string
  isApartamento: boolean
  observacao?: string
  status: StatusLancamento
  createdAt: Date
  updatedAt: Date
}

// =====================================
// GASTOS FIXOS
// =====================================

export interface GastoFixo {
  id: string
  nome: string
  categoriaId: string
  subcategoriaId?: string
  valor: number
  formaPagamento: FormaPagamento
  contaId?: string
  cartaoId?: string
  diaVencimento: number
  ativo: boolean
  observacao?: string
}

// =====================================
// INVESTIMENTOS
// =====================================

export interface Investimento {
  id: string
  nome: string
  tipo: TipoInvestimento
  instituicao: string
  valorAplicado: number
  valorAtual: number
  dataAplicacao: Date
  dataVencimento?: Date
  rentabilidadeEstimada?: number
  rentabilidadeAtual?: number
  observacao?: string
}

export interface AporteInvestimento {
  id: string
  investimentoId: string
  data: Date
  valor: number
  tipo: 'aporte' | 'resgate'
}

// =====================================
// APARTAMENTO
// =====================================

export interface LancamentoApartamento {
  id: string
  data: Date
  tipo: 'pagamento' | 'reserva' | 'gasto'
  descricao: string
  categoria: CategoriaApartamento
  valor: number
  status: 'pago' | 'pendente' | 'previsto'
  formaPagamento: FormaPagamento
  contaId?: string
  cartaoId?: string
  observacao?: string
}

export interface ResumoApartamento {
  valorTotal: number
  valorPago: number
  valorPendente: number
  valorReservado: number
  proximoPagamento?: LancamentoApartamento
  porCategoria: Record<CategoriaApartamento, number>
}

// =====================================
// DASHBOARD E RESUMOS
// =====================================

export interface ResumoDashboard {
  mes: number
  ano: number
  receitaTotal: number
  despesaTotal: number
  saldoMes: number
  gastosFixosTotal: number
  gastosVariaveisTotal: number
  investimentoTotal: number
  apartamentoTotal: number
  faturaCartaoTotal: number
  saldoContas: number
  porCategoria: {
    categoriaId: string
    nome: string
    cor: string
    valor: number
    percentual: number
  }[]
  evolucaoMensal: {
    mes: number
    ano: number
    receita: number
    despesa: number
    saldo: number
  }[]
}

export interface FiltrosDashboard {
  mes: number
  ano: number
  contaId?: string
  cartaoId?: string
  categoriaId?: string
  tipo?: TipoLancamento
}

// =====================================
// CONFIGURAÇÕES DO USUÁRIO
// =====================================

export interface ConfiguracoesUsuario {
  moeda: string
  formatoData: 'dd/MM/yyyy' | 'MM/dd/yyyy' | 'yyyy-MM-dd'
  primeiroDiaMes: number
  metaMensal?: number
  alertaLimiteCartao: number // percentual
  temaEscuro: boolean
}
