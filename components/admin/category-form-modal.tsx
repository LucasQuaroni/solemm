'use client'

import { useEffect, useState } from 'react'
import { X, Loader2 } from 'lucide-react'
import { generateId } from '@/lib/utils'
import type { Category } from '@/types'

interface Props {
  open: boolean
  onClose: () => void
  onSave: (category: Category) => void
  category: Category | null
  saving?: boolean
}

const emptyCategory = (): Category => ({
  id: generateId(),
  name: '',
  slug: '',
})

export default function CategoryFormModal({ open, onClose, onSave, category, saving = false }: Props) {
  const [form, setForm] = useState<Category>(emptyCategory())
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (category) {
      setForm({ ...category })
    } else {
      setForm(emptyCategory())
    }
    setErrors({})
  }, [category, open])

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
    if (!form.slug.trim()) e.slug = 'El slug es requerido'
    return e
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    onSave(form)
  }

  // Generar slug automáticamente desde el nombre
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    setForm((f) => ({
      ...f,
      name,
      slug: !category ? name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : f.slug
    }))
  }

  if (!open) return null

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50" onClick={onClose} aria-hidden="true" />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h2 className="font-sans text-lg font-bold text-foreground">
              {category ? 'Editar categoría' : 'Nueva categoría'}
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-secondary transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex-1 px-6 py-5">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-body text-sm font-medium text-foreground">
                  Nombre <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={handleNameChange}
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  placeholder="Ej: Carteras de Cuero"
                />
                {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-body text-sm font-medium text-foreground">
                  Slug (URL) <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value.toLowerCase().replace(/[^a-z0-9\-]/g, '') }))}
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  placeholder="carteras-de-cuero"
                />
                <p className="text-xs text-muted-foreground">Debe ser único, sin espacios (usá guiones).</p>
                {errors.slug && <p className="text-xs text-destructive">{errors.slug}</p>}
              </div>
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
              {category ? 'Guardar cambios' : 'Crear categoría'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
