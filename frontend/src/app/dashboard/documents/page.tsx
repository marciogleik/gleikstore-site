'use client'

import { useState, useEffect, useRef } from 'react'
import { FileText, Upload, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { getDocuments, uploadDocument, uploadContract } from '@/lib/api'
import type { Document } from '@/lib/api'
import { formatDate } from '@/lib/utils'

type DocumentTypeKey = 'RG' | 'CPF' | 'COMPROVANTE_ENDERECO' | 'CONTRATO'

const documentTypes: { key: DocumentTypeKey; label: string; description: string }[] = [
  { key: 'RG', label: 'RG', description: 'Documento de identidade' },
  { key: 'CPF', label: 'CPF', description: 'Cadastro de Pessoa Física' },
  { key: 'COMPROVANTE_ENDERECO', label: 'Comprovante de Endereço', description: 'Conta de luz, água ou telefone' },
  { key: 'CONTRATO', label: 'Contrato Assinado', description: 'Contrato de compra em PDF' },
]

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [uploadingType, setUploadingType] = useState<DocumentTypeKey | null>(null)
  const [message, setMessage] = useState({ type: '', text: '' })
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({})

  useEffect(() => {
    fetchDocuments()
  }, [])

  const fetchDocuments = async () => {
    try {
      const response = await getDocuments()
      setDocuments(response.documents)
    } catch (error) {
      console.error('Erro ao buscar documentos:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileSelect = async (type: DocumentTypeKey, file: File) => {
    setMessage({ type: '', text: '' })
    setUploadingType(type)

    try {
      if (type === 'CONTRATO') {
        await uploadContract(file)
      } else {
        await uploadDocument(file, type as 'RG' | 'CPF' | 'COMPROVANTE_ENDERECO')
      }
      
      await fetchDocuments()
      setMessage({ type: 'success', text: `${getDocLabel(type)} enviado com sucesso!` })
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Erro ao fazer upload' 
      })
    } finally {
      setUploadingType(null)
    }
  }

  const getDocLabel = (type: DocumentTypeKey): string => {
    return documentTypes.find(d => d.key === type)?.label || type
  }

  const getDocumentByType = (type: DocumentTypeKey): Document | undefined => {
    return documents.find(d => d.documentType === type)
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
        <h1 className="text-3xl font-bold">Documentos</h1>
        <p className="text-zinc-400 mt-2">Envie seus documentos para validação</p>
      </div>

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
        {documentTypes.map((docType) => {
          const existingDoc = getDocumentByType(docType.key)
          const isUploading = uploadingType === docType.key

          return (
            <Card key={docType.key} className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{docType.label}</CardTitle>
                    <CardDescription>{docType.description}</CardDescription>
                  </div>
                  {existingDoc ? (
                    <div className="p-2 bg-green-500/20 rounded-full">
                      <Check className="w-4 h-4 text-green-400" />
                    </div>
                  ) : (
                    <div className="p-2 bg-zinc-800 rounded-full">
                      <X className="w-4 h-4 text-zinc-500" />
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {existingDoc ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-xl">
                      <FileText className="w-5 h-5 text-zinc-400" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {docType.label}
                        </p>
                        <p className="text-xs text-zinc-500">
                          Enviado em {formatDate(existingDoc.uploadedAt)}
                        </p>
                      </div>
                      <a
                        href={existingDoc.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-white hover:underline"
                      >
                        Ver
                      </a>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => fileInputRefs.current[docType.key]?.click()}
                      loading={isUploading}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Substituir
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={() => fileInputRefs.current[docType.key]?.click()}
                    loading={isUploading}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Enviar documento
                  </Button>
                )}

                <input
                  ref={(el) => { fileInputRefs.current[docType.key] = el }}
                  type="file"
                  accept={docType.key === 'CONTRATO' ? 'application/pdf' : 'image/jpeg,image/png,application/pdf'}
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      handleFileSelect(docType.key, file)
                    }
                  }}
                  className="hidden"
                />
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Info */}
      <Card className="bg-zinc-900/30 border-zinc-800">
        <CardContent className="py-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-zinc-800 rounded-xl">
              <FileText className="w-6 h-6 text-zinc-400" />
            </div>
            <div>
              <h4 className="font-semibold mb-1">Sobre os documentos</h4>
              <p className="text-sm text-zinc-400">
                Os documentos são necessários para validar sua identidade e garantir a segurança 
                da sua compra. Todos os arquivos são armazenados de forma segura e criptografada.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
