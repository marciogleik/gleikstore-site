'use client'

import { useState, useEffect } from 'react'
import { Users, Search, Mail, Phone, ShoppingBag, ExternalLink, User, Key, CheckCircle, AlertCircle, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { getAdminCustomers, adminChangeUserPassword, type User as Customer } from '@/lib/api'
import { formatCPF, formatDate } from '@/lib/utils'

type ExtendedCustomer = Customer & { _count: { sales: number } }

export default function ClientesPage() {
    const [customers, setCustomers] = useState<ExtendedCustomer[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCustomer, setSelectedCustomer] = useState<ExtendedCustomer | null>(null)
    const [newPassword, setNewPassword] = useState('')
    const [isChangingPassword, setIsChangingPassword] = useState(false)
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | ''; text: string }>({ type: '', text: '' })

    useEffect(() => {
        loadCustomers()
    }, [])

    const loadCustomers = async () => {
        setIsLoading(true)
        try {
            const data = await getAdminCustomers()
            setCustomers(data.customers)
        } catch (error) {
            console.error('Erro ao carregar clientes:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedCustomer || !newPassword) return

        setIsChangingPassword(true)
        setFeedback({ type: '', text: '' })

        try {
            const result = await adminChangeUserPassword(selectedCustomer.id, newPassword)
            if (result.success) {
                setFeedback({ type: 'success', text: result.message })
                setNewPassword('')
                setTimeout(() => {
                    setSelectedCustomer(null)
                    setFeedback({ type: '', text: '' })
                }, 2000)
            } else {
                setFeedback({ type: 'error', text: result.message })
            }
        } catch (error) {
            setFeedback({ type: 'error', text: 'Erro inesperado ao alterar senha' })
        } finally {
            setIsChangingPassword(false)
        }
    }

    const filteredCustomers = customers.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.cpf.includes(searchTerm) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-8 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-4 border-b border-zinc-900">
                <div className="flex items-center gap-5">
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative p-4 rounded-2xl bg-black border border-zinc-800 shadow-xl">
                            <Users className="w-8 h-8 text-indigo-500" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <h1 className="text-3xl font-black tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-500">
                            Base de Clientes Premium
                        </h1>
                        <p className="text-sm text-zinc-500 font-medium tracking-wide">
                            Gerenciamento de alta fidelidade para o seu ecossistema.
                        </p>
                    </div>
                </div>
            </div>

            {/* List */}
            <Card className="bg-zinc-900/20 border-zinc-800/50 backdrop-blur-xl card-glow overflow-hidden">
                <CardHeader className="border-b border-zinc-800/20 pb-8 pt-8 px-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="relative w-full md:w-96 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-700 group-focus-within:text-indigo-400 transition-colors" />
                            <Input 
                                className="h-14 pl-12 bg-black/40 border-zinc-800 focus:border-indigo-500/40 text-sm rounded-2xl transition-all" 
                                placeholder="Filtrar por nome, CPF ou email..." 
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-zinc-900/50 border border-zinc-800">
                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Total:</span>
                            <span className="text-sm text-indigo-400 font-black">{filteredCustomers.length} Clientes</span>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="p-12 text-center text-zinc-500">Carregando base de clientes...</div>
                    ) : filteredCustomers.length === 0 ? (
                        <div className="p-12 text-center text-zinc-500">Nenhum cliente encontrado.</div>
                    ) : (
                        <>
                            {/* Desktop View */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="text-xs text-zinc-500 uppercase tracking-wider border-b border-zinc-800/50">
                                            <th className="px-6 py-4 text-left font-medium">Cliente</th>
                                            <th className="px-6 py-4 text-left font-medium">Contato</th>
                                            <th className="px-6 py-4 text-center font-medium">Compras</th>
                                            <th className="px-6 py-4 text-left font-medium">Membro desde</th>
                                            <th className="px-6 py-4 text-right font-medium">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-800/30">
                                        {filteredCustomers.map(customer => (
                                            <tr key={customer.id} className="hover:bg-indigo-500/5 transition-colors group">
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:border-indigo-500/30 transition-all shadow-inner">
                                                            <User className="w-6 h-6 text-zinc-600 group-hover:text-indigo-400 transition-colors" />
                                                        </div>
                                                        <div>
                                                            <p className="font-black text-white tracking-tight text-base">{customer.name}</p>
                                                            <p className="text-[10px] text-zinc-500 font-black tracking-widest uppercase mt-0.5">{formatCPF(customer.cpf)}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="space-y-1.5 text-xs font-medium">
                                                        <div className="flex items-center gap-2.5 text-zinc-400 group-hover:text-zinc-200 transition-colors">
                                                            <div className="p-1 rounded bg-zinc-800/50 text-zinc-500"><Mail className="w-3 h-3" /></div>
                                                            <span className="tracking-tight">{customer.email}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2.5 text-zinc-500">
                                                            <div className="p-1 rounded bg-zinc-800/50 text-zinc-600"><Phone className="w-3 h-3" /></div>
                                                            <span className="tracking-tight">{customer.phone}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex justify-center">
                                                        <span className="px-4 py-2 rounded-2xl bg-zinc-900/80 text-white font-black text-sm flex items-center gap-2.5 border border-zinc-800 shadow-xl group-hover:bg-indigo-500/10 group-hover:border-indigo-500/20 transition-all">
                                                            <ShoppingBag className="w-4 h-4 text-indigo-500" />
                                                            {customer._count.sales}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 text-[11px] font-bold text-zinc-600 uppercase tracking-widest">
                                                    {formatDate(customer.createdAt).split(',')[0]}
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button 
                                                            variant="secondary" 
                                                            size="sm" 
                                                            className="h-10 w-10 p-0 bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-zinc-500 hover:text-amber-500 rounded-xl transition-all" 
                                                            title="Trocar Senha"
                                                            onClick={() => setSelectedCustomer(customer)}
                                                        >
                                                            <Key className="w-4 h-4" />
                                                        </Button>
                                                        <Button variant="secondary" size="sm" className="h-10 w-10 p-0 bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-zinc-500 hover:text-white rounded-xl transition-all" title="Ver Perfil">
                                                            <ExternalLink className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile View */}
                            <div className="md:hidden divide-y divide-zinc-800/50">
                                {filteredCustomers.map(customer => (
                                    <div key={customer.id} className="p-4 space-y-4">
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center">
                                                    <User className="w-5 h-5 text-zinc-500" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-zinc-200">{customer.name}</p>
                                                    <p className="text-[10px] text-zinc-500 font-mono">{formatCPF(customer.cpf)}</p>
                                                </div>
                                            </div>
                                            <div className="px-2 py-1 rounded-lg bg-zinc-800 text-zinc-400 text-[10px] font-bold border border-zinc-700">
                                                {customer._count.sales} {customer._count.sales === 1 ? 'Compra' : 'Compras'}
                                            </div>
                                        </div>
                                        <div className="bg-zinc-800/30 p-3 rounded-xl gap-2 grid grid-cols-1">
                                            <div className="flex items-center gap-2 text-zinc-400">
                                                <Mail className="w-3.5 h-3.5" />
                                                <span className="text-xs truncate">{customer.email}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-zinc-400">
                                                <Phone className="w-3.5 h-3.5" />
                                                <span className="text-xs">{customer.phone}</span>
                                            </div>
                                        </div>
                                        <Button variant="secondary" size="sm" className="w-full text-xs">
                                            <ExternalLink className="w-3.5 h-3.5 mr-2" /> Detalhes do Cliente
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Password Change Modal */}
            {selectedCustomer && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-fade-in">
                    <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-[2.5rem] p-10 shadow-3xl relative overflow-hidden">
                        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-600 to-yellow-600 opacity-20"></div>
                        
                        <button 
                            onClick={() => setSelectedCustomer(null)}
                            className="absolute top-6 right-6 p-2 rounded-xl text-zinc-600 hover:text-white hover:bg-zinc-900 transition-all"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div className="text-center mb-8">
                            <div className="inline-flex p-4 rounded-3xl bg-amber-500/10 border border-amber-500/20 mb-4">
                                <Key className="w-8 h-8 text-amber-500" />
                            </div>
                            <h2 className="text-2xl font-black text-white tracking-tight uppercase">Trocar Senha</h2>
                            <p className="text-sm text-zinc-500 mt-2">Alterando acesso para <span className="text-amber-500">{selectedCustomer.name}</span></p>
                        </div>

                        <form onSubmit={handleChangePassword} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Nova Senha Temporária</label>
                                <Input 
                                    type="password"
                                    placeholder="••••••••"
                                    className="h-16 bg-black border-zinc-900 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 rounded-2xl transition-all text-white text-lg"
                                    value={newPassword}
                                    onChange={e => setNewPassword(e.target.value)}
                                    required
                                />
                            </div>

                            {feedback.text && (
                                <div className={`p-4 rounded-2xl text-sm font-bold flex items-center gap-3 animate-shake ${
                                    feedback.type === 'success' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                                }`}>
                                    {feedback.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                                    {feedback.text}
                                </div>
                            )}

                            <Button 
                                type="submit" 
                                variant="primary" 
                                className="w-full h-16 bg-amber-500 hover:bg-amber-400 text-black font-black rounded-2xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3"
                                loading={isChangingPassword}
                            >
                                {!isChangingPassword && <span>Confirmar Alteração</span>}
                            </Button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
