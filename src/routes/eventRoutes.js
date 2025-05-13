const express = require('express');
const autenticarToken = require('../middleware/auth');
const Event = require('../models/Event');

const router = express.Router();

// Criar evento
router.post('/', autenticarToken, async (req, res) => {
  if (req.utilizador.tipo !== 'facilitador') {
    return res.status(403).json({ error: 'Apenas facilitadores podem criar eventos' });
  }

  const { titulo, descricao, tipo, data } = req.body;
  const id = await Event.create({ titulo, descricao, tipo, data, user_id: req.utilizador.id });
  res.status(201).json({ message: 'Evento criado', id });
});

// Listar e pesquisar eventos
router.get('/', async (req, res) => {
  const eventos = await Event.listAll({ tipo: req.query.tipo, data: req.query.data });
  res.json(eventos);
});

// Participar num evento
router.post('/:id/participar', autenticarToken, async (req, res) => {
  if (req.utilizador.tipo !== 'estudante') {
    return res.status(403).json({ error: 'Apenas estudantes podem participar' });
  }

  const id = await Event.participate(req.utilizador.id, req.params.id);
  res.status(201).json({ message: 'Inscrição feita', id });
});

// Ver eventos do estudante
router.get('/meus', autenticarToken, async (req, res) => {
  if (req.utilizador.tipo !== 'estudante') {
    return res.status(403).json({ error: 'Acesso restrito' });
  }

  const eventos = await Event.myEvents(req.utilizador.id);
  res.json(eventos);
});

// Remover evento (admin)
router.delete('/:id', autenticarToken, async (req, res) => {
  if (req.utilizador.tipo !== 'admin') {
    return res.status(403).json({ error: 'Só administradores podem remover eventos' });
  }

  const sucesso = await Event.delete(req.params.id);
  if (!sucesso) return res.status(404).json({ error: 'Evento não encontrado' });
  res.json({ message: 'Evento removido' });
});

module.exports = router;
