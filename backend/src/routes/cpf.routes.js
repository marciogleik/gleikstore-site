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
 * Consulta de CPF - Mix de Real (Cadastro) e Demo (Crédito)
 * Se tiver CADASTRO_API_KEY, busca nome real na Receita.
 * Se tiver CREDIT_API_KEY, busca score real.
 */
async function consultarCpfApi(cpf) {
  let name = 'Nome não encontrado';
  let status = 'DESCONHECIDA';
  let score = 0;
  let hasPendencies = false;
  let pendencies = [];
  let rawData = { source: 'mixed' };

  // 1. Tentar consulta de CADASTRO (Grátis/Barato - Receita Federal)
  // Exemplo usando APICPF.com (Plano Free disponível)
  if (process.env.CADASTRO_API_KEY) {
    try {
      const cadResponse = await fetch(`https://api.apicpf.com/v1/cpf/${cpf}?token=${process.env.CADASTRO_API_KEY}`);
      if (cadResponse.ok) {
        const cadData = await cadResponse.json();
        name = cadData.nome || name;
        status = cadData.situacao || status;
        rawData.cadastro = cadData;
      }
    } catch (e) {
      console.error('Erro na consulta cadastral:', e.message);
    }
  }

  // 2. Tentar consulta de CRÉDITO (Paga - SPC/Serasa)
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

      if (response.ok) {
        const data = await response.json();
        score = data.score || data.pontuacao || 0;
        hasPendencies = data.hasPendencies || data.restricoes || false;
        pendencies = data.pendencies || data.detalhes || [];
        rawData.credito = data;
        if (data.name || data.nome) name = data.name || data.nome;
      }
    } catch (error) {
      console.error('Erro na consulta de crédito real:', error.message);
    }
  } else {
    // MODO DEMONSTRAÇÃO para CRÉDITO
    const cpfClean = cpf.replace(/\D/g, '');
    const seed = parseInt(cpfClean.substring(0, 4)) || 500;

    // Nome simulado se não veio da API de cadastro
    if (name === 'Nome não encontrado') {
      name = `Simulação: ${cpfClean.substring(0, 3)}.***.***-${cpfClean.substring(9)}`;
    }

    score = Math.min(1000, Math.max(100, (seed * 7) % 900 + 100));
    const lastDigit = parseInt(cpfClean.charAt(cpfClean.length - 1)) || 0;
    hasPendencies = lastDigit % 2 !== 0;

    if (hasPendencies) {
      pendencies = [
        {
          tipo: 'Atraso de pagamento',
          valor: `R$ ${(seed * 1.5).toFixed(2)}`,
          credor: 'Empresa Teste S.A.',
          data: '2025-01-10',
        }
      ];
    }

    if (status === 'DESCONHECIDA') status = score > 400 ? 'REGULAR' : 'PENDENTE';
    rawData.demo = true;
  }

  return {
    name,
    score,
    hasPendencies,
    status,
    pendencies,
    rawData,
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
