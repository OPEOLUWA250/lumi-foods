'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { Check, Plus } from 'lucide-react'
import { Price } from '@/components/price'
import { useCart } from '@/lib/cart-context'
import { Product } from '@/lib/products'
import { cn } from '@/lib/utils'

interface ProductCardProps {
  product: Product
  priority?: boolean
}

export function ProductCard({ product, priority }: ProductCardProps) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const href = `/products/${product.id}`

  useEffect(() => () => clearTimeout(timer.current), [])

  const handleQuickAdd = () => {
    addItem(product, 1)
    setAdded(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setAdded(false), 1600)
  }

  return (
    <article className="group relative">
      <Link href={href} className="block">
        <div className="product-photo relative mb-3 aspect-[4/5] overflow-hidden bg-tertiary sm:mb-4">
          <Image
            src={product.image}
            alt={product.name}
            fill
            priority={priority}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />

          <div className="absolute left-2 top-2 flex flex-col items-start gap-1 sm:left-3 sm:top-3">
            <span className="rounded-full border border-neutral/10 bg-white/90 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-neutral backdrop-blur sm:px-2.5 sm:py-1 sm:text-[10px] sm:tracking-[0.14em]">
              {product.category}
            </span>
            {!product.inStock && (
              <span className="rounded-full bg-neutral-400 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-white sm:px-2.5 sm:py-1 sm:text-[10px]">
                Sold out
              </span>
            )}
          </div>

          {/* Hover reveal — only on devices that can actually hover */}
          <div className="absolute inset-x-3 bottom-3 hidden translate-y-2 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 [@media(hover:hover)]:sm:block">
            <span className="block bg-white/95 py-2.5 text-center text-xs font-semibold uppercase tracking-[0.14em] text-neutral shadow-sm backdrop-blur">
              View product
            </span>
          </div>
        </div>

        <h3 className="line-clamp-2 text-sm font-bold leading-snug text-neutral transition group-hover:text-primary sm:text-base">
          {product.name}
        </h3>
        <p className="mt-1 line-clamp-1 text-xs text-neutral/55 sm:text-sm">{product.description}</p>
      </Link>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-x-2 gap-y-1.5 sm:mt-3">
        <Price value={product.price} />
        <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-neutral/45 sm:text-xs">
          {product.weight}
        </span>
      </div>

      <button
        type="button"
        onClick={handleQuickAdd}
        disabled={!product.inStock}
        aria-label={added ? `${product.name} added to bag` : `Add ${product.name} to bag`}
        className={cn(
          'absolute right-2 top-2 flex size-9 items-center justify-center shadow-sm backdrop-blur transition sm:right-3 sm:top-3 sm:size-10',
          'before:absolute before:-inset-1 before:content-[""] disabled:cursor-not-allowed disabled:opacity-40',
          added ? 'border border-primary bg-primary text-white' : 'border border-neutral/10 bg-white/90 text-neutral hover:border-primary hover:bg-primary hover:text-white',
        )}
      >
        {added ? <Check size={16} /> : <Plus size={18} />}
      </button>
      <span className="sr-only" aria-live="polite">
        {added ? `${product.name} added to your bag` : ''}
      </span>
    </article>
  )
}
