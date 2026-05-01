'use client'

import { useEffect, useState, useMemo } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import WhatsAppButton from '@/components/layout/whatsapp-button'
import ProductCard from '@/components/products/product-card'
import { getProducts, getCategories } from '@/lib/db'
import type { Product, Category } from '@/types'

export default function TiendaPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'name'>('default')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getProducts(), getCategories()]).then(([prods, cats]) => {
      setProducts(prods)
      setCategories(cats)
      setLoading(false)
    })
  }, [])

  const filtered = useMemo(() => {
    let result = [...products]

    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.category === selectedCategory)
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      )
    }

    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        result.sort((a, b) => b.price - a.price)
        break
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
    }

    return result
  }, [products, selectedCategory, searchQuery, sortBy])

  const allCategories = [{ id: 'all', name: 'Todos', slug: 'all' }, ...categories]

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16 md:pt-20">
        <div className="bg-leather-dark text-cream py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="font-body text-xs tracking-widest uppercase text-cream/60">
              Nuestra tienda
            </span>
            <h1 className="font-sans text-3xl md:text-4xl font-bold mt-2">Productos</h1>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col sm:flex-row gap-4 mb-8 items-start sm:items-center justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary font-body"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="text-sm border border-border rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 font-body"
              >
                <option value="default">Ordenar por</option>
                <option value="price-asc">Precio: menor a mayor</option>
                <option value="price-desc">Precio: mayor a menor</option>
                <option value="name">Nombre A-Z</option>
              </select>

              <button
                onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                className="sm:hidden flex items-center gap-2 text-sm border border-border rounded-lg px-3 py-2.5 bg-white font-body"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filtros
              </button>

              <p className="text-sm text-muted-foreground font-body">
                {filtered.length} {filtered.length === 1 ? 'producto' : 'productos'}
              </p>
            </div>
          </div>

          <div className="flex gap-8">
            <aside className={`${mobileFiltersOpen ? 'block' : 'hidden'} sm:block w-full sm:w-52 shrink-0`}>
              <div className="sticky top-24">
                <h2 className="font-body text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-4">
                  Categorias
                </h2>
                <ul className="flex flex-col gap-1">
                  {allCategories.map((cat) => (
                    <li key={cat.id}>
                      <button
                        onClick={() => {
                          setSelectedCategory(cat.slug)
                          setMobileFiltersOpen(false)
                        }}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm font-body transition-colors ${
                          selectedCategory === cat.slug
                            ? 'bg-primary text-primary-foreground font-semibold'
                            : 'text-foreground hover:bg-secondary'
                        }`}
                      >
                        {cat.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>

            <div className="flex-1 min-w-0">
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="bg-secondary animate-pulse rounded-xl aspect-[3/4]" />
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center">
                    <Search className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="font-body text-base text-muted-foreground">
                    No se encontraron productos
                  </p>
                  <button
                    onClick={() => { setSearchQuery(''); setSelectedCategory('all') }}
                    className="text-sm text-primary underline-offset-2 hover:underline"
                  >
                    Limpiar filtros
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {filtered.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}
