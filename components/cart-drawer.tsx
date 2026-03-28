'use client'

import { useCart } from '@/lib/cart-context'
import { X, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, cartTotal, clearCart } = useCart()
  const whatsappNumber = '234811332439'

  const handleCheckout = () => {
    const itemsList = items
      .map((item) => `${item.name} (${item.quantity}x ₦${item.price})`)
      .join('%0A')
    const total = `₦${cartTotal.toFixed(0)}`
    const message = `Hi! I would like to order:%0A${itemsList}%0ATotal: ${total}`
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`
    window.open(whatsappUrl, '_blank')
    clearCart()
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-screen w-full sm:w-96 bg-background shadow-lg z-50 flex flex-col transition-transform">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-border">
          <h2 className="text-2xl font-bold text-foreground">Shopping Cart</h2>
          <button
            onClick={onClose}
            className="p-2 text-foreground hover:bg-muted rounded-md transition-colors"
            aria-label="Close cart"
          >
            <X size={24} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p className="text-muted-foreground mb-4">Your cart is empty</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 pb-4 border-b border-border">
                {/* Image */}
                <div className="relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden bg-muted">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground line-clamp-2">
                      {item.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      ₦{item.price} each
                    </p>
                  </div>

                  {/* Quantity and Remove */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 border border-border rounded-md">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-2 py-1 text-foreground hover:bg-muted transition-colors"
                      >
                        −
                      </button>
                      <span className="w-6 text-center text-foreground text-sm">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-1 text-foreground hover:bg-muted transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-foreground hover:bg-muted rounded-md transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {/* Total for Item */}
                <div className="text-right">
                  <p className="font-semibold text-foreground">
                    ₦{Math.round(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border p-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-foreground">Total:</span>
              <span className="text-2xl font-bold text-primary">
                ₦{Math.round(cartTotal)}
              </span>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-primary text-primary-foreground py-3 rounded-md font-semibold hover:opacity-90 transition-opacity"
            >
              Checkout on WhatsApp
            </button>

            <button
              onClick={onClose}
              className="w-full bg-muted text-foreground py-3 rounded-md font-semibold hover:bg-border transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  )
}
