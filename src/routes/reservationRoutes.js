const express = require('express');
const autenticarToken = require('../middleware/auth');
const Reservation = require('../models/Reservation');

const router = express.Router();

// Criar reserva (estudante)
router.post('/', autenticarToken, async (req, res) => {
  if (req.utilizador.tipo !== 'estudante') {
    return res.status(403).json({ error: 'Só estudantes podem reservar' });
  }

  const { accommodation_id, data_inicio, data_fim } = req.body;

  const disponivel = await Reservation.isAvailable(accommodation_id, data_inicio, data_fim);
  if (!disponivel) {
    return res.status(409).json({ error: 'Alojamento indisponível nas datas' });
  }

  const id = await Reservation.create({
    user_id: req.utilizador.id,
    accommodation_id,
    data_inicio,
    data_fim
  });

  res.status(201).json({ message: 'Reserva criada', id });
});

// Ver reservas do estudante
router.get('/minhas', autenticarToken, async (req, res) => {
  if (req.utilizador.tipo !== 'estudante') {
    return res.status(403).json({ error: 'Acesso restrito' });
  }

  const reservas = await Reservation.findByUser(req.utilizador.id);
  res.json(reservas);
});

// Ver reservas recebidas (facilitador)
router.get('/recebidas', autenticarToken, async (req, res) => {
  if (req.utilizador.tipo !== 'facilitador') {
    return res.status(403).json({ error: 'Acesso restrito' });
  }

  const reservas = await Reservation.findByFacilitador(req.utilizador.id);
  res.json(reservas);
});
// Confirmar reserva
router.put('/:id/confirmar', autenticarToken, async (req, res) => {
    if (req.utilizador.tipo !== 'facilitador') {
      return res.status(403).json({ error: 'Apenas facilitadores podem confirmar reservas' });
    }
  
    const sucesso = await Reservation.updateEstado(req.params.id, req.utilizador.id, 'confirmada');
    if (!sucesso) return res.status(403).json({ error: 'Reserva não encontrada ou sem permissão' });
  
    res.json({ message: 'Reserva confirmada' });
  });
  
  // Cancelar reserva
  router.put('/:id/cancelar', autenticarToken, async (req, res) => {
    if (req.utilizador.tipo !== 'facilitador') {
      return res.status(403).json({ error: 'Apenas facilitadores podem cancelar reservas' });
    }
  
    const sucesso = await Reservation.updateEstado(req.params.id, req.utilizador.id, 'cancelada');
    if (!sucesso) return res.status(403).json({ error: 'Reserva não encontrada ou sem permissão' });
  
    res.json({ message: 'Reserva cancelada' });
  });
  
module.exports = router;
