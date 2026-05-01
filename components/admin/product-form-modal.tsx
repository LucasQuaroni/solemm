'use client'

import { useEffect, useState } from 'react'
import { X, Plus, Trash2, Loader2 } from 'lucide-react'
import { uploadImage } from '@/lib/db'
import { generateId } from '@/lib/utils'
import type { Product, Category } from '@/types'

interface Props {
  open: boolean
  onClose: () => void
  onSave: (product: Product) => void
  product: Product | null
  categories: Category[]
  saving?: boolean
}

const emptyProduct = (): Product => ({
  id: generateId(),
  name: '',
  price: 0,
  description: '',
  category: '',
  images: [],
  featured: false,
  stock: 0,
  createdAt: new Date().toISOString(),
})

export default function ProductFormModal({ open, onClose, onSave, product, categories, saving = false }: Props) {
  const [form, setForm] = useState<Product>(emptyProduct())
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (product) {
      setForm({ ...product })
    } else {
      setForm(emptyProduct())
    }
    setErrors({})
  }, [product, open])

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.name.trim()) e.name = 'El nombre es requerido'
    if (form.price <= 0) e.price = 'El precio debe ser mayor a 0'
    if (!form.category) e.category = 'Selecciona una categoria'
    return e
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    onSave(form)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    setIsUploadingImage(true)
    try {
      const url = await uploadImage(file, 'products')
      setForm((f) => ({ ...f, images: [...f.images, url] }))
    } catch (err) {
      console.error('Error uploading image', err)
      alert('Error al subir la imagen')
    } finally {
      setIsUploadingImage(false)
    }
  }

  const removeImage = (i: number) => {
    setForm((f) => ({ ...f, images: f.images.filter((_, idx) => idx !== i) }))
  }

  if (!open) return null

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50" onClick={onClose} aria-hidden="true" />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h2 className="font-sans text-lg font-bold text-foreground">
              {product ? 'Editar producto' : 'Nuevo producto'}
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-secondary transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5">
            <div className="flex flex-col gap-4">
              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <label className="font-body text-sm font-medium text-foreground">
                  Nombre <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  placeholder="Ej: Cartera Modelo Sofia"
                />
                {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
              </div>

              {/* Price + Stock */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-body text-sm font-medium text-foreground">
                    Precio (ARS) <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={form.price || ''}
                    onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))}
                    className="w-full px-3 py-2.5 border border-border rounded-lg text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    placeholder="45000"
                  />
                  {errors.price && <p className="text-xs text-destructive">{errors.price}</p>}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-body text-sm font-medium text-foreground">Stock</label>
                  <input
                    type="number"
                    min={0}
                    value={form.stock || ''}
                    onChange={(e) => setForm((f) => ({ ...f, stock: Number(e.target.value) }))}
                    className="w-full px-3 py-2.5 border border-border rounded-lg text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    placeholder="10"
                  />
                </div>
              </div>

              {/* Category */}
              <div className="flex flex-col gap-1.5">
                <label className="font-body text-sm font-medium text-foreground">
                  Categoria <span className="text-destructive">*</span>
                </label>
                <select
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white"
                >
                  <option value="">Seleccionar categoria</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>{c.name}</option>
                  ))}
                </select>
                {errors.category && <p className="text-xs text-destructive">{errors.category}</p>}
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label className="font-body text-sm font-medium text-foreground">Descripcion</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
                  placeholder="Descripcion del producto..."
                />
              </div>

              {/* Images */}
              <div className="flex flex-col gap-1.5">
                <label className="font-body text-sm font-medium text-foreground">Imagenes</label>
                <div className="flex gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploadingImage}
                    className="flex-1 px-3 py-2.5 border border-border rounded-lg text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                  />
                  {isUploadingImage && (
                    <div className="flex items-center justify-center px-3">
                      <Loader2 className="w-5 h-5 animate-spin text-primary" />
                    </div>
                  )}
                </div>
                {form.images.length > 0 && (
                  <ul className="flex flex-col gap-2 mt-2">
                    {form.images.map((img, i) => (
                      <li key={i} className="flex items-center gap-2 bg-secondary/50 rounded-lg px-3 py-2">
                        <img src={img} alt="" className="w-8 h-8 object-cover rounded" />
                        <span className="flex-1 text-xs text-muted-foreground truncate font-body">{img}</span>
                        <button
                          type="button"
                          onClick={() => removeImage(i)}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                <p className="text-xs text-muted-foreground font-body">Selecciona una imagen de tu computadora</p>
              </div>

              {/* Featured */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
                  className="w-4 h-4 accent-primary"
                />
                <span className="font-body text-sm text-foreground">Mostrar en productos destacados</span>
              </label>
            </div>
          </form>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-body font-medium text-foreground hover:bg-secondary rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="px-6 py-2.5 text-sm font-body font-semibold bg-primary hover:bg-leather text-primary-foreground rounded-lg transition-colors flex items-center gap-2 disabled:opacity-70"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {product ? 'Guardar cambios' : 'Crear producto'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
