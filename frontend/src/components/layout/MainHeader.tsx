'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getMe, removeToken } from '@/lib/api'
import type { User } from '@/lib/api'

export function MainHeader() {
  const [user, setUser] = useState<User | null>(null)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const check = async () => {
      try {
        const response = await getMe()
        setUser(response.user)
      } catch {
        removeToken()
        setUser(null)
      } finally {
        setIsChecking(false)
      }
    }

    // Só tenta buscar se existir token no localStorage
    if (typeof window !== 'undefined' && localStorage.getItem('gleikstore_token')) {
      check()
    } else {
      setIsChecking(false)
    }
  }, [])

  const handleLogout = () => {
    removeToken()
    setUser(null)
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <img
            src="/gleikstore-icon.png"
            alt="Ícone GLEIKSTORE"
            className="w-7 h-7"
          />
          <span className="text-xl font-semibold tracking-tight">
            GLEIK<span className="text-gray-500">STORE</span>
          </span>
        </Link>

        <div className="flex items-center gap-3 text-sm">
          {!isChecking && user && (
            <>
              <Link
                href="/dashboard"
                className="px-4 py-2 border border-white/20 rounded-full hover:bg-white hover:text-black transition-all flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 18 20"
                  fill="currentColor"
                  width="18"
                  height="18"
                >
                  <path d="M6 4.5a3 3 0 116 0 3 3 0 01-6 0zm3-4a4 4 0 100 8 4 4 0 000-8zm5.58 12.15c1.12.82 1.83 2.24 1.91 4.85H1.51c.08-2.6.79-4.03 1.9-4.85C4.66 11.75 6.5 11.5 9 11.5s4.35.26 5.58 1.15zM9 10.5c-2.5 0-4.65.24-6.17 1.35C1.27 12.98.5 14.93.5 18v.5h17V18c0-3.07-.77-5.02-2.33-6.15-1.52-1.1-3.67-1.35-6.17-1.35z" />
                </svg>
                <span>Área de membros</span>
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-400 hover:text-white transition-colors"
              >
                Sair
              </button>
            </>
          )}

          {!isChecking && !user && (
            <>
              <Link
                href="/login"
                className="px-4 py-2 border border-white/20 rounded-full hover:bg-white hover:text-black transition-all"
              >
                Entrar
              </Link>
              <Link
                href="/register"
                className="hidden sm:inline text-gray-400 hover:text-white transition-colors"
              >
                Criar conta
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
