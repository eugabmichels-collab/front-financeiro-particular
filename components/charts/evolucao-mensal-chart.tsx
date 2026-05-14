'use client'

import * as React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency, getMonthNameShort } from '@/lib/format'

interface EvolucaoMensal {
  mes: number
  ano: number
  receita: number
  despesa: number
  saldo: number
}

interface EvolucaoMensalChartProps {
  data: EvolucaoMensal[]
}

// Compute colors in JavaScript - CSS variables don't work directly in Recharts
const RECEITA_COLOR = 'oklch(0.60 0.15 155)'
const DESPESA_COLOR = 'oklch(0.58 0.16 25)'

export function EvolucaoMensalChart({ data }: EvolucaoMensalChartProps) {
  const chartData = data.map((item) => ({
    name: `${getMonthNameShort(item.mes)}/${item.ano.toString().slice(-2)}`,
    receita: item.receita,
    despesa: item.despesa,
    saldo: item.saldo,
  }))

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Evolução Mensal</CardTitle>
        <CardDescription>Receitas e despesas dos últimos meses</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-card px-3 py-2 shadow-sm">
                        <p className="mb-1 font-medium">{label}</p>
                        {payload.map((entry, index) => (
                          <p key={index} className="text-sm" style={{ color: entry.color }}>
                            {entry.name === 'receita' ? 'Receita' : 'Despesa'}:{' '}
                            {formatCurrency(entry.value as number)}
                          </p>
                        ))}
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Legend
                formatter={(value) => (value === 'receita' ? 'Receita' : 'Despesa')}
                iconType="circle"
                iconSize={8}
              />
              <Bar
                dataKey="receita"
                fill={RECEITA_COLOR}
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
              <Bar
                dataKey="despesa"
                fill={DESPESA_COLOR}
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
