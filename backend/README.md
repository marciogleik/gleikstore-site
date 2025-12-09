# Gleikstore Backend

API REST para a plataforma Gleikstore - Sistema de gestão de clientes e aparelhos.

## 🚀 Tecnologias

- **Node.js** + **Express**
- **Prisma ORM** + **PostgreSQL**
- **JWT** para autenticação
- **Bcrypt** para hash de senhas
- **Multer** para uploads
- **Supabase Storage** para armazenamento de arquivos

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Copiar arquivo de ambiente
cp .env.example .env

# Editar .env com suas configurações
```

## ⚙️ Configuração do Banco de Dados

```bash
# Gerar cliente Prisma
npm run prisma:generate

# Executar migrations
npm run prisma:migrate

# Abrir Prisma Studio (opcional)
npm run prisma:studio
```

## 🏃 Executando

```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

## 📡 Endpoints da API

### Autenticação
- `POST /api/auth/register` - Criar conta
- `POST /api/auth/login` - Fazer login
- `GET /api/auth/me` - Dados do usuário autenticado

### Usuário
- `GET /api/user` - Buscar dados do usuário
- `PUT /api/user` - Atualizar dados

### Dispositivos
- `GET /api/device` - Listar dispositivos
- `POST /api/device` - Adicionar dispositivo
- `PUT /api/device/:id` - Atualizar dispositivo
- `DELETE /api/device/:id` - Remover dispositivo

### Uploads
- `POST /api/upload/profile-photo` - Upload de foto de perfil
- `POST /api/upload/document` - Upload de documento
- `POST /api/upload/contract` - Upload de contrato
- `GET /api/upload/documents` - Listar documentos

## 🔐 Autenticação

Todas as rotas (exceto login e register) requerem token JWT no header:

```
Authorization: Bearer <token>
```

## 📁 Estrutura

```
backend/
├── prisma/
│   └── schema.prisma      # Modelos do banco
├── src/
│   ├── lib/
│   │   ├── prisma.js      # Cliente Prisma
│   │   └── supabase.js    # Cliente Supabase
│   ├── middlewares/
│   │   └── auth.middleware.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── device.routes.js
│   │   └── upload.routes.js
│   └── server.js          # Entrada principal
├── .env.example
└── package.json
```
