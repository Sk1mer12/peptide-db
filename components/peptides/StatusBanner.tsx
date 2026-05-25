import { AlertTriangle } from 'lucide-react'
import type { PeptideCategory } from '@/types'

const config: Record<'investigational' | 'grey-market', { bg: string; text: string; message: string }> = {
  investigational: {
    bg: 'bg-amber-50 border-amber-200',
    text: 'text-amber-800',
    message:
      'This compound is under clinical investigation and is not approved for general use. Information is provided for research reference only.',
  },
  'grey-market': {
    bg: 'bg-red-50 border-red-200',
    text: 'text-red-800',
    message:
      'This compound is not approved for human use by the FDA or equivalent regulatory bodies. It is available only as a research chemical. Do not use for self-administration. This information is strictly for educational purposes.',
  },
}

interface Props {
  category: PeptideCategory
}

export default function StatusBanner({ category }: Props) {
  if (category === 'approved-rx') return null
  const c = config[category]
  return (
    <div className={`border rounded-lg p-4 flex gap-3 ${c.bg}`}>
      <AlertTriangle size={18} className={`${c.text} shrink-0 mt-0.5`} />
      <p className={`text-sm ${c.text}`}>{c.message}</p>
    </div>
  )
}
