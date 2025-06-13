const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Estudantes = require('../models/utilizadorModel');
const autenticarToken = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const Admin = require('../models/adminModel');
const router = express.Router();


//criar conta
router.post('/', async (req, res) => {
  try {
    const { nome, email, password, tipo } = req.body;

    if (!nome || !email || !password || !tipo) {
      return res.status(400).json({ error: 'Faltam dados para criar o utilizador' });
    }
    // Validação tipo
    const tiposValidos = ['facilitador', 'estudante'];
    if (!tiposValidos.includes(tipo)) {
      return res.status(400).json({ error: 'Tipo inválido.' });
    }
    // Verificar se o email já existe
    if (!email.includes('@') || !email.includes('.')) {
      return res.status(400).json({ error: 'Email escrito incorretamente [pode faltar @ ou .]' });
    }

    const existing = await Estudantes.findByEmail(email);
    if (existing) return res.status(409).json({ error: 'E-mail já registado' });

    // verificação password
    if (password.length < 6) {
      return res.status(400).json({ error: 'A password deve ter pelo menos 6 caracteres' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    //cria o utilizador
    const userId = await Estudantes.create({ nome, email, password: hashedPassword, tipo });

    res.status(201).json({ message: 'Utilizador criado', userId });
  } catch (err) {
    console.error('Erro ao criar:', err);
    res.status(500).json({ error: 'Erro ao criar utilizador' });
  }
});
router.post('/login', async (req, res) => {
  try {

    const { email, password } = req.body;
    if (!email || !password) return res.status(406).json({ error: 'Tem que preencher o email e_ou password!' });

    // Verifica se o email e password
    if (!email.includes('@') || !email.includes('.')) {
      return res.status(400).json({ error: 'Email escrito incorretamente [pode faltar @ ou .]' });
    }
    const user = await Estudantes.findByEmail(email);
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!user || !passwordMatch) return res.status(401).json({ error: 'Credenciais inválidas ou não existe!' });

    if (user.ativo === 0) {
      return res.status(403).json({ error: 'Conta bloqueada pelo administrador' });
    }

    const token = jwt.sign(
      { id: user.id, tipo: user.tipo, ativo: user.ativo, nome: user.nome, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Erro no login' });
  }
});
router.get('/:id', autenticarToken, async (req, res) => {
  if (!req.utilizador) {
    return res.status(401).json({ error: 'Acesso não autorizado' });
  }
  // Check if the requested id matches the user id from the token
  if (req.params.id !== String(req.utilizador.id)) {
    return res.status(403).json({ error: 'Acesso proibido: não é o seu ID!' });
  }
  res.json({
    message: 'Acesso autorizado!',
    id: req.utilizador.id,
    nome: req.utilizador.nome,
    email: req.utilizador.email,
    tipo: req.utilizador.tipo
  });
});


//ADMIN ROUTES

//Listar facilitadores e estado
router.get('/:tipo/:estado', autenticarToken, isAdmin, async (req, res) => {
  const { tipo, estado } = req.params;

  const tiposValidos = ['facilitadores', 'estudantes'];
  const estadosValidos = ['pendentes', 'todos'];

  // Validação
  if (!tiposValidos.includes(tipo) || !estadosValidos.includes(estado)) {
    return res.status(400).json({ error: 'Tipo ou estado inválido.' });
  }

  // Lógica de seleção
  if (tipo === 'facilitadores' && estado === 'pendentes') {
    const lista = await Admin.listarFacilitadoresPendentes();
    return res.json(lista);
  }

  if (tipo === 'facilitadores' && estado === 'todos') {
    const facilitadores = await Admin.listarFacilitadores();
    return res.json(facilitadores);
  }

  if (tipo === 'estudantes' && estado === 'todos') {
    const estudantes = await Admin.listarEstudantes();
    return res.json(estudantes);
  }

  if (tipo === 'estudantes' && estado === 'pendentes') {
    return res.status(400).json({ error: 'Não existe essa rota [Não existe estudantes pendentes]' });
  }
});


// // Ver facilitadores pendentes
// router.get('/:tipo/pendentes', autenticarToken, isAdmin, async (req, res) => {
//   if (req.params.tipo !== 'facilitadores') {
//     return res.status(400).json({ error: 'Tipo inválido.' });
//   }
//   const lista = await Admin.listarFacilitadoresPendentes();
//   res.json(lista);
// });

//Promover/Despromover facilitador 
router.put('/facilitadores/:id', autenticarToken, isAdmin, async (req, res) => {
  const sucesso = await Admin.alterarStatusFacilitador(req.params.id, true);
  if (!sucesso) return res.status(404).json({ error: 'Facilitador não encontrado' });

  const facilitador = await Admin.listarFacilitadores();
  req.params.nome = facilitador.find(f => f.id === parseInt(req.params.id)).nome;
  req.params.email = facilitador.find(f => f.id === parseInt(req.params.id)).email;
  req.params.ativo = facilitador.find(f => f.id === parseInt(req.params.id)).ativo; // Definindo o estado como ativo
  res.json({ message: 'Estado do facilitador alterado', id: req.params.id, nome: req.params.nome, email: req.params.email, ativo: req.params.ativo });

}
);

// Listar estudantes
// router.get('/', autenticarToken, isAdmin, async (req, res) => {
//   const estudante = await Estudantes.listarEstudantes();
//   res.json(estudante);
// });

//Bloquear/desbloquear estudantes
router.put('/:id', autenticarToken, isAdmin, async (req, res) => {
  const sucesso = await Admin.alterarStatusEstudante(req.params.id, true);
  if (!sucesso) return res.status(404).json({ error: 'Estudante não encontrado' });

  const estudante = await Admin.listarEstudantes();
  req.params.nome = estudante.find(f => f.id === parseInt(req.params.id)).nome;
  req.params.email = estudante.find(f => f.id === parseInt(req.params.id)).email;
  req.params.ativo = estudante.find(f => f.id === parseInt(req.params.id)).ativo;
  res.json({ message: 'Estado do estudante alterado', id: req.params.id, nome: req.params.nome, email: req.params.email, ativo: req.params.ativo });

}
);
//Apagar utilizador
router.delete('/:id', autenticarToken, isAdmin, async (req, res) => {
  const sucesso = await Admin.removerUtilizador(req.params.id);
  if (!sucesso) return res.status(404).json({ error: 'Utilizador não encontrado' });
  res.json({ message: 'Utilizador removido' });
});


module.exports = router;