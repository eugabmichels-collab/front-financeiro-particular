'use client'

import * as React from 'react'
import { Plus, TrendingUp } from 'lucide-react'
import { toast } from 'sonner'

import { Header } from '@/components/layout/header'
import { useFilters } from '@/hooks/use-filters'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LancamentosTable } from '@/components/tables/lancamentos-table'
import { LancamentoForm } from '@/components/forms/lancamento-form'
import { SummaryCard } from '@/components/cards/summary-card'
import { formatCurrency } from '@/lib/format'

import { lancamentos as mockLancamentos, categorias, cartoes, contas } from '@/data/mock-data'
import { filtrarPorMesAno, calcularTotalReceitas, calcularPorCategoria } from '@/lib/calculations'
import type { Lancamento } from '@/types'

export default function ReceitasPage() {
  const { mes, ano, mesAnterior, proximoMes } = useFilters()
  const [showForm, setShowForm] = React.useState(false)
  const [editingLancamento, setEditingLancamento] = React.useState<Lancamento | null>(null)
  const [lancamentos, setLancamentos] = React.useState(mockLancamentos)

  // Filter by month/year and only receitas
  const lancamentosMes = filtrarPorMesAno(lancamentos, mes, ano).filter((l) => l.tipo === 'receita')
  
  // Calculate totals
  const receitaTotal = lancamentosMes
    .filter((l) => l.status !== 'previsto')
    .reduce((acc, l) => acc + l.valor, 0)
  const receitaPrevista = lancamentosMes
    .filter((l) => l.status === 'previsto')
    .reduce((acc, l) => acc + l.valor, 0)

  const handleEdit = (lancamento: Lancamento) => {
    setEditingLancamento(lancamento)
    setShowForm(true)
  }

  const handleDelete = (lancamento: Lancamento) => {
    setLancamentos((prev) => prev.filter((l) => l.id !== lancamento.id))
    toast.success('Receita excluída com sucesso')
  }

  const handleDuplicate = (lancamento: Lancamento) => {
    const duplicado: Lancamento = {
      ...lancamento,
      id: `lanc-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setLancamentos((prev) => [duplicado, ...prev])
    toast.success('Receita duplicada com sucesso')
  }

  const handleMarkPaid = (lancamento: Lancamento) => {
    setLancamentos((prev) =>
      prev.map((l) =>
        l.id === lancamento.id ? { ...l, status: 'pago' as const, updatedAt: new Date() } : l
      )
    )
    toast.success('Receita confirmada como recebida')
  }

  const handleSave = (data: Partial<Lancamento>) => {
    const lancamentoData = { ...data, tipo: 'receita' as const }
    if (editingLancamento) {
      setLancamentos((prev) =>
        prev.map((l) => (l.id === editingLancamento.id ? { ...l, ...lancamentoData } : l))
      )
      toast.success('Receita atualizada com sucesso')
    } else {
      setLancamentos((prev) => [lancamentoData as Lancamento, ...prev])
      toast.success('Receita criada com sucesso')
    }
    setEditingLancamento(null)
  }

  const handleNewReceita = () => {
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
        onNovoLancamento={handleNewReceita}
        titulo="Receitas"
      />
      <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        {/* Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-2">
          <SummaryCard
            title="Receita Confirmada"
            value={receitaTotal}
            icon={TrendingUp}
            variant="receita"
            subtitle="recebido este mês"
          />
          <SummaryCard
            title="Receita Prevista"
            value={receitaPrevista}
            icon={TrendingUp}
            variant="default"
            subtitle="a receber"
          />
        </div>

        {/* Transactions Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Receitas do Mês</CardTitle>
                <CardDescription>
                  Todas as entradas financeiras
                </CardDescription>
              </div>
              <Button onClick={handleNewReceita}>
                <Plus className="mr-2 size-4" />
                Nova Receita
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <LancamentosTable
              data={lancamentosMes}
              categorias={categorias.filter((c) => c.tipo === 'receita')}
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
