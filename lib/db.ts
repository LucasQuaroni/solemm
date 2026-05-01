'use server'

import clientPromise from './mongo'
import type { Product, Banner, Category, StoreSettings } from '@/types'
import { defaultCategories, defaultProducts, defaultBanners, defaultSettings } from '@/lib/utils'

async function getCollection(name: string) {
  const client = await clientPromise
  const db = client.db('solemm')
  return db.collection(name)
}

// ─── Products ────────────────────────────────────────────────────────────────

export async function getProducts(): Promise<Product[]> {
  try {
    const col = await getCollection('products')
    const products = await col.find({}, { projection: { _id: 0 } }).sort({ createdAt: -1 }).toArray()
    if (products.length === 0) {
      await Promise.all(defaultProducts.map((p) => col.insertOne({ ...p })))
      return defaultProducts
    }
    return products as unknown as Product[]
  } catch (error) {
    console.error('getProducts error:', error)
    return defaultProducts
  }
}

export async function saveProduct(product: Product): Promise<void> {
  const col = await getCollection('products')
  await col.updateOne({ id: product.id }, { $set: product }, { upsert: true })
}

export async function deleteProduct(id: string): Promise<void> {
  const col = await getCollection('products')
  await col.deleteOne({ id })
}

// ─── Banners ─────────────────────────────────────────────────────────────────

export async function getBanners(): Promise<Banner[]> {
  try {
    const col = await getCollection('banners')
    const banners = await col.find({}, { projection: { _id: 0 } }).toArray()
    if (banners.length === 0) {
      await Promise.all(defaultBanners.map((b) => col.insertOne({ ...b })))
      return defaultBanners
    }
    return banners as unknown as Banner[]
  } catch (error) {
    console.error('getBanners error:', error)
    return defaultBanners
  }
}

export async function saveBanner(banner: Banner): Promise<void> {
  const col = await getCollection('banners')
  await col.updateOne({ id: banner.id }, { $set: banner }, { upsert: true })
}

export async function deleteBanner(id: string): Promise<void> {
  const col = await getCollection('banners')
  await col.deleteOne({ id })
}

// ─── Categories ──────────────────────────────────────────────────────────────

export async function getCategories(): Promise<Category[]> {
  try {
    const col = await getCollection('categories')
    const categories = await col.find({}, { projection: { _id: 0 } }).toArray()
    if (categories.length === 0) {
      await Promise.all(defaultCategories.map((c) => col.insertOne({ ...c })))
      return defaultCategories
    }
    return categories as unknown as Category[]
  } catch (error) {
    console.error('getCategories error:', error)
    return defaultCategories
  }
}

export async function saveCategory(category: Category): Promise<void> {
  const col = await getCollection('categories')
  await col.updateOne({ id: category.id }, { $set: category }, { upsert: true })
}

export async function deleteCategory(id: string): Promise<void> {
  const col = await getCollection('categories')
  await col.deleteOne({ id })
}

// ─── Settings ────────────────────────────────────────────────────────────────

export async function getSettings(): Promise<StoreSettings> {
  try {
    const col = await getCollection('settings')
    const setting = await col.findOne({ id: 'main' }, { projection: { _id: 0 } })
    if (!setting) {
      await col.insertOne({ id: 'main', ...defaultSettings })
      return defaultSettings
    }
    return setting as unknown as StoreSettings
  } catch (error) {
    console.error('getSettings error:', error)
    return defaultSettings
  }
}

export async function saveSettings(settings: StoreSettings): Promise<void> {
  const col = await getCollection('settings')
  await col.updateOne({ id: 'main' }, { $set: settings }, { upsert: true })
}

// ─── Cloudinary Upload ───────────────────────────────────────────────────────

export async function uploadImage(file: File, folder: string): Promise<string> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

  if (!cloudName || !uploadPreset) {
    throw new Error('Faltan credenciales de Cloudinary en las variables de entorno.')
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', uploadPreset)
  formData.append('folder', folder)

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    throw new Error('Error al subir la imagen a Cloudinary')
  }

  const data = await response.json()
  return data.secure_url
}
