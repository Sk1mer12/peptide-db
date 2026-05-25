interface Props {
  label: string
  value: number
  max?: number
  variant?: 'safety' | 'performance'
}

const safetyColor = (value: number) => {
  if (value >= 4) return 'bg-green-500'
  if (value >= 3) return 'bg-amber-400'
  return 'bg-red-400'
}

const performanceColor = () => 'bg-blue-500'

export default function RatingBar({ label, value, max = 5, variant = 'safety' }: Props) {
  const filled = Math.min(Math.max(Math.round(value), 0), max)
  const color = variant === 'safety' ? safetyColor(filled) : performanceColor()

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-500 w-20 shrink-0">{label}</span>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: max }).map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full border ${
              i < filled
                ? `${color} border-transparent`
                : 'bg-white border-gray-300'
            }`}
          />
        ))}
      </div>
      <span className="text-xs text-gray-400 font-mono">{filled}/{max}</span>
    </div>
  )
}
