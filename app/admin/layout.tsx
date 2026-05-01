'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  Image as ImageIcon,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react'

const ADMIN_PASSWORD = 'solemm2025'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/productos', label: 'Productos', icon: Package },
  { href: '/admin/categorias', label: 'Categorías', icon: Package },
  { href: '/admin/banners', label: 'Banners', icon: ImageIcon },
  { href: '/admin/configuracion', label: 'Configuracion', icon: Settings },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const auth = sessionStorage.getItem('solemm_admin_auth')
    if (auth === 'true') setAuthenticated(true)
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('solemm_admin_auth', 'true')
      setAuthenticated(true)
      setError('')
    } else {
      setError('Contraseña incorrecta')
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('solemm_admin_auth')
    setAuthenticated(false)
    setPassword('')
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-leather-dark px-4">
        <div className="w-full max-w-sm bg-white rounded-xl shadow-2xl p-8">
          <div className="flex flex-col items-center mb-8">
            <Image
              src="/logo.png"
              alt="Solemm Cueros"
              width={72}
              height={72}
              className="rounded-full object-cover mb-4"
            />
            <h1 className="font-sans text-2xl font-bold text-foreground">Administracion</h1>
            <p className="font-body text-sm text-muted-foreground mt-1">Solemm Cueros</p>
          </div>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-body text-sm font-medium text-foreground" htmlFor="password">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 border border-border rounded-lg text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                autoFocus
              />
              {error && <p className="text-xs text-destructive font-body">{error}</p>}
            </div>
            <button
              type="submit"
              className="w-full bg-primary hover:bg-leather text-primary-foreground font-body font-semibold py-2.5 rounded-lg transition-colors"
            >
              Ingresar
            </button>
          </form>
          <p className="text-center text-xs text-muted-foreground mt-6 font-body">
            Contrasena por defecto: <code className="bg-secondary px-1 py-0.5 rounded">solemm2025</code>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex bg-secondary/30">
      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 z-50 md:z-auto h-screen w-64 bg-leather-dark text-cream flex flex-col transition-transform duration-300 md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center gap-3 px-5 py-5 border-b border-cream/10">
          <Image
            src="/logo.png"
            alt="Solemm"
            width={40}
            height={40}
            className="rounded-full object-cover"
          />
          <div>
            <p className="font-sans font-semibold text-sm text-cream leading-tight">Solemm Cueros</p>
            <p className="font-body text-xs text-cream/60">Panel de Admin</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4">
          <ul className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-body transition-colors ${
                      isActive
                        ? 'bg-cream/20 text-cream font-semibold'
                        : 'text-cream/70 hover:text-cream hover:bg-cream/10'
                    }`}
                  >
                    <item.icon className="w-4 h-4 shrink-0" />
                    {item.label}
                    {isActive && <ChevronRight className="w-3 h-3 ml-auto" />}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="px-3 pb-5 border-t border-cream/10 pt-4">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 px-3 py-2 text-xs text-cream/60 hover:text-cream transition-colors font-body"
          >
            Ver tienda
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 text-xs text-cream/60 hover:text-destructive transition-colors font-body w-full text-left"
          >
            <LogOut className="w-3.5 h-3.5" />
            Cerrar sesion
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-border px-4 sm:px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-secondary transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="font-sans font-semibold text-foreground">
            {navItems.find((n) => n.href === pathname)?.label ?? 'Administracion'}
          </h1>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
