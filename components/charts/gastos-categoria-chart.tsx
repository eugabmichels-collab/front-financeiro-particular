'use client'

import * as React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency, formatPercent } from '@/lib/format'

interface GastoCategoria {
  categoriaId: string
  nome: string
  cor: string
  valor: number
  percentual: number
}

interface GastosCategoriaChartProps {
  data: GastoCategoria[]
  total: number
}

export function GastosCategoriaChart({ data, total }: GastosCategoriaChartProps) {
  const chartData = data.slice(0, 8).map((item) => ({
    name: item.nome,
    value: item.valor,
    color: item.cor,
    percentual: item.percentual,
  }))

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Gastos por Categoria</CardTitle>
        <CardDescription>Distribuição das despesas do mês</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-4 lg:flex-row">
          <div className="h-[200px] w-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
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
                            {formatCurrency(data.value)} ({formatPercent(data.percentual)})
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
          <div className="flex flex-1 flex-col gap-2">
            {chartData.map((item, index) => (
              <div key={index} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div
                    className="size-3 rounded-sm"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm">{item.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium">
                    {formatCurrency(item.value)}
                  </span>
                  <span className="ml-2 text-xs text-muted-foreground">
                    {formatPercent(item.percentual)}
                  </span>
                </div>
              </div>
            ))}
            <div className="mt-2 border-t pt-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total</span>
                <span className="text-sm font-bold">{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
