'use client'


import { LancamentosRecentes } from '@/components/cards/lancamentos-recentes'
import { SummaryCards } from '@/components/cards/summary-card'
import { EvolucaoMensalChart } from '@/components/charts/evolucao-mensal-chart'
import { GastosCategoriaChart } from '@/components/charts/gastos-categoria-chart'
import { Header } from '@/components/layout/header'
import { useFilters } from '@/hooks/use-filters'

import { categorias, gastosFixos, investimentos, lancamentos, lancamentosApartamento } from '@/data/mock-data'
import {
  calcularEvolucaoMensal,
  calcularGastosVariaveis,
  calcularPorCategoria,
  calcularTotaisApartamento,
  calcularTotalDespesas,
  calcularTotalGastosFixos,
  calcularTotalInvestido,
  calcularTotalReceitas,
  filtrarPorMesAno,
} from '@/lib/calculations'

export default function DashboardPage() {
  const { mes, ano, mesAnterior, proximoMes } = useFilters()

  // Filter data by month/year
  const lancamentosMes = filtrarPorMesAno(lancamentos, mes, ano)

  // Calculate metrics
  const receitaTotal = calcularTotalReceitas(lancamentosMes)
  const despesaTotal = calcularTotalDespesas(lancamentosMes)
  const saldoMes = receitaTotal - despesaTotal
  const gastosFixosTotal = calcularTotalGastosFixos(gastosFixos)
  const gastosVariaveisTotal = calcularGastosVariaveis(lancamentosMes)

  // Calculate credit card total for the month
  const faturaCartaoTotal = lancamentosMes
    .filter((l) => l.formaPagamento === 'credito' && l.tipo === 'despesa')
    .reduce((acc, l) => acc + l.valor, 0)

  // Investments total
  const investimentoTotal = calcularTotalInvestido(investimentos)

  // Apartment totals
  const apartamentoTotais = calcularTotaisApartamento(lancamentosApartamento)

  // Expenses by category
  const gastosPorCategoria = calcularPorCategoria(lancamentosMes, categorias)

  // Monthly evolution (last 6 months)
  const evolucaoMensal = calcularEvolucaoMensal(lancamentos, 6)

  // Recent transactions - sorted by date descending
  const lancamentosRecentes = [...lancamentosMes].sort(
    (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()
  )

  return (
    <>
      <Header
        mes={mes}
        ano={ano}
        onMesAnterior={mesAnterior}
        onProximoMes={proximoMes}
        titulo='Dashboard'
      />
      <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        {/* Summary Cards */}
        <SummaryCards
          receitaTotal={receitaTotal}
          despesaTotal={despesaTotal}
          saldoMes={saldoMes}
          gastosFixosTotal={gastosFixosTotal}
          gastosVariaveisTotal={gastosVariaveisTotal}
          faturaCartaoTotal={faturaCartaoTotal}
          investimentoTotal={investimentoTotal}
          apartamentoTotal={apartamentoTotais.pago}
        />

        {/* Charts Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          <GastosCategoriaChart
            data={gastosPorCategoria}
            total={despesaTotal}
          />
          <EvolucaoMensalChart data={evolucaoMensal} />
        </div>

        {/* Recent Transactions */}
        <LancamentosRecentes
          lancamentos={lancamentosRecentes}
          categorias={categorias}
        />
      </main>
    </>
  )
}
