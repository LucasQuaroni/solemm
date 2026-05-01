export interface Product {
  id: string
  name: string
  price: number
  description: string
  category: string
  images: string[]
  featured: boolean
  stock: number
  createdAt: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface Banner {
  id: string
  image: string
  title: string
  subtitle: string
  cta: string
  ctaLink: string
}

export interface Category {
  id: string
  name: string
  slug: string
}

export interface StoreSettings {
  whatsappNumber: string
  instagramUrl: string
  address: string
  email: string
  aboutTitle: string
  aboutText: string
  aboutImage: string
}
