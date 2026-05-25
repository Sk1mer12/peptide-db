import type { Metadata } from 'next'
import './globals.css'
import SiteHeader from '@/components/layout/SiteHeader'
import SiteFooter from '@/components/layout/SiteFooter'
import { CompareProvider } from '@/hooks/useCompare'
import CompareTray from '@/components/compare/CompareTray'
import { getAllPeptides } from '@/lib/peptides'

export const metadata: Metadata = {
  title: 'PeptideDB — Peptide Reference Database',
  description:
    'Comprehensive educational reference database for peptides: approved drugs, investigational compounds, and research peptides.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const allPeptides = getAllPeptides()
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <CompareProvider>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
          <CompareTray allPeptides={allPeptides} />
        </CompareProvider>
      </body>
    </html>
  )
}
