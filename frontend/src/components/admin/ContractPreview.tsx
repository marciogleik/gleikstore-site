'use client'

import { formatCurrency, formatDate, formatCPF } from '@/lib/utils'
import { type Sale } from '@/lib/api'
import { Printer, Download, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface ContractPreviewProps {
    sale: Sale
    onClose: () => void
}

export default function ContractPreview({ sale, onClose }: ContractPreviewProps) {
    const handlePrint = () => {
        window.print()
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl flex flex-col">
                {/* Toolbar (not visible when printing) */}
                <div className="p-4 border-b border-zinc-200 flex justify-between items-center bg-zinc-50 print:hidden">
                    <div className="flex items-center gap-2">
                        <Button variant="secondary" size="sm" onClick={handlePrint}>
                            <Printer className="w-4 h-4 mr-2" /> Imprimir
                        </Button>
                        <Button variant="secondary" size="sm" disabled>
                            <Download className="w-4 h-4 mr-2" /> Baixar PDF
                        </Button>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-zinc-200 rounded-full transition-colors">
                        <X className="w-5 h-5 text-zinc-500" />
                    </button>
                </div>

                {/* Contract Paper */}
                <div className="p-12 text-zinc-900 font-serif leading-relaxed print:p-0">
                    <div className="text-center mb-10">
                        <h1 className="text-2xl font-bold uppercase border-b-2 border-zinc-900 pb-2 inline-block">Contrato de Compra e Venda de Equipamento Eletrônico</h1>
                    </div>

                    <div className="space-y-6 text-sm">
                        <section>
                            <h2 className="font-bold mb-2">1. DAS PARTES</h2>
                            <p>
                                <strong>VENDEDORA:</strong> GLEIKSTORE – PLATAFORMA DE VENDAS DE IPHONES, com sede em Brasília/DF.
                            </p>
                            <p className="mt-2">
                                <strong>COMPRADOR(A):</strong> {sale.customer?.name}, portador(a) do CPF nº {formatCPF(sale.customer?.cpf || '')}, residente e domiciliado(a) conforme cadastro no sistema.
                            </p>
                        </section>

                        <section>
                            <h2 className="font-bold mb-2">2. DO OBJETO</h2>
                            <p>
                                O presente contrato tem como objeto a venda do seguinte equipamento:
                            </p>
                            <ul className="list-disc ml-6 mt-2 space-y-1">
                                <li><strong>Modelo:</strong> {sale.product?.model}</li>
                                <li><strong>Capacidade:</strong> {sale.product?.capacity}</li>
                                <li><strong>Cor:</strong> {sale.product?.color}</li>
                                <li><strong>Condição:</strong> {sale.product?.condition}</li>
                                <li><strong>IMEI / Serial:</strong> {sale.product?.imei}</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="font-bold mb-2">3. DO PREÇO E PAGAMENTO</h2>
                            <p>
                                O valor total da transação é de <strong>{formatCurrency(sale.totalAmount)}</strong>, a ser pago via <strong>{sale.paymentType}</strong>.
                            </p>
                            {sale.payment?.dueDate && (
                                <p className="mt-2 text-zinc-600">
                                    Vencimento do pagamento: {formatDate(sale.payment.dueDate)}.
                                </p>
                            )}
                        </section>

                        <section>
                            <h2 className="font-bold mb-2">4. DA GARANTIA</h2>
                            <p>
                                A VENDEDORA oferece garantia de 90 dias para vícios ocultos e defeitos de fabricação, contados a partir da data de entrega do aparelho ({formatDate(sale.saleDate)}). A garantia não cobre danos causados por mau uso, contato com líquidos ou quedas.
                            </p>
                        </section>

                        <section>
                            <h2 className="font-bold mb-2">5. DISPOSIÇÕES GERAIS</h2>
                            <p>
                                O Comprador declara ter conferido o estado físico do aparelho no ato da compra. Este contrato passa a vigorar na data de sua assinatura digital/confirmação no sistema.
                            </p>
                        </section>

                        <div className="pt-20 grid grid-cols-2 gap-20">
                            <div className="border-t border-zinc-900 pt-2 text-center">
                                <p className="font-bold uppercase text-[10px]">GLEIKSTORE (Vendedor)</p>
                            </div>
                            <div className="border-t border-zinc-900 pt-2 text-center">
                                <p className="font-bold uppercase text-[10px]">{sale.customer?.name} (Comprador)</p>
                            </div>
                        </div>

                        <div className="text-center pt-10 text-[10px] text-zinc-400">
                            ID do Contrato: {sale.id} • Gerado em {new Date().toLocaleString('pt-BR')}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
