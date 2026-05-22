'use client'

import * as React from 'react'
import { Bell, Database, FolderKanban, Palette, Pencil, Trash2, User, Wallet } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Header } from '@/components/layout/header'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { useFinancialAreas } from '@/hooks/use-financial-areas'
import { financialAreaIconOptions, getFinancialAreaIcon } from '@/lib/financial-areas'
import type { IconeAreaFinanceira } from '@/types'

interface ConfiguracoesFormValues {
  nome: string
  email: string
  moeda: string
  formatoData: string
  primeiroDiaMes: string
  metaMensal: string
  alertaCartao: string
  notificacoes: boolean
  temaEscuro: boolean
}

interface FinanceAreaEditorState {
  id?: string
  nome: string
  descricao: string
  cor: string
  icone: IconeAreaFinanceira
  categorias: string
}

const INITIAL_FINANCE_AREA_FORM: FinanceAreaEditorState = {
  nome: '',
  descricao: '',
  cor: '#0f766e',
  icone: 'building2',
  categorias: '',
}

export default function ConfiguracoesPage() {
  const { areasFinanceiras, createArea, updateArea, removeArea } = useFinancialAreas()
  const [financeAreaForm, setFinanceAreaForm] = React.useState<FinanceAreaEditorState>(INITIAL_FINANCE_AREA_FORM)

  const form = useForm<ConfiguracoesFormValues>({
    defaultValues: {
      nome: 'Usuário',
      email: 'usuario@email.com',
      moeda: 'BRL',
      formatoData: 'dd/MM/yyyy',
      primeiroDiaMes: '1',
      metaMensal: '',
      alertaCartao: '80',
      notificacoes: true,
      temaEscuro: false,
    },
  })

  const handleSubmit = (_values: ConfiguracoesFormValues) => {
    toast.success('Configurações salvas')
  }

  const isEditingFinanceArea = Boolean(financeAreaForm.id)

  const resetFinanceAreaForm = () => {
    setFinanceAreaForm(INITIAL_FINANCE_AREA_FORM)
  }

  const handleFinanceAreaChange = <K extends keyof FinanceAreaEditorState>(field: K, value: FinanceAreaEditorState[K]) => {
    setFinanceAreaForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const handleFinanceAreaSubmit = () => {
    if (!financeAreaForm.nome.trim()) {
      toast.error('Informe um nome para a área financeira')
      return
    }

    const payload = {
      nome: financeAreaForm.nome,
      descricao: financeAreaForm.descricao,
      cor: financeAreaForm.cor,
      icone: financeAreaForm.icone,
      categorias: financeAreaForm.categorias
        .split(',')
        .map((categoria) => categoria.trim())
        .filter(Boolean),
    }

    if (financeAreaForm.id) {
      updateArea(financeAreaForm.id, payload)
      toast.success('Área financeira atualizada')
    } else {
      createArea(payload)
      toast.success('Área financeira criada')
    }

    resetFinanceAreaForm()
  }

  const handleFinanceAreaEdit = (areaId: string) => {
    const area = areasFinanceiras.find((item) => item.id === areaId)

    if (!area) {
      return
    }

    setFinanceAreaForm({
      id: area.id,
      nome: area.nome,
      descricao: area.descricao || '',
      cor: area.cor,
      icone: area.icone,
      categorias: area.categorias.map((categoria) => categoria.nome).join(', '),
    })
  }

  const handleFinanceAreaDelete = (areaId: string) => {
    const removed = removeArea(areaId)

    if (!removed) {
      toast.error('Essa área é padrão do sistema e não pode ser excluída')
      return
    }

    if (financeAreaForm.id === areaId) {
      resetFinanceAreaForm()
    }

    toast.success('Área financeira removida')
  }

  return (
    <>
      <Header
        hasDate={false}
        titulo="Configurações"
      />
      <Form {...form}>
        <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
          <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-6">
            {/* Profile */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="size-5" />
                  Perfil
                </CardTitle>
                <CardDescription>Informações da sua conta</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="nome"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome</FormLabel>
                        <FormControl>
                          <Input id="nome" placeholder="Seu nome" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>E-mail</FormLabel>
                        <FormControl>
                          <Input id="email" type="email" placeholder="seu@email.com" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Financial Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="size-5" />
                  Preferências Financeiras
                </CardTitle>
                <CardDescription>Configure como os valores são exibidos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="moeda"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Moeda</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="BRL">Real (R$)</SelectItem>
                            <SelectItem value="USD">Dólar (US$)</SelectItem>
                            <SelectItem value="EUR">Euro (EUR)</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="formatoData"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Formato de Data</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="dd/MM/yyyy">DD/MM/AAAA</SelectItem>
                            <SelectItem value="MM/dd/yyyy">MM/DD/AAAA</SelectItem>
                            <SelectItem value="yyyy-MM-dd">AAAA-MM-DD</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>

                <Separator />

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="primeiroDiaMes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Primeiro dia do mês financeiro</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Array.from({ length: 28 }, (_, i) => i + 1).map((dia) => (
                              <SelectItem key={dia} value={dia.toString()}>
                                Dia {dia}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                          Define quando seu mês financeiro começa
                        </p>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="metaMensal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meta mensal de economia</FormLabel>
                        <FormControl>
                          <Input id="meta" type="number" placeholder="1000" {...field} />
                        </FormControl>
                        <p className="text-xs text-muted-foreground">
                          Quanto você quer economizar por mês
                        </p>
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FolderKanban className="size-5" />
                  Áreas Financeiras
                </CardTitle>
                <CardDescription>
                  Crie abas extras no menu para organizar objetivos como apartamento, carro ou viagem.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
                  <div className="space-y-4 rounded-lg border p-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2 sm:col-span-2">
                        <FormLabel>Nome da área</FormLabel>
                        <Input
                          placeholder="Ex.: Carro, Viagem, Reforma"
                          value={financeAreaForm.nome}
                          onChange={(event) => handleFinanceAreaChange('nome', event.target.value)}
                        />
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <FormLabel>Descrição</FormLabel>
                        <Input
                          placeholder="Resumo rápido do objetivo dessa área"
                          value={financeAreaForm.descricao}
                          onChange={(event) => handleFinanceAreaChange('descricao', event.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <FormLabel>Ícone</FormLabel>
                        <Select
                          value={financeAreaForm.icone}
                          onValueChange={(value) => handleFinanceAreaChange('icone', value as IconeAreaFinanceira)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {financialAreaIconOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <FormLabel>Cor</FormLabel>
                        <Input
                          type="color"
                          value={financeAreaForm.cor}
                          onChange={(event) => handleFinanceAreaChange('cor', event.target.value)}
                        />
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <FormLabel>Categorias iniciais</FormLabel>
                        <Input
                          placeholder="Ex.: entrada, parcelas, seguro"
                          value={financeAreaForm.categorias}
                          onChange={(event) => handleFinanceAreaChange('categorias', event.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                          Opcional. Use vírgulas para separar categorias básicas dessa área.
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <Button type="button" onClick={handleFinanceAreaSubmit}>
                        {isEditingFinanceArea ? 'Salvar Área' : 'Criar Área'}
                      </Button>
                      {isEditingFinanceArea && (
                        <Button type="button" variant="outline" onClick={resetFinanceAreaForm}>
                          Cancelar edição
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {areasFinanceiras.map((area) => {
                      const Icon = getFinancialAreaIcon(area.icone)

                      return (
                        <div key={area.id} className="rounded-lg border p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Icon className="size-4" style={{ color: area.cor }} />
                                <p className="font-medium">{area.nome}</p>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {area.descricao || 'Sem descrição informada'}
                              </p>
                              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                                <span>Rota: /financas/{area.slug}</span>
                                <span>{area.categorias.length} categorias</span>
                                <span>{area.lancamentos.length} lançamentos</span>
                                {area.fixa && <span>Padrão do sistema</span>}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button type="button" variant="outline" size="sm" onClick={() => handleFinanceAreaEdit(area.id)}>
                                <Pencil className="mr-2 size-4" />
                                Editar
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button type="button" variant="outline" size="sm" disabled={area.fixa}>
                                    <Trash2 className="mr-2 size-4" />
                                    Excluir
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Excluir área financeira?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Essa ação remove a aba do menu e a organização associada a essa área.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleFinanceAreaDelete(area.id)}>
                                      Excluir área
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="size-5" />
                  Notificações e Alertas
                </CardTitle>
                <CardDescription>Configure quando receber alertas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="notificacoes"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <FormLabel>Notificações</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Receber lembretes de contas a pagar
                        </p>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <Separator />

                <FormField
                  control={form.control}
                  name="alertaCartao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alerta de limite do cartão</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger className="w-[200px]">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="50">50% do limite</SelectItem>
                          <SelectItem value="70">70% do limite</SelectItem>
                          <SelectItem value="80">80% do limite</SelectItem>
                          <SelectItem value="90">90% do limite</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        Alertar quando o cartão atingir este percentual
                      </p>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Appearance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="size-5" />
                  Aparência
                </CardTitle>
                <CardDescription>Personalize a interface</CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="temaEscuro"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <FormLabel>Tema escuro</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Usar cores escuras na interface
                        </p>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Data */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="size-5" />
                  Dados
                </CardTitle>
                <CardDescription>Gerencie seus dados</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="font-medium">Exportar dados</p>
                    <p className="text-sm text-muted-foreground">
                      Baixe uma cópia de todos os seus dados
                    </p>
                  </div>
                  <Button type="button" variant="outline">Exportar</Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="font-medium text-destructive">Excluir conta</p>
                    <p className="text-sm text-muted-foreground">
                      Remove permanentemente sua conta e dados
                    </p>
                  </div>
                  <Button type="button" variant="destructive">Excluir</Button>
                </div>
              </CardContent>
            </Card>

            {/* Save */}
            <div className="flex justify-end">
              <Button size="lg" type="submit">
                Salvar Alterações
              </Button>
            </div>
          </form>
        </main>
      </Form>
    </>
  )
}
