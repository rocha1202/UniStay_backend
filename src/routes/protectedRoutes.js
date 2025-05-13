const express = require('express');
const autenticarToken = require('../middleware/auth'); // middleware JWT
const router = express.Router();

router.get('/perfil', autenticarToken, (req, res) => {
  res.json({
    message: 'Acesso autorizado!',
    user: req.utilizador // dados do token
  });
});

module.exports = router;
