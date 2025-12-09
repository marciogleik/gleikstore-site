'use client'

import { Shield, Smartphone, CheckCircle, Truck, DollarSign, HeartHandshake } from 'lucide-react'
import { Card } from '@/components/ui/Card'

const features = [
  {
    icon: Shield,
    title: 'Garantia Completa',
    description: 'Todos os aparelhos possuem garantia de até 12 meses contra defeitos.',
  },
  {
    icon: Smartphone,
    title: 'Aparelhos Legítimos',
    description: 'iPhones 100% originais Apple, com procedência verificada.',
  },
  {
    icon: CheckCircle,
    title: 'Testes Completos',
    description: 'Bateria, tela, câmeras, sensores - tudo testado e aprovado.',
  },
  {
    icon: Truck,
    title: 'Entrega Imediata',
    description: 'Aparelhos em estoque prontos para envio no mesmo dia.',
  },
  {
    icon: DollarSign,
    title: 'Preço Competitivo',
    description: 'Os melhores preços do mercado com condições especiais.',
  },
  {
    icon: HeartHandshake,
    title: 'Atendimento Humano',
    description: 'Suporte personalizado do início ao fim da sua compra.',
  },
]

export function Features() {
  return (
    <section id="diferenciais" className="py-32 bg-black">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Por que escolher a <span className="gradient-text">Gleikstore</span>?
          </h2>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Qualidade, confiança e transparência em cada aparelho vendido.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} hover className="group">
              <div className="flex flex-col items-start">
                <div className="p-3 bg-zinc-800 rounded-xl mb-4 group-hover:bg-zinc-700 transition-colors">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-zinc-400">{feature.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
