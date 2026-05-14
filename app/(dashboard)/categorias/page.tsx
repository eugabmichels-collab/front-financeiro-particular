'use client'

import * as React from 'react'
import { Plus, Tags, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

import { Header } from '@/components/layout/header'
import { useFilters } from '@/hooks/use-filters'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Separator } from '@/components/ui/separator'

import { categorias as mockCategorias } from '@/data/mock-data'
import type { Categoria } from '@/types'

export default function CategoriasPage() {
  const { mes, ano, mesAnterior, proximoMes } = useFilters()
  const [categorias, setCategorias] = React.useState(mockCategorias)

  // Group categories by type
  const categoriasPorTipo = {
    receita: categorias.filter((c) => c.tipo === 'receita'),
    despesa: categorias.filter((c) => c.tipo === 'despesa'),
    investimento: categorias.filter((c) => c.tipo === 'investimento'),
    apartamento: categorias.filter((c) => c.tipo === 'apartamento'),
  }

  const tipoLabels = {
    receita: { label: 'Receitas', color: 'bg-receita' },
    despesa: { label: 'Despesas', color: 'bg-despesa' },
    investimento: { label: 'Investimentos', color: 'bg-investimento' },
    apartamento: { label: 'Apartamento', color: 'bg-apartamento' },
  }

  const handleDelete = (categoria: Categoria) => {
    setCategorias((prev) => prev.filter((c) => c.id !== categoria.id))
    toast.success(`Categoria "${categoria.nome}" excluída`)
  }

  return (
    <>
      <Header
        mes={mes}
        ano={ano}
        onMesAnterior={mesAnterior}
        onProximoMes={proximoMes}
        titulo="Categorias"
      />
      <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Tags className="size-5" />
                  Gerenciar Categorias
                </CardTitle>
                <CardDescription>
                  Organize suas receitas e despesas em categorias e subcategorias
                </CardDescription>
              </div>
              <Button>
                <Plus className="mr-2 size-4" />
                Nova Categoria
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" className="w-full">
              {(Object.keys(categoriasPorTipo) as Array<keyof typeof categoriasPorTipo>).map((tipo) => (
                <AccordionItem key={tipo} value={tipo}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <div className={`size-3 rounded-full ${tipoLabels[tipo].color}`} />
                      <span className="font-semibold">{tipoLabels[tipo].label}</span>
                      <Badge variant="secondary" className="ml-2">
                        {categoriasPorTipo[tipo].length}
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-2">
                      {categoriasPorTipo[tipo].map((categoria) => (
                        <div
                          key={categoria.id}
                          className="rounded-lg border p-4"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div
                                className="size-6 rounded-md"
                                style={{ backgroundColor: categoria.cor }}
                              />
                              <span className="font-medium">{categoria.nome}</span>
                            </div>
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
                                  onClick={() => handleDelete(categoria)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="mr-2 size-4" />
                                  Excluir
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          {categoria.subcategorias.length > 0 && (
                            <>
                              <Separator className="my-3" />
                              <div className="flex flex-wrap gap-2">
                                {categoria.subcategorias.map((sub) => (
                                  <Badge key={sub.id} variant="outline">
                                    {sub.nome}
                                  </Badge>
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                      {categoriasPorTipo[tipo].length === 0 && (
                        <p className="py-4 text-center text-muted-foreground">
                          Nenhuma categoria cadastrada
                        </p>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </main>
    </>
  )
}
