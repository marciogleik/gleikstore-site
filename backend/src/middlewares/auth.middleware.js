/**
 * Middleware de Autenticação JWT
 * Protege rotas que requerem usuário autenticado
 */

const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');

const authMiddleware = async (req, res, next) => {
  try {
    // Pegar token do header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ 
        error: true, 
        message: 'Token não fornecido' 
      });
    }

    // Formato: "Bearer <token>"
    const parts = authHeader.split(' ');
    
    if (parts.length !== 2) {
      return res.status(401).json({ 
        error: true, 
        message: 'Token mal formatado' 
      });
    }

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)) {
      return res.status(401).json({ 
        error: true, 
        message: 'Token mal formatado' 
      });
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Buscar usuário no banco
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
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

    if (!user) {
      return res.status(401).json({ 
        error: true, 
        message: 'Usuário não encontrado' 
      });
    }

    // Adicionar usuário à requisição
    req.user = user;
    
    return next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: true, 
        message: 'Token expirado' 
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        error: true, 
        message: 'Token inválido' 
      });
    }

    return res.status(500).json({ 
      error: true, 
      message: 'Erro na autenticação' 
    });
  }
};

module.exports = authMiddleware;
