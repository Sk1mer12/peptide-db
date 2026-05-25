import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { getPeptideBySlug } from '@/lib/peptides'
import { decodeIds } from '@/lib/compare'
import CompareTable from '@/components/compare/CompareTable'
import type { PeptideFrontmatter } from '@/types'

interface Props {
  searchParams: { ids?: string }
}

export const metadata = {
  title: 'Compare Peptides — PeptideDB',
}

export default async function ComparePage({ searchParams }: Props) {
  const ids = decodeIds(searchParams.ids)
  const results = await Promise.all(ids.map(id => getPeptideBySlug(id)))
  const peptides = results
    .filter((r): r is { frontmatter: PeptideFrontmatter; content: string } => r !== null)
    .map(r => r.frontmatter)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6 flex items-center gap-4">
        <Link href="/peptides" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft size={14} />
          Back to database
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Compare Peptides</h1>
      </div>

      {peptides.length < 2 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg font-medium">Select at least 2 peptides to compare</p>
          <Link href="/peptides" className="text-sm text-blue-600 hover:underline mt-2 inline-block">
            Browse the database
          </Link>
        </div>
      ) : (
        <CompareTable peptides={peptides} />
      )}
    </div>
  )
}
