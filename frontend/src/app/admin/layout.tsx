'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { 
    LayoutDashboard, 
    ShoppingCart, 
    Package, 
    Search, 
    ShieldCheck, 
    Users, 
    Settings, 
    LogOut, 
    Menu, 
    X as CloseIcon,
    Smartphone,
    Activity,
    Bell
} from 'lucide-react'
import { getMe, removeToken } from '@/lib/api'
import type { User as UserType } from '@/lib/api'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<UserType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await getMe()
        if (response.user.role !== 'ADMIN') {
          router.push('/dashboard')
          return
        }
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
        <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-2 border-zinc-800 border-t-white rounded-full animate-spin" />
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-600 animate-pulse">Iniciando Command Center</p>
        </div>
      </div>
    )
  }

  const navItems = [
    { href: '/admin', icon: LayoutDashboard, label: 'Resumo' },
    { href: '/admin/vendas', icon: ShoppingCart, label: 'Vendas' },
    { href: '/admin/estoque', icon: Package, label: 'Estoque' },
    { href: '/admin/consulta-cpf', icon: Search, label: 'Score' },
    { href: '/admin/garantias', icon: ShieldCheck, label: 'Garantias' },
    { href: '/admin/clientes', icon: Users, label: 'Clientes' },
    { href: '/admin/settings', icon: Settings, label: 'Ajustes' },
  ]

  return (
    <div className="min-h-screen bg-black text-zinc-400 font-sans selection:bg-white/10 selection:text-white">
      {/* Static Background Glow (Optimized) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/5 blur-[120px] rounded-full" />
      </div>

      {/* Main Container */}
      <div className="flex relative z-10">
        {/* Sidebar Desktop */}
        <aside className="hidden lg:flex flex-col w-72 h-screen sticky top-0 border-r border-zinc-900 bg-black/50 backdrop-blur-3xl px-6 py-10 shrink-0">
          {/* Logo Section */}
          <Link href="/admin" className="flex items-center gap-4 group mb-12 px-2">
            <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-tr from-white to-zinc-800 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
                <div className="relative w-12 h-12 rounded-xl bg-black border border-zinc-800 flex items-center justify-center">
                    <Smartphone className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                </div>
            </div>
            <div>
              <p className="text-xl font-black text-white tracking-tighter leading-none group-hover:tracking-tight transition-all uppercase">Gleikstore</p>
              <p className="text-[10px] font-black tracking-[0.2em] text-zinc-600 mt-1 uppercase">Admin Suite</p>
            </div>
          </Link>

          {/* Nav Section */}
          <nav className="flex-1 space-y-2">
            <p className="px-4 text-[10px] font-black text-zinc-700 uppercase tracking-[0.2em] mb-4">Principal</p>
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group
                    ${isActive 
                        ? 'bg-gradient-to-r from-zinc-900 to-transparent border border-zinc-800/80 text-white shadow-xl shadow-black/50' 
                        : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/30'
                    }
                  `}
                >
                  <item.icon className={`w-5 h-5 transition-colors ${isActive ? 'text-white' : 'text-zinc-700 group-hover:text-zinc-500'}`} />
                  <span className="text-sm font-bold tracking-tight">{item.label}</span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)] animate-pulse" />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* User Profile / Logout */}
          <div className="mt-auto pt-10 border-t border-zinc-900 space-y-4">
             <div className="px-2 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-800 flex items-center justify-center shadow-inner">
                    <Activity className="w-5 h-5 text-zinc-600" />
                </div>
                <div className="min-w-0">
                    <p className="text-xs font-black text-white truncate uppercase tracking-tighter">{user?.name}</p>
                    <p className="text-[10px] font-bold text-zinc-600 truncate">{user?.email}</p>
                </div>
             </div>
             <button
                onClick={handleLogout}
                className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-red-500/60 hover:text-red-500 hover:bg-red-500/5 transition-all text-sm font-bold active:scale-95"
              >
                <LogOut className="w-5 h-5" />
                <span>Encerrar Sessão</span>
              </button>
          </div>
        </aside>

        {/* Mobile Header */}
        <div className="lg:hidden fixed top-0 inset-x-0 z-40 bg-black/80 backdrop-blur-xl border-b border-zinc-900 h-20 flex items-center justify-between px-6">
            <Link href="/admin" className="flex items-center gap-3">
                <Smartphone className="w-6 h-6 text-white" />
                <span className="text-lg font-black text-white tracking-tighter uppercase">Gleikstore</span>
            </Link>
            <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-3 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white transition-colors"
                aria-label="Toggle menu"
            >
                {isMobileMenuOpen ? <CloseIcon className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
        </div>

        {/* Mobile Nav Overlay */}
        {isMobileMenuOpen && (
            <div className="lg:hidden fixed inset-0 z-50 bg-black">
                <div className="p-8 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-12">
                         <span className="text-2xl font-black text-white tracking-tighter uppercase">Menu</span>
                         <button onClick={() => setIsMobileMenuOpen(false)} className="p-3"><CloseIcon className="w-8 h-8 text-zinc-600" /></button>
                    </div>
                    <nav className="space-y-4 flex-1 overflow-y-auto">
                        {navItems.map((item) => (
                             <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center gap-5 p-5 rounded-[2rem] border transition-all ${
                                    pathname === item.href ? 'bg-zinc-900 border-zinc-700 text-white' : 'border-transparent text-zinc-500'
                                }`}
                             >
                                <item.icon className="w-7 h-7" />
                                <span className="text-xl font-bold">{item.label}</span>
                             </Link>
                        ))}
                    </nav>
                    <button
                        onClick={handleLogout}
                        className="mt-8 flex items-center gap-5 p-5 rounded-[2rem] bg-red-500/5 text-red-500 font-bold text-xl"
                    >
                        <LogOut className="w-7 h-7" />
                        <span>Sair da Conta</span>
                    </button>
                </div>
            </div>
        )}

        {/* Main Content Viewport */}
        <main className="flex-1 min-w-0 pt-24 lg:pt-10 px-6 lg:px-12 max-w-[1600px] mx-auto min-h-screen">
            {/* Top Bar Desktop */}
            <div className="hidden lg:flex items-center justify-end gap-6 mb-12">
                <div className="relative group">
                    <Bell className="w-6 h-6 text-zinc-700 group-hover:text-zinc-300 transition-colors cursor-pointer" />
                    <div className="absolute top-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-black" />
                </div>
                <div className="h-4 w-px bg-zinc-800" />
                <Link href="/admin/settings">
                    <Settings className="w-6 h-6 text-zinc-700 hover:text-zinc-300 transition-colors cursor-pointer" />
                </Link>
            </div>
            
            <div className="pb-20">
                {children}
            </div>
        </main>
      </div>
    </div>
  )
}
