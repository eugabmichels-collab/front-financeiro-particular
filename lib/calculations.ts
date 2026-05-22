// =====================================
// CÁLCULOS FINANCEIROS
// =====================================

import type { 
  AreaFinanceira,
  Lancamento, 
  GastoFixo, 
  Cartao, 
  Investimento, 
  LancamentoAreaFinanceira,
  LancamentoApartamento,
  Categoria 
} from '@/types'

/**
 * Calcula o total de receitas de uma lista de lançamentos
 */
export function calcularTotalReceitas(lancamentos: Lancamento[]): number {
  return lancamentos
    .filter(l => l.tipo === 'receita' && l.status !== 'previsto')
    .reduce((acc, l) => acc + l.valor, 0)
}

/**
 * Calcula o total de despesas de uma lista de lançamentos
 */
export function calcularTotalDespesas(lancamentos: Lancamento[]): number {
  return lancamentos
    .filter(l => l.tipo === 'despesa' && l.status !== 'previsto')
    .reduce((acc, l) => acc + l.valor, 0)
}

/**
 * Calcula o saldo (receitas - despesas)
 */
export function calcularSaldo(lancamentos: Lancamento[]): number {
  const receitas = calcularTotalReceitas(lancamentos)
  const despesas = calcularTotalDespesas(lancamentos)
  return receitas - despesas
}

/**
 * Calcula o total de gastos fixos
 */
export function calcularTotalGastosFixos(gastosFixos: GastoFixo[]): number {
  return gastosFixos
    .filter(gf => gf.ativo)
    .reduce((acc, gf) => acc + gf.valor, 0)
}

/**
 * Calcula gastos variáveis (despesas - gastos fixos)
 */
export function calcularGastosVariaveis(lancamentos: Lancamento[]): number {
  return lancamentos
    .filter(l => l.tipo === 'despesa' && !l.isFixo && l.status !== 'previsto')
    .reduce((acc, l) => acc + l.valor, 0)
}

/**
 * Calcula o total gasto no cartão de crédito no mês
 */
export function calcularGastosCartao(
  lancamentos: Lancamento[], 
  cartaoId: string
): number {
  return lancamentos
    .filter(l => l.cartaoId === cartaoId && l.formaPagamento === 'credito')
    .reduce((acc, l) => acc + l.valor, 0)
}

/**
 * Calcula o limite disponível do cartão
 */
export function calcularLimiteDisponivel(
  cartao: Cartao, 
  lancamentos: Lancamento[]
): number {
  const gastos = calcularGastosCartao(lancamentos, cartao.id)
  return cartao.limite - gastos
}

/**
 * Calcula totais por categoria
 */
export function calcularPorCategoria(
  lancamentos: Lancamento[],
  categorias: Categoria[]
): { categoriaId: string; nome: string; cor: string; valor: number; percentual: number }[] {
  const despesas = lancamentos.filter(l => l.tipo === 'despesa' && l.status !== 'previsto')
  const total = despesas.reduce((acc, l) => acc + l.valor, 0)
  
  const porCategoria = new Map<string, number>()
  
  despesas.forEach(l => {
    const atual = porCategoria.get(l.categoriaId) || 0
    porCategoria.set(l.categoriaId, atual + l.valor)
  })
  
  return Array.from(porCategoria.entries())
    .map(([categoriaId, valor]) => {
      const categoria = categorias.find(c => c.id === categoriaId)
      return {
        categoriaId,
        nome: categoria?.nome || 'Sem categoria',
        cor: categoria?.cor || '#888888',
        valor,
        percentual: total > 0 ? (valor / total) * 100 : 0
      }
    })
    .sort((a, b) => b.valor - a.valor)
}

/**
 * Calcula o total investido
 */
export function calcularTotalInvestido(investimentos: Investimento[]): number {
  return investimentos.reduce((acc, i) => acc + i.valorAtual, 0)
}

/**
 * Calcula a rentabilidade total dos investimentos
 */
export function calcularRentabilidadeTotal(investimentos: Investimento[]): {
  valorAplicado: number
  valorAtual: number
  rendimento: number
  percentual: number
} {
  const valorAplicado = investimentos.reduce((acc, i) => acc + i.valorAplicado, 0)
  const valorAtual = investimentos.reduce((acc, i) => acc + i.valorAtual, 0)
  const rendimento = valorAtual - valorAplicado
  const percentual = valorAplicado > 0 ? (rendimento / valorAplicado) * 100 : 0
  
  return { valorAplicado, valorAtual, rendimento, percentual }
}

/**
 * Calcula totais do apartamento
 */
export function calcularTotaisApartamento(lancamentos: LancamentoApartamento[]): {
  total: number
  pago: number
  pendente: number
  previsto: number
} {
  return calcularTotaisAreaFinanceira(
    lancamentos.map((lancamento) => ({
      id: lancamento.id,
      data: lancamento.data,
      tipo: lancamento.tipo,
      descricao: lancamento.descricao,
      categoriaId: lancamento.categoria,
      valor: lancamento.valor,
      status: lancamento.status,
      formaPagamento: lancamento.formaPagamento,
      contaId: lancamento.contaId,
      cartaoId: lancamento.cartaoId,
      observacao: lancamento.observacao,
    }))
  )
}

export function calcularTotaisAreaFinanceira(lancamentos: LancamentoAreaFinanceira[]): {
  total: number
  pago: number
  pendente: number
  previsto: number
} {
  const total = lancamentos.reduce((acc, l) => acc + l.valor, 0)
  const pago = lancamentos
    .filter(l => l.status === 'pago')
    .reduce((acc, l) => acc + l.valor, 0)
  const pendente = lancamentos
    .filter(l => l.status === 'pendente')
    .reduce((acc, l) => acc + l.valor, 0)
  const previsto = lancamentos
    .filter(l => l.status === 'previsto')
    .reduce((acc, l) => acc + l.valor, 0)
  
  return { total, pago, pendente, previsto }
}

export function calcularTotalAreasFinanceiras(areas: AreaFinanceira[]): number {
  return areas.reduce((acc, area) => acc + calcularTotaisAreaFinanceira(area.lancamentos).pago, 0)
}

/**
 * Filtra lançamentos por mês e ano
 */
export function filtrarPorMesAno(
  lancamentos: Lancamento[], 
  mes: number, 
  ano: number
): Lancamento[] {
  return lancamentos.filter(l => {
    const data = new Date(l.data)
    return data.getMonth() + 1 === mes && data.getFullYear() === ano
  })
}

/**
 * Agrupa lançamentos por dia
 */
export function agruparPorDia(lancamentos: Lancamento[]): Map<string, Lancamento[]> {
  const grupos = new Map<string, Lancamento[]>()
  
  lancamentos.forEach(l => {
    const data = new Date(l.data)
    const chave = data.toISOString().split('T')[0]
    const atual = grupos.get(chave) || []
    grupos.set(chave, [...atual, l])
  })
  
  return grupos
}

/**
 * Calcula a evolução mensal dos últimos N meses
 */
export function calcularEvolucaoMensal(
  lancamentos: Lancamento[],
  meses: number = 6
): { mes: number; ano: number; receita: number; despesa: number; saldo: number }[] {
  const hoje = new Date()
  const resultado: { mes: number; ano: number; receita: number; despesa: number; saldo: number }[] = []
  
  for (let i = meses - 1; i >= 0; i--) {
    const data = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1)
    const mes = data.getMonth() + 1
    const ano = data.getFullYear()
    
    const lancamentosMes = filtrarPorMesAno(lancamentos, mes, ano)
    const receita = calcularTotalReceitas(lancamentosMes)
    const despesa = calcularTotalDespesas(lancamentosMes)
    
    resultado.push({
      mes,
      ano,
      receita,
      despesa,
      saldo: receita - despesa
    })
  }
  
  return resultado
}

/**
 * Verifica se um gasto fixo está em um cartão específico
 */
export function gastosFixosNoCartao(gastosFixos: GastoFixo[], cartaoId: string): GastoFixo[] {
  return gastosFixos.filter(gf => gf.cartaoId === cartaoId && gf.ativo)
}

/**
 * Calcula o próximo vencimento de um gasto fixo
 */
export function proximoVencimento(diaVencimento: number): Date {
  const hoje = new Date()
  const mesAtual = hoje.getMonth()
  const anoAtual = hoje.getFullYear()
  
  let proximaData = new Date(anoAtual, mesAtual, diaVencimento)
  
  if (proximaData < hoje) {
    proximaData = new Date(anoAtual, mesAtual + 1, diaVencimento)
  }
  
  return proximaData
}
