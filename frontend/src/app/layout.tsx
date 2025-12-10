import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'GLEIKSTORE | Tecnologia Premium ao Seu Alcance',
  description:
    'GLEIKSTORE | Tecnologia Premium ao Seu Alcance. iPhones premium com garantia e atendimento especializado.',
  keywords: 'gleikstore, iphone, tecnologia premium, apple, seminovo, smartphone',
  authors: [{ name: 'Gleikstore' }],
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'GLEIKSTORE | Tecnologia Premium ao Seu Alcance',
    description: 'iPhones premium com garantia e atendimento especializado.',
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
