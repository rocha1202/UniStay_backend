// Rota para criar uma avaliação
const express = require('express');
const autenticarToken = require('../middleware/auth');
const avaliacoes = require('../models/avaliacoesModel');

const router = express.Router();

router.post('/:id', autenticarToken, async (req, res) => {
    const { id } = req.params; // ID da reserva
    const { pontuacao, comentario } = req.body;
    const user_id = req.utilizador.id; // ID do utilizador autenticado

    try {
        //verifica se a data de hoje é posterior à data de fim da reserva
        const verificaDataFim = await avaliacoes.findByDataFim(id);
        if (verificaDataFim) {
            return res.status(400).json({ error: 'Não é possível avaliar uma reserva que ainda não terminou.' });
        }

        // Verifica se a reserva existe e pertence ao utilizador autenticado
        const reserva = await avaliacoes.findById(id);
        if (!reserva || reserva.user_id !== user_id) {
            return res.status(404).json({ error: 'Reserva não encontrada ou não pertence ao utilizador.' });
        }

        // Obtém o ID do alojamento associado à reserva
        const accommodation_id = await avaliacoes.findByIdAccommodation(id);
        if (!accommodation_id) {
            return res.status(404).json({ error: 'Alojamento não encontrado.' });
        }
        //verifica se já existe uma avaliação para esta reserva
        const existingRating = await avaliacoes.findByIdAva(id);
        if (existingRating) {
            return res.status(400).json({ error: 'Já existe uma avaliação para esta reserva.' });
        }
        // Cria a avaliação
        const novaAvaliacao = await avaliacoes.create({
            user_id,
            accommodation_id, // Use o ID do alojamento obtido
            pontuacao,
            comentario,
            id_reservations: id // ID da reserva
        });

        res.status(200).json(novaAvaliacao);
    } catch (error) {
        console.error('Erro ao criar avaliação:', error);
        res.status(500).json({ error: 'Erro ao criar avaliação.' });
    }
});
// Ver avaliações de um alojamento
router.get('/:id', async (req, res) => {
    try {
        const accommodation_id = req.params.id;

        const avaliacao = await avaliacoes.findByAccommodation(accommodation_id);
        if (!avaliacao || avaliacao.length === 0) {
            return res.status(404).json({ error: 'Nenhuma avaliação encontrada para este alojamento.' });
        }
        const resumo = await avaliacoes.getResumoByAccommodation(accommodation_id);
        if (!resumo) {
            return res.status(404).json({ error: 'Resumo das avaliações não encontrado.' });
        }

        res.json({
            media_pontuacao: resumo.media_pontuacao || 0,
            total_avaliacoes: resumo.total_avaliacoes || 0,
            avaliacao
        });
    } catch (error) {
        console.error('Erro ao listar avaliação:', error);
        res.status(500).json({ error: 'Erro ao listar avaliações.' });
    }
});

module.exports = router;
