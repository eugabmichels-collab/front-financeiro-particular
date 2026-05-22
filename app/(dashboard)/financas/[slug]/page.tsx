'use client'

import Link from 'next/link'
import * as React from 'react'
import { useParams } from 'next/navigation'
import { CalendarClock, CheckCircle, Clock, FolderOpen } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

import { Header } from '@/components/layout/header'
import { useFilters } from '@/hooks/use-filters'
import { useFinancialAreas } from '@/hooks/use-financial-areas'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { Progress } from '@/components/ui/progress'
import { calcularTotaisAreaFinanceira } from '@/lib/calculations'
import { formatCurrency, formatDate, getStatusLabel, getStatusVariant } from '@/lib/format'
import { getFinancialAreaIcon } from '@/lib/financial-areas'

export default function AreaFinanceiraPage() {
  const params = useParams<{ slug: string }>()
  const { mes, ano, mesAnterior, proximoMes } = useFilters()
  const { areasFinanceiras } = useFinancialAreas()

  const area = React.useMemo(
    () => areasFinanceiras.find((item) => item.slug === params.slug),
    [areasFinanceiras, params.slug]
  )

  const categoriasMap = React.useMemo(
    () => new Map(area?.categorias.map((categoria) => [categoria.id, categoria]) || []),
    [area]
  )

  const totais = React.useMemo(
    () => calcularTotaisAreaFinanceira(area?.lancamentos || []),
    [area]
  )

  const progressPercent = totais.total > 0 ? (totais.pago / totais.total) * 100 : 0

  const porCategoria = React.useMemo(() => {
    if (!area) {
      return []
    }

    const grouped = area.lancamentos.reduce<Record<string, { total: number; pago: number }>>((acc, lancamento) => {
      if (!acc[lancamento.categoriaId]) {
        acc[lancamento.categoriaId] = { total: 0, pago: 0 }
      }

      acc[lancamento.categoriaId].total += lancamento.valor

      if (lancamento.status === 'pago') {
        acc[lancamento.categoriaId].pago += lancamento.valor
      }

      return acc
    }, {})

    return Object.entries(grouped).map(([categoriaId, values]) => ({
      categoriaId,
      name: categoriasMap.get(categoriaId)?.nome || 'Sem categoria',
      total: values.total,
      pago: values.pago,
      color: categoriasMap.get(categoriaId)?.cor || area.cor,
    }))
  }, [area, categoriasMap])

  const proximoPagamento = React.useMemo(() => {
    if (!area) {
      return undefined
    }

    return [...area.lancamentos]
      .filter((lancamento) => lancamento.status === 'pendente' || lancamento.status === 'previsto')
      .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())[0]
  }, [area])

  if (!area) {
    return (
      <>
        <Header
          mes={mes}
          ano={ano}
          onMesAnterior={mesAnterior}
          onProximoMes={proximoMes}
          titulo="Área Financeira"
        />
        <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FolderOpen />
              </EmptyMedia>
              <EmptyTitle>Área financeira não encontrada</EmptyTitle>
              <EmptyDescription>
                A área solicitada não existe mais ou ainda não foi criada nas configurações.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button asChild>
                <Link href="/configuracoes">Gerenciar áreas financeiras</Link>
              </Button>
            </EmptyContent>
          </Empty>
        </main>
      </>
    )
  }

  const Icon = getFinancialAreaIcon(area.icone)

  return (
    <>
      <Header
        mes={mes}
        ano={ano}
        onMesAnterior={mesAnterior}
        onProximoMes={proximoMes}
        titulo={area.nome}
      />
      <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon className="size-5" style={{ color: area.cor }} />
              Progresso de {area.nome}
            </CardTitle>
            <CardDescription>
              {area.descricao || 'Acompanhe pagamentos, reservas e gastos desta área financeira.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Progresso geral</span>
              <span className="font-semibold">{progressPercent.toFixed(1)}% concluído</span>
            </div>
            <Progress value={progressPercent} className="h-3" />
            <div className="grid grid-cols-2 gap-4 pt-2 sm:grid-cols-4">
              <div className="text-center">
                <p className="text-2xl font-bold" style={{ color: area.cor }}>{formatCurrency(totais.pago)}</p>
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

        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm text-muted-foreground">Total Pago</p>
                <p className="text-2xl font-bold" style={{ color: area.cor }}>{formatCurrency(totais.pago)}</p>
                <p className="text-xs text-muted-foreground">já quitado</p>
              </div>
              <CheckCircle className="size-5" style={{ color: area.cor }} />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm text-muted-foreground">Pendente</p>
                <p className="text-2xl font-bold text-cartao">{formatCurrency(totais.pendente)}</p>
                <p className="text-xs text-muted-foreground">a pagar em breve</p>
              </div>
              <Clock className="size-5 text-cartao" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm text-muted-foreground">Previsto</p>
                <p className="text-2xl font-bold">{formatCurrency(totais.previsto)}</p>
                <p className="text-xs text-muted-foreground">pagamentos futuros</p>
              </div>
              <CalendarClock className="size-5 text-muted-foreground" />
            </CardContent>
          </Card>
        </div>

        {proximoPagamento && (
          <Card style={{ borderColor: `${area.cor}4d`, backgroundColor: `${area.cor}0d` }}>
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <CalendarClock className="size-5" style={{ color: area.cor }} />
                <div>
                  <p className="font-medium">Próximo Pagamento</p>
                  <p className="text-sm text-muted-foreground">
                    {proximoPagamento.descricao} - {formatDate(proximoPagamento.data)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold" style={{ color: area.cor }}>
                  {formatCurrency(proximoPagamento.valor)}
                </p>
                <Badge variant={getStatusVariant(proximoPagamento.status)}>
                  {getStatusLabel(proximoPagamento.status)}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Gastos por Categoria</CardTitle>
            <CardDescription>Distribuição dos valores cadastrados em {area.nome.toLowerCase()}</CardDescription>
          </CardHeader>
          <CardContent>
            {porCategoria.length > 0 ? (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={porCategoria} layout="vertical" margin={{ left: 100 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal vertical={false} />
                    <XAxis type="number" tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload
                          return (
                            <div className="rounded-lg border bg-card px-3 py-2 shadow-sm">
                              <p className="font-medium">{data.name}</p>
                              <p className="text-sm">Total: {formatCurrency(data.total)}</p>
                              <p className="text-sm">Pago: {formatCurrency(data.pago)}</p>
                            </div>
                          )
                        }

                        return null
                      }}
                    />
                    <Bar dataKey="total" radius={[0, 4, 4, 0]} maxBarSize={25}>
                      {porCategoria.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <Empty className="border border-dashed">
                <EmptyHeader>
                  <EmptyTitle>Sem lançamentos nesta área</EmptyTitle>
                  <EmptyDescription>
                    A área já aparece no menu e está pronta para receber movimentações quando você precisar.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Histórico</CardTitle>
            <CardDescription>Timeline dos pagamentos e reservas de {area.nome.toLowerCase()}</CardDescription>
          </CardHeader>
          <CardContent>
            {area.lancamentos.length > 0 ? (
              <div className="space-y-4">
                {[...area.lancamentos]
                  .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
                  .map((lancamento) => {
                    const categoria = categoriasMap.get(lancamento.categoriaId)

                    return (
                      <div
                        key={lancamento.id}
                        className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className="size-3 rounded-full"
                            style={{ backgroundColor: categoria?.cor || area.cor }}
                          />
                          <div>
                            <p className="font-medium">{lancamento.descricao}</p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>{formatDate(lancamento.data)}</span>
                              <span>-</span>
                              <span>{categoria?.nome || 'Sem categoria'}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant={getStatusVariant(lancamento.status)}>
                            {getStatusLabel(lancamento.status)}
                          </Badge>
                          <span className="font-semibold" style={{ color: lancamento.status === 'pago' ? area.cor : undefined }}>
                            {formatCurrency(lancamento.valor)}
                          </span>
                        </div>
                      </div>
                    )
                  })}
              </div>
            ) : (
              <Empty className="border border-dashed">
                <EmptyHeader>
                  <EmptyTitle>Nenhum histórico cadastrado</EmptyTitle>
                  <EmptyDescription>
                    Essa área já aparece no menu, mas ainda não possui movimentações associadas.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            )}
          </CardContent>
        </Card>
      </main>
    </>
  )
}