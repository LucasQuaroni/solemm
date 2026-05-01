import type { Metadata } from 'next'
import { Playfair_Display, Lato } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { CartProvider } from '@/contexts/cart-context'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
})

const lato = Lato({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-lato',
})

export const metadata: Metadata = {
  title: 'Solemm Cueros | Marroquinería Artesanal',
  description:
    'Carteras, billeteras, cinturones y accesorios de cuero artesanal. Calidad premium, hecho a mano.',
  keywords: ['cuero', 'marroquinería', 'carteras', 'billeteras', 'cinturones', 'artesanal'],
  icons: {
    icon: '/logo.png',
  },
  openGraph: {
    title: 'Solemm Cueros',
    description: 'Marroquinería artesanal de calidad premium.',
    images: ['/logo.png'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${playfair.variable} ${lato.variable} bg-background`}>
      <body className="font-body antialiased">
        <CartProvider>{children}</CartProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
