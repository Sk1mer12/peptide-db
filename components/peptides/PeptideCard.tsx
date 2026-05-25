import Link from 'next/link'
import type { PeptideListItem } from '@/types'
import PeptideBadge from './PeptideBadge'
import CompareToggleButton from '@/components/compare/CompareToggleButton'
import PeptideImage from './PeptideImage'
import RatingBar from './RatingBar'

interface Props {
  peptide: PeptideListItem
}

export default function PeptideCard({ peptide }: Props) {
  return (
    <div className="border border-gray-200 rounded-lg bg-white p-4 flex flex-col gap-3 hover:border-gray-300 transition-colors">
      <div className="flex gap-3">
        <PeptideImage name={peptide.name} pubchemCid={peptide.pubchemCid} size="sm" />
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <Link
              href={`/peptides/${peptide.slug}`}
              className="font-semibold text-gray-900 hover:text-blue-700 leading-tight"
            >
              {peptide.name}
            </Link>
            <PeptideBadge category={peptide.category} size="sm" />
          </div>
          {peptide.aliases.length > 0 && (
            <p className="text-xs text-gray-500 truncate">
              {peptide.aliases.join(' · ')}
            </p>
          )}
        </div>
      </div>

      <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">{peptide.summary}</p>

      <div className="flex flex-wrap gap-1">
        {peptide.purpose.slice(0, 3).map(p => (
          <span key={p} className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
            {p}
          </span>
        ))}
      </div>

      <div className="flex flex-col gap-1 pt-2 border-t border-gray-100">
        <RatingBar label="Safety" value={peptide.safetyRating} variant="safety" />
        <RatingBar label="Performance" value={peptide.performanceRating} variant="performance" />
      </div>

      <div className="flex items-center justify-between mt-auto">
        <span className="text-xs text-gray-400">{peptide.producer || '—'}</span>
        <CompareToggleButton slug={peptide.slug} />
      </div>
    </div>
  )
}
