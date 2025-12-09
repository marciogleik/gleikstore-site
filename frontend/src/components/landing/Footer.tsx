'use client'

import Link from 'next/link'
import { Instagram, MessageCircle } from 'lucide-react'
import { getWhatsAppLink } from '@/lib/utils'

export function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <span className="text-2xl font-bold tracking-tight">
                Gleik<span className="text-zinc-400">store</span>
              </span>
            </Link>
            <p className="text-zinc-400 mb-4 max-w-md">
              Sua loja de confiança para iPhones premium. Aparelhos originais, 
              testados e com garantia.
            </p>
            <div className="text-sm text-zinc-500 space-y-1">
              <p>CNPJ: 62.282.270/0001-90</p>
              <p>Rua Treze, Bairro Operário</p>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Links</h4>
            <ul className="space-y-3">
              <li>
                <a href="#catalogo" className="text-zinc-400 hover:text-white transition-colors">
                  Catálogo
                </a>
              </li>
              <li>
                <a href="#diferenciais" className="text-zinc-400 hover:text-white transition-colors">
                  Diferenciais
                </a>
              </li>
              <li>
                <a href="#sobre" className="text-zinc-400 hover:text-white transition-colors">
                  Sobre
                </a>
              </li>
              <li>
                <Link href="/login" className="text-zinc-400 hover:text-white transition-colors">
                  Área do Cliente
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contato</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href={getWhatsAppLink('Olá! Vim pelo site e gostaria de mais informações.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/gleikstore"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                  @gleikstore
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-zinc-800 mt-12 pt-8 text-center">
          <p className="text-sm text-zinc-500">
            © {new Date().getFullYear()} Gleikstore. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
