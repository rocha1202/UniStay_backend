function isAdmin(req, res, next) {
    if (req.utilizador.tipo !== 'admin') {
      return res.status(401).json({ error: 'Acesso restrito a administradores' });
    }
    next();
  }
  
  module.exports = isAdmin;
  