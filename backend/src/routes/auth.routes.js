/**
 * Rotas de Autenticação
 * POST /api/auth/register - Criar conta
 * POST /api/auth/login - Fazer login
 * GET /api/auth/me - Dados do usuário autenticado
 */

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

/**
 * POST /api/auth/register
 * Criar nova conta de usuário
 */
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, cpf, phone, address } = req.body;

    // Validações básicas
    if (!name || !email || !password || !cpf || !phone || !address) {
      return res.status(400).json({
        error: true,
        message: 'Todos os campos são obrigatórios'
      });
    }

    // Verificar se email já existe
    const existingEmail = await prisma.user.findUnique({
      where: { email }
    });

    if (existingEmail) {
      return res.status(400).json({
        error: true,
        message: 'Este email já está cadastrado'
      });
    }

    // Verificar se CPF já existe
    const existingCpf = await prisma.user.findUnique({
      where: { cpf }
    });

    if (existingCpf) {
      return res.status(400).json({
        error: true,
        message: 'Este CPF já está cadastrado'
      });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar usuário
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        cpf,
        phone,
        address,
        // role será USER por padrão definido no Prisma
      },
      select: {
        id: true,
        name: true,
        email: true,
        cpf: true,
        phone: true,
        address: true,
        role: true,
        createdAt: true,
      },
    });

    // Gerar token JWT
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    return res.status(201).json({
      message: 'Conta criada com sucesso!',
      user,
      token
    });
  } catch (error) {
    console.error('Erro no registro:', error);
    return res.status(500).json({
      error: true,
      message: 'Erro ao criar conta'
    });
  }
});

/**
 * POST /api/auth/login
 * Fazer login
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validações
    if (!email || !password) {
      return res.status(400).json({
        error: true,
        message: 'Email e senha são obrigatórios'
      });
    }

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        error: true,
        message: 'Email ou senha incorretos'
      });
    }

    // Verificar senha
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({
        error: true,
        message: 'Email ou senha incorretos'
      });
    }

    // Gerar token
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // Retornar sem a senha
    const { password: _, ...userWithoutPassword } = user;

    return res.json({
      message: 'Login realizado com sucesso!',
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Erro no login:', error);
    return res.status(500).json({
      error: true,
      message: 'Erro ao fazer login'
    });
  }
});

/**
 * GET /api/auth/me
 * Retorna dados do usuário autenticado
 */
router.get('/me', authMiddleware, async (req, res) => {
  try {
    // Buscar dados completos do usuário
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        cpf: true,
        phone: true,
        address: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        profilePhoto: {
          select: {
            fileUrl: true,
            uploadedAt: true
          }
        },
        devices: {
          select: {
            id: true,
            model: true,
            imei: true,
            purchaseDate: true,
            warrantyEnd: true
          }
        },
        documents: {
          select: {
            id: true,
            documentType: true,
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

module.exports = router;
