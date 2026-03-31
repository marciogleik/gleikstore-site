'use client'

import { useState, useEffect } from 'react'
import { Plus, ShoppingCart, Search, Filter, Download, ExternalLink, CheckCircle, Clock, AlertTriangle, User, Smartphone, CreditCard, FileText, TrendingUp, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { getSales, confirmSalePayment, type Sale } from '@/lib/api'
import { formatCurrency, formatDate, formatCPF } from '@/lib/utils'
import Link from 'next/link'
import ContractPreview from '@/components/admin/ContractPreview'

export default function VendasPage() {
    const [sales, setSales] = useState<Sale[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [previewSale, setPreviewSale] = useState<Sale | null>(null)

    useEffect(() => {
        loadSales()
    }, [])

    const loadSales = async () => {
        setIsLoading(true)
        try {
            const data = await getSales()
            setSales(data)
        } catch (error) {
            console.error('Erro ao carregar vendas:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleConfirmPayment = async (id: string) => {
        if (!confirm('Deseja confirmar o pagamento desta venda manualmente?')) return
        try {
            await confirmSalePayment(id)
            loadSales()
        } catch (error) {
            alert('Erro ao confirmar pagamento')
        }
    }

    const filteredSales = sales.filter(sale => 
        sale.customer?.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        sale.customer?.cpf.includes(searchTerm) ||
        sale.product?.model.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-10 pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-4 border-b border-zinc-900">
                <div className="flex items-center gap-5">
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative p-4 rounded-2xl bg-black border border-zinc-800 shadow-xl">
                            <ShoppingCart className="w-8 h-8 text-emerald-500" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <h1 className="text-3xl font-black tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-500">
                            Gestão de Vendas
                        </h1>
                        <p className="text-sm text-zinc-500 font-medium tracking-wide">
                            Controle total sobre o faturamento e contratos da GLEIKSTORE.
                        </p>
                    </div>
                </div>
                <Link href="/admin/vendas/nova" className="w-full md:w-auto">
                    <Button
                        variant="primary"
                        className="h-14 px-10 w-full font-bold rounded-2xl shadow-2xl transition-all hover:-translate-y-1 flex items-center justify-center gap-3 active:scale-95 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white shadow-emerald-500/20"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Nova Venda</span>
                    </Button>
                </Link>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total de Vendas', value: sales.length, icon: ShoppingCart, color: 'text-zinc-400', bg: 'bg-zinc-800/20', border: 'border-zinc-800/50' },
                    { label: 'Aguardando Pagamento', value: sales.filter(s => s.status === 'PENDING').length, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
                    { label: 'Receita Total', value: formatCurrency(sales.reduce((acc, curr) => acc + (curr.status === 'COMPLETED' ? Number(curr.totalAmount) : 0), 0)), icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
                    { label: 'Ticket Médio', value: formatCurrency(sales.length > 0 ? sales.reduce((acc, curr) => acc + Number(curr.totalAmount), 0) / sales.length : 0), icon: TrendingUp, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
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
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Sales List */}
            <Card className="bg-zinc-900/30 border-zinc-800/50 backdrop-blur-sm card-glow overflow-hidden">
                <CardHeader className="pb-6 border-b border-zinc-800/50">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                            <Input
                                className="h-11 pl-10 bg-black/20 border-zinc-800 focus:border-zinc-700 text-sm rounded-lg"
                                placeholder="Buscar por cliente, CPF ou iPhone..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <Button variant="secondary" className="h-11 bg-zinc-800/50 border-zinc-700/50 hover:bg-zinc-800 text-zinc-300">
                                <Filter className="w-4 h-4 mr-2" />
                                Filtrar
                            </Button>
                            <Button variant="secondary" className="h-11 bg-zinc-800/50 border-zinc-700/50 hover:bg-zinc-800 text-zinc-300">
                                <Download className="w-4 h-4 mr-2" />
                                Exportar
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="p-32 text-center text-zinc-500 animate-pulse font-bold tracking-widest uppercase text-xs">Aguarde... Processando transações</div>
                    ) : filteredSales.length === 0 ? (
                        <div className="p-32 text-center space-y-8 animate-fade-in relative overflow-hidden">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/5 via-transparent to-transparent opacity-50"></div>
                            <div className="relative">
                                <div className="inline-flex p-10 rounded-3xl bg-zinc-900/50 border border-zinc-800/50 text-zinc-800 mb-4 shadow-inner">
                                    <ShoppingCart className="w-16 h-16 opacity-10 animate-pulse" />
                                </div>
                                <div className="space-y-2">
                                    <p className="text-2xl font-black text-white tracking-tight">Livro de Vendas Vazio</p>
                                    <p className="text-zinc-500 text-sm font-medium">Realize sua primeira venda para ver o histórico de faturamento aqui.</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-black/20 border-b border-zinc-800/50">
                                        <th className="text-left py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Cliente</th>
                                        <th className="text-left py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Aparelho</th>
                                        <th className="text-left py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Pagamento</th>
                                        <th className="text-center py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Status</th>
                                        <th className="text-left py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Data</th>
                                        <th className="text-right py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-800/30">
                                    {filteredSales.map(sale => (
                                        <tr key={sale.id} className="hover:bg-zinc-800/10 transition-colors group">
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700/50 flex items-center justify-center group-hover:border-blue-500/30 transition-all">
                                                        <User className="w-5 h-5 text-zinc-500" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-white tracking-tight">{sale.customer?.name}</p>
                                                        <p className="text-[10px] text-zinc-500 font-mono tracking-tighter">{formatCPF(sale.customer?.cpf || '')}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex flex-col gap-0.5">
                                                    <div className="flex items-center gap-2">
                                                        <Smartphone className="w-3.5 h-3.5 text-zinc-400" />
                                                        <span className="font-bold text-zinc-200 tracking-tight">{sale.product?.model}</span>
                                                    </div>
                                                    <p className="text-[10px] text-zinc-500 ml-5">{sale.product?.capacity} • {sale.product?.color}</p>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="space-y-1">
                                                    <p className="font-black text-white tracking-tight">{formatCurrency(sale.totalAmount)}</p>
                                                    <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-bold uppercase tracking-tighter">
                                                        <CreditCard className="w-3 h-3 text-zinc-600" />
                                                        {sale.paymentType}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex justify-center">
                                                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-tight flex items-center gap-2 border ${
                                                        sale.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                        sale.status === 'CANCELLED' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                                        'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                                    }`}>
                                                        {sale.status === 'COMPLETED' ? (
                                                            <><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Pago</>
                                                        ) : sale.status === 'PENDING' ? (
                                                            <><Clock className="w-3 h-3" /> Pendente</>
                                                        ) : 'Cancelado'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-[11px] font-medium text-zinc-500 tracking-tighter">
                                                {formatDate(sale.saleDate)}
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {sale.status === 'PENDING' && (
                                                        <Button 
                                                            variant="secondary" 
                                                            size="sm" 
                                                            className="h-9 px-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 text-[10px] font-bold"
                                                            onClick={() => handleConfirmPayment(sale.id)}
                                                        >
                                                            Liquidado
                                                        </Button>
                                                    )}
                                                    <Button variant="secondary" size="sm" className="h-9 w-9 p-0 bg-zinc-800/50 border border-zinc-700/50 hover:bg-zinc-800" title="Ver Contrato" onClick={() => setPreviewSale(sale)}>
                                                        <FileText className="w-4 h-4 text-zinc-400" />
                                                    </Button>
                                                    {sale.payment?.boletoUrl && (
                                                        <Button variant="secondary" size="sm" className="h-9 w-9 p-0 bg-zinc-800/50 border border-zinc-700/50 hover:bg-zinc-800" title="Ver Boleto">
                                                            <a href={sale.payment.boletoUrl} target="_blank" rel="noopener noreferrer">
                                                                <ExternalLink className="w-4 h-4 text-zinc-400" />
                                                            </a>
                                                        </Button>
                                                    )}
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

            {/* Contract Modal */}
            {previewSale && (
                <ContractPreview 
                    sale={previewSale} 
                    onClose={() => setPreviewSale(null)} 
                />
            )}
        </div>
    )
}
