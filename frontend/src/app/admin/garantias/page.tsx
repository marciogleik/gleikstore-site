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
  const [message, setMessage] = useState<{ type: 'success' | 'error' | ''; text: string }>({ type: '', text: '' })
  const [warrantyType, setWarrantyType] = useState<'90' | '365' | 'custom'>('365')

  const calculateWarrantyEnd = (purchaseDate: string, type: string) => {
    if (!purchaseDate) return ''
    const date = new Date(purchaseDate)
    if (type === '90') {
      date.setDate(date.getDate() + 90)
    } else if (type === '365') {
      date.setFullYear(date.getFullYear() + 1)
    } else {
      return formData.warrantyEnd
    }
    return date.toISOString().split('T')[0]
  }

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
      setWarrantyType('custom')
      setMessage({ type: 'success', text: 'Garantia carregada para edição.' })
    } catch (error) {
      const today = new Date().toISOString().split('T')[0]
      const end = calculateWarrantyEnd(today, '365')
      setFormData({ model: '', purchaseDate: today, warrantyEnd: end })
      setWarrantyType('365')
      setMessage({
        type: 'error',
        text: 'Nenhuma garantia encontrada. Preencha os dados para cadastrar um novo aparelho.',
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
      setMessage({ type: 'success', text: 'Garantia salva com sucesso!' })
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
        <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20">
          <Shield className="w-6 h-6 text-amber-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Registro de Aparelhos</h1>
          <p className="text-sm text-zinc-400">
            Cadastre o IMEI e defina o tempo de garantia exclusivo GLEIKSTORE.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Coluna de Busca/IMEI */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-zinc-900/40 border-zinc-800/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg">Identificação</CardTitle>
              <CardDescription>Insira o IMEI para iniciar o cadastro.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <Input
                  type="text"
                  placeholder="IMEI ou Número de Série"
                  value={imei}
                  onChange={(e) => setImei(e.target.value)}
                  className="pl-10 h-12 bg-black/20 border-zinc-800 focus:border-amber-500/50"
                />
              </div>
              <Button
                type="button"
                variant="secondary"
                className="w-full h-11 bg-zinc-800 hover:bg-zinc-700 text-white"
                onClick={handleSearch}
                loading={isLoading}
              >
                Verificar IMEI
              </Button>
            </CardContent>
          </Card>

          {message.text && (
            <div
              className={`p-4 rounded-2xl text-sm border ${message.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                : 'bg-zinc-900/50 border-zinc-800 text-zinc-400'
                }`}
            >
              <div className="flex gap-3">
                <div className={`mt-0.5 w-1.5 h-1.5 rounded-full shrink-0 ${message.type === 'success' ? 'bg-emerald-500' : 'bg-zinc-500'
                  }`} />
                {message.text}
              </div>
            </div>
          )}
        </div>

        {/* Coluna de Detalhes */}
        <div className="lg:col-span-2">
          <Card className="bg-zinc-900/40 border-zinc-800/50 backdrop-blur-sm h-full">
            <CardHeader>
              <CardTitle className="text-lg text-white">Configuração do Aparelho</CardTitle>
              <CardDescription>Preencha os detalhes da venda e o período de garantia.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Modelo do Aparelho</label>
                    <Input
                      type="text"
                      placeholder="Ex: iPhone 16 Pro Max 256GB"
                      value={formData.model}
                      onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                      className="h-12 bg-black/20 border-zinc-800 focus:border-amber-500/50"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Data da Venda</label>
                    <Input
                      type="date"
                      value={formData.purchaseDate}
                      onChange={(e) => {
                        const newDate = e.target.value
                        setFormData({
                          ...formData,
                          purchaseDate: newDate,
                          warrantyEnd: calculateWarrantyEnd(newDate, warrantyType)
                        })
                      }}
                      className="h-12 bg-black/20 border-zinc-800 focus:border-amber-500/50 [color-scheme:dark]"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-4">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Período de Garantia</label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: '365', label: '1 Ano (Gleik)', sub: '365 dias' },
                        { id: '90', label: '90 Dias', sub: '3 meses' },
                        { id: 'custom', label: 'Customizado', sub: 'Manual' },
                      ].map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => {
                            setWarrantyType(opt.id as any)
                            if (opt.id !== 'custom') {
                              setFormData({
                                ...formData,
                                warrantyEnd: calculateWarrantyEnd(formData.purchaseDate, opt.id)
                              })
                            }
                          }}
                          className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${warrantyType === opt.id
                            ? 'bg-amber-500/10 border-amber-500 text-amber-500'
                            : 'bg-black/20 border-zinc-800 text-zinc-500 hover:border-zinc-700'
                            }`}
                        >
                          <span className="text-sm font-bold">{opt.label}</span>
                          <span className="text-[10px] opacity-60 uppercase">{opt.sub}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className={`md:col-span-2 space-y-3 transition-opacity ${warrantyType === 'custom' ? 'opacity-100' : 'opacity-60'}`}>
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Fim da Garantia</label>
                    <Input
                      type="date"
                      value={formData.warrantyEnd}
                      disabled={warrantyType !== 'custom'}
                      onChange={(e) => setFormData({ ...formData, warrantyEnd: e.target.value })}
                      className="h-12 bg-black/20 border-zinc-800 focus:border-amber-500/50 [color-scheme:dark]"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                    type="submit"
                    variant="primary"
                    loading={isSaving}
                    className="h-12 px-8 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-xl"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Finalizar Registro
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
