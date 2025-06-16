const express = require('express');
const autenticarToken = require('../middleware/auth');
const Notification = require('../models/notificacaoModel.js');
const e = require('express');


const router = express.Router();

router.get('/:estado', autenticarToken, async (req, res) => {
    try{
        const user_id = req.utilizador.id; // ID do utilizador autenticado
        const notificacoes = await Notification.listByUser(user_id);

        if (!notificacoes || notificacoes.length === 0) {
            return res.status(404).json({ message: 'Nenhuma notificação encontrada.' });
        }

        if (req.params.estado === "todas") {
            res.status(200).json(notificacoes);
        } else if (req.params.estado === "novas") {
            // Filtra as notificações lidas
            const notificacoesLidas = notificacoes.filter(n => n.lida === 0);
            res.status(200).json(notificacoesLidas);
        } else {
            return res.status(400).json({ error: 'Tipo de notificação inválido. Use "todas" ou "novas".' });
        }
    } catch (error) {
        console.error('Erro ao listar notificações:', error);
        res.status(500).json({ error: 'Erro ao listar notificações.' });
    }
});


module.exports = router;
