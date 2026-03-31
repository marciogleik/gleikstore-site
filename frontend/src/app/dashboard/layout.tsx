'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { User, Smartphone, FileText, Camera, LogOut, Home, Shield, Search, ShoppingCart, Package, Menu, X as CloseIcon, Signature } from 'lucide-react'
import { getMe, removeToken } from '@/lib/api'
import type { User as UserType } from '@/lib/api'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [user, setUser] = useState<UserType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await getMe()
        setUser(response.user)
      } catch {
        removeToken()
        router.push('/login')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const handleLogout = () => {
    removeToken()
    router.push('/login')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const navItems = [
    { href: '/dashboard', icon: User, label: 'Dados Pessoais' },
    { href: '/dashboard/device', icon: Smartphone, label: 'Meu Aparelho' },
    { href: '/dashboard/photo', icon: Camera, label: 'Foto de Perfil' },
    { href: '/dashboard/documents', icon: FileText, label: 'Documentos' },
    { href: '/dashboard/contracts', icon: Signature, label: 'Contratos' },
  ]

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-zinc-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-zinc-700 to-zinc-900 flex items-center justify-center border border-zinc-700 group-hover:border-zinc-500 transition-colors">
                 <Smartphone className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tighter text-white">
                Gleik<span className="text-zinc-500">store</span>
              </span>
            </Link>

            <div className="flex items-center gap-2 sm:gap-4">
              <span className="text-sm text-zinc-400 hidden sm:block capitalize">
                Olá, {user?.name?.split(' ')[0].toLowerCase()}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-500 hover:text-white transition-colors rounded-lg hover:bg-zinc-900"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sair</span>
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-zinc-400 hover:text-white transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <CloseIcon className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className={`
            lg:w-64 flex-shrink-0 
            ${isMobileMenuOpen ? 'block' : 'hidden lg:block'} 
            fixed lg:relative inset-0 lg:inset-auto z-40 lg:z-0 
            bg-black/95 lg:bg-transparent backdrop-blur-xl lg:backdrop-blur-none
            p-6 lg:p-0 pt-24 lg:pt-0
          `}>
            <nav className="space-y-1">
              <Link
                href="/"
                className="flex items-center gap-3 px-4 py-2.5 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900/50 rounded-xl transition-all text-sm font-medium border border-transparent hover:border-zinc-800"
              >
                <Home className="w-4 h-4" />
                Voltar ao site
              </Link>

              <div className="h-px bg-zinc-800/50 my-6 mx-4" />

              {/* Link de admin, apenas para usuários ADMIN */}
              {user?.role === 'ADMIN' && (
                <div className="pb-6 space-y-1">
                  <p className="px-4 text-[10px] font-bold text-amber-500/50 uppercase tracking-widest mb-2">Administração</p>
                  <Link
                    href="/admin/garantias"
                    className="flex items-center gap-3 px-4 py-2.5 text-zinc-400 hover:text-amber-400 hover:bg-amber-400/5 rounded-xl transition-all text-sm"
                  >
                    <Shield className="w-4 h-4" />
                    Painel de garantias
                  </Link>

                  <Link
                    href="/admin/consulta-cpf"
                    className="flex items-center gap-3 px-4 py-2.5 text-zinc-400 hover:text-violet-400 hover:bg-violet-400/5 rounded-xl transition-all text-sm"
                  >
                    <Search className="w-4 h-4" />
                    Consulta CPF
                  </Link>

                  <Link
                    href="/admin/estoque"
                    className="flex items-center gap-3 px-4 py-2.5 text-zinc-400 hover:text-blue-400 hover:bg-blue-400/5 rounded-xl transition-all text-sm"
                  >
                    <Package className="w-4 h-4" />
                    Estoque iPhones
                  </Link>

                  <Link
                    href="/admin/vendas"
                    className="flex items-center gap-3 px-4 py-2.5 text-zinc-400 hover:text-emerald-400 hover:bg-emerald-400/5 rounded-xl transition-all text-sm"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Gestão de Vendas
                  </Link>
                  <div className="h-px bg-zinc-800/50 my-6 mx-4" />
                </div>
              )}

              <p className="px-4 text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-2">Minha Conta</p>
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-2.5 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-xl transition-all text-sm"
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </aside>

          {/* Overlay for mobile when menu is open */}
          {isMobileMenuOpen && (
            <div 
              className="lg:hidden fixed inset-0 bg-black/60 z-30" 
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
