'use client'

import { useEffect, useState } from 'react'
import { AlertTriangle } from 'lucide-react'

const STORAGE_KEY = 'peptidedb-marketplace-disclaimer-v1'

export default function DisclaimerGate({ children }: { children: React.ReactNode }) {
  const [accepted, setAccepted] = useState<boolean | null>(null)

  useEffect(() => {
    setAccepted(typeof window !== 'undefined' && window.localStorage.getItem(STORAGE_KEY) === '1')
  }, [])

  if (accepted === null) {
    return <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 text-sm text-gray-400">Loading…</div>
  }

  if (!accepted) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        <div className="border border-amber-200 bg-amber-50 rounded-lg p-6">
          <div className="flex items-start gap-3 mb-4">
            <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={22} />
            <h1 className="text-xl font-bold text-amber-900">Marketplace — Read this first</h1>
          </div>
          <div className="space-y-3 text-sm text-amber-900 leading-relaxed">
            <p>
              This Marketplace is an <strong>informational directory</strong> of suppliers that list peptides
              referenced in this database. It is <strong>not</strong> medical advice, a prescription service,
              an endorsement, or a recommendation to purchase any compound.
            </p>
            <p>
              Many peptides in this database are <strong>research-use only</strong>, <strong>not approved for
              human use</strong>, <strong>WADA-prohibited</strong>, or otherwise legally restricted in your
              jurisdiction. The legal status of buying, importing, possessing, or using these compounds is
              <strong> your responsibility</strong> to verify under your local law.
            </p>
            <p>
              Vendor links are categorised as <em>Pharmacy</em>, <em>Distributor</em>, or
              <em> Research supplier</em>. Research suppliers ship compounds explicitly labelled
              &ldquo;not for human consumption&rdquo; — they are listed for completeness and transparency, not
              as a route to self-administration.
            </p>
            <p>
              We do <strong>not</strong> verify vendor quality, product purity, shipping legality, or
              regulatory status. Links may break, vendors may change inventory, and laws change.
            </p>
            <p className="font-semibold pt-2">
              By continuing, you confirm you are an adult, you understand the above, and you accept full
              responsibility for any action you take based on this information.
            </p>
          </div>
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => {
                window.localStorage.setItem(STORAGE_KEY, '1')
                setAccepted(true)
              }}
              className="px-4 py-2 bg-amber-900 text-white rounded font-medium hover:bg-amber-800 transition-colors"
            >
              I understand — continue
            </button>
            <a
              href="/peptides"
              className="px-4 py-2 border border-amber-300 text-amber-900 rounded font-medium hover:bg-amber-100 transition-colors"
            >
              Take me back
            </a>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
