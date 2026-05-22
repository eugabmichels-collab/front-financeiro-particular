'use client'

import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/format'
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  CreditCard, 
  CalendarClock,
  PiggyBank,
  Building2,
  type LucideIcon,
} from 'lucide-react'

interface SummaryCardProps {
  title: string
  value: number
  subtitle?: string
  icon: LucideIcon
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  variant?: 'default' | 'receita' | 'despesa' | 'investimento' | 'apartamento' | 'cartao'
  className?: string
}

export function SummaryCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
  variant = 'default',
  className,
}: SummaryCardProps) {
  const variantStyles = {
    default: {
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
      valueColor: 'text-foreground',
    },
    receita: {
      iconBg: 'bg-receita/10',
      iconColor: 'text-receita',
      valueColor: 'text-receita',
    },
    despesa: {
      iconBg: 'bg-despesa/10',
      iconColor: 'text-despesa',
      valueColor: 'text-despesa',
    },
    investimento: {
      iconBg: 'bg-investimento/10',
      iconColor: 'text-investimento',
      valueColor: 'text-investimento',
    },
    apartamento: {
      iconBg: 'bg-apartamento/10',
      iconColor: 'text-apartamento',
      valueColor: 'text-apartamento',
    },
    cartao: {
      iconBg: 'bg-cartao/10',
      iconColor: 'text-cartao',
      valueColor: 'text-cartao',
    },
  }

  const styles = variantStyles[variant]

  return (
    <Card className={cn('transition-all hover:shadow-md', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={cn('flex size-9 items-center justify-center rounded-lg', styles.iconBg)}>
          <Icon className={cn('size-5', styles.iconColor)} />
        </div>
      </CardHeader>
      <CardContent>
        <div className={cn('text-2xl font-bold', styles.valueColor)}>
          {formatCurrency(value)}
        </div>
        {(subtitle || trendValue) && (
          <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            {trend && (
              <span className={cn(
                'flex items-center',
                trend === 'up' && 'text-receita',
                trend === 'down' && 'text-despesa',
              )}>
                {trend === 'up' ? (
                  <TrendingUp className="mr-0.5 size-3" />
                ) : trend === 'down' ? (
                  <TrendingDown className="mr-0.5 size-3" />
                ) : null}
                {trendValue}
              </span>
            )}
            {subtitle && <span>{subtitle}</span>}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

interface SummaryCardsProps {
  receitaTotal: number
  despesaTotal: number
  saldoMes: number
  gastosFixosTotal: number
  gastosVariaveisTotal: number
  faturaCartaoTotal: number
  investimentoTotal: number
  apartamentoTotal: number
}

export function SummaryCards({
  receitaTotal,
  despesaTotal,
  saldoMes,
  gastosFixosTotal,
  gastosVariaveisTotal,
  faturaCartaoTotal,
  investimentoTotal,
  apartamentoTotal,
}: SummaryCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <SummaryCard
        title="Receita Total"
        value={receitaTotal}
        icon={TrendingUp}
        variant="receita"
        subtitle="este mês"
      />
      <SummaryCard
        title="Despesa Total"
        value={despesaTotal}
        icon={TrendingDown}
        variant="despesa"
        subtitle={`Fixos: ${formatCurrency(gastosFixosTotal)}`}
      />
      <SummaryCard
        title="Saldo do Mês"
        value={saldoMes}
        icon={Wallet}
        variant={saldoMes >= 0 ? 'receita' : 'despesa'}
        subtitle="receita - despesa"
      />
      <SummaryCard
        title="Fatura Cartões"
        value={faturaCartaoTotal}
        icon={CreditCard}
        variant="cartao"
        subtitle="fatura atual"
      />
      <SummaryCard
        title="Gastos Fixos"
        value={gastosFixosTotal}
        icon={CalendarClock}
        variant="default"
        subtitle="recorrentes"
      />
      <SummaryCard
        title="Gastos Variáveis"
        value={gastosVariaveisTotal}
        icon={TrendingDown}
        variant="default"
        subtitle="não recorrentes"
      />
      <SummaryCard
        title="Investimentos"
        value={investimentoTotal}
        icon={PiggyBank}
        variant="investimento"
        subtitle="patrimônio total"
      />
      <SummaryCard
        title="Apartamento"
        value={apartamentoTotal}
        icon={Building2}
        variant="apartamento"
        subtitle="total pago"
      />
    </div>
  )
}
