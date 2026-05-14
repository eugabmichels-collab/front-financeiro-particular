'use client'

import * as React from 'react'
import { Plus, CreditCard } from 'lucide-react'

import { Header } from '@/components/layout/header'
import { useFilters } from '@/hooks/use-filters'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CartaoCard } from '@/components/cards/cartao-card'
import { SummaryCard } from '@/components/cards/summary-card'
import { LancamentosTable } from '@/components/tables/lancamentos-table'

import { cartoes, gastosFixos, lancamentos as mockLancamentos, categorias } from '@/data/mock-data'
import { filtrarPorMesAno } from '@/lib/calculations'
import { formatCurrency } from '@/lib/format'
import type { Cartao } from '@/types'

export default function CartoesPage() {
  const { mes, ano, mesAnterior, proximoMes } = useFilters()
  const [selectedCartao, setSelectedCartao] = React.useState<Cartao | null>(null)

  // Filter transactions by month/year
  const lancamentosMes = filtrarPorMesAno(mockLancamentos, mes, ano)
  
  // Calculate total invoice for all cards
  const faturaTotal = lancamentosMes
    .filter((l) => l.formaPagamento === 'credito' && l.tipo === 'despesa')
    .reduce((acc, l) => acc + l.valor, 0)
  
  // Calculate total limit
  const limiteTotal = cartoes.filter((c) => c.ativo).reduce((acc, c) => acc + c.limite, 0)
  const disponivelTotal = limiteTotal - faturaTotal

  // Selected card transactions
  const lancamentosCartao = selectedCartao
    ? lancamentosMes.filter((l) => l.cartaoId === selectedCartao.id)
    : []

  return (
    <>
      <Header
        mes={mes}
        ano={ano}
        onMesAnterior={mesAnterior}
        onProximoMes={proximoMes}
        titulo="Cartões de Crédito"
      />
      <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        {/* Summary */}
        <div className="grid gap-4 sm:grid-cols-3">
          <SummaryCard
            title="Fatura Total"
            value={faturaTotal}
            icon={CreditCard}
            variant="cartao"
            subtitle="todos os cartões"
          />
          <SummaryCard
            title="Limite Disponível"
            value={disponivelTotal}
            icon={CreditCard}
            variant="default"
            subtitle="para uso"
          />
          <SummaryCard
            title="Limite Total"
            value={limiteTotal}
            icon={CreditCard}
            variant="default"
            subtitle="soma dos limites"
          />
        </div>

        {/* Cards Grid */}
        <div>
          <h2 className="mb-4 text-lg font-semibold">Meus Cartões</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cartoes.map((cartao) => (
              <CartaoCard
                key={cartao.id}
                cartao={cartao}
                gastosFixos={gastosFixos}
                lancamentos={lancamentosMes}
                onClick={() => setSelectedCartao(cartao)}
              />
            ))}
          </div>
        </div>

        {/* Selected Card Details */}
        {selectedCartao && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="size-8 rounded-lg"
                    style={{ backgroundColor: selectedCartao.cor }}
                  />
                  <div>
                    <CardTitle>Fatura {selectedCartao.nome}</CardTitle>
                    <CardDescription>
                      Lançamentos do cartão no mês
                    </CardDescription>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedCartao(null)}
                >
                  Fechar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {lancamentosCartao.length > 0 ? (
                <LancamentosTable
                  data={lancamentosCartao}
                  categorias={categorias}
                  cartoes={cartoes}
                />
              ) : (
                <p className="py-8 text-center text-muted-foreground">
                  Nenhum lançamento neste cartão este mês
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </>
  )
}
