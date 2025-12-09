import { Navbar } from '@/components/landing/Navbar'
import { Hero } from '@/components/landing/Hero'
import { Features } from '@/components/landing/Features'
import { Catalog } from '@/components/landing/Catalog'
import { About } from '@/components/landing/About'
import { Footer } from '@/components/landing/Footer'
import { WhatsAppButton } from '@/components/landing/WhatsAppButton'

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      <Navbar />
      <Hero />
      <Features />
      <Catalog />
      <About />
      <Footer />
      <WhatsAppButton />
    </main>
  )
}
