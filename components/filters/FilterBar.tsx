'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import type { ActiveFilters, PeptideCategory } from '@/types'

const CATEGORIES: { value: PeptideCategory | ''; label: string }[] = [
  { value: '', label: 'All' },
  { value: 'approved-rx', label: 'Approved Rx' },
  { value: 'investigational', label: 'Investigational' },
  { value: 'grey-market', label: 'Grey-market' },
]

const PURPOSE_LABELS: Record<string, string> = {
  'weight-loss': 'Weight loss',
  'diabetes': 'Diabetes',
  'cardiovascular': 'Cardiovascular',
  'gh-release': 'GH release',
  'healing': 'Healing',
  'nootropic': 'Nootropic',
  'cancer': 'Cancer',
  'sexual-health': 'Sexual health',
  'anti-aging': 'Anti-aging',
  'immune': 'Immune',
  'hormonal': 'Hormonal',
  'osteoporosis': 'Osteoporosis',
  'gut-health': 'Gut health',
  'neuroprotection': 'Neuroprotection',
  'skin-hair': 'Skin & hair',
  'antimicrobial': 'Antimicrobial',
  'muscle-recovery': 'Muscle recovery',
  'longevity': 'Longevity',
}

interface Props {
  filters: ActiveFilters
  allPurposes: string[]
  onChange: (f: ActiveFilters) => void
  resultCount: number
}

const CATEGORY_LABELS: Record<PeptideCategory, string> = {
  'approved-rx': 'Approved Rx',
  'investigational': 'Investigational',
  'grey-market': 'Grey-market',
}

function DropdownFilter({
  label,
  open,
  onToggle,
  badge,
  children,
}: {
  label: string
  open: boolean
  onToggle: () => void
  badge?: number
  children: React.ReactNode
}) {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${
          open
            ? 'bg-gray-900 text-white border-gray-900'
            : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
        }`}
      >
        {label}
        {badge ? (
          <span className="bg-blue-600 text-white text-xs rounded-full px-1.5 py-0.5 leading-none">{badge}</span>
        ) : null}
        <ChevronDown size={13} className={`transition-transform duration-150 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1.5 z-30 bg-white border border-gray-200 rounded-lg shadow-md p-3 min-w-[180px]">
          {children}
        </div>
      )}
    </div>
  )
}

function MinRatingPicker({
  label,
  value,
  onChange,
  dotColor,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  dotColor: string
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-500 w-24 shrink-0">{label} ≥</span>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map(n => (
          <button
            key={n}
            onClick={() => onChange(value === n ? 1 : n)}
            title={`Minimum ${n}`}
            className={`w-4 h-4 rounded-full border transition-colors ${
              n <= value
                ? `${dotColor} border-transparent`
                : 'bg-white border-gray-300 hover:border-gray-400'
            }`}
          />
        ))}
      </div>
      <span className="text-xs text-gray-400 font-mono w-6">{value}+</span>
    </div>
  )
}

export default function FilterBar({ filters, allPurposes, onChange, resultCount }: Props) {
  const [categoryOpen, setCategoryOpen] = useState(false)
  const [purposesOpen, setPurposesOpen] = useState(false)
  const [ratingsOpen, setRatingsOpen] = useState(false)

  const togglePurpose = (p: string) => {
    const next = filters.purposes.includes(p)
      ? filters.purposes.filter(x => x !== p)
      : [...filters.purposes, p]
    onChange({ ...filters, purposes: next })
  }

  const categoryLabel = filters.category ? CATEGORY_LABELS[filters.category] : 'Status'
  const ratingsBadge =
    filters.minSafetyRating > 1 || filters.minPerformanceRating > 1
      ? (filters.minSafetyRating > 1 ? 1 : 0) + (filters.minPerformanceRating > 1 ? 1 : 0)
      : undefined

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 flex-wrap">
        <DropdownFilter
          label={categoryLabel}
          open={categoryOpen}
          onToggle={() => { setCategoryOpen(o => !o); setPurposesOpen(false); setRatingsOpen(false) }}
          badge={filters.category ? 1 : undefined}
        >
          <div className="flex flex-col gap-1">
            {[{ value: '' as const, label: 'All' }, ...CATEGORIES.slice(1)].map(cat => (
              <button
                key={cat.value}
                onClick={() => { onChange({ ...filters, category: cat.value }); setCategoryOpen(false) }}
                className={`text-left px-2 py-1.5 rounded text-sm transition-colors ${
                  filters.category === cat.value
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </DropdownFilter>

        {allPurposes.length > 0 && (
          <DropdownFilter
            label="Peptide type"
            open={purposesOpen}
            onToggle={() => { setPurposesOpen(o => !o); setCategoryOpen(false); setRatingsOpen(false) }}
            badge={filters.purposes.length || undefined}
          >
            <div className="flex flex-wrap gap-1.5 max-w-xs">
              {allPurposes.map(p => (
                <button
                  key={p}
                  onClick={() => togglePurpose(p)}
                  className={`px-2 py-0.5 rounded text-xs border transition-colors ${
                    filters.purposes.includes(p)
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
                  }`}
                >
                  {PURPOSE_LABELS[p] ?? p}
                </button>
              ))}
            </div>
          </DropdownFilter>
        )}

        <DropdownFilter
          label="Ratings"
          open={ratingsOpen}
          onToggle={() => { setRatingsOpen(o => !o); setCategoryOpen(false); setPurposesOpen(false) }}
          badge={ratingsBadge}
        >
          <div className="flex flex-col gap-3 py-1">
            <MinRatingPicker
              label="Safety"
              value={filters.minSafetyRating}
              onChange={v => onChange({ ...filters, minSafetyRating: v })}
              dotColor="bg-green-500"
            />
            <MinRatingPicker
              label="Performance"
              value={filters.minPerformanceRating}
              onChange={v => onChange({ ...filters, minPerformanceRating: v })}
              dotColor="bg-blue-500"
            />
            {(filters.minSafetyRating > 1 || filters.minPerformanceRating > 1) && (
              <button
                onClick={() => onChange({ ...filters, minSafetyRating: 1, minPerformanceRating: 1 })}
                className="text-xs text-gray-400 hover:text-gray-600 text-left mt-1 transition-colors"
              >
                Clear ratings
              </button>
            )}
          </div>
        </DropdownFilter>

        <span className="ml-auto text-sm text-gray-400">{resultCount} peptide{resultCount !== 1 ? 's' : ''}</span>
      </div>
    </div>
  )
}
