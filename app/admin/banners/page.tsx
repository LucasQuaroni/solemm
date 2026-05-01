'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { getBanners, saveBanner, deleteBanner } from '@/lib/db'
import type { Banner } from '@/types'
import BannerFormModal from '@/components/admin/banner-form-modal'

export default function AdminBanners() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    getBanners().then((b) => {
      setBanners(b)
      setLoading(false)
    })
  }, [])

  const handleSave = async (banner: Banner) => {
    setSaving(true)
    await saveBanner(banner)
    if (editingBanner) {
      setBanners((prev) => prev.map((b) => (b.id === banner.id ? banner : b)))
    } else {
      setBanners((prev) => [banner, ...prev])
    }
    setSaving(false)
    setModalOpen(false)
    setEditingBanner(null)
  }

  const handleDelete = async (id: string) => {
    await deleteBanner(id)
    setBanners((prev) => prev.filter((b) => b.id !== id))
    setDeleteConfirm(null)
  }

  const openNew = () => {
    setEditingBanner(null)
    setModalOpen(true)
  }

  const openEdit = (banner: Banner) => {
    setEditingBanner(banner)
    setModalOpen(true)
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-sans text-xl font-bold text-foreground">Banners</h2>
          <p className="font-body text-sm text-muted-foreground mt-0.5">
            {banners.length} banners en el carrusel
          </p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-primary hover:bg-leather text-primary-foreground font-body font-semibold text-sm py-2.5 px-5 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nuevo banner
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-secondary animate-pulse rounded-xl aspect-video" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {banners.length === 0 ? (
            <div className="col-span-2 bg-white rounded-xl border border-border p-12 text-center">
              <p className="font-body text-sm text-muted-foreground">No hay banners configurados</p>
            </div>
          ) : (
            banners.map((banner) => (
              <div key={banner.id} className="bg-white rounded-xl border border-border overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative aspect-video">
                  <Image src={banner.image} alt={banner.title} fill className="object-cover" />
                </div>
                <div className="p-4">
                  <h3 className="font-body font-semibold text-foreground text-sm">{banner.title}</h3>
                  <p className="font-body text-xs text-muted-foreground mt-0.5 line-clamp-2">{banner.subtitle}</p>
                  <div className="flex items-center gap-2 mt-4">
                    <button
                      onClick={() => openEdit(banner)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-body font-medium bg-secondary hover:bg-border rounded-lg transition-colors"
                    >
                      <Pencil className="w-3 h-3" />
                      Editar
                    </button>
                    {deleteConfirm === banner.id ? (
                      <div className="flex-1 flex items-center gap-1">
                        <button onClick={() => handleDelete(banner.id)} className="flex-1 text-xs bg-destructive text-white px-2 py-2 rounded-lg font-semibold">
                          Confirmar
                        </button>
                        <button onClick={() => setDeleteConfirm(null)} className="text-xs text-muted-foreground px-2 py-2">
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(banner.id)}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-body font-medium bg-red-50 hover:bg-red-100 text-destructive rounded-lg transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                        Eliminar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <BannerFormModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditingBanner(null) }}
        onSave={handleSave}
        banner={editingBanner}
        saving={saving}
      />
    </div>
  )
}
