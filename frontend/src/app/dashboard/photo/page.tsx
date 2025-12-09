'use client'

import { useState, useEffect, useRef } from 'react'
import { Camera, Upload, User } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { getDocuments, uploadProfilePhoto } from '@/lib/api'

export default function PhotoPage() {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fetchPhoto = async () => {
      try {
        const response = await getDocuments()
        if (response.profilePhoto) {
          setPhotoUrl(response.profilePhoto.fileUrl)
        }
      } catch (error) {
        console.error('Erro ao buscar foto:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPhoto()
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Criar preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUpload = async () => {
    const file = fileInputRef.current?.files?.[0]
    if (!file) return

    setMessage({ type: '', text: '' })
    setIsUploading(true)

    try {
      const response = await uploadProfilePhoto(file)
      setPhotoUrl(response.profilePhoto.fileUrl)
      setPreview(null)
      setMessage({ type: 'success', text: 'Foto atualizada com sucesso!' })
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Erro ao fazer upload' 
      })
    } finally {
      setIsUploading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const displayImage = preview || photoUrl

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Foto de Perfil</h1>
        <p className="text-zinc-400 mt-2">Atualize sua foto de perfil</p>
      </div>

      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardHeader>
          <CardTitle>Sua Foto</CardTitle>
          <CardDescription>Clique para selecionar uma nova foto</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {message.text && (
              <div className={`p-4 rounded-xl text-sm ${
                message.type === 'success' 
                  ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                  : 'bg-red-500/10 border border-red-500/20 text-red-400'
              }`}>
                {message.text}
              </div>
            )}

            {/* Photo Preview */}
            <div className="flex flex-col items-center gap-6">
              <div 
                className="relative w-48 h-48 rounded-full overflow-hidden bg-zinc-800 border-4 border-zinc-700 cursor-pointer hover:border-zinc-600 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                {displayImage ? (
                  <img 
                    src={displayImage} 
                    alt="Foto de perfil" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-20 h-20 text-zinc-600" />
                  </div>
                )}
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <Camera className="w-8 h-8 text-white" />
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileSelect}
                className="hidden"
              />

              <p className="text-sm text-zinc-500">
                Formatos aceitos: JPG, PNG, WebP (máx. 10MB)
              </p>
            </div>

            {/* Upload Button */}
            {preview && (
              <div className="flex justify-center">
                <Button 
                  variant="primary" 
                  onClick={handleUpload}
                  loading={isUploading}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Salvar foto
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
