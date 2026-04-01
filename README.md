# Gleikstore 

Gleikstore é uma plataforma digital de alta performance desenvolvida para redefinir a experiência de aquisição e gestão de dispositivos premium. Combinando uma estética minimalista ("Luxury Dark Mode") com uma infraestrutura robusta, a plataforma atende tanto o consumidor final quanto a gestão administrativa.

---

## Capacidades da Plataforma

### 1. Showroom Digital & Catálogo "Flagship"
- **Experiência Visual Imersiva**: Interface inspirada nos padrões de design da Apple, Nothing e Tesla, utilizando Next.js 15 e Tailwind v4 para transições fluidas.
- **Catálogo Dinâmico**: Vitrine inteligente de dispositivos com integração direta para canais de fechamento (WhatsApp) e sistema de SEO otimizado.

### 2. Customer Intelligence Panel (Portal do Cliente)
- **Gestão de Ativos em Tempo Real**: O cliente tem visibilidade total de seus dispositivos adquiridos, incluindo números de IMEI e status de garantia.
- **Digital Contract Suite**: Sistema nativo de assinatura digital, permitindo a formalização de termos de compra e venda sem papel, com validade jurídica e autenticidade via UUID.
- **Secure Document Vault**: Sistema de upload e gestão de documentos sensíveis (RG, CPF, comprovantes) protegidos por políticas de segurança Row Level Security (RLS).
- **Personal Profile Optimization**: Gestão de dados pessoais e fotos de perfil com armazenamento em bucket seguro.

### 3. Elite Administrative Control (Painel Admin)
- **Inventory Optimization**: Gestão avançada de estoque com rastreamento por IMEI, estado físico do aparelho (Novo/Seminovo) e histórico de entrada/saída.
- **Sales & Provisioning**: Fluxo de venda que provisiona automaticamente o dispositivo para o painel do cliente no ato da confirmação.
- **Warranty Guard**: Sistema de alerta e monitoramento automático de períodos de garantia, facilitando o suporte pós-venda.
- **Customer 360 View**: Painel administrativo centralizado para auditoria de clientes, validação de documentos e histórico completo de transações.
- **Advanced CPF Consultation**: Módulo integrado para consulta e verificação de CPF, garantindo leads qualificados e segurança nas transações.

---

## 🛠️ Especificações Técnicas (The Stack)

### Core
- **Framework**: [Next.js 15](https://nextjs.org/) (App Router Architecture)
- **Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (High-performance JIT engine)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)

### Data & Infrastructure
- **Backend-as-a-Service**: [Supabase](https://supabase.com/)
- **Database**: PostgreSQL (Relational integrity)
- **Storage**: Supabase Storage Buckets (Criptografia de documentos e mídia)
- **Authentication**: Supabase Auth (JWT & Real-time protection)
- **Programming Language**: [TypeScript](https://www.typescriptlang.org/) (Full-stack type safety)

### Design philosophy
- **Minimalist Aesthetic**: Foco em espaços em branco (negative space), tipografia clean (Inter) e sombras suaves para uma sensação de profundidade e luxo.
- **Performance First**: Otimização de imagens de próxima geração e carregamento dinâmico de componentes pesados.

---

## 🔐 Segurança & Governança de Dados

A arquitetura da Gleikstore foi construída sobre os pilares da segurança moderna:
- **Row Level Security (RLS)**: Cada dado no banco de dados é blindado, garantindo que usuários só acessem o que lhes pertence.
- **File Encryption**: Documentos de identidade são armazenados em buckets privados, acessíveis apenas via links temporários assinados (Signed URLs).
- **Audit Logs**: Rastreamento de atividades críticas tanto no portal do cliente quanto no painel administrativo.

---

© 2024 Gleikstore. Desenvolvido para a Excelência.
By: [Marcio Gleik](https://www.linkedin.com/in/marciogleikdev/)
