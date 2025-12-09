# Gleikstore Frontend

Interface premium para a plataforma Gleikstore - Loja de iPhones.

## 🚀 Tecnologias

- **Next.js 15** (App Router)
- **React 19**
- **Tailwind CSS v4**
- **Framer Motion** (animações)
- **Lucide Icons**
- **TypeScript**

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Copiar arquivo de ambiente
cp .env.example .env.local

# Editar .env.local com suas configurações
```

## 🏃 Executando

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar produção
npm start
```

## 📄 Páginas

### Públicas
- `/` - Landing Page premium
- `/login` - Página de login
- `/register` - Página de registro

### Protegidas (requer autenticação)
- `/dashboard` - Dados pessoais
- `/dashboard/device` - Informações do aparelho
- `/dashboard/photo` - Foto de perfil
- `/dashboard/documents` - Upload de documentos

## 🎨 Design

O design segue o estilo premium inspirado em:
- **Apple** - Minimalismo e elegância
- **Nothing** - Contraste e tipografia
- **Tesla** - Espaço e sofisticação

### Cores principais
- Background: `#000000` (preto)
- Cards: `#111111` (cinza escuro)
- Bordas: `#222222`
- Texto: `#ffffff` (branco)
- Muted: `#888888`

## 📁 Estrutura

```
frontend/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── dashboard/
│   │   │   ├── device/
│   │   │   ├── documents/
│   │   │   └── photo/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── landing/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Hero.tsx
│   │   │   ├── Features.tsx
│   │   │   ├── Catalog.tsx
│   │   │   ├── About.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── WhatsAppButton.tsx
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       └── Input.tsx
│   └── lib/
│       ├── api.ts
│       └── utils.ts
├── .env.example
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

## 🔗 Integração com Backend

O frontend se comunica com o backend através da API REST.
Configure a URL da API no arquivo `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## 📱 Responsividade

O design é totalmente responsivo:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px
