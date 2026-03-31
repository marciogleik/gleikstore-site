'use client'

import { useState, useEffect } from 'react'
import { FileText, Check, Signature, Smartphone, AlertCircle, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { getMyContract, signDigitalContract, getMe, User } from '@/lib/api'
import { formatDate } from '@/lib/utils'

const IPHONE_MODELS = [
  'iPhone 11', 'iPhone 11 Pro', 'iPhone 11 Pro Max',
  'iPhone 12', 'iPhone 12 mini', 'iPhone 12 Pro', 'iPhone 12 Pro Max',
  'iPhone 13', 'iPhone 13 mini', 'iPhone 13 Pro', 'iPhone 13 Pro Max',
  'iPhone 14', 'iPhone 14 Plus', 'iPhone 14 Pro', 'iPhone 14 Pro Max',
  'iPhone 15', 'iPhone 15 Plus', 'iPhone 15 Pro', 'iPhone 15 Pro Max',
  'iPhone 16', 'iPhone 16 Plus', 'iPhone 16 Pro', 'iPhone 16 Pro Max',
  'iPhone 17', 'iPhone 17 Plus', 'iPhone 17 Pro', 'iPhone 17 Pro Max',
]

export default function ContractsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [contract, setContract] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedModel, setSelectedModel] = useState('')
  const [signature, setSignature] = useState('')
  const [isSigning, setIsSigning] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [userRes, contractRes] = await Promise.all([
        getMe(),
        getMyContract()
      ])
      setUser(userRes.user)
      setContract(contractRes)
      if (contractRes?.modelName) {
        setSelectedModel(contractRes.modelName)
      }
      if (contractRes?.signature) {
          setSignature(contractRes.signature)
      }
    } catch (error) {
      console.error('Erro ao buscar dados:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSign = async () => {
    if (!selectedModel) {
      setMessage({ type: 'error', text: 'Por favor, selecione o modelo do aparelho.' })
      return
    }
    if (!signature.trim()) {
      setMessage({ type: 'error', text: 'Por favor, digite seu nome completo para assinar.' })
      return
    }

    setIsSigning(true)
    setMessage({ type: '', text: '' })

    try {
      const updatedContract = await signDigitalContract(selectedModel, signature)
      setContract(updatedContract)
      setMessage({ type: 'success', text: 'Contrato assinado digitalmente com sucesso!' })
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: 'Erro ao assinar contrato. Tente novamente.' 
      })
    } finally {
      setIsSigning(false)
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
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-500">
            Contrato de Aquisição
          </h1>
          <p className="text-zinc-400 mt-2">Gerencie e assine seu contrato Gleikstore</p>
        </div>
        {contract?.isDigital && (
             <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-sm font-medium">
                <ShieldCheck className="w-4 h-4" />
                Contrato Assinado
             </div>
        )}
      </div>

      {message.text && (
        <div className={`p-4 rounded-xl text-sm flex items-center gap-3 ${
          message.type === 'success' 
            ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
            : 'bg-red-500/10 border border-red-500/20 text-red-400'
        }`}>
          {message.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar de Configuração */}
        <div className="space-y-6 lg:col-span-1">
          <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm sticky top-24">
            <CardHeader>
              <CardTitle className="text-sm uppercase tracking-widest text-zinc-500">Configuração</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                  <Smartphone className="w-4 h-4" /> Modelo do Aparelho
                </label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  disabled={!!contract?.isDigital}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <option value="">Selecione o modelo...</option>
                  {IPHONE_MODELS.map(model => (
                    <option key={model} value={model}>{model}</option>
                  ))}
                </select>
              </div>

              {!contract?.isDigital ? (
                <div className="space-y-4 pt-4 border-t border-zinc-800">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                      <Signature className="w-4 h-4" /> Sua Assinatura
                    </label>
                    <input
                      type="text"
                      placeholder="Identico ao RG/CPF"
                      value={signature}
                      onChange={(e) => setSignature(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-white/10 transition-all font-serif italic"
                    />
                    <p className="text-[10px] text-zinc-500">Ao digitar seu nome, você concorda com os termos do contrato.</p>
                  </div>
                  <Button
                    className="w-full bg-white text-black hover:bg-zinc-200"
                    onClick={handleSign}
                    loading={isSigning}
                  >
                    Assinar Agora
                  </Button>
                </div>
              ) : (
                <div className="pt-4 border-t border-zinc-800">
                   <p className="text-xs text-zinc-500 mb-2 font-medium uppercase tracking-tighter">Assinado por:</p>
                   <p className="font-serif italic text-lg text-white border-b border-zinc-800 pb-2 mb-2">{contract.signature}</p>
                   <p className="text-[10px] text-zinc-600">Data da assinatura: {formatDate(contract.uploadedAt)}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Visualização do Contrato */}
        <div className="lg:col-span-2">
          <Card className="bg-white text-zinc-900 overflow-hidden shadow-2xl">
            <div className="h-2 bg-black" />
            <CardContent className="p-8 sm:p-12 space-y-8 font-serif leading-relaxed text-sm sm:text-base">
              {/* Cabeçalho do Contrato */}
              <div className="text-center space-y-4 border-b border-zinc-100 pb-8">
                <h2 className="text-3xl font-bold tracking-tighter uppercase italic">Gleikstore</h2>
                <div className="flex flex-col text-xs text-zinc-500 gap-1 font-sans">
                  <span className="font-bold text-zinc-900">GLEIKSTORE COMÉRCIO DE ELETRÔNICOS</span>
                  <span>CNPJ: 62.282.270/0001-90</span>
                  <span>Rua Treze - Água Boa, MT</span>
                </div>
                <h3 className="text-xl font-bold underline decoration-zinc-300 underline-offset-8 mt-10 uppercase tracking-tight text-zinc-800">
                  CONTRATO DE COMPRA E VENDA E TERMO DE GARANTIA
                </h3>
              </div>

              {/* Corpo do Contrato */}
              <div className="space-y-8 text-zinc-800">
                <section className="bg-zinc-50 p-4 rounded-lg border border-zinc-100">
                  <p className="text-sm leading-relaxed">
                    Pelo presente instrumento particular, de um lado a empresa <strong>GLEIKSTORE</strong>, inscrita no CNPJ sob o nº <strong>62.282.270/0001-90</strong>, doravante denominada 
                    <strong> VENDEDORA</strong>, e de outro lado o(a) Sr(a). <strong>{user?.name || '____________________'}</strong>, portador(a) do 
                    CPF nº <strong>{user?.cpf || '____________________'}</strong>, doravante denominado(a) <strong>COMPRADOR(A)</strong>, 
                    celebram o presente contrato sob as cláusulas e condições abaixo:
                  </p>
                </section>

                <div className="space-y-6">
                  <section>
                    <h4 className="font-bold flex items-center gap-2 mb-3 uppercase text-xs tracking-wider border-l-4 border-zinc-900 pl-3">
                      Cláusula Primeira - Do Objeto e Estado do Bem
                    </h4>
                    <p className="pl-4">
                      O objeto deste contrato é a venda de 01 (um) aparelho celular da marca Apple, 
                      modelo <strong className="text-zinc-900">{selectedModel || ' [ SELECIONE O MODELO NO PAINEL LATERAL ] '}</strong>, 
                      original, em pleno funcionamento. O COMPRADOR declara ter ciência do estado físico do aparelho, 
                      tendo-o conferido no ato da entrega/recebimento.
                    </p>
                  </section>

                  <section>
                    <h4 className="font-bold flex items-center gap-2 mb-3 uppercase text-xs tracking-wider border-l-4 border-zinc-900 pl-3">
                      Cláusula Segunda - Da Garantia GLEIKSTORE
                    </h4>
                    <p className="pl-4">
                      A VENDEDORA concede garantia total de <strong>90 (noventa) dias</strong> (garantia legal conforme CDC), 
                      podendo ser estendida conforme oferta vigente no ato da compra. A garantia cobre exclusivamente 
                      vicios de fabricação e problemas de hardware. 
                      <br /><br />
                      <span className="text-xs text-zinc-500 italic block border-l-2 border-zinc-200 pl-4">
                        * Exclusões de Garantia: Danos provocados por quedas, contato com líquidos, quebra de tela, 
                        abertura do aparelho por terceiros ou uso de carregadores não homologados.
                      </span>
                    </p>
                  </section>

                  <section>
                    <h4 className="font-bold flex items-center gap-2 mb-3 uppercase text-xs tracking-wider border-l-4 border-zinc-900 pl-3">
                      Cláusula Terceira - Do Pagamento e Propriedade
                    </h4>
                    <p className="pl-4">
                      A transferência definitiva da propriedade do bem objeto deste contrato só se consolidará após 
                      a compensação integral do valor acordado. Em caso de parcelamento via boleto ou carnê próprio, 
                      o bem permanece como garantia até a quitação da última parcela.
                    </p>
                  </section>

                  <section>
                    <h4 className="font-bold flex items-center gap-2 mb-3 uppercase text-xs tracking-wider border-l-4 border-zinc-900 pl-3">
                      Cláusula Quarta - Da Proteção de Dados (LGPD)
                    </h4>
                    <p className="pl-4 text-xs italic text-zinc-600">
                      A Gleikstore compromete-se a utilizar os dados coletados neste contrato exclusivamente para 
                      fins de emissão de nota fiscal, controle de garantia e comunicações pós-venda, em estrita 
                      conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018).
                    </p>
                  </section>

                  <section>
                    <h4 className="font-bold flex items-center gap-2 mb-3 uppercase text-xs tracking-wider border-l-4 border-zinc-900 pl-3">
                      Cláusula Quinta - Do Foro
                    </h4>
                    <p className="pl-4">
                      Fica eleito o foro da comarca de Água Boa - MT para dirimir quaisquer dúvidas oriundas deste 
                      instrumento, com renúncia expressa a qualquer outro por mais privilegiado que seja.
                    </p>
                  </section>
                </div>

                {/* Área de Assinatura no Documento */}
                <div className="mt-16 pt-12 border-t border-zinc-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                    <div className="space-y-4">
                      <div className="h-px bg-zinc-400 w-full" />
                      <div className="text-center">
                        <p className="font-bold text-xs uppercase text-zinc-900">Gleikstore</p>
                        <p className="text-[10px] text-zinc-500 font-sans">CARIMBO DIGITAL VENDEDORA</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className={`text-center transition-all duration-1000 transform ${signature ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                        <p className="font-serif italic text-2xl mb-1 text-zinc-900">{signature}</p>
                      </div>
                      <div className="h-px bg-zinc-400 w-full" />
                      <div className="text-center">
                        <p className="font-bold text-xs uppercase text-zinc-900">{user?.name || 'COMPRADOR'}</p>
                        <p className="text-[10px] text-zinc-500 font-sans">ASSINATURA DO(A) COMPRADOR(A)</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center text-[10px] text-zinc-400 pt-10 font-sans border-t border-zinc-50 mt-10">
                  <p>Documento gerado e autenticado digitalmente por Gleikstore em {new Date().toLocaleDateString('pt-BR')}</p>
                  {contract?.isDigital && (
                    <div className="mt-2 p-1 border border-emerald-100 inline-block rounded bg-emerald-50">
                      <p className="font-mono text-emerald-700 font-bold uppercase tracking-widest">
                        Autenticação: {contract.id.toUpperCase()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
