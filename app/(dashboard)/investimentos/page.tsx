'use client'

import * as React from 'react'
import { PiggyBank, TrendingUp, TrendingDown } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

import { Header } from '@/components/layout/header'
import { useFilters } from '@/hooks/use-filters'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SummaryCard } from '@/components/cards/summary-card'
import { InvestimentoCard } from '@/components/cards/investimento-card'
import { formatCurrency, formatPercent, getTipoInvestimentoLabel } from '@/lib/format'

import { investimentos } from '@/data/mock-data'
import { calcularRentabilidadeTotal } from '@/lib/calculations'

// Chart colors for investment types
const TIPO_COLORS: Record<string, string> = {
  cdb: 'oklch(0.55 0.15 250)',
  fgts: 'oklch(0.60 0.15 155)',
  previdencia: 'oklch(0.55 0.15 300)',
  tesouro: 'oklch(0.65 0.15 70)',
  fundos: 'oklch(0.55 0.12 195)',
  acoes: 'oklch(0.58 0.16 25)',
  outros: 'oklch(0.50 0.05 260)',
}

export default function InvestimentosPage() {
  const { mes, ano, mesAnterior, proximoMes } = useFilters()

  // Calculate totals
  const totais = calcularRentabilidadeTotal(investimentos)
  
  // Group by type for chart
  const porTipo = investimentos.reduce((acc, inv) => {
    const tipo = inv.tipo
    if (!acc[tipo]) {
      acc[tipo] = { valor: 0, count: 0 }
    }
    acc[tipo].valor += inv.valorAtual
    acc[tipo].count += 1
    return acc
  }, {} as Record<string, { valor: number; count: number }>)

  const chartData = Object.entries(porTipo).map(([tipo, data]) => ({
    name: getTipoInvestimentoLabel(tipo),
    value: data.valor,
    color: TIPO_COLORS[tipo] || TIPO_COLORS.outros,
    percent: (data.valor / totais.valorAtual) * 100,
  }))

  return (
    <>
      <Header
        mes={mes}
        ano={ano}
        onMesAnterior={mesAnterior}
        onProximoMes={proximoMes}
        titulo="Investimentos"
      />
      <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        {/* Summary */}
        <div className="grid gap-4 sm:grid-cols-4">
          <SummaryCard
            title="Patrimônio Total"
            value={totais.valorAtual}
            icon={PiggyBank}
            variant="investimento"
            subtitle="valor atualizado"
          />
          <SummaryCard
            title="Total Aplicado"
            value={totais.valorAplicado}
            icon={PiggyBank}
            variant="default"
            subtitle="aportes realizados"
          />
          <SummaryCard
            title="Rendimento Total"
            value={totais.rendimento}
            icon={totais.rendimento >= 0 ? TrendingUp : TrendingDown}
            variant={totais.rendimento >= 0 ? 'receita' : 'despesa'}
            subtitle={`${formatPercent(totais.percentual)} de rentabilidade`}
          />
          <SummaryCard
            title="Investimentos"
            value={investimentos.length}
            icon={PiggyBank}
            variant="default"
            subtitle="ativos cadastrados"
          />
        </div>

        {/* Distribution Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Tipo</CardTitle>
            <CardDescription>Como seu patrimônio está distribuído</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-6 lg:flex-row">
              <div className="h-[250px] w-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={110}
                      paddingAngle={2}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload
                          return (
                            <div className="rounded-lg border bg-card px-3 py-2 shadow-sm">
                              <p className="font-medium">{data.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {formatCurrency(data.value)} ({formatPercent(data.percent)})
                              </p>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-1 flex-col gap-3">
                {chartData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="size-4 rounded-sm"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="font-medium">{item.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold">
                        {formatCurrency(item.value)}
                      </span>
                      <span className="ml-2 text-sm text-muted-foreground">
                        {formatPercent(item.percent)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Investments Grid */}
        <div>
          <h2 className="mb-4 text-lg font-semibold">Meus Investimentos</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {investimentos.map((investimento) => (
              <InvestimentoCard
                key={investimento.id}
                investimento={investimento}
              />
            ))}
          </div>
        </div>
      </main>
    </>
  )
}
