'use client'

import { useCompare } from '@/hooks/useCompare'
import { Plus, Check } from 'lucide-react'

interface Props {
  slug: string
}

export default function CompareToggleButton({ slug }: Props) {
  const { selected, toggle, canAdd } = useCompare()
  const isSelected = selected.includes(slug)

  if (!isSelected && !canAdd) return null

  return (
    <button
      onClick={() => toggle(slug)}
      className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded border transition-colors ${
        isSelected
          ? 'bg-gray-900 text-white border-gray-900'
          : 'bg-white text-gray-600 border-gray-300 hover:border-gray-500'
      }`}
    >
      {isSelected ? <Check size={12} /> : <Plus size={12} />}
      {isSelected ? 'Added' : 'Compare'}
    </button>
  )
}
