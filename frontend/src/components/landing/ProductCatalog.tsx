'use client'

import { useState } from 'react'
import Image from 'next/image'
import { MessageCircle, ShoppingBag, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import productsData from '@/data/products.json'

interface Product {
    id: string
    name: string
    price: number
    colors: string[]
    description: string
}

interface Category {
    id: string
    name: string
    image: string
    items: Product[]
}

export default function ProductCatalog() {
    const [activeCategory, setActiveCategory] = useState(productsData.categories[0].id)

    const currentCategory = productsData.categories.find(c => c.id === activeCategory)

    const handleBuy = (product: Product) => {
        const message = `Olá, tudo bem? Tenho interesse no *${product.name}* que custa R$ ${product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}.`
        const encodedMessage = encodeURIComponent(message)
        window.open(`https://wa.me/5561982195532?text=${encodedMessage}`, '_blank')
    }

    return (
        <section id="catalogo" className="py-24 relative overflow-hidden">
            <div className="container px-4 mx-auto">
                <div className="flex flex-col items-center mb-16 text-center">
                    <span className="px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold tracking-widest uppercase mb-4 border border-emerald-500/20">
                        Catálogo Oficial 2026
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                        Nossos <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-sky-400">Produtos</span>
                    </h2>
                    <p className="text-zinc-400 max-w-2xl text-lg leading-relaxed">
                        Produtos Apple novos, com caixa lacrada e 1 ano de garantia direta na autorizada.
                        O luxo e a performance que você merece, com a confiança Gleikstore.
                    </p>
                </div>

                {/* Category Tabs */}
                <div className="flex flex-wrap justify-center gap-2 mb-12">
                    {productsData.categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => setActiveCategory(category.id)}
                            className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border ${activeCategory === category.id
                                    ? 'bg-white text-black border-white shadow-lg shadow-white/10 scale-105'
                                    : 'bg-zinc-900/50 text-zinc-400 border-zinc-800 hover:border-zinc-700'
                                }`}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>

                {/* Featured Category Image */}
                {currentCategory?.image && (
                    <div className="relative w-full h-[300px] md:h-[450px] mb-16 rounded-3xl overflow-hidden group">
                        <Image
                            src={currentCategory.image}
                            alt={currentCategory.name}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                        <div className="absolute bottom-10 left-10">
                            <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">{currentCategory.name}</h3>
                            <p className="text-zinc-300 max-w-md">Descubra a linha completa de {currentCategory.name} com condições exclusivas.</p>
                        </div>
                    </div>
                )}

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {currentCategory?.items.map((product) => (
                        <Card key={product.id} className="bg-zinc-900/40 border-zinc-800/50 hover:border-emerald-500/30 transition-all duration-500 group flex flex-col h-full overflow-hidden backdrop-blur-sm">
                            <CardContent className="p-6 flex flex-col h-full">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-2.5 rounded-xl bg-zinc-800/50 text-zinc-400 group-hover:text-emerald-400 group-hover:bg-emerald-500/10 transition-colors">
                                        <ShoppingBag className="w-5 h-5" />
                                    </div>
                                    <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold border border-zinc-800 px-2 py-1 rounded-md">
                                        Lacrado
                                    </span>
                                </div>

                                <h4 className="text-lg font-bold text-zinc-100 mb-2 group-hover:text-white transition-colors">{product.name}</h4>
                                <p className="text-zinc-500 text-sm mb-4 flex-grow italic">"{product.description}"</p>

                                <div className="space-y-4 pt-4 border-t border-zinc-800/50">
                                    <div className="flex flex-wrap gap-1.5">
                                        {product.colors.map(color => (
                                            <span key={color} className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">
                                                {color}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <span className="text-xs text-zinc-500 block mb-1">A partir de</span>
                                            <span className="text-xl font-black text-white tracking-tight">
                                                R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => handleBuy(product)}
                                            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white text-black hover:bg-emerald-500 hover:text-white transition-all duration-300 shadow-lg shadow-white/5"
                                        >
                                            <ArrowRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-4 pt-4">
                                    <Button
                                        variant="primary"
                                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-bold h-12 rounded-xl"
                                        onClick={() => handleBuy(product)}
                                    >
                                        <MessageCircle className="w-4 h-4 mr-2" />
                                        Comprar via WhatsApp
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="mt-20 p-8 rounded-3xl bg-zinc-950 border border-zinc-800 text-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-sky-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <p className="text-zinc-500 text-sm relative z-10">
                        ⚠️ Valores sujeitos a alteração sem aviso prévio. Consulta de estoque em tempo real via WhatsApp.
                        Lista atualizada em <span className="text-zinc-300">{productsData.lastUpdated}</span>.
                    </p>
                </div>
            </div>
        </section>
    )
}
