'use client'

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from 'react'
import { Product, products } from './products'

export interface CartItem extends Product {
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  addItem: (product: Product, quantity: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  cartCount: number
  cartTotal: number
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
}

export const MAX_QUANTITY = 99
const STORAGE_KEY = 'lumifoods.cart.v1'

const CartContext = createContext<CartContextType | undefined>(undefined)

/**
 * Only ids and quantities are saved; product details (price, name, image) are
 * re-read from the catalogue on load, so a price change never leaves a stale
 * total in someone's saved bag.
 */
function restoreCart(): CartItem[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const saved: unknown = JSON.parse(raw)
    if (!Array.isArray(saved)) return []
    return saved.flatMap((entry) => {
      const id = entry?.id
      const quantity = Number(entry?.quantity)
      const product = products.find((p) => p.id === id)
      if (!product || !Number.isInteger(quantity) || quantity < 1) return []
      return [{ ...product, quantity: Math.min(quantity, MAX_QUANTITY) }]
    })
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [hydrated, setHydrated] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setItems(restoreCart())
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(items.map(({ id, quantity }) => ({ id, quantity }))),
      )
    } catch {
      // Private mode / storage disabled: the bag still works for this visit.
    }
  }, [items, hydrated])

  const addItem = useCallback((product: Product, quantity: number) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id)
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, MAX_QUANTITY) }
            : item,
        )
      }
      return [...prevItems, { ...product, quantity: Math.min(quantity, MAX_QUANTITY) }]
    })
  }, [])

  const removeItem = useCallback((productId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== productId))
  }, [])

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prevItems) => prevItems.filter((item) => item.id !== productId))
      return
    }
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity: Math.min(quantity, MAX_QUANTITY) } : item,
      ),
    )
  }, [])

  const clearCart = useCallback(() => setItems([]), [])
  const openCart = useCallback(() => setIsOpen(true), [])
  const closeCart = useCallback(() => setIsOpen(false), [])

  const value = useMemo(() => {
    const cartCount = items.reduce((sum, item) => sum + item.quantity, 0)
    const cartTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    return {
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      cartCount,
      cartTotal,
      isOpen,
      openCart,
      closeCart,
    }
  }, [items, addItem, removeItem, updateQuantity, clearCart, isOpen, openCart, closeCart])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
