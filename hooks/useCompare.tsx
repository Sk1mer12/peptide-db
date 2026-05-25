'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { encodeIds } from '@/lib/compare'
import { useRouter } from 'next/navigation'

interface CompareContextValue {
  selected: string[]
  toggle: (slug: string) => void
  clear: () => void
  canAdd: boolean
  navigateToCompare: () => void
}

const CompareCtx = createContext<CompareContextValue | null>(null)

export function CompareProvider({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<string[]>([])
  const router = useRouter()

  const toggle = useCallback((slug: string) => {
    setSelected(prev =>
      prev.includes(slug)
        ? prev.filter(s => s !== slug)
        : prev.length < 3
          ? [...prev, slug]
          : prev
    )
  }, [])

  const clear = useCallback(() => setSelected([]), [])

  const navigateToCompare = useCallback(() => {
    if (selected.length >= 2) {
      router.push(`/compare?ids=${encodeIds(selected)}`)
    }
  }, [selected, router])

  return (
    <CompareCtx.Provider value={{ selected, toggle, clear, canAdd: selected.length < 3, navigateToCompare }}>
      {children}
    </CompareCtx.Provider>
  )
}

export function useCompare() {
  const ctx = useContext(CompareCtx)
  if (!ctx) throw new Error('useCompare must be used within CompareProvider')
  return ctx
}
