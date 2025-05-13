const express = require('express');
const autenticarToken = require('../middleware/auth');
const Rating = require('../models/Rating');

const router = express.Router();

// Avaliar alojamento
router.post('/', autenticarToken, async (req, res) => {
  if (req.utilizador.tipo !== 'estudante') {
    return res.status(403).json({ error: 'Só estudantes podem avaliar' });
  }

  const { accommodation_id, pontuacao, comentario } = req.body;

  const autorizado = await Rating.alreadyReserved(req.utilizador.id, accommodation_id);
  if (!autorizado) {
    return res.status(403).json({ error: 'Só podes avaliar alojamentos onde estiveste' });
  }

  const id = await Rating.create({
    user_id: req.utilizador.id,
    accommodation_id,
    pontuacao,
    comentario
  });

  res.status(201).json({ message: 'Avaliação submetida', id });
});

// Ver avaliações de um alojamento
router.get('/:id', async (req, res) => {
    const accommodation_id = req.params.id;
  
    const avaliacoes = await Rating.findByAccommodation(accommodation_id);
    const resumo = await Rating.getResumoByAccommodation(accommodation_id);
  
    res.json({
      media_pontuacao: resumo.media_pontuacao || 0,
      total_avaliacoes: resumo.total_avaliacoes || 0,
      avaliacoes
    });
  });
  
  
module.exports = router;
