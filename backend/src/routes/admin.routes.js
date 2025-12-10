/**
 * Rotas de administração (apenas ADMIN)
 * - Cadastrar/atualizar garantia de aparelho por IMEI (WarrantyTemplate)
 */

const express = require('express');
const prisma = require('../lib/prisma');
const authMiddleware = require('../middlewares/auth.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');

const router = express.Router();

// Aplica autenticação + verificação de admin em todas as rotas abaixo
router.use(authMiddleware, adminMiddleware);

/**
 * GET /api/admin/warranty/:imei
 * Consulta garantia cadastrada para um IMEI
 */
router.get('/warranty/:imei', async (req, res) => {
  try {
    const { imei } = req.params;

    const warranty = await prisma.warrantyTemplate.findUnique({
      where: { imei },
    });

    if (!warranty) {
      return res.status(404).json({
        error: true,
        message: 'Nenhuma garantia encontrada para este IMEI',
      });
    }

    return res.json({ warranty });
  } catch (error) {
    console.error('Erro em GET /api/admin/warranty/:imei:', error);
    return res.status(500).json({
      error: true,
      message: 'Erro ao buscar garantia',
    });
  }
});

/**
 * POST /api/admin/warranty
 * Cria ou atualiza garantia por IMEI
 * Body esperado:
 * {
 *   imei: string,
 *   model: string,
 *   purchaseDate: string (ISO ou yyyy-mm-dd),
 *   warrantyEnd: string (ISO ou yyyy-mm-dd)
 * }
 */
router.post('/warranty', async (req, res) => {
  try {
    const { imei, model, purchaseDate, warrantyEnd } = req.body;

    if (!imei || !model || !purchaseDate || !warrantyEnd) {
      return res.status(400).json({
        error: true,
        message: 'imei, model, purchaseDate e warrantyEnd são obrigatórios',
      });
    }

    const purchaseDateObj = new Date(purchaseDate);
    const warrantyEndObj = new Date(warrantyEnd);

    if (isNaN(purchaseDateObj.getTime()) || isNaN(warrantyEndObj.getTime())) {
      return res.status(400).json({
        error: true,
        message: 'Datas inválidas',
      });
    }

    // Verificar se já existe garantia para este IMEI
    const existing = await prisma.warrantyTemplate.findUnique({ where: { imei } });

    let warranty;

    if (existing) {
      warranty = await prisma.warrantyTemplate.update({
        where: { imei },
        data: {
          model,
          purchaseDate: purchaseDateObj,
          warrantyEnd: warrantyEndObj,
        },
      });
    } else {
      warranty = await prisma.warrantyTemplate.create({
        data: {
          imei,
          model,
          purchaseDate: purchaseDateObj,
          warrantyEnd: warrantyEndObj,
        },
      });
    }

    return res.json({
      message: 'Garantia salva com sucesso',
      warranty,
    });
  } catch (error) {
    console.error('Erro em POST /api/admin/warranty:', error);
    return res.status(500).json({
      error: true,
      message: 'Erro ao salvar garantia',
    });
  }
});

module.exports = router;
