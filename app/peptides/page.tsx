import { getAllPeptides, getAllPurposes } from '@/lib/peptides'
import PeptideGrid from '@/components/peptides/PeptideGrid'

export const metadata = {
  title: 'Peptide Database — PeptideDB',
  description: 'Browse all peptides: approved pharmaceuticals, investigational compounds, and research chemicals.',
}

export default function PeptidesPage() {
  const peptides = getAllPeptides()
  const allPurposes = getAllPurposes(peptides)
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Peptide Database</h1>
        <p className="text-sm text-gray-500 mt-1">
          {peptides.length} compounds · for educational and research reference only
        </p>
      </div>
      <PeptideGrid peptides={peptides} allPurposes={allPurposes} />
    </div>
  )
}
