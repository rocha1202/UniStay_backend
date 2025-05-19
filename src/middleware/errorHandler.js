function errorHandler(err, req, res, next) {
  console.error('Erro interno:', err);

  // Em produção podes esconder detalhes
  const isDev = process.env.NODE_ENV !== 'production';

  res.status(500).json({
    error: 'Erro interno do servidor',
    ...(isDev && { detalhes: err.message })
  });
}

module.exports = errorHandler;
