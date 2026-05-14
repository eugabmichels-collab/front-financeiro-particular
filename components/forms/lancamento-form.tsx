'use client'

import * as React from 'react'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { Lancamento, Categoria, Cartao, Conta, TipoLancamento, FormaPagamento, StatusLancamento } from '@/types'

interface LancamentoFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  lancamento?: Lancamento | null
  categorias: Categoria[]
  cartoes: Cartao[]
  contas: Conta[]
  onSave: (lancamento: Partial<Lancamento>) => void
}

export function LancamentoForm({
  open,
  onOpenChange,
  lancamento,
  categorias,
  cartoes,
  contas,
  onSave,
}: LancamentoFormProps) {
  const [tipo, setTipo] = React.useState<TipoLancamento>('despesa')
  const [data, setData] = React.useState<Date>(new Date())
  const [categoriaId, setCategoriaId] = React.useState('')
  const [subcategoriaId, setSubcategoriaId] = React.useState('')
  const [descricao, setDescricao] = React.useState('')
  const [valor, setValor] = React.useState('')
  const [formaPagamento, setFormaPagamento] = React.useState<FormaPagamento>('pix')
  const [contaId, setContaId] = React.useState('')
  const [cartaoId, setCartaoId] = React.useState('')
  const [isFixo, setIsFixo] = React.useState(false)
  const [isApartamento, setIsApartamento] = React.useState(false)
  const [status, setStatus] = React.useState<StatusLancamento>('pago')
  const [observacao, setObservacao] = React.useState('')
  const [parcelado, setParcelado] = React.useState(false)
  const [totalParcelas, setTotalParcelas] = React.useState('1')

  // Filter categories by type
  const categoriasFiltradas = categorias.filter((c) => {
    if (tipo === 'receita') return c.tipo === 'receita'
    if (tipo === 'despesa') return c.tipo === 'despesa'
    return true
  })

  // Get subcategories for selected category
  const subcategorias = categoriasFiltradas.find((c) => c.id === categoriaId)?.subcategorias || []

  // Reset form when opening
  React.useEffect(() => {
    if (open) {
      if (lancamento) {
        setTipo(lancamento.tipo)
        setData(new Date(lancamento.data))
        setCategoriaId(lancamento.categoriaId)
        setSubcategoriaId(lancamento.subcategoriaId || '')
        setDescricao(lancamento.descricao)
        setValor(lancamento.valor.toString())
        setFormaPagamento(lancamento.formaPagamento)
        setContaId(lancamento.contaId || '')
        setCartaoId(lancamento.cartaoId || '')
        setIsFixo(lancamento.isFixo)
        setIsApartamento(lancamento.isApartamento)
        setStatus(lancamento.status)
        setObservacao(lancamento.observacao || '')
        setParcelado(lancamento.parcelado)
        setTotalParcelas(lancamento.totalParcelas?.toString() || '1')
      } else {
        setTipo('despesa')
        setData(new Date())
        setCategoriaId('')
        setSubcategoriaId('')
        setDescricao('')
        setValor('')
        setFormaPagamento('pix')
        setContaId('')
        setCartaoId('')
        setIsFixo(false)
        setIsApartamento(false)
        setStatus('pago')
        setObservacao('')
        setParcelado(false)
        setTotalParcelas('1')
      }
    }
  }, [open, lancamento])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      id: lancamento?.id || `lanc-${Date.now()}`,
      tipo,
      data,
      categoriaId,
      subcategoriaId: subcategoriaId || undefined,
      descricao,
      valor: parseFloat(valor.replace(',', '.')),
      formaPagamento,
      contaId: formaPagamento !== 'credito' ? contaId : undefined,
      cartaoId: formaPagamento === 'credito' ? cartaoId : undefined,
      isFixo,
      isApartamento,
      status,
      observacao: observacao || undefined,
      parcelado,
      parcelaAtual: parcelado ? 1 : undefined,
      totalParcelas: parcelado ? parseInt(totalParcelas) : undefined,
      createdAt: lancamento?.createdAt || new Date(),
      updatedAt: new Date(),
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {lancamento ? 'Editar Lançamento' : 'Novo Lançamento'}
          </DialogTitle>
          <DialogDescription>
            Preencha os dados do lançamento financeiro
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <Tabs value={tipo} onValueChange={(v) => setTipo(v as TipoLancamento)} className="mb-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="receita" className="data-[state=active]:bg-receita data-[state=active]:text-white">
                Receita
              </TabsTrigger>
              <TabsTrigger value="despesa" className="data-[state=active]:bg-despesa data-[state=active]:text-white">
                Despesa
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="data">Data</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !data && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 size-4" />
                      {data ? format(data, 'dd/MM/yyyy', { locale: ptBR }) : 'Selecione uma data'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={data}
                      onSelect={(d) => d && setData(d)}
                      locale={ptBR}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="valor">Valor</Label>
                <Input
                  id="valor"
                  placeholder="0,00"
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Input
                id="descricao"
                placeholder="Descrição do lançamento"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Categoria</Label>
                <Select value={categoriaId} onValueChange={(v) => { setCategoriaId(v); setSubcategoriaId('') }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoriasFiltradas.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Subcategoria</Label>
                <Select value={subcategoriaId} onValueChange={setSubcategoriaId} disabled={!categoriaId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Opcional" />
                  </SelectTrigger>
                  <SelectContent>
                    {subcategorias.map((sub) => (
                      <SelectItem key={sub.id} value={sub.id}>
                        {sub.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Forma de Pagamento</Label>
                <Select value={formaPagamento} onValueChange={(v) => setFormaPagamento(v as FormaPagamento)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pix">PIX</SelectItem>
                    <SelectItem value="debito">Débito</SelectItem>
                    <SelectItem value="credito">Crédito</SelectItem>
                    <SelectItem value="dinheiro">Dinheiro</SelectItem>
                    <SelectItem value="boleto">Boleto</SelectItem>
                    <SelectItem value="transferencia">Transferência</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {formaPagamento === 'credito' ? (
                <div className="space-y-2">
                  <Label>Cartão</Label>
                  <Select value={cartaoId} onValueChange={setCartaoId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {cartoes.filter((c) => c.ativo).map((cartao) => (
                        <SelectItem key={cartao.id} value={cartao.id}>
                          {cartao.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label>Conta</Label>
                  <Select value={contaId} onValueChange={setContaId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {contas.filter((c) => c.ativo).map((conta) => (
                        <SelectItem key={conta.id} value={conta.id}>
                          {conta.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={status} onValueChange={(v) => setStatus(v as StatusLancamento)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pago">Pago</SelectItem>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="previsto">Previsto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {tipo === 'despesa' && formaPagamento === 'credito' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="parcelado">Parcelado</Label>
                    <Switch
                      id="parcelado"
                      checked={parcelado}
                      onCheckedChange={setParcelado}
                    />
                  </div>
                  {parcelado && (
                    <Input
                      type="number"
                      min="2"
                      max="48"
                      placeholder="Parcelas"
                      value={totalParcelas}
                      onChange={(e) => setTotalParcelas(e.target.value)}
                    />
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <Switch
                  id="isFixo"
                  checked={isFixo}
                  onCheckedChange={setIsFixo}
                />
                <Label htmlFor="isFixo">Gasto Fixo</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="isApartamento"
                  checked={isApartamento}
                  onCheckedChange={setIsApartamento}
                />
                <Label htmlFor="isApartamento">Apartamento</Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="observacao">Observação</Label>
              <Textarea
                id="observacao"
                placeholder="Observações adicionais (opcional)"
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
                rows={2}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {lancamento ? 'Salvar' : 'Criar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
