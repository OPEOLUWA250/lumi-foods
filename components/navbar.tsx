'use client'

import Link from 'next/link'
import { useCart } from '@/lib/cart-context'
import { ShoppingCart } from 'lucide-react'
import { useState } from 'react'

interface NavbarProps {
  onCartClick: () => void
}

export function Navbar({ onCartClick }: NavbarProps) {
  const { cartCount } = useCart()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-40 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">L</span>
            </div>
            <span className="text-2xl font-bold text-secondary hidden sm:inline">LumiFoods</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/products" className="text-foreground hover:text-primary transition-colors">
              Shop
            </Link>
            <Link href="/about" className="text-foreground hover:text-primary transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-foreground hover:text-primary transition-colors">
              Contact
            </Link>
          </div>

          {/* Cart Button */}
          <button
            onClick={onCartClick}
            className="relative p-2 text-foreground hover:text-primary transition-colors"
            aria-label="Shopping cart"
          >
            <ShoppingCart size={24} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2"
            aria-label="Menu"
          >
            <div className="space-y-1">
              <div className="w-6 h-0.5 bg-foreground"></div>
              <div className="w-6 h-0.5 bg-foreground"></div>
              <div className="w-6 h-0.5 bg-foreground"></div>
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 border-t border-border space-y-2">
            <Link href="/" className="block px-4 py-2 text-foreground hover:bg-muted rounded transition-colors">
              Home
            </Link>
            <Link href="/products" className="block px-4 py-2 text-foreground hover:bg-muted rounded transition-colors">
              Shop
            </Link>
            <Link href="/about" className="block px-4 py-2 text-foreground hover:bg-muted rounded transition-colors">
              About
            </Link>
            <Link href="/contact" className="block px-4 py-2 text-foreground hover:bg-muted rounded transition-colors">
              Contact
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
