'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, User, Smartphone, CreditCard, ChevronRight, CheckCircle, AlertTriangle, ArrowLeft, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { getAdminCustomerByCpf, getInventory, createSale, type User as Customer, type Product } from '@/lib/api'
import { formatCPF, formatCurrency } from '@/lib/utils'

export default function NovaVendaPage() {
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    // Step 1: Customer
    const [cpfInput, setCpfInput] = useState('')
    const [customer, setCustomer] = useState<Customer | null>(null)

    // Step 2: Product
    const [inventory, setInventory] = useState<Product[]>([])
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

    // Step 3: Payment
    const [paymentType, setPaymentType] = useState('BOLETO')
    const [dueDate, setDueDate] = useState('')

    useEffect(() => {
        if (step === 2) {
            loadInventory()
        }
    }, [step])

    const loadInventory = async () => {
        setIsLoading(true)
        try {
            const data = await getInventory()
            setInventory(data.filter(p => p.status === 'AVAILABLE'))
        } catch (error) {
            console.error('Erro ao carregar estoque:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSearchCustomer = async () => {
        setError('')
        const cleanCpf = cpfInput.replace(/\D/g, '')
        if (cleanCpf.length !== 11) {
            setError('Digite um CPF válido com 11 dígitos.')
            return
        }

        setIsLoading(true)
        try {
            const res = await getAdminCustomerByCpf(cleanCpf)
            setCustomer(res.user)
            setStep(2)
        } catch (e) {
            setError('Cliente não encontrado na base de dados. Peça para o cliente se cadastrar primeiro ou realize o cadastro manual.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleFinalizeSale = async () => {
        if (!customer || !selectedProduct) return
        setIsLoading(true)
        try {
            await createSale({
                customerId: customer.id,
                productId: selectedProduct.id,
                paymentType,
                dueDate: paymentType === 'BOLETO' ? dueDate : undefined
            })
            router.push('/admin/vendas?success=true')
        } catch (e) {
            setError('Erro ao finalizar venda. Tente novamente.')
            setIsLoading(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            {/* Breadcrumbs / Progress */}
            <div className="flex items-center gap-4 text-xs font-medium uppercase tracking-wider">
                <button onClick={() => router.back()} className="flex items-center gap-1 text-zinc-500 hover:text-white transition-colors">
                    <ArrowLeft className="w-3.5 h-3.5" /> Voltar
                </button>
                <div className="flex-1 h-px bg-zinc-800 mx-2" />
                <span className={step === 1 ? 'text-blue-400' : 'text-zinc-500'}>1. Cliente</span>
                <ChevronRight className="w-3 h-3 text-zinc-600" />
                <span className={step === 2 ? 'text-blue-400' : 'text-zinc-500'}>2. Aparelho</span>
                <ChevronRight className="w-3 h-3 text-zinc-600" />
                <span className={step === 3 ? 'text-blue-400' : 'text-zinc-500'}>3. Pagamento</span>
            </div>

            {/* Step 1: Customer Selection */}
            {step === 1 && (
                <Card className="bg-zinc-900/50 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="w-5 h-5 text-blue-400" />
                            Identificar Cliente
                        </CardTitle>
                        <CardDescription>Busque o cliente pelo CPF para iniciar a venda</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex gap-2">
                            <Input 
                                placeholder="000.000.000-00"
                                value={cpfInput}
                                onChange={e => setCpfInput(formatCPF(e.target.value))}
                                maxLength={14}
                                onKeyDown={e => e.key === 'Enter' && handleSearchCustomer()}
                            />
                            <Button onClick={handleSearchCustomer} loading={isLoading}>
                                Buscar
                            </Button>
                        </div>
                        {error && (
                            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex gap-3">
                                <AlertTriangle className="w-5 h-5 shrink-0" />
                                {error}
                            </div>
                        )}
                        <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 text-zinc-400 text-xs text-center italic">
                            O cliente deve estar previamente cadastrado no sistema para realizar uma venda.
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Step 2: Product Selection */}
            {step === 2 && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <Smartphone className="w-5 h-5 text-blue-400" />
                            Selecionar Aparelho
                        </h2>
                        <div className="text-sm text-zinc-500">
                            Cliente: <span className="text-zinc-200 font-medium">{customer?.name}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {isLoading ? (
                            <p className="text-zinc-500 col-span-2 text-center py-10">Buscando estoque...</p>
                        ) : inventory.length === 0 ? (
                            <div className="col-span-2 p-10 text-center border border-dashed border-zinc-800 rounded-2xl">
                                <p className="text-zinc-500">Sem aparelhos disponíveis no estoque.</p>
                                <Button variant="secondary" className="mt-4" onClick={() => router.push('/admin/estoque')}>Ir para Estoque</Button>
                            </div>
                        ) : (
                            inventory.map(product => (
                                <button
                                    key={product.id}
                                    onClick={() => setSelectedProduct(product)}
                                    className={`text-left p-4 rounded-2xl border transition-all ${
                                        selectedProduct?.id === product.id 
                                        ? 'bg-blue-500/10 border-blue-500 ring-1 ring-blue-500' 
                                        : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700'
                                    }`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <p className="font-semibold text-zinc-100">{product.model}</p>
                                        <p className="text-blue-400 font-bold">{formatCurrency(product.price)}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-zinc-500">{product.capacity} • {product.color} • {product.condition}</p>
                                        <p className="text-[10px] text-zinc-600 font-mono">IMEI: {product.imei}</p>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button 
                            disabled={!selectedProduct} 
                            onClick={() => setStep(3)}
                            className="w-full md:w-auto px-10"
                        >
                            Próximo Passo <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                </div>
            )}

            {/* Step 3: Payment & Finalize */}
            {step === 3 && (
                <div className="space-y-6">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-blue-400" />
                        Pagamento e Finalização
                    </h2>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Summary */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card className="bg-zinc-900/50 border-zinc-800">
                                <CardHeader>
                                    <CardTitle className="text-sm uppercase tracking-wider text-zinc-500">Resumo da Venda</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex justify-between py-2 border-b border-zinc-800/50">
                                        <span className="text-zinc-400">Cliente</span>
                                        <span className="text-zinc-200 font-medium">{customer?.name}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-zinc-800/50">
                                        <span className="text-zinc-400">Aparelho</span>
                                        <span className="text-zinc-200 font-medium">{selectedProduct?.model} ({selectedProduct?.capacity})</span>
                                    </div>
                                    <div className="flex justify-between pt-4">
                                        <span className="text-lg font-semibold text-zinc-200">Total</span>
                                        <span className="text-2xl font-bold text-emerald-400">
                                            {formatCurrency(selectedProduct?.price || 0)}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs text-zinc-500 uppercase font-medium">Forma de Pagamento</label>
                                    <select 
                                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                        value={paymentType}
                                        onChange={e => setPaymentType(e.target.value)}
                                    >
                                        <option value="BOLETO">Boleto Bancário</option>
                                        <option value="PIX">PIX</option>
                                        <option value="CREDIT_CARD">Cartão de Crédito</option>
                                        <option value="FINANCING">Boletagem Própria (Boleto)</option>
                                        <option value="CASH">Dinheiro</option>
                                    </select>
                                </div>
                                
                                { (paymentType === 'BOLETO' || paymentType === 'FINANCING') && (
                                    <div className="space-y-2">
                                        <label className="text-xs text-zinc-500 uppercase font-medium">Data de Vencimento</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                            <Input 
                                                type="date" 
                                                className="pl-10"
                                                value={dueDate}
                                                onChange={e => setDueDate(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Sidebar Action */}
                        <div className="space-y-4">
                            <Card className="bg-emerald-500/5 border-emerald-500/20">
                                <CardContent className="pt-6 space-y-4">
                                    <div className="flex items-start gap-3 text-emerald-400 text-sm">
                                        <CheckCircle className="w-5 h-5 shrink-0" />
                                        <p>Ao finalizar, o sistema irá gerar o registro da venda e o boleto de pagamento.</p>
                                    </div>
                                    <Button 
                                        variant="primary" 
                                        className="w-full bg-emerald-600 hover:bg-emerald-500 h-12"
                                        onClick={handleFinalizeSale}
                                        loading={isLoading}
                                    >
                                        Finalizar Venda
                                    </Button>
                                    <p className="text-[10px] text-center text-zinc-500 uppercase tracking-tighter">
                                        O contrato será gerado automaticamente após a confirmação.
                                    </p>
                                </CardContent>
                            </Card>
                            <Button variant="secondary" className="w-full" onClick={() => setStep(2)}>
                                Voltar para Aparelhos
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
