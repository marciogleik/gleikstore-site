const prisma = require('../lib/prisma');

/**
 * Middleware para verificar se o usuário autenticado é ADMIN
 * Usa req.user.id preenchido pelo authMiddleware
 */
module.exports = async function adminMiddleware(req, res, next) {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        error: true,
        message: 'Usuário não autenticado',
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, role: true },
    });

    if (!user || user.role !== 'ADMIN') {
      return res.status(403).json({
        error: true,
        message: 'Acesso restrito a administradores',
      });
    }

    return next();
  } catch (error) {
    console.error('Erro no adminMiddleware:', error);
    return res.status(500).json({
      error: true,
      message: 'Erro na verificação de administrador',
    });
  }
};
