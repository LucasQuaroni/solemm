'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Instagram, MapPin, Mail } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getSettings } from '@/lib/db'
import type { StoreSettings } from '@/types'

export default function Footer() {
  const [settings, setSettings] = useState<StoreSettings | null>(null)

  useEffect(() => {
    getSettings().then(setSettings)
  }, [])

  const whatsappUrl = settings
    ? `https://wa.me/${settings.whatsappNumber}`
    : 'https://wa.me/5491100000000'

  return (
    <footer className="bg-leather-dark text-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="Solemm Cueros"
                width={56}
                height={56}
                className="rounded-full object-cover"
              />
              <div>
                <p className="font-sans text-lg font-semibold text-cream leading-tight">Solemm</p>
                <p className="font-body text-xs tracking-widest uppercase text-cream/70">Cueros</p>
              </div>
            </div>
            <p className="font-body text-sm text-cream/70 leading-relaxed">
              Marroquinería artesanal de calidad premium. Cada pieza, una historia.
            </p>
            <div className="flex items-center gap-3 mt-2">
              <a
                href={settings?.instagramUrl ?? '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-9 h-9 rounded-full bg-cream/10 hover:bg-cream/20 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-9 h-9 rounded-full bg-cream/10 hover:bg-cream/20 transition-colors"
                aria-label="WhatsApp"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-sans text-sm font-semibold tracking-widest uppercase text-cream/50 mb-4">
              Navegacion
            </h3>
            <ul className="flex flex-col gap-2">
              {[
                { href: '/', label: 'Inicio' },
                { href: '/tienda', label: 'Tienda' },
                { href: '/#nosotros', label: 'Nosotros' },
                { href: '/contacto', label: 'Contacto' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-body text-sm text-cream/70 hover:text-cream transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-sans text-sm font-semibold tracking-widest uppercase text-cream/50 mb-4">
              Contacto
            </h3>
            <ul className="flex flex-col gap-3">
              {settings?.address && (
                <li className="flex items-start gap-2 text-sm text-cream/70">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{settings.address}</span>
                </li>
              )}
              {settings?.email && (
                <li className="flex items-center gap-2 text-sm text-cream/70">
                  <Mail className="w-4 h-4 shrink-0" />
                  <a href={`mailto:${settings.email}`} className="hover:text-cream transition-colors">
                    {settings.email}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-cream/10 mt-10 pt-6 text-center">
          <p className="font-body text-xs text-cream/40">
            &copy; {new Date().getFullYear()} Solemm Cueros. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
