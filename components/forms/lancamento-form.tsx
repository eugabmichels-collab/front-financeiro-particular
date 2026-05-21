'use client'

import * as React from 'react'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useForm } from 'react-hook-form'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
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

interface LancamentoFormValues {
  tipo: TipoLancamento
  data: Date
  categoriaId: string
  subcategoriaId: string
  descricao: string
  valor: string
  formaPagamento: FormaPagamento
  contaId: string
  cartaoId: string
  isFixo: boolean
  isApartamento: boolean
  status: StatusLancamento
  observacao: string
  parcelado: boolean
  totalParcelas: string
}

function getDefaultValues(lancamento?: Lancamento | null): LancamentoFormValues {
  if (lancamento) {
    return {
      tipo: lancamento.tipo,
      data: new Date(lancamento.data),
      categoriaId: lancamento.categoriaId,
      subcategoriaId: lancamento.subcategoriaId || '',
      descricao: lancamento.descricao,
      valor: lancamento.valor.toString(),
      formaPagamento: lancamento.formaPagamento,
      contaId: lancamento.contaId || '',
      cartaoId: lancamento.cartaoId || '',
      isFixo: lancamento.isFixo,
      isApartamento: lancamento.isApartamento,
      status: lancamento.status,
      observacao: lancamento.observacao || '',
      parcelado: lancamento.parcelado,
      totalParcelas: lancamento.totalParcelas?.toString() || '1',
    }
  }

  return {
    tipo: 'despesa',
    data: new Date(),
    categoriaId: '',
    subcategoriaId: '',
    descricao: '',
    valor: '',
    formaPagamento: 'pix',
    contaId: '',
    cartaoId: '',
    isFixo: false,
    isApartamento: false,
    status: 'pago',
    observacao: '',
    parcelado: false,
    totalParcelas: '1',
  }
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
  const form = useForm<LancamentoFormValues>({
    defaultValues: getDefaultValues(lancamento),
  })

  const tipo = form.watch('tipo')
  const data = form.watch('data')
  const categoriaId = form.watch('categoriaId')
  const formaPagamento = form.watch('formaPagamento')
  const parcelado = form.watch('parcelado')

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
      form.reset(getDefaultValues(lancamento))
    }
  }, [form, lancamento, open])

  const handleSubmit = (values: LancamentoFormValues) => {
    onSave({
      id: lancamento?.id || `lanc-${Date.now()}`,
      tipo: values.tipo,
      data: values.data,
      categoriaId: values.categoriaId,
      subcategoriaId: values.subcategoriaId || undefined,
      descricao: values.descricao,
      valor: parseFloat(values.valor.replace(',', '.')),
      formaPagamento: values.formaPagamento,
      contaId: values.formaPagamento !== 'credito' ? values.contaId : undefined,
      cartaoId: values.formaPagamento === 'credito' ? values.cartaoId : undefined,
      isFixo: values.isFixo,
      isApartamento: values.isApartamento,
      status: values.status,
      observacao: values.observacao || undefined,
      parcelado: values.parcelado,
      parcelaAtual: values.parcelado ? 1 : undefined,
      totalParcelas: values.parcelado ? parseInt(values.totalParcelas, 10) : undefined,
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <Tabs
              value={tipo}
              onValueChange={(value) => form.setValue('tipo', value as TipoLancamento)}
              className="mb-4"
            >
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
                <FormField
                  control={form.control}
                  name="data"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                'w-full justify-start text-left font-normal',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              <CalendarIcon className="mr-2 size-4" />
                              {field.value
                                ? format(field.value, 'dd/MM/yyyy', { locale: ptBR })
                                : 'Selecione uma data'}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(selectedDate) => selectedDate && field.onChange(selectedDate)}
                            locale={ptBR}
                          />
                        </PopoverContent>
                      </Popover>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="valor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor</FormLabel>
                      <FormControl>
                        <Input id="valor" placeholder="0,00" required {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="descricao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Input
                        id="descricao"
                        placeholder="Descrição do lançamento"
                        required
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="categoriaId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoria</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value)
                          form.setValue('subcategoriaId', '')
                        }}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categoriasFiltradas.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.nome}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subcategoriaId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subcategoria</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={!categoriaId}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Opcional" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {subcategorias.map((sub) => (
                            <SelectItem key={sub.id} value={sub.id}>
                              {sub.nome}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="formaPagamento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Forma de Pagamento</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={(value) => field.onChange(value as FormaPagamento)}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="pix">PIX</SelectItem>
                          <SelectItem value="debito">Débito</SelectItem>
                          <SelectItem value="credito">Crédito</SelectItem>
                          <SelectItem value="dinheiro">Dinheiro</SelectItem>
                          <SelectItem value="boleto">Boleto</SelectItem>
                          <SelectItem value="transferencia">Transferência</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                {formaPagamento === 'credito' ? (
                  <FormField
                    control={form.control}
                    name="cartaoId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cartão</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {cartoes.filter((c) => c.ativo).map((cartao) => (
                              <SelectItem key={cartao.id} value={cartao.id}>
                                {cartao.nome}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                ) : (
                  <FormField
                    control={form.control}
                    name="contaId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Conta</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {contas.filter((c) => c.ativo).map((conta) => (
                              <SelectItem key={conta.id} value={conta.id}>
                                {conta.nome}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={(value) => field.onChange(value as StatusLancamento)}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="pago">Pago</SelectItem>
                          <SelectItem value="pendente">Pendente</SelectItem>
                          <SelectItem value="previsto">Previsto</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                {tipo === 'despesa' && formaPagamento === 'credito' && (
                  <FormField
                    control={form.control}
                    name="parcelado"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="parcelado">Parcelado</Label>
                          <Switch id="parcelado" checked={field.value} onCheckedChange={field.onChange} />
                        </div>
                        {field.value && (
                          <FormField
                            control={form.control}
                            name="totalParcelas"
                            render={({ field: totalField }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    type="number"
                                    min="2"
                                    max="48"
                                    placeholder="Parcelas"
                                    {...totalField}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        )}
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <div className="flex flex-wrap gap-6">
                <FormField
                  control={form.control}
                  name="isFixo"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormControl>
                        <Switch id="isFixo" checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <Label htmlFor="isFixo">Gasto Fixo</Label>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isApartamento"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormControl>
                        <Switch
                          id="isApartamento"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <Label htmlFor="isApartamento">Apartamento</Label>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="observacao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observação</FormLabel>
                    <FormControl>
                      <Textarea
                        id="observacao"
                        placeholder="Observações adicionais (opcional)"
                        rows={2}
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
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
        </Form>
      </DialogContent>
    </Dialog>
  )
}
