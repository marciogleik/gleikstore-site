'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, Search, Save } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { getAdminWarrantyByImei, saveAdminWarranty } from '@/lib/api'

export default function AdminGarantiasPage() {
  const router = useRouter()
  const [imei, setImei] = useState('')
  const [formData, setFormData] = useState({
    model: '',
    purchaseDate: '',
    warrantyEnd: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error' | '' ; text: string }>({ type: '', text: '' })

  const handleSearch = async () => {
    setMessage({ type: '', text: '' })
    if (!imei.trim()) return

    setIsLoading(true)
    try {
      const response = await getAdminWarrantyByImei(imei.trim())
      const w = response.warranty
      setFormData({
        model: w.model,
        purchaseDate: w.purchaseDate.substring(0, 10),
        warrantyEnd: w.warrantyEnd.substring(0, 10),
      })
      setMessage({ type: 'success', text: 'Garantia carregada para edição.' })
    } catch (error) {
      setFormData({ model: '', purchaseDate: '', warrantyEnd: '' })
      setMessage({
        type: 'error',
        text:
          error instanceof Error
            ? error.message
            : 'Nenhuma garantia encontrada para este IMEI. Preencha os dados para cadastrar.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage({ type: '', text: '' })

    if (!imei.trim() || !formData.model || !formData.purchaseDate || !formData.warrantyEnd) {
      setMessage({ type: 'error', text: 'Preencha IMEI, modelo, data de compra e fim da garantia.' })
      return
    }

    setIsSaving(true)
    try {
      await saveAdminWarranty({
        imei: imei.trim(),
        model: formData.model,
        purchaseDate: formData.purchaseDate,
        warrantyEnd: formData.warrantyEnd,
      })
      setMessage({ type: 'success', text: 'Garantia salva com sucesso.' })
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Erro ao salvar garantia',
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <Shield className="w-6 h-6 text-amber-400" />
        <div>
          <h1 className="text-2xl font-semibold">Painel de garantias</h1>
          <p className="text-sm text-zinc-400">
            Cadastre e gerencie garantias por IMEI para os aparelhos vendidos pela GLEIKSTORE.
          </p>
        </div>
      </div>

      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardHeader>
          <CardTitle>Buscar IMEI</CardTitle>
          <CardDescription>Localize uma garantia já cadastrada ou prepare-se para criar uma nova.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
            <Input
              type="text"
              placeholder="IMEI ou número de série"
              value={imei}
              onChange={(e) => setImei(e.target.value)}
            />
            <Button type="button" variant="secondary" onClick={handleSearch} loading={isLoading}>
              <Search className="w-4 h-4 mr-2" />
              Buscar
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardHeader>
          <CardTitle>Detalhes da garantia</CardTitle>
          <CardDescription>
            Defina o modelo do aparelho, a data de compra e o fim da garantia para o IMEI informado.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-6">
            {message.text && (
              <div
                className={`p-4 rounded-xl text-sm ${
                  message.type === 'success'
                    ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                    : 'bg-red-500/10 border border-red-500/20 text-red-400'
                }`}
              >
                {message.text}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <label className="block text-xs uppercase text-zinc-400 mb-2">Modelo</label>
                <Input
                  type="text"
                  placeholder="Ex: iPhone 15 Pro Max"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs uppercase text-zinc-400 mb-2">Data da compra</label>
                <Input
                  type="date"
                  value={formData.purchaseDate}
                  onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs uppercase text-zinc-400 mb-2">Garantia válida até</label>
                <Input
                  type="date"
                  value={formData.warrantyEnd}
                  onChange={(e) => setFormData({ ...formData, warrantyEnd: e.target.value })}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" variant="primary" loading={isSaving}>
                <Save className="w-4 h-4 mr-2" />
                Salvar garantia
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
