'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatDate, getStatusLabel, getStatusVariant, getTipoLabel } from '@/lib/format'
import type { Lancamento, Categoria } from '@/types'

interface LancamentosRecentesProps {
  lancamentos: Lancamento[]
  categorias: Categoria[]
}

export function LancamentosRecentes({ lancamentos, categorias }: LancamentosRecentesProps) {
  const getCategoriaNome = (categoriaId: string) => {
    const categoria = categorias.find((c) => c.id === categoriaId)
    return categoria?.nome || 'Sem categoria'
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Lançamentos Recentes</CardTitle>
          <CardDescription>Últimas movimentações do mês</CardDescription>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/lancamentos" className="flex items-center gap-1">
            Ver todos
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {lancamentos.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">
              Nenhum lançamento este mês
            </p>
          ) : (
            lancamentos.slice(0, 8).map((lancamento) => (
              <div
                key={lancamento.id}
                className="flex items-center justify-between gap-4 rounded-lg border p-3 transition-colors hover:bg-muted/50"
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{lancamento.descricao}</span>
                    {lancamento.isFixo && (
                      <Badge variant="outline" className="text-xs">
                        Fixo
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{formatDate(lancamento.data)}</span>
                    <span>•</span>
                    <span>{getCategoriaNome(lancamento.categoriaId)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={getStatusVariant(lancamento.status)}>
                    {getStatusLabel(lancamento.status)}
                  </Badge>
                  <span
                    className={`text-right font-semibold ${
                      lancamento.tipo === 'receita' ? 'text-receita' : 'text-despesa'
                    }`}
                  >
                    {lancamento.tipo === 'receita' ? '+' : '-'}
                    {formatCurrency(lancamento.valor)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
