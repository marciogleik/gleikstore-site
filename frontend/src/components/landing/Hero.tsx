'use client'

import { MessageCircle, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { getWhatsAppLink } from '@/lib/utils'

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/50 via-black to-black" />
      
      {/* Ambient light effect */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-[120px]" />
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
        <div className="animate-fade-in-up">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900/80 border border-zinc-800 rounded-full mb-8">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-zinc-400">Aparelhos disponíveis para entrega imediata</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6">
            <span className="block">iPhones Premium</span>
            <span className="block gradient-text">com Garantia</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto mb-12">
            Aparelhos originais, testados e certificados. 
            Qualidade Apple com o melhor preço do mercado.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={getWhatsAppLink('Olá! Quero conhecer os iPhones disponíveis na Gleikstore.')}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="primary" size="lg">
                <MessageCircle className="w-5 h-5 mr-2" />
                Falar no WhatsApp
              </Button>
            </a>
            <a href="#catalogo">
              <Button variant="outline" size="lg">
                Ver Catálogo
              </Button>
            </a>
          </div>
        </div>

        {/* iPhone Image Placeholder */}
        <div className="mt-20 animate-fade-in delay-300">
          <div className="relative mx-auto w-[300px] h-[600px] md:w-[400px] md:h-[800px]">
            {/* iPhone Frame */}
            <div className="absolute inset-0 bg-gradient-to-b from-zinc-800 to-zinc-900 rounded-[50px] border border-zinc-700 shadow-2xl glow">
              {/* Screen */}
              <div className="absolute inset-3 bg-gradient-to-br from-zinc-900 via-black to-zinc-900 rounded-[40px] overflow-hidden">
                {/* Dynamic Island */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-8 bg-black rounded-full" />
                {/* Screen content */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">📱</div>
                    <p className="text-zinc-500 text-sm">iPhone 15 Pro Max</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Glow effect */}
            <div className="absolute -inset-4 bg-white/5 rounded-[60px] blur-2xl -z-10" />
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-zinc-500" />
        </div>
      </div>
    </section>
  )
}
