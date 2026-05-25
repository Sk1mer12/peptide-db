import type { PeptideCategory } from '@/types'

const styles: Record<PeptideCategory, string> = {
  'approved-rx': 'bg-blue-50 text-blue-700 border border-blue-200',
  'investigational': 'bg-amber-50 text-amber-700 border border-amber-200',
  'grey-market': 'bg-red-50 text-red-700 border border-red-200',
}

const labels: Record<PeptideCategory, string> = {
  'approved-rx': 'Approved Rx',
  'investigational': 'Investigational',
  'grey-market': 'Grey-market',
}

interface Props {
  category: PeptideCategory
  size?: 'sm' | 'md'
}

export default function PeptideBadge({ category, size = 'md' }: Props) {
  const sizeClass = size === 'sm' ? 'text-xs px-1.5 py-0.5' : 'text-xs px-2 py-1'
  return (
    <span className={`inline-flex items-center rounded font-medium ${sizeClass} ${styles[category]}`}>
      {labels[category]}
    </span>
  )
}
