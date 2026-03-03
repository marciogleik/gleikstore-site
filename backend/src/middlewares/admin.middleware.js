/**
 * Middleware para verificar se o usuário autenticado é ADMIN
 * Otimizado: usa req.user.role já preenchido pelo authMiddleware
 * (não faz query extra ao banco)
 */
module.exports = function adminMiddleware(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      error: true,
      message: 'Usuário não autenticado',
    });
  }

  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({
      error: true,
      message: 'Acesso restrito a administradores',
    });
  }

  return next();
};
