'use client'

import * as React from 'react'
import { Settings, User, Palette, Bell, Database, Wallet } from 'lucide-react'

import { Header } from '@/components/layout/header'
import { useFilters } from '@/hooks/use-filters'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function ConfiguracoesPage() {
  const { mes, ano, mesAnterior, proximoMes } = useFilters()
  
  const [moeda, setMoeda] = React.useState('BRL')
  const [formatoData, setFormatoData] = React.useState('dd/MM/yyyy')
  const [primeiroDiaMes, setPrimeiroDiaMes] = React.useState('1')
  const [metaMensal, setMetaMensal] = React.useState('')
  const [alertaCartao, setAlertaCartao] = React.useState('80')
  const [notificacoes, setNotificacoes] = React.useState(true)
  const [temaEscuro, setTemaEscuro] = React.useState(false)

  return (
    <>
      <Header
        mes={mes}
        ano={ano}
        onMesAnterior={mesAnterior}
        onProximoMes={proximoMes}
        titulo="Configurações"
      />
      <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
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
              <div className="space-y-2">
                <Label htmlFor="nome">Nome</Label>
                <Input id="nome" placeholder="Seu nome" defaultValue="Usuário" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type="email" placeholder="seu@email.com" defaultValue="usuario@email.com" />
              </div>
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
              <div className="space-y-2">
                <Label>Moeda</Label>
                <Select value={moeda} onValueChange={setMoeda}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BRL">Real (R$)</SelectItem>
                    <SelectItem value="USD">Dólar (US$)</SelectItem>
                    <SelectItem value="EUR">Euro (EUR)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Formato de Data</Label>
                <Select value={formatoData} onValueChange={setFormatoData}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dd/MM/yyyy">DD/MM/AAAA</SelectItem>
                    <SelectItem value="MM/dd/yyyy">MM/DD/AAAA</SelectItem>
                    <SelectItem value="yyyy-MM-dd">AAAA-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Separator />
            
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Primeiro dia do mês financeiro</Label>
                <Select value={primeiroDiaMes} onValueChange={setPrimeiroDiaMes}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
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
              </div>
              <div className="space-y-2">
                <Label htmlFor="meta">Meta mensal de economia</Label>
                <Input
                  id="meta"
                  type="number"
                  placeholder="1000"
                  value={metaMensal}
                  onChange={(e) => setMetaMensal(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Quanto você quer economizar por mês
                </p>
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
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notificações</Label>
                <p className="text-sm text-muted-foreground">
                  Receber lembretes de contas a pagar
                </p>
              </div>
              <Switch checked={notificacoes} onCheckedChange={setNotificacoes} />
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <Label>Alerta de limite do cartão</Label>
              <Select value={alertaCartao} onValueChange={setAlertaCartao}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
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
            </div>
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
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Tema escuro</Label>
                <p className="text-sm text-muted-foreground">
                  Usar cores escuras na interface
                </p>
              </div>
              <Switch checked={temaEscuro} onCheckedChange={setTemaEscuro} />
            </div>
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
              <Button variant="outline">Exportar</Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="font-medium text-destructive">Excluir conta</p>
                <p className="text-sm text-muted-foreground">
                  Remove permanentemente sua conta e dados
                </p>
              </div>
              <Button variant="destructive">Excluir</Button>
            </div>
          </CardContent>
        </Card>

        {/* Save */}
        <div className="flex justify-end">
          <Button size="lg">
            Salvar Alterações
          </Button>
        </div>
      </main>
    </>
  )
}
