const express = require('express');

const app = express();

app.use(express.json());
const PORT = 8081;

const listaUsuarios = [];
const listaRecados = [];

app.get('/', (req, res) => {
  res.status(200).send('<h1>Bem-vindo ao sistema de cadastro de recados!</h1><p>Dê continuidade ao seu cadastro:</p>');
});

app.post('/cadastro', (req, res) => {
  const dados = req.body;

  const usuario = listaUsuarios.find((user) => user.email === dados.email);

  if (usuario) {
    return res.status(400).json({
      success: false,
      message: 'O nome de usuário já existe',
      data: {},
    });
  }

  if (!dados.nome) {
    return res.status(400).json('O campo nome é obrigatório');
  }

  if (!dados.email) {
    return res.status(400).json('O campo e-mail é obrigatório');
  }

  if (!dados.senha) {
    return res.status(400).json('O campo senha é obrigatório');
  }

  const novoUsuario = {
    id: Math.random().toString(36).substr(2, 9),
    nome: dados.nome,
    email: dados.email,
    senha: dados.senha,
    logado: false,
  };

  listaUsuarios.push(novoUsuario);

  return res.status(201).json({
    success: true,
    message: 'Usuário criado com sucesso',
    data: novoUsuario,
  });
});

app.post('/login', (req, res) => {
  const data = req.body;

  const usuario = listaUsuarios.find((user) => user.email === data.email && user.senha === data.senha);

  if (!usuario) {
    return res.status(400).json({
      success: false,
      message: 'E-mail ou senha estão incorretos',
      data: {},
    });
  }

  listaUsuarios.forEach((usuario) => (usuario.logado = false));

  usuario.logado = true;

  return res.status(200).json({
    success: true,
    message: 'Login realizado com sucesso',
  });
});

app.get('/recados', (req, res) => {
  const dados = req.body;

  const user = listaUsuarios.find((user) => user.logado === true);

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'É necessário fazer login para criar um recado',
      data: {},
    });
  }

  const novoRecado = {
    id: Math.random().toString(36).substr(2, 9),
    titulo: dados.titulo,
    descricao: dados.descricao,
    autor: user,
  };

  listaRecados.push(novoRecado);

  return res.status(201).json({
    success: true,
    message: 'Recado criado com sucesso',
    data: novoRecado,
  });
});

app.get('/recados/:id', (req, res) => {
  const params = req.params;

  const user = listaUsuarios.find((user) => user.logado === true);

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'É necessário fazer login para listar seus recados',
      data: {},
    });
  }

  const recado = listaRecados.find((recado) => recado.id === params.id);

  if (!recado) {
    return res.status(404).json({
      success: false,
      message: 'Recado não encontrado',
      data: {},
    });
  }

  const recadoListado = {
    id: recado.id,
    titulo: recado.titulo,
    descricao: recado.descricao,
    autor: user,
  };

  return res.status(200).json({
    success: true,
    message: 'Recado listado com sucesso',
    data: recadoListado,
  });
});

app.put('/recados/:id', (req, res) => {
  const params = req.params;

  const user = listaUsuarios.find((user) => user.logado === true);

  const recadoIndex = listaRecados.findIndex((recado) => recado.id === params.id);

  const recado = listaRecados.find((recado) => recado.id === params.id);

  if (!user) {
    return res.status(400).json({
      success: false,
      message: 'É necessário fazer login para atualizar um recado',
      data: {},
    });
  }

  if (recadoIndex < 0) {
    return res.status(404).json({
      success: false,
      message: 'Recado não encontrado',
      data: {},
    });
  }

  listaRecados[recadoIndex].titulo = req.body.titulo;
  listaRecados[recadoIndex].descricao = req.body.descricao;

  return res.status(200).json({
    success: true,
    message: 'Recado atualizado com sucesso',
    data: listaRecados[recadoIndex],
  });
});

app.delete('/recados/:id', (req, res) => {
  const params = req.params;

  const user = listaUsuarios.find((user) => user.logado === true);

  if (!user) {
    return res.status(400).json({
      success: false,
      message: 'É necessário fazer login para deletar um recado',
      data: {},
    });
  }

  const recadoIndex = listaRecados.findIndex((recado) => recado.id === params.id);

  if (recadoIndex < 0) {
    return res.status(404).json({
      success: false,
      message: 'Recado não encontrado',
      data: {},
    });
  }

  listaRecados.splice(recadoIndex, 1);

  return res.status(200).json({
    success: true,
    message: 'Recado deletado com sucesso',
  });
});

app.listen(PORT, () => console.log(`Servidor iniciado na porta ${PORT}`));
