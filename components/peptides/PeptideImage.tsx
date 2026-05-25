'use client'

import { useState } from 'react'
import Image from 'next/image'
import { FlaskConical } from 'lucide-react'

interface Props {
  name: string
  pubchemCid?: number
  size?: 'sm' | 'lg'
}

export default function PeptideImage({ name, pubchemCid, size = 'sm' }: Props) {
  const [failed, setFailed] = useState(false)

  const src = pubchemCid
    ? `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${pubchemCid}/PNG`
    : `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(name)}/PNG`

  const dim = size === 'lg' ? 240 : 96

  if (failed) {
    return (
      <div
        style={{ width: dim, height: dim }}
        className="flex items-center justify-center bg-gray-50 rounded-lg border border-gray-100 shrink-0"
      >
        <FlaskConical size={size === 'lg' ? 40 : 24} className="text-gray-300" />
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
