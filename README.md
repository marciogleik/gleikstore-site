# Gleikstore - Plataforma Completa

Sistema completo para a marca Gleikstore - Loja de iPhones Premium.

## 🏗️ Arquitetura

O projeto está dividido em duas partes:

```
gleikstore-site/
├── backend/          # API REST (Node.js + Express + Prisma)
└── frontend/         # Interface (Next.js 15 + Tailwind CSS v4)
```

## 🚀 Quick Start

### 1. Backend

```bash
cd backend

# Instalar dependências
npm install

# Configurar ambiente
cp .env.example .env
# Edite o .env com suas configurações de banco de dados

# Gerar cliente Prisma
npm run prisma:generate

# Executar migrations
npm run prisma:migrate

# Iniciar servidor
npm run dev
```

O backend estará rodando em `http://localhost:3001`

### 2. Frontend

```bash
cd frontend

# Instalar dependências
npm install

# Configurar ambiente
cp .env.example .env.local
# Edite o .env.local com a URL da API

# Iniciar servidor de desenvolvimento
npm run dev
```

O frontend estará rodando em `http://localhost:3000`

## 📋 Funcionalidades

### Landing Page
- ✅ Navbar fixa premium com efeito ao rolar
- ✅ Hero Section com imagem de iPhone
- ✅ Seção de Diferenciais (6 cards)
- ✅ Catálogo de produtos com botão WhatsApp
- ✅ Seção Sobre a Gleikstore
- ✅ Footer com informações da empresa
- ✅ Botão flutuante do WhatsApp

### Autenticação
- ✅ Página de Login
- ✅ Página de Registro
- ✅ JWT Authentication
- ✅ Proteção de rotas

### Dashboard do Cliente
- ✅ Dados Pessoais (editar nome, telefone, endereço)
- ✅ Dados do Aparelho (modelo, IMEI, garantia)
- ✅ Upload de Foto de Perfil
- ✅ Upload de Documentos (RG, CPF, Comprovante, Contrato)

## 🛠️ Tecnologias

### Backend
- Node.js + Express
- Prisma ORM
- PostgreSQL
- JWT (jsonwebtoken)
- Bcrypt
- Multer (uploads)
- Supabase Storage (opcional)

### Frontend
- Next.js 15 (App Router)
- React 19
- Tailwind CSS v4
- Framer Motion
- Lucide Icons
- TypeScript

## 🎨 Design

Estilo premium inspirado em Apple/Nothing/Tesla:
- Fundo preto (#000) e cinza escuro (#111)
- Tipografia clean (Inter)
- Muito espaço em branco
- Animações suaves
- Cards com bordas sutis

## 📊 Banco de Dados

### Modelos (Prisma)

```prisma
model User {
  id        String   @id @default(uuid())
  name      String
  email     String   @unique
  password  String
  cpf       String   @unique
  phone     String
  address   String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Device {
  id           String   @id @default(uuid())
  userId       String
  model        String
  imei         String
  purchaseDate DateTime
  warrantyEnd  DateTime
}

model Document {
  id           String       @id @default(uuid())
  userId       String
  documentType DocumentType
  fileUrl      String
  uploadedAt   DateTime     @default(now())
}

model ProfilePhoto {
  id         String   @id @default(uuid())
  userId     String   @unique
  fileUrl    String
  uploadedAt DateTime @default(now())
}
```

## 📡 API Endpoints

### Autenticação
- `POST /api/auth/register` - Criar conta
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Dados do usuário autenticado

### Usuário
- `GET /api/user` - Buscar dados
- `PUT /api/user` - Atualizar dados

### Dispositivos
- `GET /api/device` - Listar dispositivos
- `POST /api/device` - Adicionar dispositivo
- `PUT /api/device/:id` - Atualizar dispositivo

### Uploads
- `POST /api/upload/profile-photo` - Foto de perfil
- `POST /api/upload/document` - Documento
- `POST /api/upload/contract` - Contrato
- `GET /api/upload/documents` - Listar documentos

## 🔐 Variáveis de Ambiente

### Backend (.env)
```env
DATABASE_URL="postgresql://..."
JWT_SECRET="sua-chave-secreta"
JWT_EXPIRES_IN="7d"
SUPABASE_URL="https://..."
SUPABASE_SERVICE_KEY="..."
PORT=3001
FRONTEND_URL="http://localhost:3000"
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_WHATSAPP_NUMBER=5500000000000
```

## 📱 Informações da Empresa

- **CNPJ:** 62.282.270/0001-90
- **Endereço:** Rua Treze, Bairro Operário

## 📄 Licença

Projeto privado - Gleikstore © 2024
