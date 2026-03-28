'use client'

import Image from 'next/image'
import { Product } from '@/lib/products'
import { useCart } from '@/lib/cart-context'
import { ShoppingCart } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()
  const [isAdding, setIsAdding] = useState(false)
  const [addedSuccess, setAddedSuccess] = useState(false)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsAdding(true)
    addItem(product, 1)
    
    setTimeout(() => {
      setIsAdding(false)
      setAddedSuccess(true)
      setTimeout(() => setAddedSuccess(false), 2000)
    }, 600)
  }

  return (
    <Link href={`/products/${product.id}`} className="group cursor-pointer">
      <div className="bg-card rounded-lg overflow-hidden border border-border hover:border-primary transition-all duration-300 flex flex-col h-full hover:shadow-lg">
        
        {/* Product Image */}
        <div className="relative w-full overflow-hidden bg-muted" style={{ aspectRatio: '1' }}>
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>

        {/* Product Info - Minimal & Clean */}
        <div className="flex flex-col flex-grow p-6">
          
          {/* Category Badge */}
          <p className="text-xs font-bold text-primary uppercase tracking-wider mb-3">
            {product.category}
          </p>

          {/* Product Name */}
          <h3 className="text-lg font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-sm text-muted-foreground mb-6 line-clamp-3 flex-grow">
            {product.description}
          </p>

          {/* Price */}
          <div className="mb-6">
            <span className="text-3xl font-bold text-foreground">
              ₦{product.price.toFixed(0)}
            </span>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className={`w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all duration-300 text-center ${
              addedSuccess
                ? 'bg-primary text-primary-foreground scale-95'
                : 'bg-primary text-primary-foreground hover:bg-opacity-90 hover:shadow-md'
            }`}
          >
            <ShoppingCart size={20} />
            <span>
              {isAdding ? 'Adding...' : addedSuccess ? 'Added!' : 'Add to Cart'}
            </span>
          </button>
        </div>
      </div>
    </Link>
  )
}
