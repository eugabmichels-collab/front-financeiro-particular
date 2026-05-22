'use client'

import * as React from 'react'

interface FiltersContextType {
  mes: number
  ano: number
  setMes: (mes: number) => void
  setAno: (ano: number) => void
  mesAnterior: () => void
  proximoMes: () => void
}

const FiltersContext = React.createContext<FiltersContextType | null>(null)

export function useFilters() {
  const context = React.useContext(FiltersContext)
  if (!context) {
    throw new Error('useFilters must be used within a FiltersProvider')
  }
  return context
}

export function FiltersProvider({ children }: { children: React.ReactNode }) {
  const hoje = new Date()
  const [mes, setMes] = React.useState(hoje.getMonth() + 1)
  const [ano, setAno] = React.useState(hoje.getFullYear())

  const mesAnterior = React.useCallback(() => {
    if (mes === 1) {
      setMes(12)
      setAno(ano - 1)
    } else {
      setMes(mes - 1)
    }
  }, [mes, ano])

  const proximoMes = React.useCallback(() => {
    if (mes === 12) {
      setMes(1)
      setAno(ano + 1)
    } else {
      setMes(mes + 1)
    }
  }, [mes, ano])

  return (
    <FiltersContext.Provider
      value={{
        mes,
        ano,
        setMes,
        setAno,
        mesAnterior,
        proximoMes,
      }}
    >
      {children}
    </FiltersContext.Provider>
  )
}
