const express = require('express');
const autenticarToken = require('../middleware/auth');
const Eventos = require('../models/eventosModel');
const Notification = require('../models/notificacaoModel.js');
const e = require('express');

const router = express.Router();

//criar evento
router.post('/', autenticarToken, async (req, res) => {
    const { titulo, descricao, tipo, data } = req.body;
    const user_id = req.utilizador.id; // ID do utilizador autenticado

    // Validação campo a campo
    if (!titulo || typeof titulo !== 'string' || titulo.length < 3) {
        return res.status(400).json({ error: 'Título é obrigatório e deve ter pelo menos 3 caracteres.' });
    }
    if (!descricao || typeof descricao !== 'string') {
        return res.status(400).json({ error: 'Descrição é obrigatória.' });
    }
    if (!tipo || !['cultural', 'academico', 'outro'].includes(tipo)) {
        return res.status(400).json({ error: 'Tipo é obrigatório e deve ser um dos seguintes: cultural, academico, outro.' });
    }
    if (!data || isNaN(Date.parse(data))) {
        return res.status(400).json({ error: 'Data é obrigatória e deve ser uma data válida.' });
    }

    try {
        // Verifica se o evento já existe
        const existingEvent = await Eventos.findByTitulo(titulo);
        if (existingEvent) {
            return res.status(400).json({ error: 'Já existe um evento com este título.' });
        }

        // Cria o novo evento
        const novoEvento = await Eventos.create({
            titulo,
            descricao,
            tipo,
            data,
            user_id
        });

        res.status(201).json(novoEvento);
    } catch (error) {
        console.error('Erro ao criar evento:', error);
        res.status(500).json({ error: 'Erro ao criar evento.' });
    }
});

// Listar e pesquisar eventos
router.get('/', async (req, res) => {
    try {

        const filtros = {
            titulo: req.query.titulo,
            descricao: req.query.descricao,
            tipo: req.query.tipo,
            data: req.query.data
        };


        const eventos = await Eventos.listAll(filtros);
        if (!eventos || eventos.length === 0) {
            return res.status(404).json({ error: 'Nenhum evento encontrado.' });
        }
        res.json(eventos);
    } catch (error) {
        console.error('Erro ao listar eventos:', error);
        res.status(500).json({ error: 'Erro ao listar eventos.' });
    }
});

// Participar num evento
router.post('/:id', autenticarToken, async (req, res) => {
    try {
        if (req.utilizador.tipo !== 'estudante') {
            return res.status(403).json({ error: 'Apenas estudantes podem participar' });
        }

        //verifica se já está inscrito no evento
        const isParticipating = await Eventos.isParticipating(req.utilizador.id, req.params.id);
        if (isParticipating) {
            return res.status(400).json({ error: 'Já está inscrito neste evento.' });
        }

        const id = await Eventos.participate(req.utilizador.id, req.params.id);
        res.status(201).json({ message: 'Inscrição feita', id });

    }
    catch (error) {
        console.error('Erro ao participar no evento:', error);
        res.status(500).json({ error: 'Erro ao participar no evento.' });
    }
});

// Ver eventos do estudante inscrito
router.get('/minhas', autenticarToken, async (req, res) => {
    try {
        if (req.utilizador.tipo !== 'estudante') {
            return res.status(403).json({ error: 'Apenas estudnates podem acessar.' });
        }

        const eventos = await Eventos.myEvents(req.utilizador.id);
        res.json(eventos);
    }
    catch (error) {
        console.error('Erro ao listar eventos do estudante:', error);
        res.status(500).json({ error: 'Erro ao listar eventos do estudante.' });
    }
}
);

//Apagar um evento apenas admin ou o facilitador que o criou
router.delete('/:id', autenticarToken, async (req, res) => {
    try {
        //procura o id do facilitador do evento
        const evento = await Eventos.findByIdF(req.params.id);
        if (!evento) {
            return res.status(404).json({ error: 'Evento não encontrado.' });
        }
        const id = evento.user_id;
        if (req.utilizador.tipo !== 'admin' && req.utilizador.id !== id) {
            console.log(req.utilizador.tipo, req.utilizador.id, id);
            return res.status(403).json({ error: 'Apenas administradores ou o facilitador do evento podem apagar.' });
        }

        const result = await Eventos.delete(req.params.id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Não conseguiu apagar.' });
        }

        //notifica quem está inscrito no evento
        // ve quais utilizadores estão inscritos no evento
        const inscritos = await Eventos.getInscritos(req.params.id);
        if (inscritos.length < 0) {
            return res.status(404).json({ error: 'Nenhum utilizador inscrito neste evento.' });
        };
        //notifica cada utilizador inscrito
        let titulo, mensagem;
        titulo = 'Evento apagado';
        mensagem = `O evento ${evento.titulo} foi apagado.`;
        for (const inscrito of inscritos) {
            await Notification.create({
                user_id: inscrito.user_id,
                titulo,
                mensagem
            });
        }

        res.status(200).json({ message: 'Evento apagado com sucesso.' });
    } catch (error) {
        console.error('Erro ao apagar evento:', error);
        res.status(500).json({ error: 'Erro ao apagar evento.' });
    }
});

module.exports = router;
