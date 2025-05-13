const express = require('express');
const autenticarToken = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const Admin = require('../models/Admin');

const router = express.Router();

// Ver facilitadores pendentes
router.get('/facilitadores/pendentes', autenticarToken, isAdmin, async (req, res) => {
    const lista = await Admin.getFacilitadoresPendentes();
    res.json(lista);
});

// Aprovar facilitador
router.put('/facilitadores/:id/aprovar', autenticarToken, isAdmin, async (req, res) => {
    const sucesso = await Admin.aprovarFacilitador(req.params.id);
    if (!sucesso) return res.status(404).json({ error: 'Facilitador não encontrado' });
    res.json({ message: 'Facilitador aprovado' });
});

// Despromover facilitador
router.put('/facilitadores/:id/despromover', autenticarToken, isAdmin, async (req, res) => {
    const sucesso = await Admin.despromoverFacilitador(req.params.id);
    if (!sucesso) return res.status(404).json({ error: 'Facilitador não encontrado ou já despromovido' });
    res.json({ message: 'Facilitador despromovido' });
});

// Remover alojamento
router.delete('/alojamentos/:id', autenticarToken, isAdmin, async (req, res) => {
    const sucesso = await Admin.removerAlojamento(req.params.id);
    if (!sucesso) return res.status(404).json({ error: 'Alojamento não encontrado' });
    res.json({ message: 'Alojamento removido' });
});

// Remover evento
router.delete('/eventos/:id', autenticarToken, isAdmin, async (req, res) => {
    const sucesso = await Admin.removerEvento(req.params.id);
    if (!sucesso) return res.status(404).json({ error: 'Evento não encontrado' });
    res.json({ message: 'Evento removido' });
});

// Bloquear utilizador
router.put('/utilizadores/:id/bloquear', autenticarToken, isAdmin, async (req, res) => {
    const sucesso = await Admin.bloquearUtilizador(req.params.id);
    if (!sucesso) return res.status(404).json({ error: 'Utilizador não encontrado' });
    res.json({ message: 'Utilizador bloqueado' });
});

// Desbloquear utilizador
router.put('/utilizadores/:id/desbloquear', autenticarToken, isAdmin, async (req, res) => {
    const sucesso = await Admin.desbloquearUtilizador(req.params.id);
    if (!sucesso) return res.status(404).json({ error: 'Utilizador não encontrado' });
    res.json({ message: 'Utilizador desbloqueado' });
});

// Apagar utilizador permanentemente
router.delete('/utilizadores/:id', autenticarToken, isAdmin, async (req, res) => {
    const sucesso = await Admin.removerUtilizador(req.params.id);
    if (!sucesso) return res.status(404).json({ error: 'Utilizador não encontrado' });
    res.json({ message: 'Utilizador removido' });
});


module.exports = router;
