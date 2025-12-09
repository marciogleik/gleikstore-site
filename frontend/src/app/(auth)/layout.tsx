import Link from 'next/link'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <header className="p-6">
        <Link href="/" className="inline-block">
          <span className="text-2xl font-bold tracking-tight">
            Gleik<span className="text-zinc-400">store</span>
          </span>
        </Link>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        {children}
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-sm text-zinc-500">
        © {new Date().getFullYear()} Gleikstore. Todos os direitos reservados.
      </footer>
    </div>
  )
}
