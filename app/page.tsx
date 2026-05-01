'use client'

import { useEffect, useState } from 'react'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import WhatsAppButton from '@/components/layout/whatsapp-button'
import HeroCarousel from '@/components/home/hero-carousel'
import AboutSection from '@/components/home/about-section'
import FeaturedProducts from '@/components/home/featured-products'
import { ShieldCheck, Truck, MessageCircleHeart } from 'lucide-react'
import { motion } from 'framer-motion'
import {
  getBanners,
  getProducts,
  getSettings,
} from '@/lib/db'
import {
  defaultBanners,
  defaultProducts,
  defaultSettings,
} from '@/lib/utils'
import type { Banner, Product, StoreSettings } from '@/types'

export default function HomePage() {
  const [banners, setBanners] = useState<Banner[]>(defaultBanners)
  const [products, setProducts] = useState<Product[]>(defaultProducts.filter((p) => p.featured))
  const [settings, setSettings] = useState<StoreSettings>(defaultSettings)

  useEffect(() => {
    getBanners().then(setBanners)
    getProducts().then((all) => setProducts(all.filter((p) => p.featured)))
    getSettings().then(setSettings)
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="pt-16 md:pt-20"
        >
          <HeroCarousel banners={banners} />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-primary text-primary-foreground py-6 border-b border-border/20"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex sm:grid sm:grid-cols-3 gap-4 sm:gap-8 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-2 sm:pb-0">
              {[
                { text: 'Cuero genuino 100%', icon: ShieldCheck },
                { text: 'Envíos a todo el país', icon: Truck },
                { text: 'Atención por WhatsApp', icon: MessageCircleHeart },
              ].map((item, i) => (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.3 + (i * 0.1) }}
                  key={item.text} 
                  className="snap-center shrink-0 w-[85%] sm:w-auto flex items-center justify-center gap-3 bg-white/5 sm:bg-transparent border border-white/10 sm:border-transparent py-3.5 sm:py-0 px-6 rounded-2xl sm:rounded-none"
                >
                  <item.icon className="w-5 h-5 text-cream shrink-0" />
                  <span className="font-body text-sm font-medium tracking-wide text-cream/90">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <FeaturedProducts products={products} />
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
        >
          <AboutSection settings={settings} />
        </motion.div>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}
