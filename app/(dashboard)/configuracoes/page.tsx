'use client'

import { Bell, Database, Palette, User, Wallet } from 'lucide-react'
import { useForm } from 'react-hook-form'

import { Header } from '@/components/layout/header'
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

export default function ConfiguracoesPage() {

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

  const handleSubmit = (_values: ConfiguracoesFormValues) => undefined

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
