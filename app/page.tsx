import Link from 'next/link'
import { FlaskConical, Search, GitCompare, ShieldCheck } from 'lucide-react'
import { getAllPeptides } from '@/lib/peptides'

export default function HomePage() {
  const peptides = getAllPeptides()
  const approvedCount = peptides.filter(p => p.category === 'approved-rx').length
  const investigationalCount = peptides.filter(p => p.category === 'investigational').length
  const greyCount = peptides.filter(p => p.category === 'grey-market').length

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4 sm:px-6 py-16">
      <div className="w-full max-w-3xl flex flex-col items-center text-center gap-10">

        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 text-blue-600 text-sm font-medium">
            <FlaskConical size={16} />
            Educational Reference Database
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
            The comprehensive peptide reference database
          </h1>
          <p className="text-lg text-gray-500 max-w-xl">
            Research-grade information on {peptides.length}+ peptides — approved pharmaceuticals,
            investigational compounds, and grey-market research chemicals.
          </p>
          <div className="flex gap-3 flex-wrap justify-center mt-2">
            <Link
              href="/peptides"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
            >
              <Search size={16} />
              Browse database
            </Link>
            <Link
              href="/peptides?category=approved-rx"
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:border-gray-400 transition-colors"
            >
              <ShieldCheck size={16} />
              Approved Rx only
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
          <Link
            href="/peptides?category=approved-rx"
            className="border border-blue-200 bg-blue-50 rounded-lg p-5 hover:border-blue-300 transition-colors text-left"
          >
            <div className="text-3xl font-bold text-blue-700 mb-1">{approvedCount}</div>
            <div className="font-medium text-blue-800">Approved Rx</div>
            <div className="text-sm text-blue-600 mt-1">FDA-approved, prescription only</div>
          </Link>
          <Link
            href="/peptides?category=investigational"
            className="border border-amber-200 bg-amber-50 rounded-lg p-5 hover:border-amber-300 transition-colors text-left"
          >
            <div className="text-3xl font-bold text-amber-700 mb-1">{investigationalCount}</div>
            <div className="font-medium text-amber-800">Investigational</div>
            <div className="text-sm text-amber-600 mt-1">Clinical trials and pipeline</div>
          </Link>
          <Link
            href="/peptides?category=grey-market"
            className="border border-red-200 bg-red-50 rounded-lg p-5 hover:border-red-300 transition-colors text-left"
          >
            <div className="text-3xl font-bold text-red-700 mb-1">{greyCount}</div>
            <div className="font-medium text-red-800">Grey-market</div>
            <div className="text-sm text-red-600 mt-1">Not approved for human use</div>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-xl">
          <div className="flex gap-3 text-left">
            <Search size={20} className="text-gray-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-medium text-gray-900">Fuzzy search</div>
              <div className="text-sm text-gray-500">Search by name, alias, or brand</div>
            </div>
          </div>
          <div className="flex gap-3 text-left">
            <GitCompare size={20} className="text-gray-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-medium text-gray-900">Side-by-side compare</div>
              <div className="text-sm text-gray-500">Select up to 3 peptides to compare</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
