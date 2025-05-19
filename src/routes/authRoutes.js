const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { nome, email, password, tipo } = req.body;

    // verificar se email já existe
    const existing = await User.findByEmail(email);
    if (existing) return res.status(409).json({ error: 'Email já registado' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = await User.create({ nome, email, password: hashedPassword, tipo });

    res.status(201).json({ message: 'Utilizador criado', userId });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao registar' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByEmail(email);

    if (!user) return res.status(401).json({ error: 'Email não existe' });

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return res.status(401).json({ error: 'Credenciais inválidas' });
    
    if (user.ativo === 0) {
      return res.status(403).json({ error: 'Conta bloqueada pelo administrador' });
    }
    
    const token = jwt.sign(
      { id: user.id, tipo: user.tipo, ativo: user.ativo },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Erro no login' });
  }
});
router.get('/erro', (req, res) => {
  throw new Error('Simulação de falha!');
});
module.exports = router;
