// Ponto de entrada: camada de apresentação (arquivos estáticos) + API.
const path = require('node:path');
const express = require('express');
const db = require('./database/db');
const criarApi = require('./routes/api');

function criarApp(conexao = db.abrir()) {
  const app = express();
  app.use(express.json());
  app.use('/api', criarApi(conexao));
  app.use(express.static(path.join(__dirname, '..', 'public')));
  return app;
}

if (require.main === module) {
  const PORT = Number(process.env.PORT) || 3000;
  criarApp().listen(PORT, () => console.log(`SIGE AutoParts rodando em http://localhost:${PORT}`));
}

module.exports = { criarApp };
