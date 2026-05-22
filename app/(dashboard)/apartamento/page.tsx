'use client'

import * as React from 'react'
import { Building2, CheckCircle, Clock, CalendarClock, TrendingUp } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

import { Header } from '@/components/layout/header'
import { useFilters } from '@/hooks/use-filters'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { SummaryCard } from '@/components/cards/summary-card'
import { formatCurrency, formatDate, getStatusLabel, getStatusVariant, getCategoriaApartamentoLabel } from '@/lib/format'

import { lancamentosApartamento } from '@/data/mock-data'
import { calcularTotaisApartamento } from '@/lib/calculations'
import type { CategoriaApartamento } from '@/types'

// Colors for apartment categories
const CATEGORIA_COLORS: Record<string, string> = {
  entrada: 'oklch(0.55 0.15 250)',
  parcelas: 'oklch(0.60 0.15 155)',
  financiamento: 'oklch(0.55 0.15 300)',
  documentacao: 'oklch(0.65 0.15 70)',
  cartorio: 'oklch(0.55 0.12 195)',
  itbi: 'oklch(0.58 0.16 25)',
  escritura: 'oklch(0.50 0.15 180)',
  obra: 'oklch(0.55 0.12 40)',
  reforma: 'oklch(0.60 0.12 100)',
  moveis: 'oklch(0.50 0.15 220)',
  eletrodomesticos: 'oklch(0.55 0.12 260)',
  condominio: 'oklch(0.60 0.10 330)',
  reserva: 'oklch(0.50 0.12 120)',
  outros: 'oklch(0.50 0.05 260)',
}

export default function ApartamentoPage() {
  const { mes, ano, mesAnterior, proximoMes } = useFilters()

  // Calculate totals
  const totais = calcularTotaisApartamento(lancamentosApartamento)
  const progressPercent = totais.total > 0 ? (totais.pago / totais.total) * 100 : 0

  // Group by category
  const porCategoria = lancamentosApartamento.reduce((acc, lanc) => {
    const cat = lanc.categoria
    if (!acc[cat]) {
      acc[cat] = { total: 0, pago: 0, pendente: 0, previsto: 0 }
    }
    acc[cat].total += lanc.valor
    if (lanc.status === 'pago') acc[cat].pago += lanc.valor
    if (lanc.status === 'pendente') acc[cat].pendente += lanc.valor
    if (lanc.status === 'previsto') acc[cat].previsto += lanc.valor
    return acc
  }, {} as Record<string, { total: number; pago: number; pendente: number; previsto: number }>)

  const chartData = Object.entries(porCategoria).map(([cat, data]) => ({
    name: getCategoriaApartamentoLabel(cat),
    total: data.total,
    pago: data.pago,
    categoria: cat,
    color: CATEGORIA_COLORS[cat] || CATEGORIA_COLORS.outros,
  }))

  // Get next pending payment
  const proximoPagamento = lancamentosApartamento
    .filter((l) => l.status === 'pendente' || l.status === 'previsto')
    .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())[0]

  return (
    <>
      <Header
        mes={mes}
        ano={ano}
        onMesAnterior={mesAnterior}
        onProximoMes={proximoMes}
        titulo="Apartamento"
      />
      <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        {/* Progress Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="size-5 text-apartamento" />
              Progresso do Apartamento
            </CardTitle>
            <CardDescription>Acompanhe seus pagamentos e reservas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Progresso geral</span>
              <span className="font-semibold">{progressPercent.toFixed(1)}% concluído</span>
            </div>
            <Progress value={progressPercent} className="h-3" />
            <div className="grid grid-cols-2 gap-4 pt-2 sm:grid-cols-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-apartamento">{formatCurrency(totais.pago)}</p>
                <p className="text-xs text-muted-foreground">Total Pago</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-cartao">{formatCurrency(totais.pendente)}</p>
                <p className="text-xs text-muted-foreground">Pendente</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-muted-foreground">{formatCurrency(totais.previsto)}</p>
                <p className="text-xs text-muted-foreground">Previsto</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{formatCurrency(totais.total)}</p>
                <p className="text-xs text-muted-foreground">Total Geral</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <SummaryCard
            title="Total Pago"
            value={totais.pago}
            icon={CheckCircle}
            variant="apartamento"
            subtitle="já quitado"
          />
          <SummaryCard
            title="Pendente"
            value={totais.pendente}
            icon={Clock}
            variant="cartao"
            subtitle="a pagar em breve"
          />
          <SummaryCard
            title="Previsto"
            value={totais.previsto}
            icon={CalendarClock}
            variant="default"
            subtitle="pagamentos futuros"
          />
        </div>

        {/* Next Payment Alert */}
        {proximoPagamento && (
          <Card className="border-apartamento/30 bg-apartamento/5">
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <CalendarClock className="size-5 text-apartamento" />
                <div>
                  <p className="font-medium">Próximo Pagamento</p>
                  <p className="text-sm text-muted-foreground">
                    {proximoPagamento.descricao} - {formatDate(proximoPagamento.data)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-apartamento">
                  {formatCurrency(proximoPagamento.valor)}
                </p>
                <Badge variant={getStatusVariant(proximoPagamento.status)}>
                  {getStatusLabel(proximoPagamento.status)}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Chart by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Gastos por Categoria</CardTitle>
            <CardDescription>Distribuição dos gastos do apartamento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" margin={{ left: 100 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal vertical={false} />
                  <XAxis type="number" tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload
                        return (
                          <div className="rounded-lg border bg-card px-3 py-2 shadow-sm">
                            <p className="font-medium">{data.name}</p>
                            <p className="text-sm">Total: {formatCurrency(data.total)}</p>
                            <p className="text-sm text-receita">Pago: {formatCurrency(data.pago)}</p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Bar dataKey="total" radius={[0, 4, 4, 0]} maxBarSize={25}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Pagamentos</CardTitle>
            <CardDescription>Timeline de todos os pagamentos do apartamento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lancamentosApartamento
                .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
                .map((lanc) => (
                  <div
                    key={lanc.id}
                    className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="size-3 rounded-full"
                        style={{ backgroundColor: CATEGORIA_COLORS[lanc.categoria] || CATEGORIA_COLORS.outros }}
                      />
                      <div>
                        <p className="font-medium">{lanc.descricao}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{formatDate(lanc.data)}</span>
                          <span>-</span>
                          <span>{getCategoriaApartamentoLabel(lanc.categoria)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={getStatusVariant(lanc.status)}>
                        {getStatusLabel(lanc.status)}
                      </Badge>
                      <span className={`font-semibold ${lanc.status === 'pago' ? 'text-apartamento' : 'text-muted-foreground'}`}>
                        {formatCurrency(lanc.valor)}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  )
}
