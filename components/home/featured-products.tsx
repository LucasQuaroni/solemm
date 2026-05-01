import Link from 'next/link'
import ProductCard from '@/components/products/product-card'
import type { Product } from '@/types'

interface FeaturedProductsProps {
  products: Product[]
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  if (!products.length) return null

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center mb-12">
          <span className="font-body text-xs tracking-widest uppercase text-primary font-semibold">
            Nuestra seleccion
          </span>
          <h2 className="font-sans text-3xl md:text-4xl font-bold text-foreground mt-2 text-balance">
            Productos destacados
          </h2>
          <div className="w-12 h-1 bg-primary rounded-full mt-4" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="flex justify-center mt-12">
          <Link
            href="/tienda"
            className="inline-block bg-primary hover:bg-leather text-primary-foreground font-body font-semibold py-3.5 px-10 rounded-sm transition-colors tracking-wide uppercase text-sm"
          >
            Ver toda la tienda
          </Link>
        </div>
      </div>
    </section>
  )
}
