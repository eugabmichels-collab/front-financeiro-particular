'use client'

import * as React from 'react'
import { Plus, CalendarClock, MoreHorizontal, Pencil, Trash2, Power, PowerOff } from 'lucide-react'
import { toast } from 'sonner'

import { Header } from '@/components/layout/header'
import { useFilters } from '@/hooks/use-filters'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { SummaryCard } from '@/components/cards/summary-card'
import { formatCurrency, getFormaPagamentoLabel } from '@/lib/format'

import { gastosFixos as mockGastosFixos, categorias, cartoes, contas } from '@/data/mock-data'
import { calcularTotalGastosFixos } from '@/lib/calculations'
import type { GastoFixo } from '@/types'

export default function GastosFixosPage() {
  const { mes, ano, mesAnterior, proximoMes } = useFilters()
  const [gastosFixos, setGastosFixos] = React.useState(mockGastosFixos)

  // Calculate totals
  const totalAtivos = calcularTotalGastosFixos(gastosFixos)
  const totalCartao = gastosFixos
    .filter((gf) => gf.ativo && gf.formaPagamento === 'credito')
    .reduce((acc, gf) => acc + gf.valor, 0)
  const totalDebito = gastosFixos
    .filter((gf) => gf.ativo && gf.formaPagamento !== 'credito')
    .reduce((acc, gf) => acc + gf.valor, 0)

  const getCategoryName = (categoriaId: string) => {
    const categoria = categorias.find((c) => c.id === categoriaId)
    return categoria?.nome || 'Sem categoria'
  }

  const getCartaoName = (cartaoId?: string) => {
    if (!cartaoId) return '-'
    const cartao = cartoes.find((c) => c.id === cartaoId)
    return cartao?.nome || '-'
  }

  const getContaName = (contaId?: string) => {
    if (!contaId) return '-'
    const conta = contas.find((c) => c.id === contaId)
    return conta?.nome || '-'
  }

  const toggleAtivo = (gastoFixo: GastoFixo) => {
    setGastosFixos((prev) =>
      prev.map((gf) =>
        gf.id === gastoFixo.id ? { ...gf, ativo: !gf.ativo } : gf
      )
    )
    toast.success(
      gastoFixo.ativo 
        ? `${gastoFixo.nome} desativado` 
        : `${gastoFixo.nome} ativado`
    )
  }

  const handleDelete = (gastoFixo: GastoFixo) => {
    setGastosFixos((prev) => prev.filter((gf) => gf.id !== gastoFixo.id))
    toast.success('Gasto fixo excluído')
  }

  // Group by payment method
  const gastosNoCartao = gastosFixos.filter((gf) => gf.formaPagamento === 'credito')
  const gastosDebito = gastosFixos.filter((gf) => gf.formaPagamento !== 'credito')

  return (
    <>
      <Header
        mes={mes}
        ano={ano}
        onMesAnterior={mesAnterior}
        onProximoMes={proximoMes}
        titulo="Gastos Fixos"
      />
      <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        {/* Summary */}
        <div className="grid gap-4 sm:grid-cols-3">
          <SummaryCard
            title="Total Mensal"
            value={totalAtivos}
            icon={CalendarClock}
            variant="default"
            subtitle="gastos recorrentes"
          />
          <SummaryCard
            title="No Cartão"
            value={totalCartao}
            icon={CalendarClock}
            variant="cartao"
            subtitle="débito automático"
          />
          <SummaryCard
            title="Débito/Boleto"
            value={totalDebito}
            icon={CalendarClock}
            variant="default"
            subtitle="outras formas"
          />
        </div>

        {/* Gastos no Cartão */}
        <Card>
          <CardHeader>
            <CardTitle>Gastos Fixos no Cartão de Crédito</CardTitle>
            <CardDescription>
              Débitos automáticos em cartões de crédito
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Cartão</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead className="text-center">Ativo</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {gastosNoCartao.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                      Nenhum gasto fixo no cartão
                    </TableCell>
                  </TableRow>
                ) : (
                  gastosNoCartao.map((gf) => (
                    <TableRow key={gf.id} className={!gf.ativo ? 'opacity-50' : ''}>
                      <TableCell className="font-medium">{gf.nome}</TableCell>
                      <TableCell>{getCategoryName(gf.categoriaId)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{getCartaoName(gf.cartaoId)}</Badge>
                      </TableCell>
                      <TableCell>Dia {gf.diaVencimento}</TableCell>
                      <TableCell className="text-right font-semibold">
                        {formatCurrency(gf.valor)}
                      </TableCell>
                      <TableCell className="text-center">
                        <Switch
                          checked={gf.ativo}
                          onCheckedChange={() => toggleAtivo(gf)}
                        />
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="size-8">
                              <MoreHorizontal className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Pencil className="mr-2 size-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDelete(gf)}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 size-4" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Gastos em Débito/Boleto */}
        <Card>
          <CardHeader>
            <CardTitle>Gastos Fixos em Débito/Boleto</CardTitle>
            <CardDescription>
              Pagamentos recorrentes via débito, boleto ou PIX
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Forma</TableHead>
                  <TableHead>Conta</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead className="text-center">Ativo</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {gastosDebito.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground">
                      Nenhum gasto fixo em débito/boleto
                    </TableCell>
                  </TableRow>
                ) : (
                  gastosDebito.map((gf) => (
                    <TableRow key={gf.id} className={!gf.ativo ? 'opacity-50' : ''}>
                      <TableCell className="font-medium">{gf.nome}</TableCell>
                      <TableCell>{getCategoryName(gf.categoriaId)}</TableCell>
                      <TableCell>{getFormaPagamentoLabel(gf.formaPagamento)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{getContaName(gf.contaId)}</Badge>
                      </TableCell>
                      <TableCell>Dia {gf.diaVencimento}</TableCell>
                      <TableCell className="text-right font-semibold">
                        {formatCurrency(gf.valor)}
                      </TableCell>
                      <TableCell className="text-center">
                        <Switch
                          checked={gf.ativo}
                          onCheckedChange={() => toggleAtivo(gf)}
                        />
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="size-8">
                              <MoreHorizontal className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Pencil className="mr-2 size-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDelete(gf)}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 size-4" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </>
  )
}
