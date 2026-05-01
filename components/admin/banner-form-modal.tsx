'use client'

import { useEffect, useState } from 'react'
import { X, Loader2 } from 'lucide-react'
import { uploadImage } from '@/lib/db'
import { generateId } from '@/lib/utils'
import type { Banner } from '@/types'

interface Props {
  open: boolean
  onClose: () => void
  onSave: (banner: Banner) => void
  banner: Banner | null
  saving?: boolean
}

const emptyBanner = (): Banner => ({
  id: generateId(),
  image: '',
  title: '',
  subtitle: '',
  cta: 'Ver productos',
  ctaLink: '/tienda',
})

export default function BannerFormModal({ open, onClose, onSave, banner, saving = false }: Props) {
  const [form, setForm] = useState<Banner>(emptyBanner())
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (banner) {
      setForm({ ...banner })
    } else {
      setForm(emptyBanner())
    }
    setErrors({})
  }, [banner, open])

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
    if (!form.image.trim()) e.image = 'La URL de la imagen es requerida'
    if (!form.title.trim()) e.title = 'El titulo es requerido'
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
      const url = await uploadImage(file, 'banners')
      setForm((f) => ({ ...f, image: url }))
    } catch (err) {
      console.error('Error uploading image', err)
      alert('Error al subir la imagen')
    } finally {
      setIsUploadingImage(false)
    }
  }

  if (!open) return null

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50" onClick={onClose} aria-hidden="true" />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h2 className="font-sans text-lg font-bold text-foreground">
              {banner ? 'Editar banner' : 'Nuevo banner'}
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
              <div className="flex flex-col gap-1.5">
                <label className="font-body text-sm font-medium text-foreground">
                  Imagen <span className="text-destructive">*</span>
                </label>
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
                {form.image && (
                  <div className="mt-2">
                    <img src={form.image} alt="Preview" className="w-full h-32 object-cover rounded-lg border border-border" />
                  </div>
                )}
                {errors.image && <p className="text-xs text-destructive">{errors.image}</p>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-body text-sm font-medium text-foreground">
                  Titulo <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  placeholder="Coleccion 2025"
                />
                {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-body text-sm font-medium text-foreground">Subtitulo</label>
                <input
                  type="text"
                  value={form.subtitle}
                  onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  placeholder="Cuero artesanal de calidad premium"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-body text-sm font-medium text-foreground">Texto del boton</label>
                <input
                  type="text"
                  value={form.cta}
                  onChange={(e) => setForm((f) => ({ ...f, cta: e.target.value }))}
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  placeholder="Ver productos"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-body text-sm font-medium text-foreground">Link del boton</label>
                <input
                  type="text"
                  value={form.ctaLink}
                  onChange={(e) => setForm((f) => ({ ...f, ctaLink: e.target.value }))}
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  placeholder="/tienda"
                />
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
              {banner ? 'Guardar cambios' : 'Crear banner'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
