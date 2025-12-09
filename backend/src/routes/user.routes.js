/**
 * Rotas de Usuário
 * GET /api/user - Buscar dados do usuário
 * PUT /api/user - Atualizar dados do usuário
 */

const express = require('express');
const bcrypt = require('bcryptjs');
const prisma = require('../lib/prisma');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

// Todas as rotas requerem autenticação
router.use(authMiddleware);

/**
 * GET /api/user
 * Retorna dados do usuário autenticado
 */
router.get('/', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        cpf: true,
        phone: true,
        address: true,
        createdAt: true,
        updatedAt: true,
        profilePhoto: {
          select: {
            id: true,
            fileUrl: true,
            uploadedAt: true
          }
        }
      }
    });

    return res.json({ user });
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    return res.status(500).json({
      error: true,
      message: 'Erro ao buscar dados do usuário'
    });
  }
});

/**
 * PUT /api/user
 * Atualiza dados do usuário
 */
router.put('/', async (req, res) => {
  try {
    const { name, phone, address, currentPassword, newPassword } = req.body;

    // Preparar dados para atualização
    const updateData = {};

    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;

    // Se está alterando senha
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({
          error: true,
          message: 'Senha atual é obrigatória para alterar a senha'
        });
      }

      // Buscar usuário com senha
      const userWithPassword = await prisma.user.findUnique({
        where: { id: req.user.id }
      });

      // Verificar senha atual
      const validPassword = await bcrypt.compare(currentPassword, userWithPassword.password);

      if (!validPassword) {
        return res.status(400).json({
          error: true,
          message: 'Senha atual incorreta'
        });
      }

      // Hash da nova senha
      updateData.password = await bcrypt.hash(newPassword, 10);
    }

    // Atualizar usuário
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        cpf: true,
        phone: true,
        address: true,
        updatedAt: true
      }
    });

    return res.json({
      message: 'Dados atualizados com sucesso!',
      user
    });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    return res.status(500).json({
      error: true,
      message: 'Erro ao atualizar dados'
    });
  }
});

module.exports = router;
