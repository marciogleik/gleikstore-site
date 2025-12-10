'use client'

import { useState, useEffect } from 'react'
import { Save, User, Mail, Phone, MapPin, CreditCard, Shield, Sparkles, FileText, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { getUser, updateUser } from '@/lib/api'
import type { User as UserType } from '@/lib/api'
import { formatCPF, formatPhone } from '@/lib/utils'

export default function DashboardPage() {
  const [user, setUser] = useState<UserType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
  })

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getUser()
        setUser(response.user)
        setFormData({
          name: response.user.name,
          phone: formatPhone(response.user.phone),
          address: response.user.address,
        })
      } catch (error) {
        console.error('Erro ao buscar usuário:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage({ type: '', text: '' })
    setIsSaving(true)

    try {
      const response = await updateUser({
        name: formData.name,
        phone: formData.phone.replace(/\D/g, ''),
        address: formData.address,
      })
      setUser(response.user)
      setMessage({ type: 'success', text: 'Dados atualizados com sucesso!' })
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Erro ao atualizar dados' 
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-10">
      {/* Hero da área de membros */}
      <div className="space-y-3">
        <h1 className="text-3xl font-bold">Área de membros</h1>
        <p className="text-zinc-400 text-sm md:text-base max-w-2xl">
          Bem-vindo à sua experiência exclusiva GLEIKSTORE. Aqui você acompanha sua garantia,
          organiza documentos e recebe benefícios e promoções selecionadas.
        </p>
      </div>

      {/* Hub de benefícios */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
        <Link href="/dashboard/device">
          <Card className="bg-zinc-900/60 border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900 transition-colors h-full">
            <CardContent className="py-5 flex flex-col gap-3">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-emerald-500/15 text-emerald-400">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-semibold">Verificar garantia</h2>
                <p className="text-xs text-zinc-400 mt-1">
                  Consulte o status da garantia do seu iPhone cadastrado e veja quantos dias restam.
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/documents">
          <Card className="bg-zinc-900/60 border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900 transition-colors h-full">
            <CardContent className="py-5 flex flex-col gap-3">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-sky-500/15 text-sky-400">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-semibold">Meus documentos</h2>
                <p className="text-xs text-zinc-400 mt-1">
                  Envie e organize seus documentos de forma segura para contratos e garantias.
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="#" aria-disabled className="cursor-default">
          <Card className="bg-zinc-900/60 border-zinc-800 h-full">
            <CardContent className="py-5 flex flex-col gap-3">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-violet-500/15 text-violet-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-semibold">Promoções surpresa</h2>
                <p className="text-xs text-zinc-400 mt-1">
                  Em breve, condições especiais e upgrades exclusivos para membros.
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <a href="https://wa.me/5561982195532?text=Olá! Vim da área de membros GLEIKSTORE" target="_blank" rel="noopener noreferrer">
          <Card className="bg-zinc-900/60 border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900 transition-colors h-full">
            <CardContent className="py-5 flex flex-col gap-3">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-emerald-500/15 text-emerald-400">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-semibold">Atendimento dedicado</h2>
                <p className="text-xs text-zinc-400 mt-1">
                  Fale diretamente com a GLEIKSTORE pelo WhatsApp para suporte e dúvidas.
                </p>
              </div>
            </CardContent>
          </Card>
        </a>
      </div>

      {/* Bloco de dados pessoais */}
      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardHeader>
          <CardTitle>Informações da Conta</CardTitle>
          <CardDescription>Atualize seus dados de contato</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {message.text && (
              <div className={`p-4 rounded-xl text-sm ${
                message.type === 'success' 
                  ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                  : 'bg-red-500/10 border border-red-500/20 text-red-400'
              }`}>
                {message.text}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nome */}
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <Input
                  type="text"
                  placeholder="Nome completo"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="pl-12"
                />
              </div>

              {/* Email (readonly) */}
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <Input
                  type="email"
                  value={user?.email || ''}
                  className="pl-12 opacity-50"
                  disabled
                />
              </div>

              {/* CPF (readonly) */}
              <div className="relative">
                <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <Input
                  type="text"
                  value={user?.cpf ? formatCPF(user.cpf) : ''}
                  className="pl-12 opacity-50"
                  disabled
                />
              </div>

              {/* Telefone */}
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <Input
                  type="tel"
                  placeholder="Telefone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: formatPhone(e.target.value) })}
                  className="pl-12"
                  maxLength={15}
                />
              </div>

              {/* Endereço */}
              <div className="relative md:col-span-2">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <Input
                  type="text"
                  placeholder="Endereço completo"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="pl-12"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" variant="primary" loading={isSaving}>
                <Save className="w-4 h-4 mr-2" />
                Salvar alterações
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
