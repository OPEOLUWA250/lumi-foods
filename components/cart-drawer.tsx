'use client'

import Image from 'next/image'
import Link from 'next/link'
import { FormEvent, useEffect, useRef, useState } from 'react'
import { ArrowRight, Minus, Plus, ShoppingBag, X } from 'lucide-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import { MAX_QUANTITY, useCart } from '@/lib/cart-context'
import { formatNaira, openWhatsApp } from '@/lib/site'
import { cn } from '@/lib/utils'

const fieldLabel = 'mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-neutral'
const fieldInput =
  'w-full border border-neutral/15 bg-white px-4 py-3 text-sm text-neutral outline-none transition placeholder:text-neutral/40 focus:border-primary'

export function CartDrawer() {
  const { items, removeItem, updateQuantity, cartTotal, cartCount, clearCart, isOpen, closeCart } = useCart()
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [orderNote, setOrderNote] = useState('')
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  // Scroll lock, Escape to close (the checkout dialog first), focus on open.
  useEffect(() => {
    if (!isOpen) return
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      if (checkoutOpen) setCheckoutOpen(false)
      else closeCart()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = original
      document.removeEventListener('keydown', onKey)
    }
  }, [isOpen, checkoutOpen, closeCart])

  const handleCheckout = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const itemsList = items
      .map((item) => `• ${item.name} — ${item.quantity} x ${formatNaira(item.price)}`)
      .join('\n')
    const message = [
      'Hello LumiFoods, I would like to place an order.',
      '',
      `Name: ${customerName.trim()}`,
      `Phone: ${customerPhone.trim()}`,
      `Delivery address: ${deliveryAddress.trim()}`,
      '',
      'Order:',
      itemsList,
      `Total: ${formatNaira(cartTotal)}`,
      orderNote.trim() ? `Note: ${orderNote.trim()}` : '',
      '',
      'Please confirm availability, delivery fee, and payment instructions.',
    ]
      .filter(Boolean)
      .join('\n')
    openWhatsApp(message)
    clearCart()
    setCheckoutOpen(false)
    closeCart()
  }

  return (
    <>
      {/* Overlay */}
      <div
        aria-hidden
        onClick={closeCart}
        className={cn(
          'fixed inset-0 z-50 bg-black/40 transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      />

      {/* Drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping bag"
        inert={!isOpen}
        className={cn(
          'fixed inset-y-0 right-0 z-50 flex h-dvh w-full flex-col bg-white transition-[transform,visibility] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] sm:w-[26rem]',
          isOpen ? 'visible translate-x-0 shadow-2xl' : 'invisible translate-x-full',
        )}
      >
        <div className="flex items-center justify-between border-b border-neutral/10 px-5 py-4 sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral/50">Your order</p>
            <h2 className="mt-1 text-xl font-bold text-neutral">
              Bag {cartCount > 0 && <span className="font-normal text-neutral/50">({cartCount})</span>}
            </h2>
          </div>
          <button
            ref={closeButtonRef}
            onClick={closeCart}
            className="flex size-10 items-center justify-center text-neutral transition hover:bg-neutral/5"
            aria-label="Close bag"
          >
            <X size={20} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <div className="mb-5 flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <ShoppingBag size={22} />
            </div>
            <p className="text-lg font-bold text-neutral">Your bag is empty</p>
            <p className="mt-2 max-w-xs text-sm text-neutral/60">
              Premium fish, shrimp, crab and shellfish are a tap away.
            </p>
            <Link
              href="/products"
              onClick={closeCart}
              className="mt-6 inline-flex items-center gap-2 bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:opacity-90"
            >
              Start shopping
              <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-neutral/10 overflow-y-auto overscroll-contain px-5 sm:px-6">
              {items.map((item) => (
                <li key={item.id} className="flex gap-4 py-5">
                  <Link
                    href={`/products/${item.id}`}
                    onClick={closeCart}
                    className="product-photo relative block aspect-[4/5] w-20 shrink-0 overflow-hidden bg-tertiary"
                  >
                    <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />
                  </Link>

                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="line-clamp-2 text-sm font-bold leading-snug text-neutral">{item.name}</h3>
                        <p className="mt-1 text-xs text-neutral/55">
                          {item.weight} · {formatNaira(item.price)} each
                        </p>
                      </div>
                      <p className="shrink-0 text-sm font-bold text-neutral">{formatNaira(item.price * item.quantity)}</p>
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-3">
                      <div className="inline-flex items-center border border-neutral/15">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="flex size-9 items-center justify-center text-neutral transition hover:text-primary"
                          aria-label={`Decrease ${item.name} quantity`}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold text-neutral" aria-live="polite">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= MAX_QUANTITY}
                          className="flex size-9 items-center justify-center text-neutral transition hover:text-primary disabled:opacity-30"
                          aria-label={`Increase ${item.name} quantity`}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="py-2 text-xs font-medium text-neutral/55 underline underline-offset-4 transition hover:text-primary"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="pb-safe space-y-3 border-t border-neutral/10 bg-white px-5 pt-5 sm:px-6">
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-semibold uppercase tracking-[0.16em] text-neutral">Subtotal</span>
                <span className="text-2xl font-bold tracking-tight text-neutral">{formatNaira(cartTotal)}</span>
              </div>
              <p className="text-xs text-neutral/55">Delivery fee and payment are confirmed with you on WhatsApp.</p>
              <button
                onClick={() => setCheckoutOpen(true)}
                className="flex w-full items-center justify-center gap-2 bg-primary py-4 text-sm font-semibold uppercase tracking-[0.18em] text-white shadow-lg shadow-primary/20 transition hover:opacity-90"
              >
                <FontAwesomeIcon icon={faWhatsapp} className="size-4" />
                Checkout on WhatsApp
              </button>
              <button
                onClick={closeCart}
                className="w-full border border-neutral/15 py-3 text-sm font-medium text-neutral transition hover:bg-neutral/5"
              >
                Continue shopping
              </button>
            </div>
          </>
        )}
      </aside>

      {/* Checkout details — bottom sheet on phones, centred dialog from sm up */}
      {checkoutOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 sm:items-center sm:p-4"
          onClick={(event) => {
            if (event.target === event.currentTarget) setCheckoutOpen(false)
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="checkout-title"
            className="pb-safe max-h-[92dvh] w-full max-w-lg animate-in slide-in-from-bottom-8 overflow-y-auto overscroll-contain bg-white px-5 pt-6 shadow-2xl duration-300 sm:px-7 sm:pt-7 sm:fade-in sm:slide-in-from-bottom-0 sm:zoom-in-95"
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral/50">Checkout</p>
                <h3 id="checkout-title" className="mt-1 text-2xl font-bold text-neutral">
                  Delivery details
                </h3>
                <p className="mt-2 text-sm text-neutral/60">
                  We&rsquo;ll open WhatsApp with your order pre-filled for confirmation.
                </p>
              </div>
              <button
                onClick={() => setCheckoutOpen(false)}
                className="-mr-2 flex size-10 shrink-0 items-center justify-center text-neutral transition hover:bg-neutral/5"
                aria-label="Close checkout form"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-6 flex items-center justify-between bg-secondary px-4 py-3 text-sm">
              <span className="text-neutral/70">
                {cartCount} item{cartCount === 1 ? '' : 's'}
              </span>
              <span className="font-bold text-neutral">{formatNaira(cartTotal)}</span>
            </div>

            <form onSubmit={handleCheckout} className="space-y-4">
              <div>
                <label htmlFor="checkout-name" className={fieldLabel}>Full name</label>
                <input
                  id="checkout-name"
                  required
                  maxLength={80}
                  autoComplete="name"
                  value={customerName}
                  onChange={(event) => setCustomerName(event.target.value)}
                  placeholder="e.g. Ada Okafor"
                  className={fieldInput}
                />
              </div>
              <div>
                <label htmlFor="checkout-phone" className={fieldLabel}>Phone number</label>
                <input
                  id="checkout-phone"
                  required
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  maxLength={30}
                  value={customerPhone}
                  onChange={(event) => setCustomerPhone(event.target.value)}
                  placeholder="e.g. 0801 234 5678"
                  className={fieldInput}
                />
              </div>
              <div>
                <label htmlFor="checkout-address" className={fieldLabel}>Delivery address</label>
                <textarea
                  id="checkout-address"
                  required
                  maxLength={240}
                  autoComplete="street-address"
                  value={deliveryAddress}
                  onChange={(event) => setDeliveryAddress(event.target.value)}
                  placeholder="Street, area, city"
                  rows={3}
                  className={cn(fieldInput, 'resize-none')}
                />
              </div>
              <div>
                <label htmlFor="checkout-note" className={fieldLabel}>
                  Order note <span className="font-normal normal-case tracking-normal text-neutral/45">(optional)</span>
                </label>
                <textarea
                  id="checkout-note"
                  maxLength={240}
                  value={orderNote}
                  onChange={(event) => setOrderNote(event.target.value)}
                  placeholder="Preferred delivery time, nearest landmark…"
                  rows={2}
                  className={cn(fieldInput, 'resize-none')}
                />
              </div>
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 bg-primary py-4 text-sm font-semibold uppercase tracking-[0.18em] text-white shadow-lg shadow-primary/20 transition hover:opacity-90"
              >
                <FontAwesomeIcon icon={faWhatsapp} className="size-4" />
                Continue to WhatsApp
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
