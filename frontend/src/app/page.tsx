import { MainHeader } from '@/components/layout/MainHeader'

export default function Home() {
  const whatsappNumber = '5561982195532'
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=Olá! Vim pelo site da GLEIKSTORE`

  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">
      <MainHeader />

      {/* ====== HERO ====== */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Gradient orbs */}
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] rounded-full bg-violet-600/8 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] rounded-full bg-blue-600/6 blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-28 pb-20 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Text */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-8 animate-fade-in-up">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs uppercase tracking-[0.2em] text-gray-400">Aparelhos disponíveis agora</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.05] mb-6 animate-fade-in-up animate-delay-100">
              iPhones{' '}
              <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
                lacrados
              </span>{' '}
              e seminovos.
            </h1>

            <p className="text-base md:text-lg text-gray-400 max-w-md mx-auto lg:mx-0 mb-8 leading-relaxed animate-fade-in-up animate-delay-200">
              Trabalhamos com iPhones lacrados de fábrica e seminovos selecionados.
              Todos com garantia, nota fiscal e suporte direto conosco no WhatsApp.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up animate-delay-300">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative px-8 py-4 bg-white text-black font-semibold rounded-full hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] transition-all duration-300 hover:scale-105"
              >
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Ver aparelhos disponíveis
                </span>
              </a>
              <a
                href="#como-funciona"
                className="px-8 py-4 border border-white/15 rounded-full text-gray-300 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all duration-300"
              >
                Como funciona →
              </a>
            </div>

            {/* Trust badges */}
            <div className="flex items-center gap-6 mt-10 justify-center lg:justify-start animate-fade-in-up animate-delay-400">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                <span className="text-xs text-emerald-400 font-medium">Garantia de 1 ano</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                <span className="text-xs text-gray-500">Revisado e testado</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                <span className="text-xs text-gray-500">Nota fiscal inclusa</span>
              </div>
            </div>
          </div>

          {/* Hero Image — blended into dark bg */}
          <div className="flex-1 flex justify-center lg:justify-end animate-fade-in-up animate-delay-200">
            <div className="relative hero-iphone-container">
              <img
                src="/iphone-hero.png"
                alt="iPhone seminovo revisado - Gleikstore"
                className="w-[320px] md:w-[400px] lg:w-[480px] hero-iphone-img"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ====== NÚMEROS ====== */}
      <section className="border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl md:text-4xl font-bold text-white">500+</p>
              <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">Aparelhos vendidos</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-white">Lacrados</p>
              <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">Direto de fábrica</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-emerald-400">1 ano</p>
              <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">De garantia</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-white">Todo Brasil</p>
              <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">Enviamos para você</p>
            </div>
          </div>
        </div>
      </section>

      {/* ====== COMO FUNCIONA ====== */}
      <section id="como-funciona" className="py-24 px-6 relative">
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] rounded-full bg-blue-600/5 blur-[100px] pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10">
          <p className="text-xs uppercase tracking-[0.3em] text-violet-400 text-center mb-3">Direto ao ponto</p>
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-4">
            Como funciona
          </h2>
          <p className="text-gray-500 text-center max-w-lg mx-auto mb-16">
            Simples, rápido e sem burocracia. Você escolhe, a gente cuida do resto.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="group relative p-8 rounded-3xl bg-gradient-to-b from-white/[0.05] to-transparent border border-white/[0.06] hover:border-white/10 transition-all duration-500">
              <div className="absolute top-6 right-6 text-6xl font-black text-white/[0.03] group-hover:text-white/[0.06] transition-colors">01</div>
              <div className="w-12 h-12 rounded-2xl bg-violet-500/10 flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Chama no Whats</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Manda mensagem falando qual modelo você quer. Respondemos pessoalmente, nada de robô.
              </p>
            </div>

            {/* Step 2 */}
            <div className="group relative p-8 rounded-3xl bg-gradient-to-b from-white/[0.05] to-transparent border border-white/[0.06] hover:border-white/10 transition-all duration-500">
              <div className="absolute top-6 right-6 text-6xl font-black text-white/[0.03] group-hover:text-white/[0.06] transition-colors">02</div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Vê tudo antes de fechar</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Mandamos fotos reais do aparelho, bateria, detalhes e tiramos qualquer dúvida que você tiver.
              </p>
            </div>

            {/* Step 3 */}
            <div className="group relative p-8 rounded-3xl bg-gradient-to-b from-white/[0.05] to-transparent border border-white/[0.06] hover:border-white/10 transition-all duration-500">
              <div className="absolute top-6 right-6 text-6xl font-black text-white/[0.03] group-hover:text-white/[0.06] transition-colors">03</div>
              <div className="w-12 h-12 rounded-2xl bg-sky-500/10 flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Recebe com garantia</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Leva o aparelho com 1 ano de garantia, nota fiscal e nosso contato direto pra qualquer coisa.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ====== DIFERENCIAIS ====== */}
      <section className="py-24 px-6 relative">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div className="max-w-6xl mx-auto">
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-400 text-center mb-3">O que muda aqui</p>
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">
            Por que comprar na <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Gleikstore</span>?
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="card-glow p-7 rounded-2xl bg-zinc-900/60 border border-zinc-800/60">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.746 3.746 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-1.5">Lacrado ou revisado</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Trabalhamos com lacrados de fábrica e seminovos que passam por checagem completa antes de ir pra vitrine.</p>
            </div>

            <div className="card-glow p-7 rounded-2xl bg-zinc-900/60 border border-zinc-800/60 transition-all hover:border-emerald-500/30">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-1.5 text-emerald-400">1 ano de garantia</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Garantia total de 1 ano com contrato. Deu problema? Trocamos ou resolvemos, sem enrolação.</p>
            </div>

            <div className="card-glow p-7 rounded-2xl bg-zinc-900/60 border border-zinc-800/60">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-1.5">Parcelo no cartão</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Pix, cartão de crédito, parcelamento. Achamos um jeito que cabe no seu bolso.</p>
            </div>

            <div className="card-glow p-7 rounded-2xl bg-zinc-900/60 border border-zinc-800/60">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-1.5">Nota fiscal e contrato</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Tudo certinho no papel. Nota fiscal emitida e contrato assinado na hora da compra.</p>
            </div>

            <div className="card-glow p-7 rounded-2xl bg-zinc-900/60 border border-zinc-800/60">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-1.5">Atendimento de verdade</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Comprou e precisou de ajuda depois? Nos chama. Não te largamos depois da venda.</p>
            </div>

            <div className="card-glow p-7 rounded-2xl bg-zinc-900/60 border border-zinc-800/60">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                </svg>
              </div>
              <h3 className="font-semibold mb-1.5">Área do cliente online</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Consulta sua garantia, documentos e dados do aparelho pela plataforma, na hora que quiser.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ====== DEPOIMENTOS ====== */}
      <section className="py-24 px-6 relative">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div className="max-w-5xl mx-auto">
          <p className="text-xs uppercase tracking-[0.3em] text-amber-400 text-center mb-3">Quem já comprou fala</p>
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">
            Avaliações reais
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-white/[0.06]">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-sm text-gray-400 leading-relaxed mb-4">
                &ldquo;Peguei um iPhone 14 Pro com a Gleikstore e o aparelho tá impecável. Mostraram tudo antes, bateria, tela, sem mistério nenhum. Super recomendo.&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-xs font-bold">M</div>
                <div>
                  <p className="text-sm font-medium">Marcos S.</p>
                  <p className="text-xs text-gray-600">iPhone 14 Pro</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-white/[0.06]">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-sm text-gray-400 leading-relaxed mb-4">
                &ldquo;Comprei um 13 pra minha mãe. Ela não entende muito de celular e o pessoal da Gleikstore teve paciência de explicar tudo. Atendimento nota 10, voltarei com certeza.&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-xs font-bold">A</div>
                <div>
                  <p className="text-sm font-medium">Ana P.</p>
                  <p className="text-xs text-gray-600">iPhone 13</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-white/[0.06]">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-sm text-gray-400 leading-relaxed mb-4">
                &ldquo;Terceiro aparelho que pego lá. Preço justo, aparelho em estado excelente e a equipe é gente boa demais. Não compro em outro lugar.&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-xs font-bold">R</div>
                <div>
                  <p className="text-sm font-medium">Rafael L.</p>
                  <p className="text-xs text-gray-600">iPhone 15 Pro Max</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====== CTA FINAL ====== */}
      <section className="py-24 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-600/[0.04] to-transparent pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-4">Bora?</p>
          <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
            Tá procurando{' '}
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">iPhone</span>?
            <br />
            Chama no Whats.
          </h2>
          <p className="text-gray-500 max-w-lg mx-auto mb-10">
            Nos conta o que você precisa que a gente te ajuda a encontrar o aparelho certo, no preço certo. Sem compromisso.
          </p>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-full hover:shadow-[0_0_40px_rgba(16,185,129,0.3)] transition-all duration-300 hover:scale-105 text-lg"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Chamar no WhatsApp
          </a>
        </div>
      </section>

      {/* ====== SOBRE ====== */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Sobre a Gleikstore</h2>
          <p className="text-gray-500 leading-relaxed text-sm">
            Somos especialistas em iPhones lacrados e seminovos desde 2020. O que começou vendendo pra amigos e família se tornou
            uma operação que atende clientes em todo o Brasil. Trabalhamos com aparelhos lacrados de fábrica e seminovos selecionados.
            Nosso objetivo é simples: entregar um celular bom, com preço justo e sem dor de cabeça.
          </p>
        </div>
      </section>

      {/* ====== FOOTER ====== */}
      <footer className="py-12 px-6 bg-zinc-950 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            <div className="md:col-span-2">
              <span className="text-xl font-bold tracking-tight">
                GLEIK<span className="text-gray-600">STORE</span>
              </span>
              <p className="text-sm text-gray-600 mt-3 max-w-xs leading-relaxed">
                iPhones lacrados e seminovos para todo o Brasil. Com garantia e nota fiscal.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">Navegação</h4>
              <div className="space-y-2.5">
                <a href="#como-funciona" className="block text-sm text-gray-600 hover:text-white transition-colors">Como funciona</a>
                <a href="/login" className="block text-sm text-gray-600 hover:text-white transition-colors">Área do cliente</a>
                <a href="/register" className="block text-sm text-gray-600 hover:text-white transition-colors">Criar conta</a>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">Contato</h4>
              <div className="space-y-2.5">
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="block text-sm text-gray-600 hover:text-white transition-colors">
                  📱 (61) 98219-5532
                </a>
                <p className="text-sm text-gray-600">📍 Entrega para todo o Brasil</p>
                <p className="text-sm text-gray-600">🏢 CNPJ 62.282.270/0001-90</p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-3">
            <span className="text-xs text-gray-700">© 2026 Gleikstore. Todos os direitos reservados.</span>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-600 hover:text-white transition-colors">
              Fale conosco no WhatsApp
            </a>
          </div>
        </div>
      </footer>

      {/* ====== WHATSAPP FLOAT ====== */}
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg hover:bg-emerald-600 transition-all hover:scale-110 animate-pulse-glow z-50"
        aria-label="WhatsApp"
      >
        <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    </main>
  )
}
