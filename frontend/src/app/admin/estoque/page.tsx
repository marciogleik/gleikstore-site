'use client'

import { useState, useEffect } from 'react'
import { Plus, Package, Search, Edit2, Trash2, Smartphone, DollarSign, Tag, Info, X, Filter } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { getInventory, addProduct, deleteProduct, type Product } from '@/lib/api'
import { formatCurrency } from '@/lib/utils'

export default function EstoquePage() {
    const [inventory, setInventory] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showAddForm, setShowAddForm] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')

    // Form states
    const [formData, setFormData] = useState({
        model: '',
        capacity: '',
        color: '',
        condition: 'NEW',
        imei: '',
        price: ''
    })

    useEffect(() => {
        loadInventory()
    }, [])

    const loadInventory = async () => {
        setIsLoading(true)
        try {
            const data = await getInventory()
            setInventory(data)
        } catch (error) {
            console.error('Erro ao carregar estoque:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            await addProduct({
                ...formData,
                price: parseFloat(formData.price)
            })
            setFormData({ model: '', capacity: '', color: '', condition: 'NEW', imei: '', price: '' })
            setShowAddForm(false)
            loadInventory()
        } catch (error) {
            alert(error instanceof Error ? error.message : 'Erro ao adicionar produto')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja remover este item?')) return
        try {
            await deleteProduct(id)
            loadInventory()
        } catch (error) {
            alert('Erro ao remover produto')
        }
    }

    const stats = {
        total: inventory.length,
        value: inventory.reduce((acc, curr) => acc + curr.price, 0),
        models: new Set(inventory.map(i => i.model)).size
    }

    const filteredInventory = inventory.filter(item => 
        item.model.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.imei.includes(searchTerm)
    )

    return (
        <div className="space-y-10 pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-4 border-b border-zinc-900">
                <div className="flex items-center gap-5">
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative p-4 rounded-2xl bg-black border border-zinc-800 shadow-xl">
                            <Smartphone className="w-8 h-8 text-blue-500" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <h1 className="text-3xl font-black tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-500">
                            Estoque de iPhones
                        </h1>
                        <p className="text-sm text-zinc-500 font-medium tracking-wide">
                            Gerenciamento de alta performance para sua vitrine premium.
                        </p>
                    </div>
                </div>
                <Button
                    variant="primary"
                    onClick={() => setShowAddForm(!showAddForm)}
                    className={`h-14 px-10 w-full md:w-auto font-bold rounded-2xl shadow-2xl transition-all hover:-translate-y-1 flex items-center justify-center gap-3 active:scale-95 ${
                        showAddForm 
                        ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-400 border border-zinc-700' 
                        : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-blue-500/20'
                    }`}
                >
                    {showAddForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                    <span>{showAddForm ? 'Fechar Painel' : 'Novo Aparelho'}</span>
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Total em Estoque', value: stats.total, icon: Smartphone, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
                    { label: 'Valor Estimado', value: formatCurrency(stats.value), icon: Package, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
                    { label: 'Modelos Ativos', value: stats.models, icon: Filter, color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
                ].map((stat, i) => (
                    <Card key={i} className={`bg-zinc-900/20 border-zinc-800/50 backdrop-blur-xl card-glow overflow-hidden relative group`}>
                        <div className={`absolute top-0 right-0 w-24 h-24 blur-[60px] opacity-10 rounded-full ${stat.bg.replace('/10', '')} -mr-8 -mt-8`}></div>
                        <CardContent className="p-8">
                            <div className="flex items-center justify-between relative z-10">
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 opacity-70">{stat.label}</p>
                                    <p className="text-3xl font-black text-white tracking-tighter">{stat.value}</p>
                                </div>
                                <div className={`p-4 rounded-2xl ${stat.bg} border ${stat.border} shadow-inner group-hover:scale-110 transition-transform duration-500`}>
                                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Add Form */}
            {showAddForm && (
                <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600/20 via-zinc-800/20 to-violet-600/20 rounded-[2.5rem] blur-xl opacity-50"></div>
                    <Card className="bg-zinc-950/80 border-zinc-800/80 backdrop-blur-2xl rounded-[2rem] overflow-hidden shadow-2xl relative">
                        <CardHeader className="pb-8 pt-10 px-10 border-b border-zinc-900/50">
                            <CardTitle className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                                    <Plus className="w-5 h-5 text-blue-400" />
                                </div>
                                Adicionar ao Estoque
                            </CardTitle>
                            <CardDescription className="text-zinc-500 font-medium">Cadastre um novo dispositivo na base GLEIKSTORE.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-10">
                            <form onSubmit={handleAddProduct} className="space-y-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Modelo Comercial</label>
                                        <Input
                                            placeholder="Ex: iPhone 16 Pro Max"
                                            value={formData.model}
                                            onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                                            className="h-14 bg-black border-zinc-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 rounded-2xl transition-all font-bold text-white placeholder:text-zinc-700"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">IMEI / Número de Série</label>
                                        <Input
                                            placeholder="Identificação única"
                                            value={formData.imei}
                                            onChange={(e) => setFormData({ ...formData, imei: e.target.value })}
                                            className="h-14 bg-black border-zinc-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 rounded-2xl transition-all font-mono text-blue-400 placeholder:text-zinc-700 font-bold"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Preço Sugerido (R$)</label>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            placeholder="0,00"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            className="h-14 bg-black border-zinc-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 rounded-2xl transition-all font-bold text-white placeholder:text-zinc-700"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Estado de Conservação</label>
                                        <div className="relative group/select">
                                            <select
                                                value={formData.condition}
                                                onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                                                className="flex h-14 w-full rounded-2xl border border-zinc-800 bg-black px-4 py-2 text-sm text-white font-bold focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 focus:outline-none transition-all appearance-none cursor-pointer"
                                            >
                                                <option value="NEW">Novo (Lacrado)</option>
                                                <option value="EXCELLENT">Excelente (Sem marcas)</option>
                                                <option value="GOOD">Muito Bom (Mínimas marcas)</option>
                                                <option value="FAIR">Bom (Marcas de uso)</option>
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40 group-hover/select:opacity-100 transition-opacity">
                                                <Filter className="w-4 h-4 text-zinc-400" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-end pt-4">
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="h-14 px-12 bg-white hover:bg-zinc-200 text-black font-black rounded-2xl transition-all active:scale-95 shadow-xl shadow-white/5"
                                    >
                                        {isSubmitting ? 'Processando...' : 'Finalizar Cadastro'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Inventory Table */}
            <Card className="bg-zinc-900/30 border-zinc-800/50 backdrop-blur-sm card-glow overflow-hidden">
                <CardHeader className="pb-6 border-b border-zinc-800/50">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <CardTitle className="text-lg font-bold text-white">Aparelhos em Estoque</CardTitle>
                            <CardDescription className="text-zinc-500">Visualize e gerencie seu inventário disponível.</CardDescription>
                        </div>
                        <div className="relative w-full md:w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                            <Input
                                placeholder="Buscar modelo ou IMEI..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 h-10 bg-black/20 border-zinc-800 focus:border-zinc-700 text-sm rounded-lg"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="p-32 text-center text-zinc-500 animate-pulse font-bold tracking-widest uppercase text-xs">Aguarde... Sincronizando aparelhos</div>
                    ) : filteredInventory.length === 0 ? (
                        <div className="p-32 text-center space-y-8 animate-fade-in relative overflow-hidden">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/5 via-transparent to-transparent opacity-50"></div>
                            <div className="relative">
                                <div className="inline-flex p-10 rounded-3xl bg-zinc-900/50 border border-zinc-800/50 text-zinc-800 mb-4 shadow-inner">
                                    <Smartphone className="w-16 h-16 opacity-10 animate-pulse" />
                                </div>
                                <div className="space-y-2">
                                    <p className="text-2xl font-black text-white tracking-tight">Cofre de iPhones Vazio</p>
                                    <p className="text-zinc-500 text-sm font-medium">Não há aparelhos cadastrados ou sua busca não retornou resultados.</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-black/20 border-b border-zinc-800/50">
                                        <th className="text-left py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Aparelho</th>
                                        <th className="text-left py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-zinc-500">IMEI / Serial</th>
                                        <th className="text-left py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Preço</th>
                                        <th className="text-center py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Status</th>
                                        <th className="text-right py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-800/30">
                                    {filteredInventory.map(item => (
                                        <tr key={item.id} className="hover:bg-zinc-800/10 transition-colors group">
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800/50 flex items-center justify-center group-hover:bg-blue-500/10 group-hover:border-blue-500/20 transition-all">
                                                        <Smartphone className="w-5 h-5 text-zinc-500 group-hover:text-blue-400 transition-colors" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-white tracking-tight">{item.model}</p>
                                                        <span className={`inline-block mt-0.5 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-tighter border ${
                                                            item.condition === 'NEW' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-zinc-800 text-zinc-500 border-zinc-700'
                                                        }`}>
                                                            {item.condition === 'NEW' ? 'Novo' : 
                                                             item.condition === 'EXCELLENT' ? 'Excelente' :
                                                             item.condition === 'GOOD' ? 'Muito Bom' : 'Bom'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 font-mono text-zinc-500 text-xs">
                                                <span className="bg-black/40 px-2 py-1 rounded border border-zinc-800/50">{item.imei}</span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <p className="font-black text-white tracking-tight">{formatCurrency(item.price)}</p>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex justify-center">
                                                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-tight border ${
                                                        item.status === 'AVAILABLE' ? 'bg-emerald-500/5 text-emerald-400 border-emerald-500/20' :
                                                        item.status === 'SOLD' ? 'bg-zinc-800 text-zinc-500 border-zinc-700' :
                                                        'bg-amber-500/5 text-amber-400 border-amber-500/20'
                                                    }`}>
                                                        {item.status === 'AVAILABLE' ? 'Disponível' : 
                                                         item.status === 'SOLD' ? 'Vendido' : item.status}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button 
                                                        variant="secondary" 
                                                        size="sm" 
                                                        className="h-9 w-9 p-0 bg-red-500/5 border border-red-500/20 text-red-500 hover:bg-red-500/10 hover:border-red-500/30" 
                                                        onClick={() => handleDelete(item.id)}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Info Footer */}
            <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-zinc-900/30 border border-zinc-800/50 backdrop-blur-sm card-glow text-zinc-500 text-xs">
                <div className="p-1.5 rounded-lg bg-blue-500/10"><Info className="w-4 h-4 text-blue-400" /></div>
                <span className="leading-relaxed">Os itens marcados como <b className="text-zinc-300">Vendido</b> são automaticamente vinculados ao histórico de vendas e removidos da listagem ativa do cliente.</span>
            </div>
        </div>
    )
}
