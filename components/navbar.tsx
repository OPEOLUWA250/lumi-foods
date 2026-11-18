'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FormEvent, useEffect, useMemo, useRef, useState } from 'react'
import { ChevronRight, Menu, MessageCircle, Search, ShoppingBag, X } from 'lucide-react'
import { CartDrawer } from '@/components/cart-drawer'
import { Logo } from '@/components/logo'
import { useCart } from '@/lib/cart-context'
import { categoryHref, Product, products, shopCategories } from '@/lib/products'
import { formatNaira, whatsappUrl } from '@/lib/site'
import { cn } from '@/lib/utils'

const MAX_SUGGESTIONS = 5

const navItems = [
  { label: 'Shop All', href: '/products' },
  ...shopCategories.map((category) => ({ label: category, href: categoryHref(category) })),
  { label: 'How to Order', href: '/#how-it-works' },
]

function matchProducts(query: string) {
  const q = query.toLowerCase()
  if (!q) return []
  return products
    .filter((p) => `${p.name} ${p.category} ${p.description}`.toLowerCase().includes(q))
    .slice(0, MAX_SUGGESTIONS)
}

function SearchSuggestions({
  query,
  matches,
  onSelect,
}: {
  query: string
  matches: Product[]
  onSelect: () => void
}) {
  const allHref = `/products?q=${encodeURIComponent(query)}`
  return (
    <div role="listbox" aria-label="Search suggestions" className="max-h-96 overflow-y-auto p-1">
      {matches.length === 0 ? (
        <p className="px-3 py-4 text-center text-sm text-neutral/55">No seafood found for &ldquo;{query}&rdquo;</p>
      ) : (
        matches.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            role="option"
            aria-selected={false}
            onClick={onSelect}
            className="flex items-center gap-3 p-2 transition hover:bg-tertiary"
          >
            <span className="relative block size-11 shrink-0 overflow-hidden bg-tertiary">
              <Image src={product.image} alt="" fill sizes="44px" className="object-cover" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium text-neutral">{product.name}</span>
              <span className="block text-xs text-neutral/55">
                {formatNaira(product.price)} · {product.weight}
              </span>
            </span>
          </Link>
        ))
      )}
      <Link
        href={allHref}
        onClick={onSelect}
        className="mt-1 block px-3 py-2.5 text-center text-sm font-semibold text-primary transition hover:bg-primary/5"
      >
        See all results for &ldquo;{query}&rdquo;
      </Link>
    </div>
  )
}

export function Navbar() {
  const router = useRouter()
  const { cartCount, openCart } = useCart()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const searchRef = useRef<HTMLDivElement>(null)

  const searchQuery = searchValue.trim()
  const searchMatches = useMemo(() => matchProducts(searchQuery), [searchQuery])
  const badge = cartCount > 99 ? '99+' : String(cartCount)

  // Lock page scroll behind the full-screen mobile menu.
  useEffect(() => {
    if (!mobileMenuOpen) return
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileMenuOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = original
      document.removeEventListener('keydown', onKey)
    }
  }, [mobileMenuOpen])

  // Close the desktop search on outside click / Escape.
  useEffect(() => {
    if (!searchOpen) return
    const onPointer = (event: PointerEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) setSearchOpen(false)
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSearchOpen(false)
    }
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [searchOpen])

  // Rotating a tablet into desktop width shouldn't leave the menu stuck open.
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1024px)')
    const close = () => {
      if (desktop.matches) setMobileMenuOpen(false)
    }
    desktop.addEventListener('change', close)
    return () => desktop.removeEventListener('change', close)
  }, [])

  const closeSearch = () => {
    setSearchOpen(false)
    setMobileMenuOpen(false)
    setSearchValue('')
  }

  const handleSearchSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (searchQuery) router.push(`/products?q=${encodeURIComponent(searchQuery)}`)
    closeSearch()
  }

  const iconButton = 'relative flex size-10 items-center justify-center text-neutral transition hover:bg-primary/5 hover:text-primary'

  return (
    <>
      <div className="sticky top-0 z-40">
        {/* Announcement bar */}
        <div className="flex h-9 items-center justify-center gap-2 bg-primary px-4 text-white">
          <span className="truncate text-[11px] font-semibold tracking-wide sm:text-xs">
            Fresh seafood, delivered cold · Order in minutes on WhatsApp
          </span>
          <Link
            href="/#how-it-works"
            className="hidden shrink-0 text-[11px] font-semibold underline underline-offset-2 hover:opacity-80 sm:inline sm:text-xs"
          >
            Learn more
          </Link>
        </div>

        <header className="border-b border-neutral-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between gap-4 lg:h-20">
              <Link href="/" aria-label="LumiFoods home" className="shrink-0">
                <Logo />
              </Link>

              {/* Desktop nav */}
              <nav aria-label="Main" className="hidden items-center gap-7 lg:flex xl:gap-8">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-sm font-medium text-neutral transition hover:text-primary hover:underline hover:underline-offset-8"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              {/* Desktop actions */}
              <div className="hidden items-center gap-1 lg:flex">
                {searchOpen ? (
                  <div className="relative" ref={searchRef}>
                    <form
                      role="search"
                      onSubmit={handleSearchSubmit}
                      className="flex items-center gap-1.5 border border-neutral-200 bg-white px-3 py-1.5"
                    >
                      <Search size={16} className="text-neutral/50" />
                      <input
                        autoFocus
                        type="search"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        placeholder="Search seafood..."
                        aria-label="Search seafood"
                        className="w-44 bg-transparent text-sm text-neutral outline-none placeholder:text-neutral/40 [&::-webkit-search-cancel-button]:hidden"
                      />
                      <button type="button" onClick={closeSearch} aria-label="Close search" className="p-0.5 transition hover:bg-neutral/5">
                        <X size={14} />
                      </button>
                    </form>
                    {searchQuery && (
                      <div className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-80 border border-neutral-200 bg-white shadow-2xl">
                        <SearchSuggestions query={searchQuery} matches={searchMatches} onSelect={closeSearch} />
                      </div>
                    )}
                  </div>
                ) : (
                  <button type="button" onClick={() => setSearchOpen(true)} className={iconButton} aria-label="Search">
                    <Search size={20} />
                  </button>
                )}
                <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className={iconButton} aria-label="Chat with us on WhatsApp">
                  <MessageCircle size={20} />
                </a>
                <button type="button" onClick={openCart} className={iconButton} aria-label={`Open bag, ${cartCount} items`}>
                  <ShoppingBag size={20} />
                  {cartCount > 0 && (
                    <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center bg-primary px-1 text-[10px] font-medium text-white">
                      {badge}
                    </span>
                  )}
                </button>
              </div>

              {/* Mobile actions */}
              <div className="flex items-center gap-0.5 lg:hidden">
                <button type="button" onClick={openCart} className={iconButton} aria-label={`Open bag, ${cartCount} items`}>
                  <ShoppingBag size={20} />
                  {cartCount > 0 && (
                    <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center bg-primary px-1 text-[10px] font-medium text-white">
                      {badge}
                    </span>
                  )}
                </button>
                <button
                  type="button"
                  className={iconButton}
                  onClick={() => setMobileMenuOpen((open) => !open)}
                  aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                  aria-expanded={mobileMenuOpen}
                  aria-controls="mobile-navigation"
                >
                  {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile menu — sits directly under the 36px bar + 64px header */}
        <div
          id="mobile-navigation"
          inert={!mobileMenuOpen}
          aria-hidden={!mobileMenuOpen}
          className={cn(
            'fixed inset-x-0 bottom-0 top-[100px] z-30 flex flex-col bg-white transition-all duration-300 ease-out lg:hidden',
            mobileMenuOpen ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-3 opacity-0',
          )}
        >
          <nav aria-label="Mobile" className="pb-safe flex-1 overflow-y-auto overscroll-contain px-5 pt-6">
            <form role="search" onSubmit={handleSearchSubmit} className="flex items-center gap-2 border border-neutral-200 px-4 py-3">
              <Search size={16} className="shrink-0 text-neutral/50" />
              <input
                type="search"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search seafood..."
                aria-label="Search seafood"
                enterKeyHint="search"
                className="w-full bg-transparent text-sm text-neutral outline-none placeholder:text-neutral/40"
              />
            </form>
            {mobileMenuOpen && searchQuery && (
              <div className="mt-2 border border-neutral-200 bg-white">
                <SearchSuggestions query={searchQuery} matches={searchMatches} onSelect={closeSearch} />
              </div>
            )}

            <p className="mb-1 mt-8 px-1 text-xs font-semibold uppercase tracking-[0.2em] text-neutral/40">Shop</p>
            <div className="flex flex-col">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between border-b border-neutral-100 py-4 text-base font-medium text-neutral transition hover:text-primary"
                >
                  {item.label}
                  <ChevronRight size={16} className="text-neutral/30" />
                </Link>
              ))}
            </div>

            <p className="mb-2 mt-8 px-1 text-xs font-semibold uppercase tracking-[0.2em] text-neutral/40">Need help?</p>
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="mb-8 flex items-center justify-center gap-2 border border-primary px-4 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-primary transition hover:bg-primary hover:text-white"
            >
              <MessageCircle size={16} />
              Chat on WhatsApp
            </a>
          </nav>
        </div>
      </div>

      <CartDrawer />
    </>
  )
}
