/**
 * Rotas de consulta CPF (SPC/SERASA) - Admin only
 * GET  /api/admin/cpf/:cpf       - Consultar CPF
 * GET  /api/admin/cpf/history     - Histórico de consultas
 */

const express = require('express');
const prisma = require('../lib/prisma');
const authMiddleware = require('../middlewares/auth.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');

const router = express.Router();

// Todas as rotas requerem auth + admin
router.use(authMiddleware, adminMiddleware);

/**
 * Simula uma consulta de crédito para demonstração.
 * Quando a API real (API Brasil, Netrin, etc.) for configurada,
 * substituir esta função pela chamada real.
 */
async function consultarCpfApi(cpf) {
  // Se tiver API key configurada, faz consulta real
  if (process.env.CREDIT_API_KEY && process.env.CREDIT_API_URL) {
    try {
      const response = await fetch(process.env.CREDIT_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.CREDIT_API_KEY}`,
        },
        body: JSON.stringify({ cpf }),
      });

      if (!response.ok) {
        throw new Error('Erro na API de consulta de crédito');
      }

      const data = await response.json();
      return {
        name: data.name || data.nome || null,
        score: data.score || data.pontuacao || null,
        hasPendencies: data.hasPendencies || data.restricoes || false,
        status: data.status || data.situacao || 'DESCONHECIDA',
        pendencies: data.pendencies || data.detalhes || null,
        rawData: data,
      };
    } catch (error) {
      console.error('Erro na consulta real de CPF:', error);
      throw error;
    }
  }

  // MODO DEMONSTRAÇÃO: retorna dados simulados
  const cpfClean = cpf.replace(/\D/g, '');
  
  // Gera score baseado nos dígitos do CPF para consistência
  const seed = parseInt(cpfClean.substring(0, 4)) || 500;
  const score = Math.min(1000, Math.max(100, (seed * 7) % 900 + 100));

  // CPFs terminados em número par = sem pendência, ímpar = com pendência
  const lastDigit = parseInt(cpfClean.charAt(cpfClean.length - 1)) || 0;
  const hasPendencies = lastDigit % 2 !== 0;

  const pendenciesList = hasPendencies
    ? [
        {
          tipo: 'Atraso de pagamento',
          valor: `R$ ${(seed * 3.27).toFixed(2)}`,
          credor: 'Instituição Financeira XYZ',
          data: '2024-08-15',
        },
        {
          tipo: 'Protesto',
          valor: `R$ ${(seed * 1.15).toFixed(2)}`,
          credor: 'Empresa ABC Ltda',
          data: '2024-06-22',
        },
      ]
    : [];

  return {
    name: 'Nome Demonstração (API não configurada)',
    score,
    hasPendencies,
    status: score > 500 ? 'REGULAR' : 'ATENÇÃO',
    pendencies: pendenciesList,
    rawData: { mode: 'demo', cpf: cpfClean },
  };
}

/**
 * GET /api/admin/cpf/history
 * Retorna histórico de consultas de CPF
 */
router.get('/history', async (req, res) => {
  try {
    const consultas = await prisma.cpfConsulta.findMany({
      orderBy: { consultedAt: 'desc' },
      take: 50,
      include: {
        admin: {
          select: { name: true, email: true },
        },
      },
    });

    return res.json({ consultas });
  } catch (error) {
    console.error('Erro ao buscar histórico de CPF:', error);
    return res.status(500).json({
      error: true,
      message: 'Erro ao buscar histórico de consultas',
    });
  }
});

/**
 * GET /api/admin/cpf/:cpf
 * Consulta CPF e salva no histórico
 */
router.get('/:cpf', async (req, res) => {
  try {
    const { cpf } = req.params;
    const cpfClean = cpf.replace(/\D/g, '');

    // Validação simples de CPF (11 dígitos)
    if (cpfClean.length !== 11) {
      return res.status(400).json({
        error: true,
        message: 'CPF inválido. Deve conter 11 dígitos.',
      });
    }

    // Consultar API (real ou demo)
    const result = await consultarCpfApi(cpfClean);

    // Salvar no histórico
    const consulta = await prisma.cpfConsulta.create({
      data: {
        cpf: cpfClean,
        name: result.name,
        score: result.score,
        hasPendencies: result.hasPendencies,
        status: result.status,
        pendencies: result.pendencies ? JSON.stringify(result.pendencies) : null,
        rawData: result.rawData ? JSON.stringify(result.rawData) : null,
        consultedBy: req.user.id,
      },
    });

    // Verificar se esse CPF pertence a algum cliente cadastrado
    const clienteEncontrado = await prisma.user.findUnique({
      where: { cpf: cpfClean },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
      },
    });

    return res.json({
      consulta: {
        ...consulta,
        pendencies: result.pendencies,
        rawData: result.rawData,
      },
      cliente: clienteEncontrado || null,
      isDemo: !process.env.CREDIT_API_KEY,
    });
  } catch (error) {
    console.error('Erro na consulta de CPF:', error);
    return res.status(500).json({
      error: true,
      message: 'Erro ao consultar CPF',
    });
  }
});

module.exports = router;
