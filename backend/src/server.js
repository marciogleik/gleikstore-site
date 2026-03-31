/**
 * Gleikstore Backend - Servidor Principal
 * Express + Prisma + JWT Authentication
 * Otimizado para Render Free Tier (24/7 uptime)
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const prisma = require('./lib/prisma');

// Importar rotas
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const deviceRoutes = require('./routes/device.routes');
const uploadRoutes = require('./routes/upload.routes');
const adminRoutes = require('./routes/admin.routes');
const cpfRoutes = require('./routes/cpf.routes');
const inventoryRoutes = require('./routes/inventory.routes');
const salesRoutes = require('./routes/sales.routes');
const contractRoutes = require('./routes/contract.routes');

const app = express();
const PORT = process.env.PORT || 3001;

// ============ CORS MULTI-ORIGIN ============
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  'http://localhost:3003',
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Permitir requisições sem origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.some(allowed => origin.startsWith(allowed))) {
      return callback(null, true);
    }
    return callback(null, false);
  },
  credentials: true,
}));

// ============ SECURITY HEADERS ============
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// ============ BODY PARSERS ============
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

// ============ REQUEST LOGGER ============
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const ms = Date.now() - start;
    // Não logar health checks para não poluir
    if (req.path !== '/api/ping' && req.path !== '/api/health') {
      console.log(`${req.method} ${req.path} ${res.statusCode} ${ms}ms`);
    }
  });
  next();
});

// ============ ROTAS DA API ============
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/device', deviceRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/cpf', cpfRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/contracts', contractRoutes);

// ============ HEALTH CHECK ============
app.get('/api/health', async (req, res) => {
  try {
    // Verifica conexão com o banco
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      status: 'ok',
      message: 'Gleikstore API está funcionando!',
      uptime: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      status: 'degraded',
      message: 'API online mas conexão com banco instável',
      timestamp: new Date().toISOString(),
    });
  }
});

// Rota leve de ping (para uptime monitor e self-ping)
app.get('/api/ping', (req, res) => {
  res.json({ pong: true });
});

// ============ 404 HANDLER ============
app.use('/api/*', (req, res) => {
  res.status(404).json({
    error: true,
    message: `Rota ${req.method} ${req.originalUrl} não encontrada`,
  });
});

// ============ ERROR HANDLER ============
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${req.method} ${req.path}:`, err.message);

  // Erros do Multer (upload)
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      error: true,
      message: 'Arquivo muito grande. Limite: 10MB',
    });
  }

  res.status(err.status || 500).json({
    error: true,
    message: process.env.NODE_ENV === 'production'
      ? 'Erro interno do servidor'
      : err.message || 'Erro interno do servidor',
  });
});

// ============ START SERVER ============
const server = app.listen(PORT, () => {
  console.log(`🚀 Gleikstore API rodando na porta ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
  console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);

  // ============ SELF-PING KEEP-ALIVE ============
  // O Render free tier dorme após 15min sem requisições.
  // Este interval pinga o próprio servidor a cada 14min para manter ativo 24/7.
  if (process.env.NODE_ENV === 'production' && process.env.RENDER_EXTERNAL_URL) {
    const KEEP_ALIVE_URL = `${process.env.RENDER_EXTERNAL_URL}/api/ping`;
    const INTERVAL = 14 * 60 * 1000; // 14 minutos

    setInterval(async () => {
      try {
        const response = await fetch(KEEP_ALIVE_URL);
        if (response.ok) {
          console.log(`♻️  Keep-alive ping OK — ${new Date().toISOString()}`);
        }
      } catch (error) {
        console.warn('⚠️  Keep-alive ping falhou:', error.message);
      }
    }, INTERVAL);

    console.log(`♻️  Keep-alive ativado: ping a cada 14min em ${KEEP_ALIVE_URL}`);
  }
});

// ============ GRACEFUL SHUTDOWN ============
const gracefulShutdown = async (signal) => {
  console.log(`\n📛 ${signal} recebido. Encerrando servidor...`);

  server.close(async () => {
    console.log('🔌 Fechando conexões do banco de dados...');
    await prisma.$disconnect();
    console.log('✅ Servidor encerrado com sucesso.');
    process.exit(0);
  });

  // Forçar encerramento após 10s
  setTimeout(() => {
    console.error('⚠️  Forçando encerramento após 10s');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Capturar erros não tratados para evitar crash
process.on('unhandledRejection', (reason, promise) => {
  console.error('⚠️  Unhandled Rejection:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught Exception:', error);
  gracefulShutdown('UNCAUGHT_EXCEPTION');
});
