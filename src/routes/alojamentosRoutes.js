const express = require('express');
const Alojamentos = require('../models/alojamentoModel');
const autenticarToken = require('../middleware/auth');

const router = express.Router();

// Criar alojamento (só facilitador)
router.post('/', autenticarToken, async (req, res) => {
  if (req.utilizador.tipo !== 'facilitador') {
    return res.status(403).json({ error: 'Apenas facilitadores podem criar alojamentos' });
  }

  try {
    const data = { ...req.body, user_id: req.utilizador.id };
    const id = await Alojamentos.create(data);
    res.status(201).json({ id });
  } catch (err) {
    res.status(400).json({ error: 'Faltam dados' });
  }
});

// Apagar alojamento (apenas pelo criador)
router.delete('/:id', autenticarToken, async (req, res) => {
  try {
    const success = await Alojamentos.delete(req.params.id, req.utilizador.id);
    if (!success) return res.status(403).json({ error: 'Sem permissão para apagar este alojamento' });
    res.json({ message: 'Alojamento removido' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao apagar alojamento' });
  }
});

// Listar todos os alojamentos com pesquisa
router.get('/', async (req, res) => {
  try {
    const filtros = {
      zona: req.query.zona,
      preco_min: req.query.preco_min,
      preco_max: req.query.preco_max,
      camas: req.query.camas,
      tipo_quarto: req.query.tipo_quarto,
      disponivel_d1: req.query.disponivel_d1,
      disponivel_d2: req.query.disponivel_d2,
    };

    const resultados = await Alojamentos.search(filtros);
    if (resultados.length === 0) {
      return res.status(404).json({ message: 'Nenhum alojamento encontrado' });
    } else { 
    res.json(resultados);
    }
  } catch (err) {
  res.status(500).json({ error: 'Erro ao pesquisar alojamentos' });
}
});

module.exports = router;
