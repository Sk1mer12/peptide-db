import type { PeptideFrontmatter } from '@/types'
import PeptideBadge from './PeptideBadge'
import CompareToggleButton from '@/components/compare/CompareToggleButton'
import PeptideImage from './PeptideImage'

interface Props {
  peptide: PeptideFrontmatter
}

export default function PeptideDetailHeader({ peptide }: Props) {
  return (
    <div className="border-b border-gray-200 pb-6 mb-6">
      <div className="flex gap-6 items-start flex-wrap">
        <PeptideImage
          name={peptide.name}
          pubchemCid={peptide.pubchemCid}
          sequence={peptide.sequence}
          molecularWeight={peptide.molecularWeight}
          size="lg"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 flex-wrap mb-2">
            <div>
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h1 className="text-3xl font-bold text-gray-900">{peptide.name}</h1>
                <PeptideBadge category={peptide.category} />
              </div>
              {peptide.aliases.length > 0 && (
                <p className="text-gray-500 text-sm">
                  Also known as: {peptide.aliases.join(', ')}
                </p>
              )}
            </div>
            <CompareToggleButton slug={peptide.slug} />
          </div>
          {peptide.summary && (
            <p className="text-gray-700 text-base leading-relaxed max-w-3xl">{peptide.summary}</p>
          )}
        </div>
      </div>
    </div>
  )
}
