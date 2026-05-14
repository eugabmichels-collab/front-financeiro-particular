'use client'

import * as React from 'react'
import { Plus, TrendingDown, CalendarClock } from 'lucide-react'
import { toast } from 'sonner'

import { Header } from '@/components/layout/header'
import { useFilters } from '@/hooks/use-filters'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LancamentosTable } from '@/components/tables/lancamentos-table'
import { LancamentoForm } from '@/components/forms/lancamento-form'
import { SummaryCard } from '@/components/cards/summary-card'
import { GastosCategoriaChart } from '@/components/charts/gastos-categoria-chart'

import { lancamentos as mockLancamentos, categorias, cartoes, contas, gastosFixos } from '@/data/mock-data'
import { filtrarPorMesAno, calcularPorCategoria, calcularTotalGastosFixos, calcularGastosVariaveis } from '@/lib/calculations'
import type { Lancamento } from '@/types'

export default function DespesasPage() {
  const { mes, ano, mesAnterior, proximoMes } = useFilters()
  const [showForm, setShowForm] = React.useState(false)
  const [editingLancamento, setEditingLancamento] = React.useState<Lancamento | null>(null)
  const [lancamentos, setLancamentos] = React.useState(mockLancamentos)

  // Filter by month/year and only despesas
  const lancamentosMes = filtrarPorMesAno(lancamentos, mes, ano).filter((l) => l.tipo === 'despesa')
  
  // Calculate totals
  const despesaTotal = lancamentosMes
    .filter((l) => l.status !== 'previsto')
    .reduce((acc, l) => acc + l.valor, 0)
  const gastosFixosTotal = calcularTotalGastosFixos(gastosFixos)
  const gastosVariaveisTotal = calcularGastosVariaveis(lancamentosMes)
  
  // Expenses by category
  const gastosPorCategoria = calcularPorCategoria(lancamentosMes, categorias)

  const handleEdit = (lancamento: Lancamento) => {
    setEditingLancamento(lancamento)
    setShowForm(true)
  }

  const handleDelete = (lancamento: Lancamento) => {
    setLancamentos((prev) => prev.filter((l) => l.id !== lancamento.id))
    toast.success('Despesa excluída com sucesso')
  }

  const handleDuplicate = (lancamento: Lancamento) => {
    const duplicado: Lancamento = {
      ...lancamento,
      id: `lanc-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setLancamentos((prev) => [duplicado, ...prev])
    toast.success('Despesa duplicada com sucesso')
  }

  const handleMarkPaid = (lancamento: Lancamento) => {
    setLancamentos((prev) =>
      prev.map((l) =>
        l.id === lancamento.id ? { ...l, status: 'pago' as const, updatedAt: new Date() } : l
      )
    )
    toast.success('Despesa marcada como paga')
  }

  const handleSave = (data: Partial<Lancamento>) => {
    const lancamentoData = { ...data, tipo: 'despesa' as const }
    if (editingLancamento) {
      setLancamentos((prev) =>
        prev.map((l) => (l.id === editingLancamento.id ? { ...l, ...lancamentoData } : l))
      )
      toast.success('Despesa atualizada com sucesso')
    } else {
      setLancamentos((prev) => [lancamentoData as Lancamento, ...prev])
      toast.success('Despesa criada com sucesso')
    }
    setEditingLancamento(null)
  }

  const handleNewDespesa = () => {
    setEditingLancamento(null)
    setShowForm(true)
  }

  return (
    <>
      <Header
        mes={mes}
        ano={ano}
        onMesAnterior={mesAnterior}
        onProximoMes={proximoMes}
        onNovoLancamento={handleNewDespesa}
        titulo="Despesas"
      />
      <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        {/* Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <SummaryCard
            title="Total de Despesas"
            value={despesaTotal}
            icon={TrendingDown}
            variant="despesa"
            subtitle="pago este mês"
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
        </div>

        {/* Chart */}
        <GastosCategoriaChart
          data={gastosPorCategoria}
          total={despesaTotal}
        />

        {/* Transactions Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Despesas do Mês</CardTitle>
                <CardDescription>
                  Todas as saídas financeiras
                </CardDescription>
              </div>
              <Button onClick={handleNewDespesa}>
                <Plus className="mr-2 size-4" />
                Nova Despesa
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <LancamentosTable
              data={lancamentosMes}
              categorias={categorias.filter((c) => c.tipo === 'despesa')}
              cartoes={cartoes}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onDuplicate={handleDuplicate}
              onMarkPaid={handleMarkPaid}
            />
          </CardContent>
        </Card>

        {/* Form Dialog */}
        <LancamentoForm
          open={showForm}
          onOpenChange={setShowForm}
          lancamento={editingLancamento}
          categorias={categorias}
          cartoes={cartoes}
          contas={contas}
          onSave={handleSave}
        />
      </main>
    </>
  )
}
