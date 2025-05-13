const express = require('express');
const Accommodation = require('../models/Accommodation');
const autenticarToken = require('../middleware/auth');

const router = express.Router();

// Criar alojamento (só facilitador)
router.post('/', autenticarToken, async (req, res) => {
  if (req.utilizador.tipo !== 'facilitador') {
    return res.status(403).json({ error: 'Apenas facilitadores podem criar alojamentos' });
  }

  try {
    const data = { ...req.body, user_id: req.utilizador.id };
    const id = await Accommodation.create(data);
    res.status(201).json({ id });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar alojamento' });
  }
});

// Listar todos os alojamentos
router.get('/', async (req, res) => {
  try {
    const alojamentos = await Accommodation.findAll();
    res.json(alojamentos);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao listar alojamentos' });
  }
});

// Apagar alojamento (apenas pelo criador)
router.delete('/:id', autenticarToken, async (req, res) => {
  try {
    const success = await Accommodation.delete(req.params.id, req.utilizador.id);
    if (!success) return res.status(403).json({ error: 'Sem permissão para apagar este alojamento' });
    res.json({ message: 'Alojamento removido' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao apagar alojamento' });
  }
});
// Pesquisa com filtros via query params
router.get('/pesquisa', async (req, res) => {
  try {
    const filtros = {
      zona: req.query.zona,
      preco_min: req.query.preco_min,
      preco_max: req.query.preco_max,
      camas: req.query.camas,
      tipo_quarto: req.query.tipo_quarto,
      disponivel_em: req.query.disponivel_em
    };

    const resultados = await Accommodation.search(filtros);
    res.json(resultados);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao pesquisar alojamentos' });
  }
});


module.exports = router;
