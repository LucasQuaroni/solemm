'use client'

import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { getCategories, saveCategory, deleteCategory } from '@/lib/db'
import type { Category } from '@/types'
import CategoryFormModal from '@/components/admin/category-form-modal'

export default function AdminCategorias() {
  const [categories, setCategories] = useState<Category[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    getCategories().then((cats) => {
      setCategories(cats)
      setLoading(false)
    })
  }, [])

  const handleSave = async (category: Category) => {
    setSaving(true)
    await saveCategory(category)
    if (editingCategory) {
      setCategories((prev) => prev.map((c) => (c.id === category.id ? category : c)))
    } else {
      setCategories((prev) => [category, ...prev])
    }
    setSaving(false)
    setModalOpen(false)
    setEditingCategory(null)
  }

  const handleDelete = async (id: string) => {
    await deleteCategory(id)
    setCategories((prev) => prev.filter((c) => c.id !== id))
    setDeleteConfirm(null)
  }

  const openNew = () => {
    setEditingCategory(null)
    setModalOpen(true)
  }

  const openEdit = (category: Category) => {
    setEditingCategory(category)
    setModalOpen(true)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h2 className="font-sans text-xl font-bold text-foreground">Categorías</h2>
          <p className="font-body text-sm text-muted-foreground mt-0.5">
            {categories.length} categorías en total
          </p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-primary hover:bg-leather text-primary-foreground font-body font-semibold text-sm py-2.5 px-5 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nueva categoría
        </button>
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-body">
            <thead>
              <tr className="border-b border-border bg-secondary/40">
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide">Nombre</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide">Slug</th>
                <th className="text-right px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="border-b border-border">
                    <td colSpan={3} className="px-4 py-4">
                      <div className="h-8 bg-secondary animate-pulse rounded" />
                    </td>
                  </tr>
                ))
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-12 text-muted-foreground">
                    No hay categorías
                  </td>
                </tr>
              ) : (
                categories.map((category) => (
                  <tr key={category.id} className="border-b border-border last:border-0 hover:bg-secondary/20 transition-colors">
                    <td className="px-4 py-3 font-medium text-foreground">{category.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{category.slug}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(category)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground" aria-label="Editar">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        {deleteConfirm === category.id ? (
                          <div className="flex items-center gap-1">
                            <button onClick={() => handleDelete(category.id)} className="text-xs bg-destructive text-white px-2 py-1 rounded font-medium">
                              Confirmar
                            </button>
                            <button onClick={() => setDeleteConfirm(null)} className="text-xs text-muted-foreground px-2 py-1">
                              No
                            </button>
                          </div>
                        ) : (
                          <button onClick={() => setDeleteConfirm(category.id)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 transition-colors text-muted-foreground hover:text-destructive" aria-label="Eliminar">
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

      <CategoryFormModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditingCategory(null) }}
        onSave={handleSave}
        category={editingCategory}
        saving={saving}
      />
    </div>
  )
}
