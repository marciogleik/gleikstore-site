'use client'

import { MessageCircle } from 'lucide-react'
import { getWhatsAppLink } from '@/lib/utils'

export function WhatsAppButton() {
  return (
    <a
      href={getWhatsAppLink('Olá! Vim pelo site da Gleikstore e gostaria de mais informações.')}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 animate-pulse-glow"
      aria-label="Falar no WhatsApp"
    >
      <MessageCircle className="w-6 h-6 text-white" />
    </a>
  )
}
