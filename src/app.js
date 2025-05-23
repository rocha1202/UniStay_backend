const errorHandler = require('./middleware/errorHandler');

const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const protectedRoutes = require('./routes/protectedRoutes');
const accommodationRoutes = require('./routes/accommodationRoutes'); 
const reservationRoutes = require('./routes/reservationRoutes');
const ratingRoutes = require('./routes/ratingRoutes');
const eventRoutes = require('./routes/eventRoutes');
const adminRoutes = require('./routes/adminRoutes');


const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/privado', protectedRoutes);
app.use('/api/alojamentos', accommodationRoutes); 
app.use('/api/reservas', reservationRoutes);
app.use('/api/avaliacoes', ratingRoutes);
app.use('/api/eventos', eventRoutes);
app.use('/api/admin', adminRoutes);


// Middleware 404 – rota não encontrada
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Middleware de tratamento de erros
app.use(errorHandler);

module.exports = app;
