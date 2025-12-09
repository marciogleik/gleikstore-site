import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: 'Gleikstore | iPhones Premium com Garantia',
  description: 'A melhor loja de iPhones seminovos e novos. Aparelhos originais, testados e com garantia. Atendimento premium e entrega imediata.',
  keywords: 'iphone, apple, seminovo, novo, garantia, gleikstore, smartphone, celular',
  authors: [{ name: 'Gleikstore' }],
  openGraph: {
    title: 'Gleikstore | iPhones Premium com Garantia',
    description: 'A melhor loja de iPhones seminovos e novos. Aparelhos originais, testados e com garantia.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className="bg-black text-white antialiased">
        {children}
      </body>
    </html>
  )
}
