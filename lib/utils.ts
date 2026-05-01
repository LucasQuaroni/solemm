import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(price)
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

import type { Product, Banner, Category, StoreSettings } from '@/types'

export const defaultCategories: Category[] = [
  { id: '1', name: 'Carteras', slug: 'carteras' },
  { id: '2', name: 'Billeteras', slug: 'billeteras' },
  { id: '3', name: 'Cinturones', slug: 'cinturones' },
  { id: '4', name: 'Mochilas', slug: 'mochilas' },
  { id: '5', name: 'Accesorios', slug: 'accesorios' },
]

export const defaultProducts: Product[] = [
  {
    id: '1',
    name: 'Cartera Modelo Sofía',
    price: 45000,
    description:
      'Cartera de cuero vacuno de primera calidad, con forro interior y herrajes dorados. Ideal para el día a día.',
    category: 'carteras',
    images: ['/products/cartera-1.jpg'],
    featured: true,
    stock: 10,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Billetera Slim Classic',
    price: 18000,
    description:
      'Billetera minimalista en cuero liso, con porta tarjetas y billetera. Delgada y resistente.',
    category: 'billeteras',
    images: ['/products/billetera-1.jpg'],
    featured: true,
    stock: 20,
    createdAt: new Date().toISOString(),
  },
]

export const defaultBanners: Banner[] = [
  {
    id: '1',
    image: '/banners/banner-1.jpg',
    title: 'Colección 2025',
    subtitle: 'Cuero artesanal de calidad premium',
    cta: 'Ver productos',
    ctaLink: '/tienda',
  },
]

export const defaultSettings: StoreSettings = {
  whatsappNumber: '5491100000000',
  instagramUrl: 'https://www.instagram.com/solemm_/',
  address: 'Buenos Aires, Argentina',
  email: 'solemm.cueros@gmail.com',
  aboutTitle: 'Pasión por el cuero artesanal',
  aboutText:
    'Solemm Cueros nació de la pasión por los materiales nobles y el trabajo artesanal.',
  aboutImage: '/banners/banner-2.jpg',
}
