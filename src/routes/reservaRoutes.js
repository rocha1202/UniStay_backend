const express = require('express');
const autenticarToken = require('../middleware/auth');
const router = express.Router();
const Reservation = require('../models/reservaModel');
const Notification = require('../models/notificacaoModel.js');


// Criar reserva (estudante)
router.post('/', autenticarToken, async (req, res) => {
  if (req.utilizador.tipo !== 'estudante') {
    return res.status(403).json({ error: 'Só estudantes podem reservar' });
  }

  // Verifica se req.body está definido
  if (!req.body) {
    return res.status(400).json({ error: 'Corpo da requisição não pode estar vazio' });
  }

  const { accommodation_id, data_inicio, data_fim } = req.body;

  // Verifica se todos os campos necessários estão preenchidos
  if (!accommodation_id || !data_inicio || !data_fim) {
    return res.status(400).json({ error: 'Todos os campos (accommodation_id, data_inicio, data_fim) são obrigatórios' });
  }

  // Verifica se as datas são válidas
  const inicio = new Date(data_inicio);
  const fim = new Date(data_fim);

  if (isNaN(inicio.getTime()) || isNaN(fim.getTime())) {
    return res.status(400).json({ error: 'Datas inválidas' });
  }

  // Verifica se a data de fim é posterior à data de início
  if (fim <= inicio) {
    return res.status(400).json({ error: 'A data de fim deve ser posterior à data de início' });
  }

  // Verifica se o accommodation_id existe
  const accommodationExists = await Reservation.checkAccommodationExists(accommodation_id);
  if (!accommodationExists) {
    return res.status(404).json({ error: 'Alojamento não encontrado' });
  }

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

// Ver reservas (estudante ou facilitador)
router.get('/minhas', autenticarToken, async (req, res) => {
  const userId = req.utilizador.id;
  const userType = req.utilizador.tipo;

  if (userType === 'estudante') {
    const reservas = await Reservation.findByUser(userId);
    // se não houver reservas, retornar uma mensagem amigável
    if (reservas.length === 0) {
      return res.status(404).json({ message: 'Nenhuma reserva encontrada' });
    }
    return res.json(reservas);
  } else if (userType === 'facilitador') {
    const reservas = await Reservation.findByFacilitador(userId);
    if (reservas.length === 0) {
      return res.status(404).json({ message: 'Nenhuma reserva encontrada' });
    }
    return res.json(reservas);
  } else {
    return res.status(403).json({ error: 'Acesso restrito' });
  }
});


// Alterar estado da reserva (facilitador)
router.put('/:id', autenticarToken, async (req, res) => {
  if (req.utilizador.tipo !== 'facilitador') {
    return res.status(403).json({ error: 'Apenas facilitadores podem alterar o estado das reservas' });
  }

  const { id } = req.params;

  try {
    // Verifica se a reserva existe e pertence ao facilitador
    const reserva = await Reservation.findById(id);

    if (!reserva) {
      return res.status(404).json({ error: 'Reserva não encontrada' });
    }

    const facilitadorId = await Reservation.findUserByAccommodationId(reserva.accommodation_id);

    //se o facilitador do token diferente do facilitadorId da erro
    if (facilitadorId !== req.utilizador.id) {
      return res.status(403).json({ error: 'Não tens permissão para alterar esta reserva' });
    }
    let novoEstado, titulo, mensagem;

    if (reserva.estado === 'confirmada') {
      novoEstado = 'cancelada';
      titulo = 'Reserva cancelada';
      mensagem = 'A tua reserva foi cancelada pelo facilitador.';
    } else {
      novoEstado = 'confirmada';
      titulo = 'Reserva confirmada';
      mensagem = 'A tua reserva foi confirmada pelo facilitador.';
    }

    const sucesso = await Reservation.updateEstado(id, req.utilizador.id, novoEstado);
    if (!sucesso) {
      console.error('Falha ao atualizar o estado da reserva');
      return res.status(500).json({ error: 'Não foi possível atualizar o estado da reserva' });
    }

    // Notificar o estudante
    const notificationSuccess = await Notification.create({
      user_id: reserva.user_id,
      titulo,
      mensagem
    });

    if (!notificationSuccess) {
      console.error('Falha ao criar notificação');
      return res.status(500).json({ error: 'Não foi possível criar a notificação' });
    }

    res.json({ message: `Reserva ${novoEstado} com sucesso.` });
  } catch (error) {
    console.error('Erro ao alterar estado da reserva:', error);
    res.status(500).json({ error: 'Erro interno ao alterar estado da reserva' });
  }
});

module.exports = router;
