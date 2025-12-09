import Link from 'next/link'

export default function Home() {
  const whatsappNumber = '5561982195532'
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=Olá! Vim pelo site da Gleikstore`

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-xl font-semibold tracking-tight">
            Gleik<span className="text-gray-500">store</span>
          </span>
          <Link 
            href="/login" 
            className="px-4 py-2 text-sm border border-white/20 rounded-full hover:bg-white hover:text-black transition-all"
          >
            Entrar
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
          iPhones Premium
        </h1>
        <p className="text-lg md:text-xl text-gray-400 max-w-xl mb-10">
          Qualidade garantida, preços justos e atendimento excepcional.
        </p>
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="px-8 py-4 bg-white text-black font-medium rounded-full hover:bg-gray-200 transition-all"
        >
          Falar no WhatsApp
        </a>
      </section>

      {/* Diferenciais */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">Por que escolher a Gleikstore?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">✓</div>
              <h3 className="text-lg font-semibold mb-2">Garantia Real</h3>
              <p className="text-gray-400 text-sm">90 dias de garantia em todos os aparelhos</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">★</div>
              <h3 className="text-lg font-semibold mb-2">Qualidade Premium</h3>
              <p className="text-gray-400 text-sm">Aparelhos revisados e testados</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">♡</div>
              <h3 className="text-lg font-semibold mb-2">Atendimento Humano</h3>
              <p className="text-gray-400 text-sm">Suporte direto pelo WhatsApp</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sobre */}
      <section className="py-24 px-6 border-t border-white/10">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Sobre a Gleikstore</h2>
          <p className="text-gray-400 leading-relaxed mb-8">
            Somos especialistas em iPhones seminovos e novos. Trabalhamos com transparência, 
            oferecendo aparelhos de qualidade com garantia real e suporte dedicado.
          </p>
          <p className="text-sm text-gray-500">
            CNPJ: 62.282.270/0001-90
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-sm text-gray-500">
            © 2024 Gleikstore. Todos os direitos reservados.
          </span>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            WhatsApp: (61) 98219-5532
          </a>
        </div>
      </footer>

      {/* WhatsApp Floating Button */}
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-all hover:scale-110"
        aria-label="WhatsApp"
      >
        <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </main>
  )
}
