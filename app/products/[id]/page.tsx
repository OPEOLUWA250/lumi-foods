'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { CartDrawer } from '@/components/cart-drawer'
import { Footer } from '@/components/footer'
import { ProductCard } from '@/components/product-card'
import { useCart } from '@/lib/cart-context'
import { products } from '@/lib/products'
import { ArrowLeft, ShoppingCart } from 'lucide-react'

export default function ProductDetailsPage({
  params,
}: {
  params: { id: string }
}) {
  const [cartOpen, setCartOpen] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const { addItem } = useCart()

  const product = products.find((p) => p.id === params.id)
  const relatedProducts = products
    .filter((p) => p.category === product?.category && p.id !== product?.id)
    .slice(0, 3)

  if (!product) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar onCartClick={() => setCartOpen(true)} />
        <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <p className="text-xl text-muted-foreground">Product not found</p>
          <Link href="/products" className="text-primary hover:underline mt-4 inline-block">
            Back to products
          </Link>
        </div>
        <Footer />
      </main>
    )
  }

  const handleAddToCart = () => {
    addItem(product, quantity)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar onCartClick={() => setCartOpen(true)} />
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      {/* Breadcrumb */}
      <div className="bg-muted py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/products"
            className="flex items-center gap-2 text-primary hover:underline"
          >
            <ArrowLeft size={18} />
            Back to Products
          </Link>
        </div>
      </div>

      {/* Product Details */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            {/* Image */}
            <div className="relative h-96 md:h-full min-h-96 rounded-lg overflow-hidden bg-muted">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Details */}
            <div className="flex flex-col justify-between">
              <div className="space-y-6">
                <div>
                  <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-2">
                    {product.category}
                  </p>
                  <h1 className="text-4xl md:text-5xl font-bold text-foreground text-balance">
                    {product.name}
                  </h1>
                </div>

                <div>
                  <p className="text-2xl font-bold text-foreground">
                    ₦{product.price}
                  </p>
                </div>

                <p className="text-lg text-muted-foreground leading-relaxed">
                  {product.description}
                </p>

                <div className="space-y-3 py-6 border-t border-b border-border">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Weight:</span>
                    <span className="font-semibold text-foreground">{product.weight}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Origin:</span>
                    <span className="font-semibold text-foreground">{product.origin}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Availability:</span>
                    <span className="font-semibold text-primary">In Stock</span>
                  </div>
                </div>
              </div>

              {/* Add to Cart */}
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex items-center border border-border rounded-md flex-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-3 text-foreground hover:bg-muted transition-colors"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="flex-1 text-center bg-transparent border-none outline-none text-foreground"
                      min="1"
                    />
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 py-3 text-foreground hover:bg-muted transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  className={`w-full py-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${
                    added
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-primary text-primary-foreground hover:opacity-90'
                  }`}
                >
                  <ShoppingCart size={20} />
                  {added ? 'Added to Cart!' : 'Add to Cart'}
                </button>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-2">
                  Related Products
                </h2>
                <p className="text-muted-foreground">
                  You might also like these {product.category.toLowerCase()} options
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
