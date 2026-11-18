import { cn } from '@/lib/utils'

/**
 * The LUMI FOODS lockup: square monogram + stacked, letter-spaced wordmark
 * (same construction as the TOYMAK / FASHION lockup).
 * `tone="light"` is the white version for dark backgrounds.
 */
export function Logo({ tone = 'dark', className }: { tone?: 'dark' | 'light'; className?: string }) {
  const light = tone === 'light'
  return (
    <span className={cn('inline-flex items-center gap-2.5', light ? 'text-white' : 'text-primary', className)}>
      <span
        aria-hidden
        className={cn('relative block size-9 shrink-0 sm:size-10', light ? 'bg-white' : 'bg-primary')}
      >
        <span className={cn('absolute left-[34%] top-[25%] h-1/2 w-[13%]', light ? 'bg-primary' : 'bg-white')} />
        <span className={cn('absolute left-[34%] top-[62%] h-[13%] w-[35%]', light ? 'bg-primary' : 'bg-white')} />
      </span>
      <span aria-hidden className="flex flex-col leading-none">
        <span className="text-[1.3rem] font-bold tracking-[0.2em] sm:text-[1.45rem]">LUMI</span>
        <span className="mt-1 text-[0.55rem] font-medium tracking-[0.62em] opacity-80 sm:text-[0.6rem]">FOODS</span>
      </span>
      <span className="sr-only">LumiFoods</span>
    </span>
  )
}
