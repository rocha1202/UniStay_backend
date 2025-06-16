const errorHandler = require('./middleware/errorHandler');

const express = require('express');
const cors = require('cors');

const utilizadorRoutes = require('./routes/utilizadorRoutes');
const alojamentoRoutes = require('./routes/alojamentosRoutes'); 
const reservaRoutes = require('./routes/reservaRoutes');
const avaliacoesRoutes = require('./routes/avaliacoesRoutes');
const eventosRoutes = require('./routes/eventosRoutes');
const notificacaoRoutes = require('./routes/notificacaoRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/utilizadores', utilizadorRoutes);
app.use('/alojamentos', alojamentoRoutes); 
app.use('/reservas', reservaRoutes);
app.use('/avaliacoes', avaliacoesRoutes);
app.use('/eventos', eventosRoutes);
app.use('/notificacoes', notificacaoRoutes);

app.use('/', (req, res) => {
   res.send('Bem-vindo à API do Unistay!');
 });
// Middleware 404 – rota não encontrada
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Middleware de tratamento de erros
app.use(errorHandler);

module.exports = app;
