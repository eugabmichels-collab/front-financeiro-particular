'use client'

import * as React from 'react'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { getMonthName } from '@/lib/format'

interface HeaderProps {
  mes: number
  ano: number
  onMesAnterior: () => void
  onProximoMes: () => void
  onNovoLancamento?: () => void
  titulo?: string
}

export function Header({
  mes,
  ano,
  onMesAnterior,
  onProximoMes,
  onNovoLancamento,
  titulo,
}: HeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-card px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      
      {titulo && (
        <>
          <h1 className="text-lg font-semibold">{titulo}</h1>
          <Separator orientation="vertical" className="mx-2 h-4" />
        </>
      )}
      
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMesAnterior}
          className="size-8"
        >
          <ChevronLeft className="size-4" />
          <span className="sr-only">Mês anterior</span>
        </Button>
        <div className="min-w-[140px] text-center">
          <span className="font-medium">
            {getMonthName(mes)} {ano}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onProximoMes}
          className="size-8"
        >
          <ChevronRight className="size-4" />
          <span className="sr-only">Próximo mês</span>
        </Button>
      </div>
      
      <div className="ml-auto flex items-center gap-2">
        {onNovoLancamento && (
          <Button onClick={onNovoLancamento} size="sm">
            <Plus className="size-4" />
            <span className="hidden sm:inline">Novo Lançamento</span>
          </Button>
        )}
      </div>
    </header>
  )
}
