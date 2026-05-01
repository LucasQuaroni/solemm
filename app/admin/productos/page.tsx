'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Plus, Pencil, Trash2, Star, StarOff, Search } from 'lucide-react'
import {
  getProducts,
  getCategories,
  saveProduct,
  deleteProduct,
} from '@/lib/db'
import { formatPrice } from '@/lib/utils'
import type { Product, Category } from '@/types'
import ProductFormModal from '@/components/admin/product-form-modal'

export default function AdminProductos() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    Promise.all([getProducts(), getCategories()]).then(([prods, cats]) => {
      setProducts(prods)
      setCategories(cats)
      setLoading(false)
    })
  }, [])

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  )

  const handleSave = async (product: Product) => {
    setSaving(true)
    await saveProduct(product)
    if (editingProduct) {
      setProducts((prev) => prev.map((p) => (p.id === product.id ? product : p)))
    } else {
      setProducts((prev) => [product, ...prev])
    }
    setSaving(false)
    setModalOpen(false)
    setEditingProduct(null)
  }

  const handleDelete = async (id: string) => {
    await deleteProduct(id)
    setProducts((prev) => prev.filter((p) => p.id !== id))
    setDeleteConfirm(null)
  }

  const toggleFeatured = async (id: string) => {
    const updated = products.map((p) => (p.id === id ? { ...p, featured: !p.featured } : p))
    setProducts(updated)
    const product = updated.find((p) => p.id === id)
    if (product) await saveProduct(product)
  }

  const openNew = () => {
    setEditingProduct(null)
    setModalOpen(true)
  }

  const openEdit = (product: Product) => {
    setEditingProduct(product)
    setModalOpen(true)
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h2 className="font-sans text-xl font-bold text-foreground">Productos</h2>
          <p className="font-body text-sm text-muted-foreground mt-0.5">
            {products.length} productos en total
          </p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-primary hover:bg-leather text-primary-foreground font-body font-semibold text-sm py-2.5 px-5 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nuevo producto
        </button>
      </div>

      <div className="relative mb-6 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar productos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 font-body"
        />
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-body">
            <thead>
              <tr className="border-b border-border bg-secondary/40">
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide">Producto</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide">Categoria</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide">Precio</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide">Stock</th>
                <th className="text-center px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide">Destacado</th>
                <th className="text-right px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="border-b border-border">
                    <td colSpan={6} className="px-4 py-4">
                      <div className="h-8 bg-secondary animate-pulse rounded" />
                    </td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-muted-foreground">
                    No hay productos
                  </td>
                </tr>
              ) : (
                filtered.map((product) => (
                  <tr key={product.id} className="border-b border-border last:border-0 hover:bg-secondary/20 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-md overflow-hidden bg-secondary shrink-0">
                          <Image
                            src={product.images[0] ?? '/logo.png'}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <p className="font-medium text-foreground line-clamp-1">{product.name}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground capitalize">{product.category}</td>
                    <td className="px-4 py-3 font-semibold text-primary">{formatPrice(product.price)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                        {product.stock > 0 ? product.stock : 'Sin stock'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => toggleFeatured(product.id)}
                        className={`mx-auto flex items-center justify-center w-7 h-7 rounded-full transition-colors ${product.featured ? 'text-amber-500 hover:text-amber-600' : 'text-muted-foreground/30 hover:text-amber-400'}`}
                        aria-label={product.featured ? 'Quitar destacado' : 'Marcar como destacado'}
                      >
                        {product.featured ? <Star className="w-4 h-4 fill-current" /> : <StarOff className="w-4 h-4" />}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(product)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground" aria-label="Editar">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        {deleteConfirm === product.id ? (
                          <div className="flex items-center gap-1">
                            <button onClick={() => handleDelete(product.id)} className="text-xs bg-destructive text-white px-2 py-1 rounded font-medium">
                              Confirmar
                            </button>
                            <button onClick={() => setDeleteConfirm(null)} className="text-xs text-muted-foreground px-2 py-1">
                              No
                            </button>
                          </div>
                        ) : (
                          <button onClick={() => setDeleteConfirm(product.id)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 transition-colors text-muted-foreground hover:text-destructive" aria-label="Eliminar">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ProductFormModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditingProduct(null) }}
        onSave={handleSave}
        product={editingProduct}
        categories={categories}
        saving={saving}
      />
    </div>
  )
}
