import Link from 'next/link'
import { ChevronRight, Globe2 } from 'lucide-react'
import { getAllPeptides } from '@/lib/peptides'
import { getMarketplace, getVendorCountForPeptide } from '@/lib/marketplace'
import DisclaimerGate from '@/components/marketplace/DisclaimerGate'

export const metadata = {
  title: 'Marketplace — PeptideDB',
  description:
    'Informational directory of pharmacies, distributors, and research suppliers that list peptides referenced in this database. Not medical advice; not an endorsement.',
}

export default function MarketplacePage() {
  const peptides = getAllPeptides()
  const marketplace = getMarketplace()
  const peptidesWithVendors = peptides
    .map(p => ({ ...p, vendorCount: getVendorCountForPeptide(p.slug) }))
    .filter(p => p.vendorCount > 0)
    .sort((a, b) => b.vendorCount - a.vendorCount)

  return (
    <DisclaimerGate>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Marketplace</h1>
          <p className="text-sm text-gray-500 mt-1">
            Informational vendor directory across {marketplace.countries.length} jurisdictions ·{' '}
            {peptidesWithVendors.length} peptides covered · not medical advice
          </p>
        </div>

        <div className="border border-amber-200 bg-amber-50 rounded-lg p-4 mb-6 text-sm text-amber-900">
          <p>
            <strong>Coverage is in progress.</strong> Only peptides with verified vendor listings appear
            below. Vendor links are categorised{' '}
            <span className="font-semibold">Pharmacy</span>,{' '}
            <span className="font-semibold">Distributor</span>, or{' '}
            <span className="font-semibold">Research supplier</span>. Legality and shipping vary by
            country — verify locally before acting.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-6 text-xs text-gray-600">
          <Globe2 size={14} className="text-gray-400" />
          {marketplace.countries.map(c => (
            <span key={c.code} className="inline-flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded">
              <span>{c.flag}</span> {c.name}
            </span>
          ))}
        </div>

        {peptidesWithVendors.length === 0 ? (
          <div className="border border-gray-200 rounded-lg p-12 text-center bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">No vendor data yet</h2>
            <p className="text-sm text-gray-500">
              Marketplace coverage is being populated in batches.{' '}
              <Link href="/peptides" className="text-blue-700 hover:underline">
                Browse the database
              </Link>{' '}
              in the meantime.
            </p>
          </div>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {peptidesWithVendors.map(p => (
              <li key={p.slug}>
                <Link
                  href={`/marketplace/${p.slug}`}
                  className="block border border-gray-200 rounded-lg p-4 hover:border-gray-400 transition-colors group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                        {p.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{p.summary}</p>
                    </div>
                    <ChevronRight size={18} className="text-gray-300 group-hover:text-gray-500 transition-colors shrink-0" />
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    {p.vendorCount} vendor{p.vendorCount === 1 ? '' : 's'} logged
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </DisclaimerGate>
  )
}
