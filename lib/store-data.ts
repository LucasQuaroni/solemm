import type { Product, Banner, Category, StoreSettings } from '@/types'

const PRODUCTS_KEY = 'solemm_products'
const BANNERS_KEY = 'solemm_banners'
const CATEGORIES_KEY = 'solemm_categories'
const SETTINGS_KEY = 'solemm_settings'

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
  {
    id: '3',
    name: 'Cinturón Premium',
    price: 12000,
    description:
      'Cinturón de cuero genuino con hebilla plateada. Disponible en varios talles.',
    category: 'cinturones',
    images: ['/products/cinturon-1.jpg'],
    featured: true,
    stock: 15,
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Mochila Urban',
    price: 68000,
    description:
      'Mochila de cuero resistente, ideal para el trabajo o la ciudad. Bolsillos organizadores.',
    category: 'mochilas',
    images: ['/products/mochila-1.jpg'],
    featured: true,
    stock: 5,
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
  {
    id: '2',
    image: '/banners/banner-2.jpg',
    title: 'Hecho a mano',
    subtitle: 'Cada pieza, una obra única',
    cta: 'Conocenos',
    ctaLink: '/#nosotros',
  },
  {
    id: '3',
    image: '/banners/banner-3.jpg',
    title: 'Regalos únicos',
    subtitle: 'El regalo que siempre se recuerda',
    cta: 'Ver accesorios',
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
    'Solemm Cueros nació de la pasión por los materiales nobles y el trabajo artesanal. Cada pieza es elaborada con cuero seleccionado de primera calidad, cuidando cada detalle desde el corte hasta el acabado final. Creemos en la durabilidad, el estilo y la identidad de cada accesorio.',
  aboutImage: '/banners/banner-2.jpg',
}

function isServer() {
  return typeof window === 'undefined'
}

export function getProducts(): Product[] {
  if (isServer()) return defaultProducts
  try {
    const data = localStorage.getItem(PRODUCTS_KEY)
    return data ? JSON.parse(data) : defaultProducts
  } catch {
    return defaultProducts
  }
}

export function saveProducts(products: Product[]): void {
  if (isServer()) return
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products))
}

export function getBanners(): Banner[] {
  if (isServer()) return defaultBanners
  try {
    const data = localStorage.getItem(BANNERS_KEY)
    return data ? JSON.parse(data) : defaultBanners
  } catch {
    return defaultBanners
  }
}

export function saveBanners(banners: Banner[]): void {
  if (isServer()) return
  localStorage.setItem(BANNERS_KEY, JSON.stringify(banners))
}

export function getCategories(): Category[] {
  if (isServer()) return defaultCategories
  try {
    const data = localStorage.getItem(CATEGORIES_KEY)
    return data ? JSON.parse(data) : defaultCategories
  } catch {
    return defaultCategories
  }
}

export function saveCategories(categories: Category[]): void {
  if (isServer()) return
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories))
}

export function getSettings(): StoreSettings {
  if (isServer()) return defaultSettings
  try {
    const data = localStorage.getItem(SETTINGS_KEY)
    return data ? JSON.parse(data) : defaultSettings
  } catch {
    return defaultSettings
  }
}

export function saveSettings(settings: StoreSettings): void {
  if (isServer()) return
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(price)
}
