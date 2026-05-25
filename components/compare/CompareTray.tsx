'use client'

import { X, GitCompare } from 'lucide-react'
import { useCompare } from '@/hooks/useCompare'
import type { PeptideListItem } from '@/types'

interface Props {
  allPeptides: PeptideListItem[]
}

export default function CompareTray({ allPeptides }: Props) {
  const { selected, toggle, clear, navigateToCompare } = useCompare()

  if (selected.length === 0) return null

  const selectedPeptides = selected
    .map(slug => allPeptides.find(p => p.slug === slug))
    .filter(Boolean) as PeptideListItem[]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-4">
        <GitCompare size={16} className="text-gray-500 shrink-0" />
        <div className="flex-1 flex flex-wrap gap-2">
          {selectedPeptides.map(p => (
            <div key={p.slug} className="flex items-center gap-1 bg-gray-100 rounded px-2 py-1 text-sm">
              <span className="text-gray-700 font-medium">{p.name}</span>
              <button onClick={() => toggle(p.slug)} className="text-gray-400 hover:text-gray-600 ml-1">
                <X size={12} />
              </button>
            </div>
          ))}
          {selected.length < 3 && (
            <span className="text-sm text-gray-400 self-center">
              Add {3 - selected.length} more to compare
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={clear} className="text-sm text-gray-500 hover:text-gray-700">
            Clear
          </button>
          <button
            onClick={navigateToCompare}
            disabled={selected.length < 2}
            className="px-3 py-1.5 rounded bg-gray-900 text-white text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
          >
            Compare ({selected.length})
          </button>
        </div>
      </div>
    </div>
  )
}
