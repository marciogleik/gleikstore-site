'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Mail, Lock, ArrowRight, Smartphone } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { login } from '@/lib/api'

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await login(formData)
      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center p-6 relative overflow-hidden">
      {/* Cinematic Background (Optimized) */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-emerald-600/10 blur-[150px] rounded-full"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-50 contrast-150"></div>
      </div>

      <div className="w-full max-w-lg relative z-10 animate-fade-in">
        <div className="text-center mb-10 space-y-4">
            <div className="inline-flex p-4 rounded-3xl bg-zinc-900/50 border border-zinc-800 shadow-2xl mb-2 backdrop-blur-xl">
                <Smartphone className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase py-4">Gleikstore</h1>
            <p className="text-zinc-500 font-medium tracking-wide">Acesse o painel de controle administrativo</p>
        </div>

        <Card className="bg-zinc-950/50 border-zinc-800/50 backdrop-blur-3xl rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.8)] overflow-hidden scale-100 group">
          <CardContent className="p-10 lg:p-14">
            <form onSubmit={handleSubmit} className="space-y-8">
              {error && (
                <div className="p-5 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 font-bold text-sm animate-shake">
                  {error}
                </div>
              )}

              <div className="space-y-5">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">E-mail Corporativo</label>
                    <div className="relative group/input">
                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-700 group-focus-within/input:text-white transition-colors" />
                        <Input
                            type="email"
                            placeholder="admin@gleikstore.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="h-16 pl-14 bg-black border-zinc-800/80 focus:border-white focus:ring-1 focus:ring-white/10 rounded-2xl transition-all text-lg text-white font-medium placeholder:text-zinc-800"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Senha de Acesso</label>
                    <div className="relative group/input">
                        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-700 group-focus-within/input:text-white transition-colors" />
                        <Input
                            type="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="h-16 pl-14 bg-black border-zinc-800/80 focus:border-white focus:ring-1 focus:ring-white/10 rounded-2xl transition-all text-lg text-white font-medium placeholder:text-zinc-800"
                            required
                        />
                    </div>
                </div>
              </div>

              <Button 
                type="submit" 
                variant="primary" 
                size="lg" 
                className="w-full h-16 rounded-2xl bg-white hover:bg-zinc-200 text-black font-black text-xl transition-all hover:-translate-y-1 active:scale-95 shadow-xl" 
                loading={isLoading}
              >
                {!isLoading && <span className="flex items-center gap-3">Autenticar <ArrowRight className="w-6 h-6" /></span>}
              </Button>
            </form>

            <div className="mt-10 pt-10 border-t border-zinc-900 text-center">
              <p className="text-sm text-zinc-500 font-medium">
                Problemas no acesso? <Link href="https://wa.me/5561982195532" className="text-white hover:underline underline-offset-4">Contate o Suporte</Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
