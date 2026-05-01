'use client'

import { useEffect, useState } from 'react'
import { MapPin, Mail, Instagram, Send, Check } from 'lucide-react'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import WhatsAppButton from '@/components/layout/whatsapp-button'
import { getSettings } from '@/lib/db'
import type { StoreSettings } from '@/types'

export default function ContactoPage() {
  const [settings, setSettings] = useState<StoreSettings | null>(null)
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [sent, setSent] = useState(false)

  useEffect(() => {
    getSettings().then(setSettings)
  }, [])

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.name.trim()) e.name = 'Tu nombre es requerido'
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = 'Email invalido'
    if (!form.message.trim()) e.message = 'El mensaje es requerido'
    return e
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    // Send via WhatsApp
    const whatsapp = settings?.whatsappNumber ?? '5491100000000'
    const message = encodeURIComponent(
      `Consulta desde el sitio web:\n\n*Nombre:* ${form.name}\n*Email:* ${form.email}\n\n*Mensaje:*\n${form.message}`
    )
    window.open(`https://wa.me/${whatsapp}?text=${message}`, '_blank')
    setSent(true)
    setForm({ name: '', email: '', message: '' })
    setErrors({})
    setTimeout(() => setSent(false), 4000)
  }

  const whatsappUrl = settings
    ? `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent('Hola! Me gustaría hacer una consulta.')}`
    : '#'

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16 md:pt-20">
        {/* Header */}
        <div className="bg-leather-dark text-cream py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="font-body text-xs tracking-widest uppercase text-cream/60">
              Escribinos
            </span>
            <h1 className="font-sans text-3xl md:text-4xl font-bold mt-2">Contacto</h1>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
            {/* Contact info */}
            <div className="lg:col-span-2 flex flex-col gap-8">
              <div>
                <h2 className="font-sans text-2xl font-bold text-foreground mb-2">
                  Hablemos
                </h2>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">
                  Tenes alguna consulta sobre nuestros productos o queres hacer un pedido a
                  medida? Escribinos y te respondemos a la brevedad.
                </p>
              </div>

              <div className="flex flex-col gap-5">
                {/* WhatsApp */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 group"
                >
                  <div className="w-10 h-10 rounded-full bg-[#25D366]/10 flex items-center justify-center shrink-0 group-hover:bg-[#25D366]/20 transition-colors">
                    <svg className="w-5 h-5 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-body text-sm font-semibold text-foreground">WhatsApp</p>
                    <p className="font-body text-xs text-muted-foreground mt-0.5">
                      Escribinos directo, respuesta rapida
                    </p>
                  </div>
                </a>

                {/* Instagram */}
                {settings?.instagramUrl && (
                  <a
                    href={settings.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-4 group"
                  >
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0 group-hover:bg-border transition-colors">
                      <Instagram className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-body text-sm font-semibold text-foreground">Instagram</p>
                      <p className="font-body text-xs text-muted-foreground mt-0.5">@solemm_</p>
                    </div>
                  </a>
                )}

                {/* Email */}
                {settings?.email && (
                  <a
                    href={`mailto:${settings.email}`}
                    className="flex items-start gap-4 group"
                  >
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0 group-hover:bg-border transition-colors">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-body text-sm font-semibold text-foreground">Email</p>
                      <p className="font-body text-xs text-muted-foreground mt-0.5">{settings.email}</p>
                    </div>
                  </a>
                )}

                {/* Address */}
                {settings?.address && (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-body text-sm font-semibold text-foreground">Ubicacion</p>
                      <p className="font-body text-xs text-muted-foreground mt-0.5">{settings.address}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl border border-border p-6 sm:p-8 shadow-sm">
                <h3 className="font-sans text-lg font-bold text-foreground mb-6">
                  Envianos un mensaje
                </h3>

                {sent ? (
                  <div className="flex flex-col items-center gap-4 py-8 text-center">
                    <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
                      <Check className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="font-body font-semibold text-foreground">
                        Mensaje enviado por WhatsApp
                      </p>
                      <p className="font-body text-sm text-muted-foreground mt-1">
                        Te contactaremos a la brevedad.
                      </p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-body text-sm font-medium text-foreground">
                        Tu nombre <span className="text-destructive">*</span>
                      </label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                        className="w-full px-3 py-2.5 border border-border rounded-lg text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                        placeholder="Maria Garcia"
                      />
                      {errors.name && <p className="text-xs text-destructive font-body">{errors.name}</p>}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-body text-sm font-medium text-foreground">
                        Email <span className="text-destructive">*</span>
                      </label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                        className="w-full px-3 py-2.5 border border-border rounded-lg text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                        placeholder="maria@gmail.com"
                      />
                      {errors.email && <p className="text-xs text-destructive font-body">{errors.email}</p>}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-body text-sm font-medium text-foreground">
                        Mensaje <span className="text-destructive">*</span>
                      </label>
                      <textarea
                        value={form.message}
                        onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                        rows={5}
                        className="w-full px-3 py-2.5 border border-border rounded-lg text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
                        placeholder="Hola! Quisiera consultar sobre..."
                      />
                      {errors.message && (
                        <p className="text-xs text-destructive font-body">{errors.message}</p>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="self-start flex items-center gap-2 bg-primary hover:bg-leather text-primary-foreground font-body font-semibold py-3 px-8 rounded-sm transition-colors tracking-wide uppercase text-sm mt-2"
                    >
                      <Send className="w-4 h-4" />
                      Enviar por WhatsApp
                    </button>
                    <p className="text-xs text-muted-foreground font-body">
                      Al enviar, te redirigira a WhatsApp con tu mensaje listo.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}
