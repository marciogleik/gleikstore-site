'use client'

import { useState, useEffect } from 'react'
import { Save, Smartphone, Hash, Calendar, Shield } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { getDevices, createDevice, updateDevice } from '@/lib/api'
import type { Device } from '@/lib/api'
import { formatDate, formatDateForInput, isWarrantyValid, daysUntilWarrantyEnd } from '@/lib/utils'

export default function DevicePage() {
  const [device, setDevice] = useState<Device | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [formData, setFormData] = useState({
    model: '',
    imei: '',
    purchaseDate: '',
    warrantyEnd: '',
  })

  useEffect(() => {
    const fetchDevice = async () => {
      try {
        const response = await getDevices()
        if (response.devices.length > 0) {
          const dev = response.devices[0]
          setDevice(dev)
          setFormData({
            model: dev.model,
            imei: dev.imei,
            purchaseDate: formatDateForInput(dev.purchaseDate),
            warrantyEnd: formatDateForInput(dev.warrantyEnd),
          })
        }
      } catch (error) {
        console.error('Erro ao buscar dispositivo:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDevice()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage({ type: '', text: '' })
    setIsSaving(true)

    try {
      if (device) {
        // Atualizar dispositivo existente
        const response = await updateDevice(device.id, formData)
        setDevice(response.device)
        setMessage({ type: 'success', text: 'Aparelho atualizado com sucesso!' })
      } else {
        // Criar novo dispositivo
        const response = await createDevice(formData)
        setDevice(response.device)
        setMessage({ type: 'success', text: 'Aparelho cadastrado com sucesso!' })
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Erro ao salvar aparelho' 
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
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Meu Aparelho</h1>
        <p className="text-zinc-400 mt-2">Informações do seu iPhone comprado na Gleikstore</p>
      </div>

      {/* Status da Garantia */}
      {device && (
        <Card className={`border ${
          isWarrantyValid(device.warrantyEnd) 
            ? 'bg-green-500/10 border-green-500/20' 
            : 'bg-red-500/10 border-red-500/20'
        }`}>
          <CardContent className="py-6">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${
                isWarrantyValid(device.warrantyEnd) ? 'bg-green-500/20' : 'bg-red-500/20'
              }`}>
                <Shield className={`w-6 h-6 ${
                  isWarrantyValid(device.warrantyEnd) ? 'text-green-400' : 'text-red-400'
                }`} />
              </div>
              <div>
                <h3 className={`font-semibold ${
                  isWarrantyValid(device.warrantyEnd) ? 'text-green-400' : 'text-red-400'
                }`}>
                  {isWarrantyValid(device.warrantyEnd) ? 'Garantia Ativa' : 'Garantia Expirada'}
                </h3>
                <p className="text-sm text-zinc-400">
                  {isWarrantyValid(device.warrantyEnd) 
                    ? `${daysUntilWarrantyEnd(device.warrantyEnd)} dias restantes • Válida até ${formatDate(device.warrantyEnd)}`
                    : `Expirou em ${formatDate(device.warrantyEnd)}`
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardHeader>
          <CardTitle>Dados do Aparelho</CardTitle>
          <CardDescription>
            {device ? 'Visualize e atualize as informações do seu aparelho' : 'Cadastre seu aparelho'}
          </CardDescription>
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
              {/* Modelo */}
              <div className="relative">
                <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <Input
                  type="text"
                  placeholder="Modelo (ex: iPhone 15 Pro Max)"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  className="pl-12"
                  required
                />
              </div>

              {/* IMEI */}
              <div className="relative">
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <Input
                  type="text"
                  placeholder="IMEI ou Número de Série"
                  value={formData.imei}
                  onChange={(e) => setFormData({ ...formData, imei: e.target.value })}
                  className="pl-12"
                  required
                />
              </div>

              {/* Data da Compra */}
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <Input
                  type="date"
                  placeholder="Data da compra"
                  value={formData.purchaseDate}
                  onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                  className="pl-12"
                  required
                />
              </div>

              {/* Garantia até */}
              <div className="relative">
                <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <Input
                  type="date"
                  placeholder="Garantia válida até"
                  value={formData.warrantyEnd}
                  onChange={(e) => setFormData({ ...formData, warrantyEnd: e.target.value })}
                  className="pl-12"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" variant="primary" loading={isSaving}>
                <Save className="w-4 h-4 mr-2" />
                {device ? 'Salvar alterações' : 'Cadastrar aparelho'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
