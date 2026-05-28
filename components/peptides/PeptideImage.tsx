'use client'

import { useState } from 'react'
import Image from 'next/image'
import { FlaskConical } from 'lucide-react'

interface Props {
  name: string
  pubchemCid?: number
  sequence?: string
  molecularWeight?: string
  size?: 'sm' | 'lg'
}

export default function PeptideImage({ name, pubchemCid, sequence, molecularWeight, size = 'sm' }: Props) {
  const [failed, setFailed] = useState(false)

  const src = pubchemCid
    ? `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${pubchemCid}/PNG`
    : `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(name)}/PNG`

  const dim = size === 'lg' ? 240 : 96

  if (failed) {
    if (size === 'lg') {
      return (
        <div
          style={{ width: dim, height: dim }}
          className="relative flex flex-col bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-200 shrink-0 overflow-hidden"
        >
          <FlaskConical
            size={56}
            className="text-gray-100 absolute -top-2 -right-2"
          />
          <div className="relative z-10 flex flex-col justify-center h-full px-3 py-2 text-center">
            {sequence ? (
              <>
                <p className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider mb-1">Sequence</p>
                <p className="font-mono text-[11px] text-gray-700 leading-snug break-all">{sequence}</p>
              </>
            ) : (
              <>
                <p className="font-semibold text-xs text-gray-700 leading-tight mb-1">{name}</p>
                {molecularWeight && (
                  <p className="text-[11px] text-gray-500 leading-snug">{molecularWeight}</p>
                )}
                <p className="text-[9px] text-gray-400 uppercase tracking-wider mt-2">2D structure unavailable</p>
              </>
            )}
          </div>
        </div>
      )
    }

    return (
      <div
        style={{ width: dim, height: dim }}
        className="relative flex flex-col items-center justify-center bg-gray-50 rounded-lg border border-gray-100 shrink-0 overflow-hidden"
      >
        <FlaskConical size={24} className="text-gray-300" />
        {molecularWeight && (
          <p className="text-[8px] text-gray-400 mt-1 px-1 text-center leading-tight line-clamp-1">{molecularWeight}</p>
        )}
      </div>
    )
  }

  return (
    <div
      style={{ width: dim, height: dim }}
      className="relative bg-white rounded-lg border border-gray-100 shrink-0 overflow-hidden"
    >
      <Image
        src={src}
        alt={`${name} molecular structure`}
        fill
        className="object-contain p-1"
        onError={() => setFailed(true)}
        unoptimized
      />
    </div>
  )
}
