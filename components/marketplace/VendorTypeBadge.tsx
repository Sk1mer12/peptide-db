import type { VendorType } from '@/types'

const STYLES: Record<VendorType, { label: string; classes: string }> = {
  pharmacy: { label: 'Pharmacy', classes: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  distributor: { label: 'Distributor', classes: 'bg-blue-50 text-blue-700 border-blue-200' },
  research: { label: 'Research supplier', classes: 'bg-amber-50 text-amber-700 border-amber-200' },
}

export default function VendorTypeBadge({ type }: { type: VendorType }) {
  const s = STYLES[type]
  return (
    <span className={`inline-block text-[10px] font-semibold uppercase tracking-wide border px-1.5 py-0.5 rounded ${s.classes}`}>
      {s.label}
    </span>
  )
}
