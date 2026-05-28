import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { getAllPeptides, getPeptideBySlug } from '@/lib/peptides'
import { getCountries, getVendorsForPeptide } from '@/lib/marketplace'
import DisclaimerGate from '@/components/marketplace/DisclaimerGate'
import VendorList from '@/components/marketplace/VendorList'
import PeptideBadge from '@/components/peptides/PeptideBadge'

interface Params {
  slug: string
}

export async function generateStaticParams() {
  return getAllPeptides().map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Params }) {
  const peptide = getPeptideBySlug(params.slug)
  if (!peptide) return { title: 'Peptide not found — PeptideDB' }
  return {
    title: `${peptide.frontmatter.name} — Vendors — PeptideDB`,
    description: `Vendor directory for ${peptide.frontmatter.name} across multiple countries. Informational only.`,
  }
}

export default function MarketplacePeptidePage({ params }: { params: Params }) {
  const peptide = getPeptideBySlug(params.slug)
  if (!peptide) notFound()

  const { frontmatter } = peptide
  const vendorsByCountry = getVendorsForPeptide(params.slug)
  const countries = getCountries()
  const hasAny = Object.values(vendorsByCountry).some(v => v.length > 0)

  return (
    <DisclaimerGate>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <Link
          href="/marketplace"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-4"
        >
          <ArrowLeft size={14} /> Marketplace
        </Link>

        <div className="mb-6">
          <div className="flex items-center gap-3 flex-wrap mb-2">
            <h1 className="text-2xl font-bold text-gray-900">{frontmatter.name}</h1>
            <PeptideBadge category={frontmatter.category} />
          </div>
          {frontmatter.summary && (
            <p className="text-sm text-gray-600 leading-relaxed">{frontmatter.summary}</p>
          )}
        </div>

        {frontmatter.legalNote && (
          <div className="border border-amber-200 bg-amber-50 rounded-lg p-3 mb-6 text-xs text-amber-900 leading-relaxed">
            <strong>Legal status: </strong>
            {frontmatter.legalNote}
          </div>
        )}

        <VendorList vendorsByCountry={vendorsByCountry} countries={countries} />

        <div className="mt-6 text-xs text-gray-400">
          <Link href={`/peptides/${params.slug}`} className="hover:text-gray-700">
            ← Full {frontmatter.name} reference
          </Link>
        </div>

        {!hasAny && (
          <p className="text-xs text-gray-400 mt-4">
            This page is reachable so you can bookmark it; vendor entries are added as research is verified.
          </p>
        )}
      </div>
    </DisclaimerGate>
  )
}
