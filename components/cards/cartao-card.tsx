'use client'

import { cn } from '@/lib/utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { formatCurrency } from '@/lib/format'
import type { Cartao, GastoFixo, Lancamento } from '@/types'

interface CartaoCardProps {
  cartao: Cartao
  gastosFixos: GastoFixo[]
  lancamentos: Lancamento[]
  onClick?: () => void
}

export function CartaoCard({ cartao, gastosFixos, lancamentos, onClick }: CartaoCardProps) {
  // Calculate current invoice total
  const faturaAtual = lancamentos
    .filter((l) => l.cartaoId === cartao.id && l.formaPagamento === 'credito' && l.tipo === 'despesa')
    .reduce((acc, l) => acc + l.valor, 0)
  
  // Calculate fixed expenses on this card
  const fixosNoCartao = gastosFixos.filter((gf) => gf.cartaoId === cartao.id && gf.ativo)
  const totalFixos = fixosNoCartao.reduce((acc, gf) => acc + gf.valor, 0)
  
  // Calculate usage percentage
  const usagePercent = (faturaAtual / cartao.limite) * 100
  const disponivel = cartao.limite - faturaAtual

  return (
    <Card 
      className={cn(
        'cursor-pointer transition-all hover:shadow-md',
        !cartao.ativo && 'opacity-60'
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="size-10 rounded-lg"
              style={{ backgroundColor: cartao.cor }}
            />
            <div>
              <CardTitle className="text-base">{cartao.nome}</CardTitle>
              <CardDescription>{cartao.banco}</CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="text-xs uppercase">
            {cartao.bandeira}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Fatura atual</span>
            <span className="font-semibold text-despesa">{formatCurrency(faturaAtual)}</span>
          </div>
          <Progress 
            value={Math.min(usagePercent, 100)} 
            className="h-2"
          />
          <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>Disponível: {formatCurrency(disponivel)}</span>
            <span>Limite: {formatCurrency(cartao.limite)}</span>
          </div>
        </div>
        
        <div className="border-t pt-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Gastos fixos no cartão</span>
            <span className="font-medium">{formatCurrency(totalFixos)}</span>
          </div>
          {fixosNoCartao.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {fixosNoCartao.slice(0, 3).map((gf) => (
                <Badge key={gf.id} variant="secondary" className="text-xs">
                  {gf.nome}
                </Badge>
              ))}
              {fixosNoCartao.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{fixosNoCartao.length - 3}
                </Badge>
              )}
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between border-t pt-3 text-xs text-muted-foreground">
          <span>Fecha dia {cartao.diaFechamento}</span>
          <span>Vence dia {cartao.diaVencimento}</span>
        </div>
      </CardContent>
    </Card>
  )
}
