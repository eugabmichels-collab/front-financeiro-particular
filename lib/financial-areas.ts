import {
  BriefcaseBusiness,
  Building2,
  CarFront,
  GraduationCap,
  HeartHandshake,
  Home,
  Landmark,
  Plane,
  Rocket,
  Wallet,
  type LucideIcon,
} from 'lucide-react'

import { areasFinanceirasIniciais } from '@/data/mock-data'
import type { AreaFinanceira, CategoriaAreaFinanceira, IconeAreaFinanceira } from '@/types'

export const FINANCIAL_AREAS_STORAGE_KEY = 'financial-areas'
export const FINANCIAL_AREAS_UPDATED_EVENT = 'financial-areas-updated'

const CATEGORY_COLORS = [
  '#0f766e',
  '#0ea5e9',
  '#f97316',
  '#ef4444',
  '#6366f1',
  '#ca8a04',
  '#db2777',
  '#059669',
]

export const financialAreaIconOptions: Array<{ value: IconeAreaFinanceira; label: string }> = [
  { value: 'building2', label: 'Apartamento / imóvel' },
  { value: 'car-front', label: 'Carro / veículo' },
  { value: 'plane', label: 'Viagem' },
  { value: 'home', label: 'Casa' },
  { value: 'briefcase-business', label: 'Negócio / projeto' },
  { value: 'wallet', label: 'Reserva pessoal' },
  { value: 'landmark', label: 'Patrimônio' },
  { value: 'graduation-cap', label: 'Educação' },
  { value: 'heart-handshake', label: 'Família / saúde' },
  { value: 'rocket', label: 'Meta futura' },
]

const financialAreaIcons: Record<IconeAreaFinanceira, LucideIcon> = {
  building2: Building2,
  'car-front': CarFront,
  plane: Plane,
  home: Home,
  'briefcase-business': BriefcaseBusiness,
  wallet: Wallet,
  landmark: Landmark,
  'graduation-cap': GraduationCap,
  'heart-handshake': HeartHandshake,
  rocket: Rocket,
}

export function getFinancialAreaIcon(icon: IconeAreaFinanceira): LucideIcon {
  return financialAreaIcons[icon] || Wallet
}

export function slugifyFinancialAreaName(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function cloneDefaultAreas(): AreaFinanceira[] {
  return areasFinanceirasIniciais.map((area) => ({
    ...area,
    categorias: area.categorias.map((categoria) => ({ ...categoria })),
    lancamentos: area.lancamentos.map((lancamento) => ({ ...lancamento })),
  }))
}

function dispatchFinancialAreasUpdate() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(FINANCIAL_AREAS_UPDATED_EVENT))
  }
}

export function getStoredFinancialAreas(): AreaFinanceira[] {
  if (typeof window === 'undefined') {
    return cloneDefaultAreas()
  }

  const raw = window.localStorage.getItem(FINANCIAL_AREAS_STORAGE_KEY)

  if (!raw) {
    const defaults = cloneDefaultAreas()
    window.localStorage.setItem(FINANCIAL_AREAS_STORAGE_KEY, JSON.stringify(defaults))
    return defaults
  }

  try {
    const parsed = JSON.parse(raw) as AreaFinanceira[]

    if (parsed.length > 0) {
      return parsed
    }
  } catch {
    // Fall back to defaults below.
  }

  const defaults = cloneDefaultAreas()
  window.localStorage.setItem(FINANCIAL_AREAS_STORAGE_KEY, JSON.stringify(defaults))
  return defaults
}

export function saveFinancialAreas(areas: AreaFinanceira[]) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(FINANCIAL_AREAS_STORAGE_KEY, JSON.stringify(areas))
  dispatchFinancialAreasUpdate()
}

function normalizeCategories(categoryNames: string[]): CategoriaAreaFinanceira[] {
  const uniqueNames = Array.from(new Set(categoryNames.map((name) => name.trim()).filter(Boolean)))

  return uniqueNames.map((name, index) => ({
    id: slugifyFinancialAreaName(name) || `categoria-${index + 1}`,
    nome: name,
    cor: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
  }))
}

export function buildFinancialArea(input: {
  nome: string
  descricao?: string
  cor: string
  icone: IconeAreaFinanceira
  categorias?: string[]
  id?: string
  slug?: string
  lancamentos?: AreaFinanceira['lancamentos']
  fixa?: boolean
}): AreaFinanceira {
  const slugBase = slugifyFinancialAreaName(input.slug || input.nome)

  return {
    id: input.id || `finance-${crypto.randomUUID()}`,
    slug: slugBase || `finance-${Date.now()}`,
    nome: input.nome.trim(),
    descricao: input.descricao?.trim() || '',
    cor: input.cor,
    icone: input.icone,
    categorias: normalizeCategories(input.categorias || []),
    lancamentos: input.lancamentos || [],
    fixa: input.fixa || false,
  }
}

export function ensureUniqueSlug(areas: AreaFinanceira[], area: AreaFinanceira): AreaFinanceira {
  const baseSlug = area.slug
  let nextSlug = baseSlug
  let suffix = 2

  while (areas.some((current) => current.id !== area.id && current.slug === nextSlug)) {
    nextSlug = `${baseSlug}-${suffix}`
    suffix += 1
  }

  return {
    ...area,
    slug: nextSlug,
  }
}