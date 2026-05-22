'use client'

import * as React from 'react'

import {
  FINANCIAL_AREAS_UPDATED_EVENT,
  buildFinancialArea,
  ensureUniqueSlug,
  getStoredFinancialAreas,
  saveFinancialAreas,
} from '@/lib/financial-areas'
import type { AreaFinanceira, IconeAreaFinanceira } from '@/types'

interface FinancialAreaInput {
  nome: string
  descricao?: string
  cor: string
  icone: IconeAreaFinanceira
  categorias?: string[]
}

export function useFinancialAreas() {
  const [areasFinanceiras, setAreasFinanceiras] = React.useState<AreaFinanceira[]>([])

  React.useEffect(() => {
    const syncAreas = () => {
      setAreasFinanceiras(getStoredFinancialAreas())
    }

    syncAreas()
    window.addEventListener(FINANCIAL_AREAS_UPDATED_EVENT, syncAreas)
    window.addEventListener('storage', syncAreas)

    return () => {
      window.removeEventListener(FINANCIAL_AREAS_UPDATED_EVENT, syncAreas)
      window.removeEventListener('storage', syncAreas)
    }
  }, [])

  const createArea = React.useCallback((input: FinancialAreaInput) => {
    const currentAreas = getStoredFinancialAreas()
    const nextArea = ensureUniqueSlug(currentAreas, buildFinancialArea(input))
    saveFinancialAreas([...currentAreas, nextArea])
    return nextArea
  }, [])

  const updateArea = React.useCallback((areaId: string, input: FinancialAreaInput) => {
    const currentAreas = getStoredFinancialAreas()
    const previousArea = currentAreas.find((area) => area.id === areaId)

    if (!previousArea) {
      return undefined
    }

    const updatedArea = ensureUniqueSlug(currentAreas, buildFinancialArea({
      ...input,
      id: previousArea.id,
      slug: previousArea.slug,
      lancamentos: previousArea.lancamentos,
      fixa: previousArea.fixa,
    }))

    saveFinancialAreas(currentAreas.map((area) => (area.id === areaId ? updatedArea : area)))

    return updatedArea
  }, [])

  const removeArea = React.useCallback((areaId: string) => {
    const currentAreas = getStoredFinancialAreas()
    const targetArea = currentAreas.find((area) => area.id === areaId)

    if (!targetArea || targetArea.fixa) {
      return false
    }

    saveFinancialAreas(currentAreas.filter((area) => area.id !== areaId))
    return true
  }, [])

  return {
    areasFinanceiras,
    createArea,
    updateArea,
    removeArea,
  }
}