'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown, ChevronRight, Minus, Plus, Share2 } from 'lucide-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import { Price } from '@/components/price'
import { MAX_QUANTITY, useCart } from '@/lib/cart-context'
import { categoryHref, Product } from '@/lib/products'
import { formatNaira, openWhatsApp } from '@/lib/site'

const sectionLabel = 'mb-3 block text-sm font-semibold uppercase tracking-[0.16em] text-neutral'

export function ProductDetail({ product }: { product: Product }) {
  const { addItem, openCart } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [justAdded, setJustAdded] = useState(false)
  const [shareState, setShareState] = useState<'idle' | 'copied'>('idle')
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  const handleAddToCart = () => {
    addItem(product, quantity)
    setJustAdded(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setJustAdded(false), 4000)
  }

  const handleOrderNow = () => {
    openWhatsApp(
      [
        'Hello Lumie’s Foods, I would like to order:',
        '',
        `• ${product.name} (${product.weight}) — ${quantity} x ${formatNaira(product.price)}`,
        `Total: ${formatNaira(product.price * quantity)}`,
        '',
        'Please confirm availability, delivery fee, and payment instructions.',
      ].join('\n'),
    )
  }

  // Native share sheet on iOS/Android; copy-link fallback on desktop.
  const handleShare = async () => {
    const url = window.location.href
    try {
      if (navigator.share) {
        await navigator.share({ title: product.name, text: product.description, url })
        return
      }
      await navigator.clipboard.writeText(url)
      setShareState('copied')
      setTimeout(() => setShareState('idle'), 2000)
    } catch {
      // Share sheet dismissed — nothing to do.
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 md:pt-10 lg:px-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-xs text-neutral/55 md:mb-8">
        <Link href="/" className="transition hover:text-primary">Home</Link>
        <ChevronRight size={12} className="text-neutral/30" />
        <Link href="/products" className="transition hover:text-primary">Shop</Link>
        <ChevronRight size={12} className="text-neutral/30" />
        <Link href={categoryHref(product.category)} className="transition hover:text-primary">{product.category}</Link>
        <ChevronRight size={12} className="hidden text-neutral/30 sm:block" />
        <span className="hidden truncate text-neutral sm:block" aria-current="page">{product.name}</span>
      </nav>

      <div className="grid gap-8 md:grid-cols-2 md:gap-10 lg:gap-16">
        {/* Gallery */}
        <div className="md:sticky md:top-32 md:self-start">
          <div className="product-photo relative aspect-[4/5] overflow-hidden bg-tertiary">
            <Image src={product.image} alt={product.name} fill priority sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
          </div>
        </div>

        {/* Info */}
        <div className="space-y-7">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-neutral/50">{product.category}</p>
            <h1 className="text-3xl font-bold leading-tight text-neutral md:text-4xl">{product.name}</h1>
            <div className="mt-5 flex flex-wrap items-center gap-4">
              <Price value={product.price} size="lg" />
              <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                {product.weight}
              </span>
            </div>
          </div>

          <p className="max-w-xl leading-relaxed text-neutral/70">{product.description}</p>

          <dl className="grid grid-cols-2 border border-neutral/10">
            <div className="border-r border-neutral/10 p-4">
              <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral/45">Weight</dt>
              <dd className="mt-1 text-sm font-semibold text-neutral">{product.weight}</dd>
            </div>
            <div className="p-4">
              <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral/45">Origin</dt>
              <dd className="mt-1 text-sm font-semibold text-neutral">{product.origin}</dd>
            </div>
          </dl>

          <div>
            <span className={sectionLabel}>Quantity</span>
            <div className="inline-flex items-center border border-neutral/15">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
                className="flex size-12 items-center justify-center text-neutral transition hover:text-primary disabled:opacity-30"
              >
                <Minus size={16} />
              </button>
              <span className="w-12 text-center text-sm font-semibold tabular-nums text-neutral" aria-live="polite">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(MAX_QUANTITY, q + 1))}
                disabled={quantity >= MAX_QUANTITY}
                aria-label="Increase quantity"
                className="flex size-12 items-center justify-center text-neutral transition hover:text-primary disabled:opacity-30"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="w-full bg-primary py-4 text-sm font-semibold uppercase tracking-[0.18em] text-white shadow-lg shadow-primary/20 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {!product.inStock ? 'Sold out' : justAdded ? 'Added to bag' : `Add to bag · ${formatNaira(product.price * quantity)}`}
            </button>
            {justAdded && (
              <p className="flex flex-wrap items-center gap-1.5 text-sm font-medium text-primary" role="status">
                <Check size={15} />
                {quantity} × {product.name} added to your bag.
                <button onClick={openCart} className="underline underline-offset-4 hover:opacity-70">
                  View bag
                </button>
              </p>
            )}

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleOrderNow}
                disabled={!product.inStock}
                className="flex items-center justify-center gap-2 border border-neutral/15 py-3 text-sm text-neutral transition hover:bg-neutral/5 disabled:opacity-40"
              >
                <FontAwesomeIcon icon={faWhatsapp} className="size-4" />
                Order now
              </button>
              <button
                onClick={handleShare}
                className="flex items-center justify-center gap-2 border border-neutral/15 py-3 text-sm text-neutral transition hover:bg-neutral/5"
              >
                <Share2 size={16} />
                {shareState === 'copied' ? 'Link copied!' : 'Share'}
              </button>
            </div>
          </div>

          <div className="space-y-3 border-t border-neutral/10 pt-5">
            <details open className="group border border-neutral/10 bg-white px-4 py-3">
              <summary className="flex list-none items-center justify-between gap-3 py-1 text-sm font-semibold uppercase tracking-[0.16em] text-neutral [&::-webkit-details-marker]:hidden">
                Product details
                <ChevronDown size={16} className="transition group-open:rotate-180" />
              </summary>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-neutral/70">
                <li>{product.description}</li>
                <li>Pack size: {product.weight}</li>
                <li>Origin: {product.origin}</li>
              </ul>
            </details>
            <details className="group border border-neutral/10 bg-white px-4 py-3">
              <summary className="flex list-none items-center justify-between gap-3 py-1 text-sm font-semibold uppercase tracking-[0.16em] text-neutral [&::-webkit-details-marker]:hidden">
                Delivery &amp; ordering
                <ChevronDown size={16} className="transition group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-sm leading-6 text-neutral/70">
                Checkout opens WhatsApp with your order pre-filled. Our team confirms availability, the
                delivery fee and payment with you, then delivers with proper cold-chain handling so your
                seafood arrives fresh.
              </p>
            </details>
          </div>

          <div className="flex items-center gap-3 text-sm text-neutral/60">
            <span className={`inline-flex size-2 rounded-full ${product.inStock ? 'bg-emerald-500' : 'bg-neutral/30'}`} />
            {product.inStock ? 'In stock — ready to order' : 'Out of stock'}
          </div>
        </div>
      </div>
    </div>
  )
}
