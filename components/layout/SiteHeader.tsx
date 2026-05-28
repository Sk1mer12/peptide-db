import Link from 'next/link'
import { FlaskConical } from 'lucide-react'

export default function SiteHeader() {
  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold text-gray-900">
          <FlaskConical size={20} className="text-blue-600" />
          PeptideDB
        </Link>
        <nav className="flex items-center gap-6 text-sm text-gray-600">
          <Link href="/peptides" className="hover:text-gray-900 transition-colors">
            Database
          </Link>
          <Link href="/marketplace" className="hover:text-gray-900 transition-colors">
            Marketplace
          </Link>
          <Link href="/news" className="hover:text-gray-900 transition-colors">
            News
          </Link>
          <Link href="/api-docs" className="hover:text-gray-900 transition-colors">
            API
          </Link>
        </nav>
      </div>
    </header>
  )
}
