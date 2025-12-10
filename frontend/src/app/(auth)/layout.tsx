import { MainHeader } from '@/components/layout/MainHeader'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      <MainHeader />

      <main className="flex-1 flex items-center justify-center px-6 py-24">
        {children}
      </main>

      <footer className="p-6 text-center text-sm text-zinc-500">
        © {new Date().getFullYear()} GLEIKSTORE. Todos os direitos reservados.
      </footer>
    </div>
  )
}
