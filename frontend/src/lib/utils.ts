/**
 * Funções utilitárias
 */

// Formatar CPF: 000.000.000-00
export function formatCPF(value: string): string {
  const numbers = value.replace(/\D/g, '').slice(0, 11)
  return numbers
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
}

// Formatar telefone: (00) 00000-0000
export function formatPhone(value: string): string {
  const numbers = value.replace(/\D/g, '').slice(0, 11)
  return numbers
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
}

// Formatar data para exibição: DD/MM/YYYY
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR')
}

// Formatar data para input: YYYY-MM-DD
export function formatDateForInput(dateString: string): string {
  const date = new Date(dateString)
  return date.toISOString().split('T')[0]
}

// Formatar preço: R$ 0.000,00
export function formatPrice(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

// Gerar link do WhatsApp
export function getWhatsAppLink(message: string): string {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5500000000000'
  const encodedMessage = encodeURIComponent(message)
  return `https://wa.me/${phone}?text=${encodedMessage}`
}

// Verificar se a garantia está válida
export function isWarrantyValid(warrantyEnd: string): boolean {
  return new Date(warrantyEnd) > new Date()
}

// Calcular dias restantes de garantia
export function daysUntilWarrantyEnd(warrantyEnd: string): number {
  const end = new Date(warrantyEnd)
  const now = new Date()
  const diff = end.getTime() - now.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

// Classes condicionais (similar ao clsx)
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ')
}
