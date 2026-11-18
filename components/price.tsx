import { cn } from '@/lib/utils'
import { formatAmount, formatNaira } from '@/lib/site'

const SIZES = {
  // Product page.
  lg: { symbol: 'text-xl md:text-2xl', whole: 'text-4xl md:text-5xl' },
  // Cards and lists.
  sm: { symbol: 'text-xs sm:text-sm', whole: 'text-base sm:text-lg' },
}

/** "₦9,750" with a smaller currency symbol, Toymak price style. */
export function Price({
  value,
  size = 'sm',
  className,
}: {
  value: number
  size?: keyof typeof SIZES
  className?: string
}) {
  const s = SIZES[size]
  return (
    <p className={cn('flex items-baseline font-bold leading-none text-neutral', className)}>
      <span className="sr-only">{formatNaira(value)}</span>
      <span aria-hidden className={cn('mr-0.5', s.symbol)}>₦</span>
      <span aria-hidden className={cn('tracking-tight', s.whole)}>{formatAmount(value)}</span>
    </p>
  )
}
