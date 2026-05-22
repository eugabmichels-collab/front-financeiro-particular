'use client'

import { cn } from '@/lib/utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatPercent, formatDate, getTipoInvestimentoLabel } from '@/lib/format'
import { TrendingUp, TrendingDown } from 'lucide-react'
import type { Investimento } from '@/types'

interface InvestimentoCardProps {
  investimento: Investimento
  onClick?: () => void
}

export function InvestimentoCard({ investimento, onClick }: InvestimentoCardProps) {
  const rendimento = investimento.valorAtual - investimento.valorAplicado
  const rentabilidade = investimento.valorAplicado > 0 
    ? (rendimento / investimento.valorAplicado) * 100 
    : 0
  const isPositive = rendimento >= 0

  return (
    <Card 
      className="cursor-pointer transition-all hover:shadow-md"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">{investimento.nome}</CardTitle>
            <CardDescription>{investimento.instituicao}</CardDescription>
          </div>
          <Badge variant="secondary">
            {getTipoInvestimentoLabel(investimento.tipo)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Valor atual</span>
          <span className="text-xl font-bold text-investimento">
            {formatCurrency(investimento.valorAtual)}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Valor aplicado</span>
          <span className="font-medium">
            {formatCurrency(investimento.valorAplicado)}
          </span>
        </div>
        
        <div className="flex items-center justify-between border-t pt-3">
          <span className="text-sm text-muted-foreground">Rendimento</span>
          <div className={cn(
            'flex items-center gap-1 font-semibold',
            isPositive ? 'text-receita' : 'text-despesa'
          )}>
            {isPositive ? (
              <TrendingUp className="size-4" />
            ) : (
              <TrendingDown className="size-4" />
            )}
            <span>{formatCurrency(rendimento)}</span>
            <span className="text-sm">({formatPercent(rentabilidade)})</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Aplicado em {formatDate(investimento.dataAplicacao)}</span>
          {investimento.rentabilidadeEstimada && (
            <span>Est. {formatPercent(investimento.rentabilidadeEstimada)} a.a.</span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
