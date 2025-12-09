'use client'

import { MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { formatPrice, getWhatsAppLink } from '@/lib/utils'

// Catálogo de produtos (pode ser substituído por dados da API)
const products = [
  {
    id: 1,
    model: 'iPhone 15 Pro Max',
    storage: '256GB',
    color: 'Titânio Natural',
    condition: 'Grade A',
    price: 7499,
    image: '📱',
  },
  {
    id: 2,
    model: 'iPhone 15 Pro',
    storage: '128GB',
    color: 'Titânio Preto',
    condition: 'Grade A',
    price: 6299,
    image: '📱',
  },
  {
    id: 3,
    model: 'iPhone 14 Pro Max',
    storage: '256GB',
    color: 'Roxo Profundo',
    condition: 'Grade A',
    price: 5799,
    image: '📱',
  },
  {
    id: 4,
    model: 'iPhone 14 Pro',
    storage: '128GB',
    color: 'Dourado',
    condition: 'Grade A',
    price: 4999,
    image: '📱',
  },
  {
    id: 5,
    model: 'iPhone 13 Pro Max',
    storage: '256GB',
    color: 'Azul Sierra',
    condition: 'Grade A',
    price: 4499,
    image: '📱',
  },
  {
    id: 6,
    model: 'iPhone 13',
    storage: '128GB',
    color: 'Meia-noite',
    condition: 'Grade A',
    price: 3299,
    image: '📱',
  },
]

export function Catalog() {
  return (
    <section id="catalogo" className="py-32 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Nosso <span className="gradient-text">Catálogo</span>
          </h2>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Aparelhos selecionados, testados e prontos para você.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <Card key={product.id} hover className="group overflow-hidden">
              {/* Product Image */}
              <div className="relative h-48 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-xl mb-6 flex items-center justify-center">
                <span className="text-7xl group-hover:scale-110 transition-transform duration-300">
                  {product.image}
                </span>
                {/* Condition Badge */}
                <span className="absolute top-3 right-3 px-3 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full">
                  {product.condition}
                </span>
              </div>

              {/* Product Info */}
              <div className="space-y-3">
                <h3 className="text-xl font-semibold">{product.model}</h3>
                <div className="flex items-center gap-2 text-sm text-zinc-400">
                  <span>{product.storage}</span>
                  <span>•</span>
                  <span>{product.color}</span>
                </div>
                <p className="text-2xl font-bold text-white">
                  {formatPrice(product.price)}
                </p>
              </div>

              {/* CTA Button */}
              <a
                href={getWhatsAppLink(
                  `Olá! Tenho interesse no ${product.model} ${product.storage} ${product.color} por ${formatPrice(product.price)}.`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="block mt-6"
              >
                <Button variant="secondary" size="md" className="w-full group-hover:bg-white group-hover:text-black transition-all">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Quero este
                </Button>
              </a>
            </Card>
          ))}
        </div>

        {/* More Products CTA */}
        <div className="text-center mt-16">
          <p className="text-zinc-400 mb-4">
            Não encontrou o que procura? Temos mais opções!
          </p>
          <a
            href={getWhatsAppLink('Olá! Gostaria de ver mais opções de iPhones disponíveis.')}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="lg">
              Ver mais aparelhos
            </Button>
          </a>
        </div>
      </div>
    </section>
  )
}
