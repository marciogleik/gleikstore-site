'use client'

import { useState, useEffect } from 'react'
import { 
    TrendingUp, 
    Package, 
    ShoppingCart, 
    Users, 
    DollarSign, 
    Clock, 
    ArrowUpRight, 
    ArrowDownRight, 
    Smartphone,
    Activity,
    CheckCircle2,
    Search
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { getInventory, getSales, type Product, type Sale } from '@/lib/api'
import { formatCurrency, formatDate } from '@/lib/utils'
import Link from 'next/link'

export default function AdminDashboardPage() {
    const [inventory, setInventory] = useState<Product[]>([])
    const [sales, setSales] = useState<Sale[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        setIsLoading(true)
        try {
            const [inventoryData, salesData] = await Promise.all([
                getInventory(),
                getSales()
            ])
            setInventory(inventoryData)
            setSales(salesData)
        } catch (error) {
            console.error('Erro ao carregar dados do dashboard:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const availableProducts = inventory.filter(p => p.status === 'AVAILABLE')
    const totalInventoryValue = availableProducts.reduce((acc, curr) => acc + Number(curr.price), 0)
    
    const completedSales = sales.filter(s => s.status === 'COMPLETED')
    const totalRevenue = completedSales.reduce((acc, curr) => acc + Number(curr.totalAmount), 0)
    
    const pendingSales = sales.filter(s => s.status === 'PENDING')
    const pendingRevenueValue = pendingSales.reduce((acc, curr) => acc + Number(curr.totalAmount), 0)

    const recentSales = sales.slice(0, 5)

    if (isLoading) {
        return <div className="p-12 text-center text-zinc-500">Preparando seu dashboard...</div>
    }

    return (
        <div className="space-y-8 pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-4 border-b border-zinc-900">
                <div className="flex items-center gap-5">
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative p-4 rounded-2xl bg-black border border-zinc-800 shadow-xl">
                            <Activity className="w-8 h-8 text-blue-500" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <h1 className="text-3xl font-black tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-500 uppercase">
                            Gleikstore Command
                        </h1>
                        <p className="text-sm text-zinc-500 font-medium tracking-wide">
                            Visão panorâmica do seu ecossistema de vendas premium.
                        </p>
                    </div>
                </div>
            </div>

            {/* Top Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Receita Total', value: formatCurrency(totalRevenue), icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', sub: `${completedSales.length} vendas liquidadas` },
                    { label: 'Valor em Estoque', value: formatCurrency(totalInventoryValue), icon: Package, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', sub: `${availableProducts.length} aparelhos disponíveis` },
                    { label: 'A Receber', value: formatCurrency(pendingRevenueValue), icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', sub: `${pendingSales.length} pagamentos pendentes` },
                    { label: 'Total de Pedidos', value: sales.length, icon: ShoppingCart, color: 'text-zinc-400', bg: 'bg-zinc-800/20', border: 'border-zinc-800/50', sub: 'Histórico completo' },
                ].map((stat, i) => (
                    <Card key={i} className={`bg-zinc-900/20 border-zinc-800/50 backdrop-blur-xl card-glow overflow-hidden relative group`}>
                        <div className={`absolute top-0 right-0 w-24 h-24 blur-[60px] opacity-10 rounded-full ${stat.bg.replace('/10', '').replace('/20', '')} -mr-8 -mt-8`}></div>
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
                            <div className="mt-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                                <Activity className="w-3 h-3" />
                                <span>{stat.sub}</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity */}
                <Card className="bg-zinc-900/50 border-zinc-800 lg:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div>
                            <CardTitle>Vendas Recentes</CardTitle>
                            <CardDescription>Últimas transações realizadas no sistema</CardDescription>
                        </div>
                        <Link href="/admin/vendas" className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1">
                            Ver tudo <ArrowUpRight className="w-3 h-3" />
                        </Link>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="space-y-4">
                            {recentSales.map((sale) => (
                                <div key={sale.id} className="flex items-center justify-between p-3 rounded-xl bg-zinc-800/30 border border-zinc-800/50 group hover:border-zinc-700 transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center">
                                            <Smartphone className="w-5 h-5 text-zinc-500" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-zinc-200">{sale.product?.model}</p>
                                            <p className="text-[10px] text-zinc-500 uppercase">{sale.customer?.name}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-zinc-100">{formatCurrency(sale.totalAmount)}</p>
                                        <span className={`text-[9px] font-bold uppercase ${
                                            sale.status === 'COMPLETED' ? 'text-emerald-500' : 'text-amber-500'
                                        }`}>
                                            {sale.status === 'COMPLETED' ? 'Pago' : 'Pendente'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions / Shortcuts */}
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-widest px-1">Acesso Rápido</h3>
                    
                    <Link href="/admin/vendas/nova" className="block p-1 rounded-[2rem] bg-gradient-to-r from-blue-600/20 to-blue-400/20 group hover:scale-[1.02] transition-transform shadow-2xl">
                        <div className="bg-blue-600 hover:bg-blue-500 transition-colors p-6 rounded-[1.8rem] flex justify-between items-center text-white">
                            <div>
                                <p className="text-xl font-black tracking-tight">Nova Venda</p>
                                <p className="text-xs text-blue-100 opacity-80 font-medium">Iniciar processo de auditoria e venda</p>
                            </div>
                            <ArrowUpRight className="w-8 h-8 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                        </div>
                    </Link>

                    <Link href="/admin/estoque" className="block p-px rounded-[2rem] bg-zinc-800 hover:bg-zinc-700 group hover:scale-[1.02] transition-transform">
                        <div className="bg-zinc-900 p-6 rounded-[1.95rem] flex justify-between items-center text-zinc-200">
                            <div>
                                <p className="text-xl font-black tracking-tight">Estoque</p>
                                <p className="text-xs text-zinc-500 font-medium tracking-wide uppercase">Adicionar novos aparelhos</p>
                            </div>
                            <div className="p-3 rounded-xl bg-zinc-800 group-hover:bg-zinc-700 transition-colors">
                                <Package className="w-6 h-6 text-zinc-400" />
                            </div>
                        </div>
                    </Link>

                    <Link href="/admin/consulta-cpf" className="block p-px rounded-[2rem] bg-zinc-800 hover:bg-zinc-700 group hover:scale-[1.02] transition-transform">
                        <div className="bg-zinc-900 p-6 rounded-[1.95rem] flex justify-between items-center text-zinc-200">
                            <div>
                                <p className="text-xl font-black tracking-tight">Score</p>
                                <p className="text-xs text-zinc-500 font-medium tracking-wide uppercase">Verificar SPC/SERASA</p>
                            </div>
                            <div className="p-3 rounded-xl bg-zinc-800 group-hover:bg-zinc-700 transition-colors">
                                <Search className="w-6 h-6 text-zinc-400" />
                            </div>
                        </div>
                    </Link>

                    <Card className="bg-zinc-950 border-zinc-800">
                        <CardContent className="pt-6">
                            <p className="text-xs text-zinc-500 uppercase font-medium mb-3">Integridade do Sistema</p>
                            <div className="flex items-center gap-3 text-emerald-400">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-sm font-medium">Bando de Dados Online</span>
                            </div>
                            <p className="text-[10px] text-zinc-500 mt-2 italic">Ultima sincronização: Agora</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
