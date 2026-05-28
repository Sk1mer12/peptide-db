'use client'

import { useState } from 'react'
import { ExternalLink } from 'lucide-react'
import type { Vendor, MarketplaceCountry } from '@/types'
import VendorTypeBadge from './VendorTypeBadge'

interface Props {
  vendorsByCountry: Record<string, Vendor[]>
  countries: MarketplaceCountry[]
}

export default function VendorList({ vendorsByCountry, countries }: Props) {
  const availableCountries = countries.filter(c => (vendorsByCountry[c.code]?.length ?? 0) > 0)
  const [active, setActive] = useState<string>(availableCountries[0]?.code ?? countries[0].code)

  if (availableCountries.length === 0) {
    return (
      <div className="border border-gray-200 rounded-lg p-6 text-center bg-gray-50">
        <p className="text-sm text-gray-500">No verified vendors logged for this peptide yet.</p>
        <p className="text-xs text-gray-400 mt-1">Marketplace coverage expands in batches — check back.</p>
      </div>
    )
  }

  const vendors = vendorsByCountry[active] ?? []

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-1.5 border-b border-gray-200 pb-2">
        {countries.map(c => {
          const count = vendorsByCountry[c.code]?.length ?? 0
          const isActive = c.code === active
          const isDisabled = count === 0
          return (
            <button
              key={c.code}
              onClick={() => !isDisabled && setActive(c.code)}
              disabled={isDisabled}
              className={[
                'text-xs px-2.5 py-1 rounded transition-colors flex items-center gap-1.5',
                isActive
                  ? 'bg-gray-900 text-white'
                  : isDisabled
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-gray-600 hover:bg-gray-100',
              ].join(' ')}
              title={isDisabled ? 'No vendors logged' : c.name}
            >
              <span>{c.flag}</span>
              <span>{c.name}</span>
              {count > 0 && (
                <span className={`text-[10px] px-1 rounded ${isActive ? 'bg-white/20' : 'bg-gray-100'}`}>
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      <ul className="space-y-2">
        {vendors.map((v, i) => (
          <li key={`${v.url}-${i}`}>
            <a
              href={v.url}
              target="_blank"
              rel="nofollow noopener noreferrer"
              className="flex items-start justify-between gap-3 border border-gray-200 rounded-lg p-3 hover:border-gray-400 transition-colors group"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="font-medium text-gray-900 group-hover:text-blue-700 transition-colors truncate">
                    {v.name}
                  </span>
                  <VendorTypeBadge type={v.type} />
                </div>
                {v.note && <p className="text-xs text-gray-500 leading-snug">{v.note}</p>}
                <p className="text-xs text-gray-400 truncate mt-0.5">{new URL(v.url).hostname}</p>
              </div>
              <ExternalLink size={16} className="text-gray-300 group-hover:text-gray-500 transition-colors shrink-0 mt-1" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
