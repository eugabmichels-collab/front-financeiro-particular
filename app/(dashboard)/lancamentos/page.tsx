'use client'

import * as React from 'react'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'

import { Header } from '@/components/layout/header'
import { useFilters } from '@/hooks/use-filters'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LancamentosTable } from '@/components/tables/lancamentos-table'
import { LancamentoForm } from '@/components/forms/lancamento-form'
import { SummaryCard } from '@/components/cards/summary-card'
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react'

import { lancamentos as mockLancamentos, categorias, cartoes, contas } from '@/data/mock-data'
import { filtrarPorMesAno, calcularTotalReceitas, calcularTotalDespesas } from '@/lib/calculations'
import type { Lancamento } from '@/types'

export default function LancamentosPage() {
  const { mes, ano, mesAnterior, proximoMes } = useFilters()
  const [showForm, setShowForm] = React.useState(false)
  const [editingLancamento, setEditingLancamento] = React.useState<Lancamento | null>(null)
  const [lancamentos, setLancamentos] = React.useState(mockLancamentos)

  // Filter by month/year
  const lancamentosMes = filtrarPorMesAno(lancamentos, mes, ano)
  
  // Calculate totals
  const receitaTotal = calcularTotalReceitas(lancamentosMes)
  const despesaTotal = calcularTotalDespesas(lancamentosMes)
  const saldoMes = receitaTotal - despesaTotal

  const handleEdit = (lancamento: Lancamento) => {
    setEditingLancamento(lancamento)
    setShowForm(true)
  }

  const handleDelete = (lancamento: Lancamento) => {
    setLancamentos((prev) => prev.filter((l) => l.id !== lancamento.id))
    toast.success('Lançamento excluído com sucesso')
  }

  const handleDuplicate = (lancamento: Lancamento) => {
    const duplicado: Lancamento = {
      ...lancamento,
      id: `lanc-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setLancamentos((prev) => [duplicado, ...prev])
    toast.success('Lançamento duplicado com sucesso')
  }

  const handleMarkPaid = (lancamento: Lancamento) => {
    setLancamentos((prev) =>
      prev.map((l) =>
        l.id === lancamento.id ? { ...l, status: 'pago' as const, updatedAt: new Date() } : l
      )
    )
    toast.success('Lançamento marcado como pago')
  }

  const handleSave = (data: Partial<Lancamento>) => {
    if (editingLancamento) {
      setLancamentos((prev) =>
        prev.map((l) => (l.id === editingLancamento.id ? { ...l, ...data } : l))
      )
      toast.success('Lançamento atualizado com sucesso')
    } else {
      setLancamentos((prev) => [data as Lancamento, ...prev])
      toast.success('Lançamento criado com sucesso')
    }
    setEditingLancamento(null)
  }

  const handleNewLancamento = () => {
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
        onNovoLancamento={handleNewLancamento}
        titulo="Lançamentos"
      />
      <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        {/* Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <SummaryCard
            title="Receitas"
            value={receitaTotal}
            icon={TrendingUp}
            variant="receita"
            subtitle="este mês"
          />
          <SummaryCard
            title="Despesas"
            value={despesaTotal}
            icon={TrendingDown}
            variant="despesa"
            subtitle="este mês"
          />
          <SummaryCard
            title="Saldo"
            value={saldoMes}
            icon={Wallet}
            variant={saldoMes >= 0 ? 'receita' : 'despesa'}
            subtitle="receita - despesa"
          />
        </div>

        {/* Transactions Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Todos os Lançamentos</CardTitle>
                <CardDescription>
                  Gerencie suas receitas e despesas do mês
                </CardDescription>
              </div>
              <Button onClick={handleNewLancamento}>
                <Plus className="mr-2 size-4" />
                Novo
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <LancamentosTable
              data={lancamentosMes}
              categorias={categorias}
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
