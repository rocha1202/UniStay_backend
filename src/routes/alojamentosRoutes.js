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
    res.status(500).json({ error: 'Erro ao criar alojamento' });
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
router.get

// Listar todos os alojamentos com pesquisa
router.get('/', async (req, res) => {
  try {
    const filtros = {
      zona: req.query.zona,
      preco_min: req.query.preco_min,
      preco_max: req.query.preco_max,
      camas: req.query.camas,
      tipo_quarto: req.query.tipo_quarto,
      disponivel_em: req.query.disponivel_em
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
