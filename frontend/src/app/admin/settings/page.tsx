'use client'

import { useState } from 'react'
import { UserPlus, Shield, Mail, Lock, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { adminCreateUser } from '@/lib/api'

export default function SettingsPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'ADMIN' as const
    })
    const [isLoading, setIsLoading] = useState(false)
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | ''; text: string }>({ type: '', text: '' })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setFeedback({ type: '', text: '' })

        try {
            const result = await adminCreateUser(formData)
            if (result.success) {
                setFeedback({ type: 'success', text: result.message })
                setFormData({ name: '', email: '', password: '', role: 'ADMIN' })
            } else {
                setFeedback({ type: 'error', text: result.message })
            }
        } catch (error) {
            setFeedback({ type: 'error', text: 'Erro inesperado ao criar administrador' })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-2 bg-amber-500 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.5)]"></div>
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase">Configurações</h1>
                    </div>
                    <p className="text-zinc-500 font-medium ml-5">Gestão de equipe e permissões administrativas</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="bg-zinc-950/50 border-zinc-900 rounded-[2.5rem] overflow-hidden backdrop-blur-sm">
                    <CardHeader className="p-10 pb-6">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                                <UserPlus className="w-6 h-6 text-amber-500" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl font-black text-white uppercase tracking-tight">Criar Novo Administrador</CardTitle>
                                <CardDescription className="text-zinc-500 font-medium">Provisionar acesso privilegiado ao sistema</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-10 pt-0">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Nome Completo</label>
                                    <div className="relative">
                                        <Shield className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
                                        <Input 
                                            placeholder="Ex: Carlos Oliveira"
                                            className="h-14 pl-14 bg-black border-zinc-900 focus:border-amber-500 rounded-2xl transition-all"
                                            value={formData.name}
                                            onChange={e => setFormData({...formData, name: e.target.value})}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">E-mail Corporativo</label>
                                    <div className="relative">
                                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
                                        <Input 
                                            type="email"
                                            placeholder="admin@gleikstore.com"
                                            className="h-14 pl-14 bg-black border-zinc-900 focus:border-amber-500 rounded-2xl transition-all"
                                            value={formData.email}
                                            onChange={e => setFormData({...formData, email: e.target.value})}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Senha de Acesso</label>
                                    <div className="relative">
                                        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
                                        <Input 
                                            type="password"
                                            placeholder="••••••••"
                                            className="h-14 pl-14 bg-black border-zinc-900 focus:border-amber-500 rounded-2xl transition-all"
                                            value={formData.password}
                                            onChange={e => setFormData({...formData, password: e.target.value})}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {feedback.text && (
                                <div className={`p-4 rounded-2xl text-sm font-bold flex items-center gap-3 ${
                                    feedback.type === 'success' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                                }`}>
                                    {feedback.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                                    {feedback.text}
                                </div>
                            )}

                            <Button 
                                type="submit" 
                                variant="primary" 
                                className="w-full h-14 bg-amber-500 hover:bg-amber-400 text-black font-black rounded-2xl shadow-xl transition-all active:scale-95"
                                loading={isLoading}
                            >
                                Criar Conta de Administrador
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <div className="space-y-8">
                    <Card className="bg-zinc-950/50 border-zinc-900 rounded-[2.5rem] overflow-hidden backdrop-blur-sm border-dashed">
                        <CardContent className="p-10 flex flex-col items-center text-center justify-center min-h-[300px] space-y-4">
                            <div className="p-4 rounded-full bg-zinc-900 text-zinc-600">
                                <Shield className="w-12 h-12" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-white uppercase tracking-tight">Audit Log</h3>
                                <p className="text-zinc-500 text-sm mt-2 max-w-[250px]">
                                    O registro de atividades administrativas estará disponível em breve para assinantes do plano Platinum.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
