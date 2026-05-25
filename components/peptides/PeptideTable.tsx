import Link from 'next/link'
import { CheckCircle, XCircle } from 'lucide-react'
import type { PeptideListItem } from '@/types'
import PeptideBadge from './PeptideBadge'
import CompareToggleButton from '@/components/compare/CompareToggleButton'

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

function RatingDots({ value, color }: { value: number; color: string }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className={`w-2 h-2 rounded-full ${i < value ? `${color} ` : 'bg-gray-200'}`}
        />
      ))}
    </div>
  )
}

interface Props {
  peptides: PeptideListItem[]
}

export default function PeptideTable({ peptides }: Props) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="px-4 py-2.5 text-left font-medium text-gray-600 whitespace-nowrap">Name</th>
            <th className="px-4 py-2.5 text-left font-medium text-gray-600 whitespace-nowrap">Category</th>
            <th className="px-4 py-2.5 text-left font-medium text-gray-600 whitespace-nowrap">Purpose</th>
            <th className="px-4 py-2.5 text-left font-medium text-gray-600 whitespace-nowrap">Route</th>
            <th className="px-4 py-2.5 text-left font-medium text-gray-600 whitespace-nowrap">Half-life</th>
            <th className="px-4 py-2.5 text-left font-medium text-gray-600 whitespace-nowrap">Safety</th>
            <th className="px-4 py-2.5 text-left font-medium text-gray-600 whitespace-nowrap">Performance</th>
            <th className="px-4 py-2.5 text-left font-medium text-gray-600 whitespace-nowrap">Rx</th>
            <th className="px-4 py-2.5 text-left font-medium text-gray-600 whitespace-nowrap">WADA</th>
            <th className="px-4 py-2.5 text-left font-medium text-gray-600 whitespace-nowrap"></th>
          </tr>
        </thead>
        <tbody>
          {peptides.map((p, i) => (
            <tr
              key={p.slug}
              className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'}`}
            >
              <td className="px-4 py-2.5">
                <div className="flex flex-col gap-0.5">
                  <Link
                    href={`/peptides/${p.slug}`}
                    className="font-medium text-gray-900 hover:text-blue-700 transition-colors whitespace-nowrap"
                  >
                    {p.name}
                  </Link>
                  {p.aliases.length > 0 && (
                    <span className="text-xs text-gray-400 truncate max-w-[160px]">
                      {p.aliases.slice(0, 2).join(' · ')}
                    </span>
                  )}
                </div>
              </td>
              <td className="px-4 py-2.5 whitespace-nowrap">
                <PeptideBadge category={p.category} size="sm" />
              </td>
              <td className="px-4 py-2.5">
                <div className="flex flex-wrap gap-1 max-w-[200px]">
                  {p.purpose.slice(0, 2).map(pur => (
                    <span key={pur} className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded whitespace-nowrap">
                      {PURPOSE_LABELS[pur] ?? pur}
                    </span>
                  ))}
                  {p.purpose.length > 2 && (
                    <span className="text-xs text-gray-400">+{p.purpose.length - 2}</span>
                  )}
                </div>
              </td>
              <td className="px-4 py-2.5 text-gray-600 whitespace-nowrap text-xs max-w-[140px] truncate">
                {p.route ?? '—'}
              </td>
              <td className="px-4 py-2.5 text-gray-600 font-mono text-xs whitespace-nowrap">
                {p.halfLife ?? '—'}
              </td>
              <td className="px-4 py-2.5">
                <RatingDots value={p.safetyRating} color="bg-green-500" />
              </td>
              <td className="px-4 py-2.5">
                <RatingDots value={p.performanceRating} color="bg-blue-500" />
              </td>
              <td className="px-4 py-2.5">
                {p.requiresRx
                  ? <CheckCircle size={14} className="text-green-600" />
                  : <XCircle size={14} className="text-gray-300" />}
              </td>
              <td className="px-4 py-2.5">
                {p.sportsBan
                  ? <CheckCircle size={14} className="text-red-500" />
                  : <XCircle size={14} className="text-gray-300" />}
              </td>
              <td className="px-4 py-2.5">
                <CompareToggleButton slug={p.slug} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
