// =====================================
// UTILITÁRIOS DE FORMATAÇÃO
// =====================================

/**
 * Formata um valor numérico para moeda brasileira (R$)
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

/**
 * Formata um valor numérico para moeda sem o símbolo
 */
export function formatNumber(value: number, decimals: number = 2): string {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

/**
 * Formata uma data para o padrão brasileiro
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('pt-BR').format(d)
}

/**
 * Formata uma data para exibição com mês por extenso
 */
export function formatDateLong(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d)
}

/**
 * Retorna o nome do mês
 */
export function getMonthName(month: number): string {
  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril',
    'Maio', 'Junho', 'Julho', 'Agosto',
    'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ]
  return months[month - 1] || ''
}

/**
 * Retorna o nome abreviado do mês
 */
export function getMonthNameShort(month: number): string {
  const months = [
    'Jan', 'Fev', 'Mar', 'Abr',
    'Mai', 'Jun', 'Jul', 'Ago',
    'Set', 'Out', 'Nov', 'Dez'
  ]
  return months[month - 1] || ''
}

/**
 * Formata percentual
 */
export function formatPercent(value: number, decimals: number = 1): string {
  return `${formatNumber(value, decimals)}%`
}

/**
 * Converte string de moeda para número
 */
export function parseCurrency(value: string): number {
  // Remove R$, espaços e pontos de milhar, troca vírgula por ponto
  const cleaned = value
    .replace(/R\$\s?/g, '')
    .replace(/\./g, '')
    .replace(',', '.')
    .trim()
  return parseFloat(cleaned) || 0
}

/**
 * Retorna a cor CSS baseada no tipo de lançamento
 */
export function getTypeColor(tipo: string): string {
  const colors: Record<string, string> = {
    receita: 'hsl(var(--receita))',
    despesa: 'hsl(var(--despesa))',
    investimento: 'hsl(var(--investimento))',
    apartamento: 'hsl(var(--apartamento))',
    transferencia: 'hsl(var(--muted-foreground))',
  }
  return colors[tipo] || colors.transferencia
}

/**
 * Retorna a classe CSS baseada no status
 */
export function getStatusVariant(status: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    pago: 'default',
    pendente: 'secondary',
    previsto: 'outline',
    atrasado: 'destructive',
  }
  return variants[status] || 'outline'
}

/**
 * Retorna o label traduzido do status
 */
export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pago: 'Pago',
    pendente: 'Pendente',
    previsto: 'Previsto',
    atrasado: 'Atrasado',
    aberta: 'Aberta',
    fechada: 'Fechada',
  }
  return labels[status] || status
}

/**
 * Retorna o label traduzido da forma de pagamento
 */
export function getFormaPagamentoLabel(forma: string): string {
  const labels: Record<string, string> = {
    pix: 'PIX',
    debito: 'Débito',
    credito: 'Crédito',
    dinheiro: 'Dinheiro',
    transferencia: 'Transferência',
    boleto: 'Boleto',
  }
  return labels[forma] || forma
}

/**
 * Retorna o label traduzido do tipo de lançamento
 */
export function getTipoLabel(tipo: string): string {
  const labels: Record<string, string> = {
    receita: 'Receita',
    despesa: 'Despesa',
    investimento: 'Investimento',
    transferencia: 'Transferência',
  }
  return labels[tipo] || tipo
}

/**
 * Retorna o label traduzido do tipo de investimento
 */
export function getTipoInvestimentoLabel(tipo: string): string {
  const labels: Record<string, string> = {
    cdb: 'CDB',
    fgts: 'FGTS',
    previdencia: 'Previdência',
    tesouro: 'Tesouro Direto',
    fundos: 'Fundos',
    acoes: 'Ações',
    outros: 'Outros',
  }
  return labels[tipo] || tipo
}

/**
 * Retorna o label traduzido da categoria do apartamento
 */
export function getCategoriaApartamentoLabel(categoria: string): string {
  const labels: Record<string, string> = {
    entrada: 'Entrada',
    parcelas: 'Parcelas',
    financiamento: 'Financiamento',
    documentacao: 'Documentação',
    cartorio: 'Cartório',
    itbi: 'ITBI',
    escritura: 'Escritura',
    obra: 'Obra',
    reforma: 'Reforma',
    moveis: 'Móveis',
    eletrodomesticos: 'Eletrodomésticos',
    condominio: 'Condomínio',
    reserva: 'Reserva',
    outros: 'Outros',
  }
  return labels[categoria] || categoria
}
