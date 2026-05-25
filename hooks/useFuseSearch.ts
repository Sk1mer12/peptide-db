'use client'

import { useMemo } from 'react'
import { buildFuseIndex } from '@/lib/search'
import type { PeptideListItem } from '@/types'

export function useFuseSearch(peptides: PeptideListItem[], query: string): PeptideListItem[] {
  const fuse = useMemo(() => buildFuseIndex(peptides), [peptides])

  return useMemo(() => {
    if (!query.trim()) return peptides
    return fuse.search(query).map(r => r.item)
  }, [fuse, peptides, query])
}
