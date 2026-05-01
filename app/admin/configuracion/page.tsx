'use client'

import { useEffect, useState } from 'react'
import { Save, Check, Loader2 } from 'lucide-react'
import { getSettings, saveSettings } from '@/lib/db'
import type { StoreSettings } from '@/types'

const defaultForm: StoreSettings = {
  whatsappNumber: '',
  instagramUrl: '',
  address: '',
  email: '',
  aboutTitle: '',
  aboutText: '',
  aboutImage: '',
}

export default function AdminConfiguracion() {
  const [form, setForm] = useState<StoreSettings>(defaultForm)
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved'>('idle')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSettings().then((s) => {
      setForm(s)
      setLoading(false)
    })
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('saving')
    await saveSettings(form)
    setStatus('saved')
    setTimeout(() => setStatus('idle'), 2000)
  }

  const field = (
    label: string,
    key: keyof StoreSettings,
    opts?: { type?: string; placeholder?: string; hint?: string; textarea?: boolean }
  ) => (
    <div className="flex flex-col gap-1.5">
      <label className="font-body text-sm font-medium text-foreground">{label}</label>
      {opts?.textarea ? (
        <textarea
          value={form[key]}
          onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
          rows={4}
          className="w-full px-3 py-2.5 border border-border rounded-lg text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
          placeholder={opts?.placeholder}
          disabled={loading}
        />
      ) : (
        <input
          type={opts?.type ?? 'text'}
          value={form[key]}
          onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
          className="w-full px-3 py-2.5 border border-border rounded-lg text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary disabled:opacity-60"
          placeholder={opts?.placeholder}
          disabled={loading}
        />
      )}
      {opts?.hint && <p className="text-xs text-muted-foreground font-body">{opts.hint}</p>}
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="font-sans text-xl font-bold text-foreground">Configuracion</h2>
        <p className="font-body text-sm text-muted-foreground mt-0.5">
          Datos de contacto y configuracion de la tienda
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : (
        <form onSubmit={handleSave} className="flex flex-col gap-6">
          <div className="bg-white rounded-xl border border-border p-6">
            <h3 className="font-body font-semibold text-sm text-foreground mb-4 uppercase tracking-wide">WhatsApp</h3>
            <div className="flex flex-col gap-4">
              {field('Numero de WhatsApp', 'whatsappNumber', {
                placeholder: '5491112345678',
                hint: 'Ingresa el numero con codigo de pais, sin espacios ni +. Ej: 5491112345678',
              })}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-border p-6">
            <h3 className="font-body font-semibold text-sm text-foreground mb-4 uppercase tracking-wide">Redes sociales</h3>
            <div className="flex flex-col gap-4">
              {field('URL de Instagram', 'instagramUrl', {
                placeholder: 'https://www.instagram.com/solemm_/',
              })}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-border p-6">
            <h3 className="font-body font-semibold text-sm text-foreground mb-4 uppercase tracking-wide">Datos de contacto</h3>
            <div className="flex flex-col gap-4">
              {field('Direccion', 'address', { placeholder: 'Buenos Aires, Argentina' })}
              {field('Email', 'email', { type: 'email', placeholder: 'solemm.cueros@gmail.com' })}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-border p-6">
            <h3 className="font-body font-semibold text-sm text-foreground mb-4 uppercase tracking-wide">
              Seccion &quot;Quienes somos&quot;
            </h3>
            <div className="flex flex-col gap-4">
              {field('Titulo', 'aboutTitle', { placeholder: 'Pasion por el cuero artesanal' })}
              {field('Texto', 'aboutText', {
                textarea: true,
                placeholder: 'Escribe la historia de tu marca...',
              })}
              {field('Imagen (URL)', 'aboutImage', {
                placeholder: '/banners/banner-2.jpg o URL externa',
                hint: 'URL de la imagen que aparece en la seccion Quienes somos',
              })}
            </div>
          </div>

          <button
            type="submit"
            disabled={status === 'saving'}
            className={`self-end flex items-center gap-2 py-2.5 px-8 rounded-lg font-body font-semibold text-sm transition-all ${
              status === 'saved'
                ? 'bg-green-500 text-white'
                : 'bg-primary hover:bg-leather text-primary-foreground disabled:opacity-70'
            }`}
          >
            {status === 'saving' ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Guardando...
              </>
            ) : status === 'saved' ? (
              <>
                <Check className="w-4 h-4" />
                Guardado
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Guardar cambios
              </>
            )}
          </button>
        </form>
      )}
    </div>
  )
}
