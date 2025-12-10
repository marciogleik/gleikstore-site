/**
 * Rotas de administração (apenas ADMIN)
 * - Cadastrar/atualizar garantia de aparelho por IMEI
 */

const express = require('express');
const prisma = require('../lib/prisma');
const authMiddleware = require('../middlewares/auth.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');

const router = express.Router();

// Aplica autenticação + verificação de admin em todas as rotas abaixo
router.use(authMiddleware, adminMiddleware);

/**
 * POST /api/admin/devices
 * Cadastra ou atualiza um aparelho por IMEI (usado pelo painel admin)
 * Body esperado:
 * {
 *   model: string,
 *   imei: string,
 *   purchaseDate: string (ISO ou yyyy-mm-dd),
 *   warrantyEnd: string (ISO ou yyyy-mm-dd)
 * }
 */
router.post('/devices', async (req, res) => {
  try {
    const { model, imei, purchaseDate, warrantyEnd } = req.body;

    if (!model || !imei || !purchaseDate || !warrantyEnd) {
      return res.status(400).json({
        error: true,
        message: 'model, imei, purchaseDate e warrantyEnd são obrigatórios',
      });
    }

    // Converter datas para Date
    const purchaseDateObj = new Date(purchaseDate);
    const warrantyEndObj = new Date(warrantyEnd);

    if (isNaN(purchaseDateObj.getTime()) || isNaN(warrantyEndObj.getTime())) {
      return res.status(400).json({
        error: true,
        message: 'Datas inválidas',
      });
    }

    // Regra: no painel admin, os devices ainda não estão ligados a um user específico.
    // Usaremos userId null? Nosso schema exige userId, então a estratégia será:
    // - Procurar se já existe device com esse IMEI (independente de user)
    // - Se existir, atualizar
    // - Se não existir, criar um "modelo" sem usuário vinculado não é possível.
    //   Então, criamos com um userId fictício? Melhor: o fluxo será associar
    //   sempre ao usuário quando ele informar IMEI.
    // Para isso, manteremos aqui apenas a "configuração" para ser usada
    // em uma tabela auxiliar no futuro. Para não quebrar o schema atual,
    // vamos simplificar: esse endpoint buscará devices já associados e apenas
    // atualizará as datas/model. Isso significa que, na prática, você deverá
    // primeiro associar o aparelho ao cliente (ex: na área do cliente), e
    // depois poderá ajustar datas aqui.

    const existing = await prisma.device.findFirst({ where: { imei } });

    if (!existing) {
      return res.status(404).json({
        error: true,
        message: 'Nenhum aparelho com esse IMEI foi encontrado para atualizar.',
      });
    }

    const device = await prisma.device.update({
      where: { id: existing.id },
      data: {
        model,
        imei,
        purchaseDate: purchaseDateObj,
        warrantyEnd: warrantyEndObj,
      },
    });

    return res.json({
      message: 'Aparelho atualizado com sucesso',
      device,
    });
  } catch (error) {
    console.error('Erro em POST /api/admin/devices:', error);
    return res.status(500).json({
      error: true,
      message: 'Erro ao salvar aparelho',
    });
  }
});

/**
 * GET /api/admin/devices/:imei
 * Consulta informações de um aparelho pelo IMEI
 */
router.get('/devices/:imei', async (req, res) => {
  try {
    const { imei } = req.params;

    const device = await prisma.device.findFirst({
      where: { imei },
    });

    if (!device) {
      return res.status(404).json({
        error: true,
        message: 'Aparelho não encontrado',
      });
    }

    return res.json({ device });
  } catch (error) {
    console.error('Erro em GET /api/admin/devices/:imei:', error);
    return res.status(500).json({
      error: true,
      message: 'Erro ao buscar aparelho',
    });
  }
});

module.exports = router;
