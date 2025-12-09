'use client'

import { Award, Users, Clock } from 'lucide-react'

export function About() {
  return (
    <section id="sobre" className="py-32 bg-black">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image/Visual */}
          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-3xl overflow-hidden glow">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <span className="text-9xl">🏪</span>
                  <p className="text-zinc-500 mt-4">Gleikstore</p>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute top-4 right-4 w-20 h-20 bg-white/5 rounded-full blur-xl" />
              <div className="absolute bottom-4 left-4 w-32 h-32 bg-white/5 rounded-full blur-xl" />
            </div>
            {/* Stats */}
            <div className="absolute -bottom-8 -right-8 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 glow-sm">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-zinc-800 rounded-xl">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold">500+</p>
                  <p className="text-sm text-zinc-400">Clientes satisfeitos</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Sobre a <span className="gradient-text">Gleikstore</span>
              </h2>
              <p className="text-lg text-zinc-400 leading-relaxed">
                Somos especialistas em iPhones seminovos e novos, oferecendo aparelhos 
                de alta qualidade com garantia e procedência verificada. Nossa missão é 
                democratizar o acesso à tecnologia Apple com preços justos e atendimento 
                excepcional.
              </p>
            </div>

            <p className="text-lg text-zinc-400 leading-relaxed">
              Cada aparelho passa por um rigoroso processo de verificação, incluindo 
              testes de bateria, tela, câmeras, sensores e funcionalidades. Só vendemos 
              o que usaríamos.
            </p>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-zinc-800 rounded-xl">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Qualidade Garantida</h4>
                  <p className="text-sm text-zinc-400">Aparelhos Grade A selecionados</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-zinc-800 rounded-xl">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Suporte Contínuo</h4>
                  <p className="text-sm text-zinc-400">Acompanhamento pós-venda</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
