'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { products } from '@/lib/products'
import { formatNaira } from '@/lib/site'
import { cn } from '@/lib/utils'

const SLIDE_IDS = ['salmon-001', 'crab-king-001', 'shrimp-large-001', 'oyster-001']
const slides = SLIDE_IDS.flatMap((id) => products.filter((p) => p.id === id))
const INTERVAL_MS = 5500

export function Hero() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const touchStart = useRef<{ x: number; y: number } | null>(null)
  const count = slides.length
  const active = slides[index]

  const goTo = useCallback((i: number) => setIndex(((i % count) + count) % count), [count])

  useEffect(() => {
    if (paused || count <= 1) return
    const timer = setInterval(() => setIndex((current) => (current + 1) % count), INTERVAL_MS)
    return () => clearInterval(timer)
  }, [paused, count, index])

  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
    setPaused(true)
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchStart.current
    touchStart.current = null
    setPaused(false)
    if (!start) return
    const dx = e.changedTouches[0].clientX - start.x
    const dy = e.changedTouches[0].clientY - start.y
    // Horizontal swipes only; vertical drags are page scrolls.
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) goTo(index + (dx < 0 ? 1 : -1))
  }

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured seafood"
      className="group relative overflow-hidden bg-primary text-white lg:grid lg:min-h-[min(calc(100svh-116px),780px)] lg:grid-cols-2"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Media — full-bleed background on phones, right half on desktop */}
      <div className="absolute inset-0 lg:relative lg:order-2">
        {slides.map((slide, i) => (
          <Image
            key={slide.id}
            src={slide.image}
            alt={i === index ? slide.name : ''}
            aria-hidden={i !== index}
            fill
            priority={i === 0}
            sizes="(max-width: 1024px) 100vw, 50vw"
            className={cn(
              'object-cover transition-[opacity,transform] duration-1000 ease-out',
              i === index ? 'scale-100 opacity-100' : 'scale-105 opacity-0',
            )}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/60 to-primary/20 lg:hidden" />
        <div className="absolute inset-0 hidden bg-black/5 lg:block" />

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => goTo(index - 1)}
              aria-label="Previous slide"
              className="absolute left-4 top-1/2 hidden size-11 -translate-y-1/2 items-center justify-center bg-white/15 text-white opacity-0 backdrop-blur transition duration-300 hover:bg-white/25 focus-visible:opacity-100 group-hover:opacity-100 lg:flex"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={() => goTo(index + 1)}
              aria-label="Next slide"
              className="absolute right-4 top-1/2 hidden size-11 -translate-y-1/2 items-center justify-center bg-white/15 text-white opacity-0 backdrop-blur transition duration-300 hover:bg-white/25 focus-visible:opacity-100 group-hover:opacity-100 lg:flex"
            >
              <ChevronRight size={20} />
            </button>

            {/* Slide caption → links to the product (desktop) */}
            <Link
              href={`/products/${active.id}`}
              className="absolute bottom-6 left-6 hidden items-center gap-3 bg-white/95 px-4 py-3 text-primary shadow-sm backdrop-blur transition hover:bg-white lg:flex"
            >
              <span className="text-[11px] font-semibold tabular-nums tracking-[0.2em] text-neutral/45">
                {String(index + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
              </span>
              <span className="h-4 w-px bg-neutral/15" />
              <span className="text-sm font-semibold">{active.name}</span>
              <span className="text-sm text-neutral/60">{formatNaira(active.price)}</span>
              <ArrowRight size={14} />
            </Link>
          </>
        )}
      </div>

      {/* Copy */}
      <div className="relative z-10 flex min-h-[min(calc(100svh-100px),720px)] flex-col justify-end px-5 pb-16 pt-40 sm:px-8 sm:pb-20 lg:min-h-0 lg:justify-center lg:py-20 lg:pl-8 lg:pr-16">
        <div className="w-full max-w-xl lg:ml-auto">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
            Premium quality seafood
          </p>
          <h1 className="text-[2.75rem] font-bold uppercase leading-[0.95] tracking-tight sm:text-6xl xl:text-7xl">
            The ocean&rsquo;s finest, delivered.
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-white/75 sm:text-lg">
            Fish, shrimp, crab and shellfish — sustainably sourced and delivered fresh to your door.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 bg-white px-8 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-primary transition hover:bg-white/90"
            >
              Shop now
              <ArrowRight size={16} />
            </Link>
            <Link
              href="#how-it-works"
              className="inline-flex items-center justify-center border border-white/40 px-8 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-white/10"
            >
              How to order
            </Link>
          </div>

          {count > 1 && (
            <div className="mt-10 flex items-center gap-2 lg:mt-14">
              {slides.map((slide, i) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Show ${slide.name}`}
                  aria-current={i === index}
                  className="flex h-6 items-center"
                >
                  <span
                    className={cn(
                      'block h-1.5 rounded-full transition-all duration-300',
                      i === index ? 'w-6 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/70',
                    )}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
