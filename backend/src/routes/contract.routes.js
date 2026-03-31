const express = require('express');
const prisma = require('../lib/prisma');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(authMiddleware);

/**
 * POST /api/contracts/sign
 * Assina um contrato digitalmente
 */
router.post('/sign', async (req, res) => {
  try {
    const { modelName, signature } = req.body;

    if (!modelName || !signature) {
      return res.status(400).json({
        error: true,
        message: 'Modelo do aparelho e assinatura são obrigatórios.',
      });
    }

    // Verificar se já existe um contrato assinado para este usuário
    const existingContract = await prisma.document.findFirst({
      where: {
        userId: req.user.id,
        documentType: 'CONTRATO',
      },
    });

    let document;
    if (existingContract) {
      document = await prisma.document.update({
        where: { id: existingContract.id },
        data: { 
          modelName, 
          signature, 
          isDigital: true,
          uploadedAt: new Date(),
          fileUrl: null // Limpa se houver arquivo físico anterior
        },
      });
    } else {
      document = await prisma.document.create({
        data: {
          userId: req.user.id,
          documentType: 'CONTRATO',
          modelName,
          signature,
          isDigital: true,
        },
      });
    }

    return res.json({
      success: true,
      message: 'Contrato assinado com sucesso!',
      document,
    });
  } catch (error) {
    console.error('Erro ao assinar contrato:', error.message);
    return res.status(500).json({
      error: true,
      message: 'Erro interno ao processar a assinatura.',
    });
  }
});

/**
 * GET /api/contracts/my-contract
 * Busca o contrato atual do usuário
 */
router.get('/my-contract', async (req, res) => {
  try {
    const contract = await prisma.document.findFirst({
      where: {
        userId: req.user.id,
        documentType: 'CONTRATO',
      },
    });

    return res.json({ contract });
  } catch (error) {
    console.error('Erro ao buscar contrato:', error.message);
    return res.status(500).json({
      error: true,
      message: 'Erro ao buscar contrato.',
    });
  }
});

module.exports = router;
