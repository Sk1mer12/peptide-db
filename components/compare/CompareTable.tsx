import { CheckCircle, XCircle } from 'lucide-react'
import Link from 'next/link'
import type { PeptideFrontmatter } from '@/types'
import PeptideBadge from '@/components/peptides/PeptideBadge'

interface Props {
  peptides: PeptideFrontmatter[]
}

function BoolCell({ value }: { value: boolean }) {
  return value ? (
    <CheckCircle size={16} className="text-green-600 mx-auto" />
  ) : (
    <XCircle size={16} className="text-red-400 mx-auto" />
  )
}

const ROWS: { label: string; render: (p: PeptideFrontmatter) => React.ReactNode }[] = [
  { label: 'Category', render: p => <PeptideBadge category={p.category} size="sm" /> },
  { label: 'Status', render: p => p.status },
  { label: 'Producer', render: p => p.producer || '—' },
  { label: 'Brands', render: p => p.brands.join(', ') || '—' },
  { label: 'Purpose', render: p => p.purpose.join(', ') || '—' },
  { label: 'Route', render: p => p.route || '—' },
  { label: 'Half-life', render: p => <span className="font-mono">{p.halfLife || '—'}</span> },
  { label: 'Mol. weight', render: p => <span className="font-mono">{p.molecularWeight || '—'}</span> },
  { label: 'Requires Rx', render: p => <BoolCell value={p.requiresRx} /> },
  { label: 'Buyable', render: p => <BoolCell value={p.buyable} /> },
  { label: 'Sports ban', render: p => <BoolCell value={p.sportsBan} /> },
  {
    label: 'Side effects',
    render: p =>
      p.sideEffects.length > 0 ? (
        <ul className="text-left space-y-0.5">
          {p.sideEffects.map(e => (
            <li key={e} className="text-xs text-gray-600">· {e}</li>
          ))}
        </ul>
      ) : (
        '—'
      ),
  },
  { label: 'Legal note', render: p => <span className="text-xs">{p.legalNote || '—'}</span> },
]

export default function CompareTable({ peptides }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="px-4 py-3 text-left font-medium text-gray-600 w-36">Field</th>
            {peptides.map(p => (
              <th key={p.slug} className="px-4 py-3 text-left font-semibold text-gray-900">
                <Link href={`/peptides/${p.slug}`} className="hover:text-blue-700 transition-colors">
                  {p.name}
                </Link>
                {p.aliases.length > 0 && (
                  <div className="text-xs font-normal text-gray-400 mt-0.5">{p.aliases[0]}</div>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row, i) => (
            <tr key={row.label} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="px-4 py-3 font-medium text-gray-600 align-top">{row.label}</td>
              {peptides.map(p => (
                <td key={p.slug} className="px-4 py-3 text-gray-700 align-top">
                  {row.render(p)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
