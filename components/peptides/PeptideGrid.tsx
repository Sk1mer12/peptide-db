'use client'

import { useState } from 'react'
import { LayoutGrid, Table2 } from 'lucide-react'
import type { PeptideListItem, ActiveFilters } from '@/types'
import PeptideCard from './PeptideCard'
import PeptideTable from './PeptideTable'
import SearchBar from '@/components/search/SearchBar'
import FilterBar from '@/components/filters/FilterBar'
import { useFuseSearch } from '@/hooks/useFuseSearch'

interface Props {
  peptides: PeptideListItem[]
  allPurposes: string[]
}

export default function PeptideGrid({ peptides, allPurposes }: Props) {
  const [query, setQuery] = useState('')
  const [view, setView] = useState<'grid' | 'table'>('grid')
  const [filters, setFilters] = useState<ActiveFilters>({
    category: '',
    purposes: [],
    minSafetyRating: 1,
    minPerformanceRating: 1,
  })

  const searchResults = useFuseSearch(peptides, query)

  const filtered = searchResults.filter(p => {
    if (filters.category && p.category !== filters.category) return false
    if (filters.purposes.length > 0 && !filters.purposes.some(pur => p.purpose.includes(pur))) return false
    if (p.safetyRating < filters.minSafetyRating) return false
    if (p.performanceRating < filters.minPerformanceRating) return false
    return true
  })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-3 items-center">
        <div className="flex-1">
          <SearchBar value={query} onChange={setQuery} />
        </div>
        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden shrink-0">
          <button
            onClick={() => setView('grid')}
            title="Grid view"
            className={`p-2 transition-colors ${view === 'grid' ? 'bg-gray-900 text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
          >
            <LayoutGrid size={16} />
          </button>
          <button
            onClick={() => setView('table')}
            title="Table view"
            className={`p-2 transition-colors ${view === 'table' ? 'bg-gray-900 text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
          >
            <Table2 size={16} />
          </button>
        </div>
      </div>
      <FilterBar filters={filters} allPurposes={allPurposes} onChange={setFilters} resultCount={filtered.length} />

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg font-medium">No peptides found</p>
          <p className="text-sm mt-1">Try adjusting your search or filters</p>
        </div>
      ) : view === 'table' ? (
        <PeptideTable peptides={filtered} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(p => (
            <PeptideCard key={p.slug} peptide={p} />
          ))}
        </div>
      )}
    </div>
  )
}
