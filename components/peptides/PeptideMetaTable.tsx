import { CheckCircle, XCircle } from 'lucide-react'
import type { PeptideFrontmatter } from '@/types'
import RatingBar from './RatingBar'

interface Props {
  peptide: PeptideFrontmatter
}

function BoolCell({ value }: { value: boolean }) {
  return value ? (
    <CheckCircle size={16} className="text-green-600" />
  ) : (
    <XCircle size={16} className="text-red-400" />
  )
}

export default function PeptideMetaTable({ peptide }: Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Classification</h2>
        <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
          <tbody>
            <tr className="border-b border-gray-100">
              <td className="px-3 py-2 bg-gray-50 font-medium text-gray-600 w-1/2">Status</td>
              <td className="px-3 py-2">{peptide.status}</td>
            </tr>
            <tr className="border-b border-gray-100">
              <td className="px-3 py-2 bg-gray-50 font-medium text-gray-600">Producer</td>
              <td className="px-3 py-2">{peptide.producer || '—'}</td>
            </tr>
            {peptide.brands.length > 0 && (
              <tr className="border-b border-gray-100">
                <td className="px-3 py-2 bg-gray-50 font-medium text-gray-600">Brand names</td>
                <td className="px-3 py-2">{peptide.brands.join(', ')}</td>
              </tr>
            )}
            <tr className="border-b border-gray-100">
              <td className="px-3 py-2 bg-gray-50 font-medium text-gray-600">Requires Rx</td>
              <td className="px-3 py-2"><BoolCell value={peptide.requiresRx} /></td>
            </tr>
            <tr className="border-b border-gray-100">
              <td className="px-3 py-2 bg-gray-50 font-medium text-gray-600">Buyable</td>
              <td className="px-3 py-2"><BoolCell value={peptide.buyable} /></td>
            </tr>
            <tr>
              <td className="px-3 py-2 bg-gray-50 font-medium text-gray-600">Sports ban</td>
              <td className="px-3 py-2"><BoolCell value={peptide.sportsBan} /></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Pharmacology</h2>
        <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
          <tbody>
            {peptide.route && (
              <tr className="border-b border-gray-100">
                <td className="px-3 py-2 bg-gray-50 font-medium text-gray-600 w-1/2">Route</td>
                <td className="px-3 py-2">{peptide.route}</td>
              </tr>
            )}
            {peptide.dosage && (
              <tr className="border-b border-gray-100">
                <td className="px-3 py-2 bg-gray-50 font-medium text-gray-600">Typical dosage</td>
                <td className="px-3 py-2 font-mono text-xs leading-relaxed">{peptide.dosage}</td>
              </tr>
            )}
            {peptide.halfLife && (
              <tr className="border-b border-gray-100">
                <td className="px-3 py-2 bg-gray-50 font-medium text-gray-600">Half-life</td>
                <td className="px-3 py-2 font-mono">{peptide.halfLife}</td>
              </tr>
            )}
            {peptide.molecularWeight && (
              <tr className="border-b border-gray-100">
                <td className="px-3 py-2 bg-gray-50 font-medium text-gray-600">Molecular weight</td>
                <td className="px-3 py-2 font-mono">{peptide.molecularWeight}</td>
              </tr>
            )}
            {peptide.purpose.length > 0 && (
              <tr>
                <td className="px-3 py-2 bg-gray-50 font-medium text-gray-600 align-top">Purposes</td>
                <td className="px-3 py-2">
                  <div className="flex flex-wrap gap-1">
                    {peptide.purpose.map(p => (
                      <span key={p} className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{p}</span>
                    ))}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {peptide.sideEffects && peptide.sideEffects.length > 0 && (
        <div className="lg:col-span-2">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Known Side Effects</h2>
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1.5">
              {peptide.sideEffects.map(effect => (
                <li key={effect} className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="text-gray-400 shrink-0 mt-1">·</span>
                  {effect}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="lg:col-span-2">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Ratings</h2>
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 flex flex-col gap-3">
          <RatingBar label="Safety" value={peptide.safetyRating} variant="safety" />
          <RatingBar label="Performance" value={peptide.performanceRating} variant="performance" />
          <p className="text-xs text-gray-400 mt-1">
            Safety: 5 = excellent profile, 1 = significant known risks. Performance: 5 = strong evidence base, 1 = minimal/preclinical only.
          </p>
        </div>
      </div>

      {peptide.legalNote && (
        <div className="lg:col-span-2">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Legal Note</h2>
          <p className="text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
            {peptide.legalNote}
          </p>
        </div>
      )}

      {peptide.sources && peptide.sources.length > 0 && (
        <div className="lg:col-span-2">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Sources</h2>
          <ol className="border border-gray-200 rounded-lg divide-y divide-gray-100 overflow-hidden">
            {peptide.sources.map((src, i) => (
              <li key={i} className="flex items-start gap-3 px-4 py-2.5 bg-white text-sm text-gray-700">
                <span className="text-gray-400 font-mono text-xs mt-0.5 shrink-0 w-5 text-right">{i + 1}.</span>
                <a
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="leading-relaxed text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                >
                  {src.label}
                </a>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  )
}
