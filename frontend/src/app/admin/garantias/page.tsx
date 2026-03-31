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
    <div className="space-y-10 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-4 border-b border-zinc-900">
        <div className="flex items-center gap-5">
            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-600 to-yellow-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative p-4 rounded-2xl bg-black border border-zinc-800 shadow-xl">
                    <Shield className="w-8 h-8 text-amber-500" />
                </div>
            </div>
            <div className="space-y-1">
                <h1 className="text-3xl font-black tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-500 uppercase">
                    Gestão de Garantias
                </h1>
                <p className="text-sm text-zinc-500 font-medium tracking-wide">
                    Controle de IMEI e prazos de cobertura exclusiva GLEIKSTORE.
                </p>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Coluna de Busca/IMEI */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-zinc-950/50 border-zinc-800/80 backdrop-blur-2xl rounded-[2.5rem] overflow-hidden shadow-2xl relative group">
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-amber-600 to-yellow-600 opacity-20 group-hover:opacity-100 transition-opacity"></div>
            <CardContent className="p-10 space-y-8 relative z-10">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">IMEI ou Número de Série</label>
                <div className="relative group/input">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-700 group-focus-within/input:text-amber-500 transition-colors" />
                  <Input
                    type="text"
                    placeholder="Ex: 3587..."
                    value={imei}
                    onChange={(e) => setImei(e.target.value)}
                    className="h-16 pl-12 bg-black border-zinc-900 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 rounded-2xl transition-all font-mono text-lg text-white"
                  />
                </div>
              </div>
              <Button
                type="button"
                variant="primary"
                className="w-full h-16 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-black rounded-2xl shadow-2xl shadow-amber-600/20 transition-all hover:-translate-y-1 flex items-center justify-center gap-3 active:scale-95"
                onClick={handleSearch}
                loading={isLoading}
              >
                <Search className="w-5 h-5" />
                <span>Verificar Dispositivo</span>
              </Button>
            </CardContent>
          </Card>

          {message.text && (
            <div
              className={`p-5 rounded-2xl text-sm border animate-fade-in-up ${message.type === 'success'
                ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400'
                : 'bg-zinc-900/30 border-zinc-800 text-zinc-400'
                }`}
            >
              <div className="flex gap-4">
                <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${message.type === 'success' ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-500'
                  }`} />
                <span className="leading-relaxed">{message.text}</span>
              </div>
            </div>
          )}
        </div>

        {/* Coluna de Detalhes */}
        <div className="lg:col-span-3">
          <Card className="bg-zinc-900/30 border-zinc-800/50 backdrop-blur-sm card-glow h-full overflow-hidden">
            <CardHeader className="pb-6">
              <CardTitle className="text-lg font-bold text-white">Configuração do Aparelho</CardTitle>
              <CardDescription className="text-zinc-500">Preencha os detalhes da venda e o período de garantia.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                  <div className="space-y-2.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Modelo do Aparelho</label>
                    <Input
                      type="text"
                      placeholder="Ex: iPhone 16 Pro Max 256GB"
                      value={formData.model}
                      onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                      className="h-12 bg-black/40 border-zinc-800 focus:border-amber-500/40 rounded-xl transition-all"
                    />
                  </div>

                  <div className="space-y-2.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Data da Venda</label>
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
                      className="h-12 bg-black/40 border-zinc-800 focus:border-amber-500/40 rounded-xl transition-all [color-scheme:dark]"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-4">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Período de Garantia</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                          className={`flex flex-col items-center justify-center p-5 rounded-2xl border transition-all duration-300 ${warrantyType === opt.id
                            ? 'bg-amber-500/10 border-amber-500 text-amber-500 shadow-lg shadow-amber-500/5'
                            : 'bg-black/40 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:bg-zinc-800/30'
                            }`}
                        >
                          <span className="text-sm font-bold tracking-tight">{opt.label}</span>
                          <span className="text-[10px] opacity-60 uppercase tracking-widest mt-1">{opt.sub}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className={`md:col-span-2 space-y-2.5 transition-all duration-500 ${warrantyType === 'custom' ? 'opacity-100 scale-100' : 'opacity-40 scale-98 pointer-events-none'}`}>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Fim da Garantia</label>
                    <Input
                      type="date"
                      value={formData.warrantyEnd}
                      disabled={warrantyType !== 'custom'}
                      onChange={(e) => setFormData({ ...formData, warrantyEnd: e.target.value })}
                      className="h-12 bg-black/40 border-zinc-800 focus:border-amber-500/40 rounded-xl transition-all [color-scheme:dark]"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    loading={isSaving}
                    className="h-12 px-10 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-xl shadow-lg shadow-amber-500/20 transition-all hover:-translate-y-0.5"
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
