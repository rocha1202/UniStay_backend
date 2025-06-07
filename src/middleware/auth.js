const jwt = require('jsonwebtoken');
require('dotenv').config();

function autenticarToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Acesso não autorizado' }); 

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token inválido' });

    req.utilizador = {
      id: user.id,
      nome: user.nome,
      email: user.email,
      tipo: user.tipo
    };
    next();
  });
}


module.exports = autenticarToken;
