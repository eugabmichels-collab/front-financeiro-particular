'use client'

import * as React from 'react'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { ArrowUpDown, MoreHorizontal, Pencil, Trash2, Copy, Check } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { formatCurrency, formatDate, getStatusLabel, getStatusVariant, getFormaPagamentoLabel } from '@/lib/format'
import type { Lancamento, Categoria, Cartao } from '@/types'

interface DataTableProps {
  data: Lancamento[]
  categorias: Categoria[]
  cartoes: Cartao[]
  onEdit?: (lancamento: Lancamento) => void
  onDelete?: (lancamento: Lancamento) => void
  onDuplicate?: (lancamento: Lancamento) => void
  onMarkPaid?: (lancamento: Lancamento) => void
}

export function LancamentosTable({
  data,
  categorias,
  cartoes,
  onEdit,
  onDelete,
  onDuplicate,
  onMarkPaid,
}: DataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: 'data', desc: true },
  ])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [tipoFilter, setTipoFilter] = React.useState<string>('todos')
  const [statusFilter, setStatusFilter] = React.useState<string>('todos')

  const getCategoriaNome = (categoriaId: string) => {
    const categoria = categorias.find((c) => c.id === categoriaId)
    return categoria?.nome || 'Sem categoria'
  }

  const getCartaoNome = (cartaoId?: string) => {
    if (!cartaoId) return '-'
    const cartao = cartoes.find((c) => c.id === cartaoId)
    return cartao?.nome || '-'
  }

  const columns: ColumnDef<Lancamento>[] = [
    {
      accessorKey: 'data',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="-ml-4"
        >
          Data
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      ),
      cell: ({ row }) => formatDate(row.getValue('data')),
    },
    {
      accessorKey: 'descricao',
      header: 'Descrição',
      cell: ({ row }) => {
        const lancamento = row.original
        return (
          <div className="flex flex-col gap-0.5">
            <span className="font-medium">{lancamento.descricao}</span>
            <span className="text-xs text-muted-foreground">
              {getCategoriaNome(lancamento.categoriaId)}
            </span>
          </div>
        )
      },
    },
    {
      accessorKey: 'tipo',
      header: 'Tipo',
      cell: ({ row }) => {
        const tipo = row.getValue('tipo') as string
        return (
          <Badge variant={tipo === 'receita' ? 'default' : 'secondary'}>
            {tipo === 'receita' ? 'Receita' : 'Despesa'}
          </Badge>
        )
      },
      filterFn: (row, id, value) => {
        if (value === 'todos') return true
        return row.getValue(id) === value
      },
    },
    {
      accessorKey: 'formaPagamento',
      header: 'Forma',
      cell: ({ row }) => {
        const lancamento = row.original
        const forma = getFormaPagamentoLabel(lancamento.formaPagamento)
        const cartao = lancamento.cartaoId ? getCartaoNome(lancamento.cartaoId) : null
        return (
          <div className="flex flex-col gap-0.5">
            <span>{forma}</span>
            {cartao && <span className="text-xs text-muted-foreground">{cartao}</span>}
          </div>
        )
      },
    },
    {
      accessorKey: 'valor',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="-ml-4"
        >
          Valor
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const lancamento = row.original
        return (
          <span className={lancamento.tipo === 'receita' ? 'text-receita font-semibold' : 'text-despesa font-semibold'}>
            {lancamento.tipo === 'receita' ? '+' : '-'}
            {formatCurrency(lancamento.valor)}
          </span>
        )
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as string
        return (
          <Badge variant={getStatusVariant(status)}>
            {getStatusLabel(status)}
          </Badge>
        )
      },
      filterFn: (row, id, value) => {
        if (value === 'todos') return true
        return row.getValue(id) === value
      },
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const lancamento = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="size-8 p-0">
                <span className="sr-only">Abrir menu</span>
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Ações</DropdownMenuLabel>
              {lancamento.status !== 'pago' && onMarkPaid && (
                <DropdownMenuItem onClick={() => onMarkPaid(lancamento)}>
                  <Check className="mr-2 size-4" />
                  Marcar como pago
                </DropdownMenuItem>
              )}
              {onEdit && (
                <DropdownMenuItem onClick={() => onEdit(lancamento)}>
                  <Pencil className="mr-2 size-4" />
                  Editar
                </DropdownMenuItem>
              )}
              {onDuplicate && (
                <DropdownMenuItem onClick={() => onDuplicate(lancamento)}>
                  <Copy className="mr-2 size-4" />
                  Duplicar
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              {onDelete && (
                <DropdownMenuItem
                  onClick={() => onDelete(lancamento)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 size-4" />
                  Excluir
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  // Apply custom filters
  const filteredData = React.useMemo(() => {
    let result = data
    if (tipoFilter !== 'todos') {
      result = result.filter((item) => item.tipo === tipoFilter)
    }
    if (statusFilter !== 'todos') {
      result = result.filter((item) => item.status === statusFilter)
    }
    return result
  }, [data, tipoFilter, statusFilter])

  const table = useReactTable({
    data: filteredData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize: 15,
      },
    },
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Input
          placeholder="Buscar lançamentos..."
          value={(table.getColumn('descricao')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('descricao')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="flex gap-2">
          <Select value={tipoFilter} onValueChange={setTipoFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="receita">Receita</SelectItem>
              <SelectItem value="despesa">Despesa</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="pago">Pago</SelectItem>
              <SelectItem value="pendente">Pendente</SelectItem>
              <SelectItem value="previsto">Previsto</SelectItem>
              <SelectItem value="atrasado">Atrasado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Nenhum lançamento encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filteredData.length} lançamento(s) encontrado(s)
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <span className="text-sm text-muted-foreground">
            Página {table.getState().pagination.pageIndex + 1} de{' '}
            {table.getPageCount()}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Próxima
          </Button>
        </div>
      </div>
    </div>
  )
}
