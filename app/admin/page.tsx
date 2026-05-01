'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Package, Image as ImageIcon, Settings, ArrowRight, Star } from 'lucide-react'
import { getProducts, getBanners, getSettings } from '@/lib/db'

export default function AdminDashboard() {
  const [productCount, setProductCount] = useState(0)
  const [featuredCount, setFeaturedCount] = useState(0)
  const [bannerCount, setBannerCount] = useState(0)
  const [whatsapp, setWhatsapp] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getProducts(), getBanners(), getSettings()]).then(([products, banners, settings]) => {
      setProductCount(products.length)
      setFeaturedCount(products.filter((p) => p.featured).length)
      setBannerCount(banners.length)
      setWhatsapp(settings.whatsappNumber)
      setLoading(false)
    })
  }, [])

  const stats = [
    { label: 'Productos', value: productCount, icon: Package, href: '/admin/productos', color: 'bg-amber-100 text-amber-700' },
    { label: 'Destacados', value: featuredCount, icon: Star, href: '/admin/productos', color: 'bg-orange-100 text-orange-700' },
    { label: 'Banners', value: bannerCount, icon: ImageIcon, href: '/admin/banners', color: 'bg-stone-100 text-stone-700' },
  ]

  const quickLinks = [
    { href: '/admin/productos', label: 'Gestionar productos', icon: Package, description: 'Agregar, editar y eliminar productos del catalogo' },
    { href: '/admin/banners', label: 'Gestionar banners', icon: ImageIcon, description: 'Administrar los banners del carrusel principal' },
    { href: '/admin/configuracion', label: 'Configuracion', icon: Settings, description: 'WhatsApp, Instagram, datos de la tienda' },
  ]

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h2 className="font-sans text-2xl font-bold text-foreground">Bienvenido</h2>
        <p className="font-body text-sm text-muted-foreground mt-1">
          Desde aqui podes gestionar toda tu tienda online.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white rounded-xl border border-border p-5 hover:shadow-md transition-shadow flex items-center gap-4"
          >
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              {loading ? (
                <div className="w-8 h-7 bg-secondary animate-pulse rounded mb-1" />
              ) : (
                <p className="font-sans text-3xl font-bold text-foreground">{stat.value}</p>
              )}
              <p className="font-body text-sm text-muted-foreground">{stat.label}</p>
            </div>
          </Link>
        ))}
      </div>

      <h3 className="font-body text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-4">
        Acciones rapidas
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {quickLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="bg-white rounded-xl border border-border p-5 hover:shadow-md hover:border-primary/30 transition-all group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                <link.icon className="w-4 h-4 text-primary" />
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
            <h4 className="font-body font-semibold text-sm text-foreground">{link.label}</h4>
            <p className="font-body text-xs text-muted-foreground mt-1 leading-relaxed">{link.description}</p>
          </Link>
        ))}
      </div>

      {!loading && whatsapp === '5491100000000' && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex items-start gap-4">
          <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
            <Settings className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <p className="font-body text-sm font-semibold text-amber-800">Configurar numero de WhatsApp</p>
            <p className="font-body text-xs text-amber-700 mt-0.5">
              El numero de WhatsApp esta usando el valor por defecto.{' '}
              <Link href="/admin/configuracion" className="underline underline-offset-2 font-semibold">
                Actualizarlo aqui
              </Link>
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
