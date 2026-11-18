'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Check, ChevronDown, Grid3x3, LayoutGrid, Search, SlidersHorizontal, X } from 'lucide-react'
import { ProductCard } from '@/components/product-card'
import { products, shopCategories } from '@/lib/products'
import { formatNaira } from '@/lib/site'
import { cn } from '@/lib/utils'

type SortValue = 'featured' | 'price-low' | 'price-high' | 'name-asc'

const SORT_LABELS: Record<SortValue, string> = {
  featured: 'Featured',
  'price-low': 'Price: Low to High',
  'price-high': 'Price: High to Low',
  'name-asc': 'Name: A–Z',
}

const PRICE_STEP = 500
const priceFloor = Math.floor(Math.min(...products.map((p) => p.price)) / PRICE_STEP) * PRICE_STEP
const priceCeil = Math.ceil(Math.max(...products.map((p) => p.price)) / PRICE_STEP) * PRICE_STEP

const categoryCounts = shopCategories.map((value) => ({
  value,
  count: products.filter((p) => p.category === value).length,
}))

function toggleInList(list: string[], value: string) {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value]
}

export function ShopView({ initialCategory, initialQuery = '' }: { initialCategory?: string; initialQuery?: string }) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCategory ? [initialCategory] : [])
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [maxPrice, setMaxPrice] = useState(priceCeil)
  const [inStockOnly, setInStockOnly] = useState(false)
  const [sortBy, setSortBy] = useState<SortValue>('featured')
  const [sortOpen, setSortOpen] = useState(false)
  const [density, setDensity] = useState<'comfortable' | 'compact'>('comfortable')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const sortMenuRef = useRef<HTMLDivElement>(null)

  // Keep the URL shareable: ?category=Crab&q=king
  useEffect(() => {
    const params = new URLSearchParams()
    if (selectedCategories.length === 1) params.set('category', selectedCategories[0])
    if (searchQuery.trim()) params.set('q', searchQuery.trim())
    const query = params.toString()
    const next = `${window.location.pathname}${query ? `?${query}` : ''}`
    if (next !== `${window.location.pathname}${window.location.search}`) {
      window.history.replaceState(window.history.state, '', next)
    }
  }, [selectedCategories, searchQuery])

  useEffect(() => {
    if (!sortOpen) return
    const onPointer = (event: PointerEvent) => {
      if (sortMenuRef.current && !sortMenuRef.current.contains(event.target as Node)) setSortOpen(false)
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSortOpen(false)
    }
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [sortOpen])

  useEffect(() => {
    if (!mobileFiltersOpen) return
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileFiltersOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = original
      document.removeEventListener('keydown', onKey)
    }
  }, [mobileFiltersOpen])

  const sortedProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    const filtered = products.filter((p) => {
      if (selectedCategories.length && !selectedCategories.includes(p.category)) return false
      if (p.price > maxPrice) return false
      if (inStockOnly && !p.inStock) return false
      if (query && !`${p.name} ${p.category} ${p.description} ${p.origin}`.toLowerCase().includes(query)) return false
      return true
    })
    if (sortBy === 'featured') return filtered
    return [...filtered].sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price
      if (sortBy === 'price-high') return b.price - a.price
      return a.name.localeCompare(b.name)
    })
  }, [selectedCategories, maxPrice, inStockOnly, searchQuery, sortBy])

  const activeFilterCount =
    selectedCategories.length + (maxPrice < priceCeil ? 1 : 0) + (inStockOnly ? 1 : 0) + (searchQuery.trim() ? 1 : 0)

  const clearFilters = () => {
    setSelectedCategories([])
    setMaxPrice(priceCeil)
    setInStockOnly(false)
    setSearchQuery('')
  }

  const heading = selectedCategories.length === 1 ? selectedCategories[0] : 'All Seafood'

  const filterProps: FilterContentProps = {
    selectedCategories,
    onToggleCategory: (value) => setSelectedCategories((prev) => toggleInList(prev, value)),
    maxPrice,
    onMaxPriceChange: setMaxPrice,
    inStockOnly,
    onInStockChange: setInStockOnly,
  }

  const tabClass = (active: boolean) =>
    cn(
      'shrink-0 px-5 py-2.5 text-sm font-semibold transition',
      active
        ? 'bg-primary text-white shadow-sm shadow-primary/25'
        : 'border border-neutral/15 bg-white text-neutral hover:border-primary/40',
    )

  return (
    <>
      {/* Collection header */}
      <section className="pt-10 md:pt-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-neutral/50">The Collection</p>
              <h1 className="text-3xl font-bold text-neutral md:text-4xl">Shop {heading}</h1>
            </div>
            <p className="text-sm text-neutral/50">
              {sortedProducts.length} of {products.length} products
            </p>
          </div>

          {/* Quick category tabs — swipe on phones, wrap on larger screens */}
          <div className="scrollbar-hide -mx-4 mt-6 flex gap-2.5 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:gap-3 sm:px-0">
            <button type="button" onClick={() => setSelectedCategories([])} className={tabClass(selectedCategories.length === 0)}>
              All
            </button>
            {shopCategories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategories([category])}
                className={tabClass(selectedCategories.length === 1 && selectedCategories[0] === category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-14 pt-8 md:pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[260px_1fr]">
            {/* Desktop sidebar */}
            <aside className="hidden lg:block">
              <div className="scrollbar-hide sticky top-32 max-h-[calc(100vh-9rem)] overflow-y-auto border border-neutral/10 bg-white p-6">
                <div className="mb-6 flex items-center justify-between">
                  <p className="text-sm font-bold uppercase tracking-[0.14em] text-neutral">Filters</p>
                  {activeFilterCount > 0 && (
                    <button onClick={clearFilters} className="text-xs font-medium text-primary underline underline-offset-4 transition hover:opacity-70">
                      Clear all
                    </button>
                  )}
                </div>
                <FilterContent {...filterProps} />
              </div>
            </aside>

            <div>
              {/* Toolbar */}
              <div className="mb-6 flex flex-wrap items-center gap-3 border border-neutral/10 bg-white p-3 shadow-sm sm:p-4">
                <div className="relative min-w-0 flex-[1_1_100%] sm:flex-1">
                  <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral/40" />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search seafood..."
                    aria-label="Search seafood"
                    enterKeyHint="search"
                    className="w-full border border-neutral/15 bg-transparent py-2.5 pl-9 pr-3 text-sm text-neutral outline-none transition placeholder:text-neutral/40 focus:border-primary"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(true)}
                  className="inline-flex flex-1 items-center justify-center gap-2 border border-neutral/15 px-4 py-2.5 text-sm font-medium text-neutral transition hover:border-primary/40 sm:flex-none lg:hidden"
                >
                  <SlidersHorizontal size={16} />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-white">
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                <div className="relative flex-1 sm:flex-none" ref={sortMenuRef}>
                  <button
                    type="button"
                    onClick={() => setSortOpen((open) => !open)}
                    aria-haspopup="listbox"
                    aria-expanded={sortOpen}
                    className="flex w-full items-center justify-center gap-2 border border-neutral/15 px-4 py-2.5 text-sm font-medium text-neutral transition hover:border-primary/40"
                  >
                    <span className="text-neutral/40">Sort:</span>
                    <span className="truncate">{SORT_LABELS[sortBy]}</span>
                    <ChevronDown size={14} className={cn('shrink-0 transition', sortOpen && 'rotate-180')} />
                  </button>
                  {sortOpen && (
                    <div role="listbox" className="absolute right-0 top-[calc(100%+0.5rem)] z-30 w-56 border border-neutral/10 bg-white p-1.5 shadow-2xl">
                      {(Object.entries(SORT_LABELS) as [SortValue, string][]).map(([value, label]) => (
                        <button
                          key={value}
                          type="button"
                          role="option"
                          aria-selected={sortBy === value}
                          onClick={() => {
                            setSortBy(value)
                            setSortOpen(false)
                          }}
                          className={cn(
                            'flex w-full items-center justify-between px-3 py-2.5 text-left text-sm transition',
                            sortBy === value ? 'bg-primary/10 font-medium text-primary' : 'text-neutral hover:bg-neutral-50',
                          )}
                        >
                          {label}
                          {sortBy === value && <Check size={14} />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="hidden items-center gap-1 border border-neutral/15 p-1 lg:flex">
                  <button
                    type="button"
                    onClick={() => setDensity('comfortable')}
                    aria-label="Comfortable grid"
                    aria-pressed={density === 'comfortable'}
                    className={cn('p-2 transition', density === 'comfortable' ? 'bg-neutral text-white' : 'text-neutral/40 hover:text-neutral')}
                  >
                    <LayoutGrid size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDensity('compact')}
                    aria-label="Compact grid"
                    aria-pressed={density === 'compact'}
                    className={cn('p-2 transition', density === 'compact' ? 'bg-neutral text-white' : 'text-neutral/40 hover:text-neutral')}
                  >
                    <Grid3x3 size={16} />
                  </button>
                </div>
              </div>

              {/* Active filter chips */}
              {activeFilterCount > 0 && (
                <div className="mb-6 flex flex-wrap items-center gap-2">
                  {selectedCategories.map((value) => (
                    <FilterChip key={value} label={value} onRemove={() => setSelectedCategories((prev) => toggleInList(prev, value))} />
                  ))}
                  {maxPrice < priceCeil && <FilterChip label={`Up to ${formatNaira(maxPrice)}`} onRemove={() => setMaxPrice(priceCeil)} />}
                  {inStockOnly && <FilterChip label="In stock" onRemove={() => setInStockOnly(false)} />}
                  {searchQuery.trim() && <FilterChip label={`“${searchQuery.trim()}”`} onRemove={() => setSearchQuery('')} />}
                  <button onClick={clearFilters} className="text-xs font-medium text-primary underline underline-offset-4 transition hover:opacity-70">
                    Clear all
                  </button>
                </div>
              )}

              {sortedProducts.length > 0 ? (
                <div
                  className={cn(
                    'grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-6 sm:gap-y-10 md:grid-cols-3',
                    density === 'compact' ? 'lg:grid-cols-4 lg:gap-x-6' : 'lg:grid-cols-3 lg:gap-x-8',
                  )}
                >
                  {sortedProducts.map((product, i) => (
                    <ProductCard key={product.id} product={product} priority={i < 4} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center border border-dashed border-neutral/20 bg-tertiary/30 px-6 py-20 text-center">
                  <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Search size={22} />
                  </div>
                  <p className="text-lg font-bold text-neutral">No seafood matches your filters</p>
                  <p className="mt-2 max-w-sm text-sm text-neutral/60">
                    Try adjusting or clearing your filters to see more of our catch.
                  </p>
                  <button onClick={clearFilters} className="mt-6 bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90">
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile filter drawer */}
      <div className={cn('fixed inset-0 z-50 lg:hidden', !mobileFiltersOpen && 'pointer-events-none')} inert={!mobileFiltersOpen} aria-hidden={!mobileFiltersOpen}>
        <div
          className={cn('absolute inset-0 bg-black/40 transition-opacity duration-300', mobileFiltersOpen ? 'opacity-100' : 'opacity-0')}
          onClick={() => setMobileFiltersOpen(false)}
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Filters"
          className={cn(
            'absolute inset-y-0 right-0 flex h-dvh w-[88vw] max-w-sm flex-col bg-white transition-[transform,visibility] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
            mobileFiltersOpen ? 'visible translate-x-0 shadow-2xl' : 'invisible translate-x-full',
          )}
        >
          <div className="flex items-center justify-between border-b border-neutral/10 px-5 py-4">
            <p className="text-lg font-bold text-neutral">Filters</p>
            <button onClick={() => setMobileFiltersOpen(false)} aria-label="Close filters" className="flex size-10 items-center justify-center transition hover:bg-neutral/5">
              <X size={18} />
            </button>
          </div>
          <div className="scrollbar-hide flex-1 overflow-y-auto overscroll-contain p-5">
            <FilterContent {...filterProps} />
          </div>
          <div className="pb-safe flex gap-3 border-t border-neutral/10 px-4 pt-4">
            <button onClick={clearFilters} className="flex-1 border border-neutral/15 py-3 text-sm font-semibold text-neutral transition hover:bg-neutral/5">
              Clear all
            </button>
            <button onClick={() => setMobileFiltersOpen(false)} className="flex-1 bg-primary py-3 text-sm font-semibold text-white transition hover:opacity-90">
              Show {sortedProducts.length} results
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

interface FilterContentProps {
  selectedCategories: string[]
  onToggleCategory: (value: string) => void
  maxPrice: number
  onMaxPriceChange: (value: number) => void
  inStockOnly: boolean
  onInStockChange: (value: boolean) => void
}

function FilterContent({ selectedCategories, onToggleCategory, maxPrice, onMaxPriceChange, inStockOnly, onInStockChange }: FilterContentProps) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="mb-4 text-sm font-semibold text-neutral">Categories</h3>
        <div className="space-y-1">
          {categoryCounts.map((cat) => {
            const checked = selectedCategories.includes(cat.value)
            return (
              <button
                key={cat.value}
                type="button"
                onClick={() => onToggleCategory(cat.value)}
                aria-pressed={checked}
                className="flex w-full items-center gap-3 px-2 py-2.5 text-left transition hover:bg-tertiary/60"
              >
                <span
                  className={cn(
                    'flex size-4 shrink-0 items-center justify-center border transition',
                    checked ? 'border-primary bg-primary text-white' : 'border-neutral/25',
                  )}
                >
                  {checked && <Check size={11} />}
                </span>
                <span className="flex-1 text-sm text-neutral">{cat.value}</span>
                <span className="text-xs text-neutral/40">{cat.count}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-sm font-semibold text-neutral">Price</h3>
        <input
          type="range"
          min={priceFloor}
          max={priceCeil}
          step={PRICE_STEP}
          value={maxPrice}
          onChange={(e) => onMaxPriceChange(Number(e.target.value))}
          aria-label="Maximum price"
          className="h-6 w-full accent-primary"
        />
        <div className="mt-2 flex justify-between text-xs text-neutral/50">
          <span>{formatNaira(priceFloor)}</span>
          <span className="font-medium text-neutral">Up to {formatNaira(maxPrice)}</span>
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-sm font-semibold text-neutral">Availability</h3>
        <button
          type="button"
          role="switch"
          aria-checked={inStockOnly}
          onClick={() => onInStockChange(!inStockOnly)}
          className="flex w-full items-center justify-between px-2 py-1.5 transition hover:bg-tertiary/60"
        >
          <span className="text-sm text-neutral">In stock only</span>
          <span className={cn('relative h-5 w-9 shrink-0 rounded-full transition', inStockOnly ? 'bg-primary' : 'bg-neutral/20')}>
            <span className={cn('absolute top-0.5 size-4 rounded-full bg-white transition-all', inStockOnly ? 'left-4' : 'left-0.5')} />
          </span>
        </button>
      </div>
    </div>
  )
}

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-primary/10 py-1.5 pl-3 pr-1.5 text-xs font-medium text-primary">
      {label}
      <button type="button" onClick={onRemove} aria-label={`Remove ${label} filter`} className="p-1 transition hover:bg-primary/20">
        <X size={12} />
      </button>
    </span>
  )
}
