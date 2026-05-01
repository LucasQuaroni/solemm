'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Check } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '@/contexts/cart-context'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/types'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <Link
      href={`/tienda/${product.id}`}
      className="group relative flex flex-col bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-border"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-secondary">
        <Image
          src={product.images[0] ?? '/logo.png'}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-foreground text-xs font-body font-semibold px-3 py-1 rounded-full">
              Sin stock
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2 p-4">
        <span className="font-body text-xs text-muted-foreground uppercase tracking-wide">
          {product.category}
        </span>
        <h3 className="font-body text-sm font-semibold text-foreground leading-tight line-clamp-2">
          {product.name}
        </h3>
        <div className="flex items-center justify-between mt-auto pt-2">
          <span className="font-sans text-lg font-bold text-primary">
            {formatPrice(product.price)}
          </span>
          <button
            onClick={handleAdd}
            disabled={product.stock === 0}
            className={`flex items-center justify-center w-9 h-9 rounded-full transition-all duration-300 ${
              added
                ? 'bg-green-500 text-white'
                : 'bg-primary text-primary-foreground hover:bg-leather'
            } disabled:opacity-40 disabled:cursor-not-allowed`}
            aria-label="Agregar al carrito"
          >
            {added ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </Link>
  )
}
