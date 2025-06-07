const express = require('express');
const autenticarToken = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const Admin = require('../models/Admin');

const router = express.Router();



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




module.exports = router;
