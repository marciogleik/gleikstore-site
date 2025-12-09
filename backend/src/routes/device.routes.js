/**
 * Rotas de Dispositivos/Aparelhos
 * GET /api/device - Listar dispositivos do usuário
 * POST /api/device - Adicionar dispositivo
 * PUT /api/device/:id - Atualizar dispositivo
 * DELETE /api/device/:id - Remover dispositivo
 */

const express = require('express');
const prisma = require('../lib/prisma');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

// Todas as rotas requerem autenticação
router.use(authMiddleware);

/**
 * GET /api/device
 * Lista todos os dispositivos do usuário
 */
router.get('/', async (req, res) => {
  try {
    const devices = await prisma.device.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });

    return res.json({ devices });
  } catch (error) {
    console.error('Erro ao buscar dispositivos:', error);
    return res.status(500).json({
      error: true,
      message: 'Erro ao buscar dispositivos'
    });
  }
});

/**
 * GET /api/device/:id
 * Busca um dispositivo específico
 */
router.get('/:id', async (req, res) => {
  try {
    const device = await prisma.device.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!device) {
      return res.status(404).json({
        error: true,
        message: 'Dispositivo não encontrado'
      });
    }

    return res.json({ device });
  } catch (error) {
    console.error('Erro ao buscar dispositivo:', error);
    return res.status(500).json({
      error: true,
      message: 'Erro ao buscar dispositivo'
    });
  }
});

/**
 * POST /api/device
 * Adiciona um novo dispositivo
 */
router.post('/', async (req, res) => {
  try {
    const { model, imei, purchaseDate, warrantyEnd } = req.body;

    // Validações
    if (!model || !imei || !purchaseDate || !warrantyEnd) {
      return res.status(400).json({
        error: true,
        message: 'Todos os campos são obrigatórios'
      });
    }

    const device = await prisma.device.create({
      data: {
        userId: req.user.id,
        model,
        imei,
        purchaseDate: new Date(purchaseDate),
        warrantyEnd: new Date(warrantyEnd)
      }
    });

    return res.status(201).json({
      message: 'Dispositivo adicionado com sucesso!',
      device
    });
  } catch (error) {
    console.error('Erro ao adicionar dispositivo:', error);
    return res.status(500).json({
      error: true,
      message: 'Erro ao adicionar dispositivo'
    });
  }
});

/**
 * PUT /api/device/:id
 * Atualiza um dispositivo
 */
router.put('/:id', async (req, res) => {
  try {
    const { model, imei, purchaseDate, warrantyEnd } = req.body;

    // Verificar se o dispositivo pertence ao usuário
    const existingDevice = await prisma.device.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!existingDevice) {
      return res.status(404).json({
        error: true,
        message: 'Dispositivo não encontrado'
      });
    }

    // Preparar dados para atualização
    const updateData = {};
    if (model) updateData.model = model;
    if (imei) updateData.imei = imei;
    if (purchaseDate) updateData.purchaseDate = new Date(purchaseDate);
    if (warrantyEnd) updateData.warrantyEnd = new Date(warrantyEnd);

    const device = await prisma.device.update({
      where: { id: req.params.id },
      data: updateData
    });

    return res.json({
      message: 'Dispositivo atualizado com sucesso!',
      device
    });
  } catch (error) {
    console.error('Erro ao atualizar dispositivo:', error);
    return res.status(500).json({
      error: true,
      message: 'Erro ao atualizar dispositivo'
    });
  }
});

/**
 * DELETE /api/device/:id
 * Remove um dispositivo
 */
router.delete('/:id', async (req, res) => {
  try {
    // Verificar se o dispositivo pertence ao usuário
    const existingDevice = await prisma.device.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!existingDevice) {
      return res.status(404).json({
        error: true,
        message: 'Dispositivo não encontrado'
      });
    }

    await prisma.device.delete({
      where: { id: req.params.id }
    });

    return res.json({
      message: 'Dispositivo removido com sucesso!'
    });
  } catch (error) {
    console.error('Erro ao remover dispositivo:', error);
    return res.status(500).json({
      error: true,
      message: 'Erro ao remover dispositivo'
    });
  }
});

module.exports = router;
