// Camada de serviços (API REST). Cada grupo de rotas corresponde a um módulo.
const express = require('express');
const { autenticar, exigir } = require('../middleware/auth');
const auth = require('../services/authService');
const svc = require('../services/integracaoService');

module.exports = function criarApi(db) {
  const api = express.Router();
  const get = (sql, ...p) => db.prepare(sql).get(...p);
  const all = (sql, ...p) => db.prepare(sql).all(...p);
  const run = (sql, ...p) => db.prepare(sql).run(...p);
  const n = (v) => (v === '' || v === undefined || v === null ? null : Number(v));

  // ---------- Acesso (RF17) ----------
  api.post('/login', (req, res) => {
    const { login, senha } = req.body || {};
    const u = get('SELECT * FROM usuarios WHERE login = ?', String(login || ''));
    if (!u || !auth.verificarSenha(String(senha || ''), u.senha_hash)) {
      return res.status(401).json({ erro: 'Usuário ou senha inválidos.' });
    }
    const usuario = { id: u.id, nome: u.nome, login: u.login, perfil: u.perfil };
    res.json({ token: auth.criarSessao(usuario), usuario, permissoes: auth.PERMISSOES[u.perfil] });
  });

  api.use(autenticar);

  api.post('/logout', (req, res) => { auth.encerrarSessao(req.token); res.status(204).end(); });
  api.get('/me', (req, res) => res.json({ usuario: req.usuario, permissoes: auth.PERMISSOES[req.usuario.perfil] }));

  // ---------- Painel gerencial (RF18) ----------
  api.get('/dashboard', exigir('dashboard'), (req, res) => res.json(svc.indicadores(db)));

  // ---------- Estoque (RF01, RF03, RF04, RF05) ----------
  api.get('/pecas', exigir('estoque:ler'), (req, res) => {
    const termo = `%${req.query.busca || ''}%`;
    res.json(all(`SELECT p.*, f.nome AS fornecedor,
                         CASE WHEN p.quantidade = 0 THEN 'Zerado'
                              WHEN p.quantidade <= p.estoque_minimo THEN 'Crítico'
                              WHEN p.quantidade <= p.estoque_minimo * 1.5 THEN 'Baixo'
                              ELSE 'OK' END AS situacao
                    FROM pecas p LEFT JOIN fornecedores f ON f.id = p.fornecedor_id
                   WHERE p.codigo LIKE ? OR p.descricao LIKE ? OR p.aplicacao LIKE ?
                   ORDER BY p.codigo`, termo, termo, termo));
  });

  const camposPeca = (b) => [b.codigo, b.descricao, b.categoria || null, b.aplicacao || null,
    n(b.estoque_minimo) ?? 5, n(b.preco_unitario), n(b.fornecedor_id)];

  api.post('/pecas', exigir('estoque:editar'), (req, res) => {
    const b = req.body;
    const r = run(`INSERT INTO pecas (codigo, descricao, categoria, aplicacao, estoque_minimo, preco_unitario, fornecedor_id, quantidade)
                   VALUES (?,?,?,?,?,?,?,0)`, ...camposPeca(b));
    const id = Number(r.lastInsertRowid);
    if (n(b.quantidade) > 0) {
      svc.movimentarEstoque(db, { pecaId: id, tipo: 'ENTRADA', quantidade: n(b.quantidade), motivo: 'Saldo inicial', usuarioId: req.usuario.id });
    }
    res.status(201).json(get('SELECT * FROM pecas WHERE id = ?', id));
  });

  api.put('/pecas/:id', exigir('estoque:editar'), (req, res) => {
    const r = run(`UPDATE pecas SET codigo=?, descricao=?, categoria=?, aplicacao=?, estoque_minimo=?, preco_unitario=?, fornecedor_id=?
                   WHERE id = ?`, ...camposPeca(req.body), req.params.id);
    if (!r.changes) return res.status(404).json({ erro: 'Peça não encontrada.' });
    res.json(get('SELECT * FROM pecas WHERE id = ?', req.params.id));
  });

  api.delete('/pecas/:id', exigir('estoque:editar'), (req, res) => {
    const usado = get('SELECT 1 FROM itens_pedido WHERE peca_id = ? LIMIT 1', req.params.id);
    if (usado) return res.status(409).json({ erro: 'Peça já utilizada em pedidos; não pode ser excluída.' });
    run('DELETE FROM pecas WHERE id = ?', req.params.id);
    res.status(204).end();
  });

  api.post('/pecas/:id/movimentacoes', exigir('estoque:editar'), (req, res) => {
    const { tipo, quantidade, motivo } = req.body;
    res.status(201).json(svc.movimentarEstoque(db, { pecaId: Number(req.params.id), tipo, quantidade, motivo, usuarioId: req.usuario.id }));
  });

  api.get('/movimentacoes', exigir('estoque:ler'), (req, res) => {
    res.json(all(`SELECT m.*, p.codigo, p.descricao, u.nome AS usuario
                    FROM movimentacoes m JOIN pecas p ON p.id = m.peca_id LEFT JOIN usuarios u ON u.id = m.usuario_id
                   ORDER BY m.id DESC LIMIT 100`));
  });

  api.get('/fornecedores', exigir('estoque:ler'), (req, res) => res.json(all('SELECT * FROM fornecedores ORDER BY nome')));

  // ---------- Vendas (RF06, RF07, RF08, RF09, RF10, RF11) ----------
  api.get('/clientes', exigir('vendas:ler'), (req, res) => {
    const termo = `%${req.query.busca || ''}%`;
    res.json(all('SELECT * FROM clientes WHERE nome LIKE ? OR documento LIKE ? ORDER BY nome', termo, termo));
  });

  const camposCliente = (b) => [b.nome, b.documento || null, b.telefone || null, b.email || null, b.endereco || null, b.cidade || null];

  api.post('/clientes', exigir('vendas:editar'), (req, res) => {
    const r = run('INSERT INTO clientes (nome, documento, telefone, email, endereco, cidade) VALUES (?,?,?,?,?,?)', ...camposCliente(req.body));
    res.status(201).json(get('SELECT * FROM clientes WHERE id = ?', r.lastInsertRowid));
  });

  api.put('/clientes/:id', exigir('vendas:editar'), (req, res) => {
    const r = run('UPDATE clientes SET nome=?, documento=?, telefone=?, email=?, endereco=?, cidade=? WHERE id = ?', ...camposCliente(req.body), req.params.id);
    if (!r.changes) return res.status(404).json({ erro: 'Cliente não encontrado.' });
    res.json(get('SELECT * FROM clientes WHERE id = ?', req.params.id));
  });

  api.get('/pedidos', exigir('vendas:ler'), (req, res) => {
    const termo = `%${req.query.busca || ''}%`;
    res.json(all(`SELECT p.*, c.nome AS cliente, e.codigo AS entrega, e.status AS status_entrega
                    FROM pedidos p JOIN clientes c ON c.id = p.cliente_id LEFT JOIN entregas e ON e.pedido_id = p.id
                   WHERE p.codigo LIKE ? OR c.nome LIKE ?
                   ORDER BY p.id DESC`, termo, termo));
  });

  api.get('/pedidos/:id', exigir('vendas:ler'), (req, res) => {
    const pedido = get('SELECT p.*, c.nome AS cliente FROM pedidos p JOIN clientes c ON c.id = p.cliente_id WHERE p.id = ?', req.params.id);
    if (!pedido) return res.status(404).json({ erro: 'Pedido não encontrado.' });
    const itens = all(`SELECT i.*, pc.codigo, pc.descricao FROM itens_pedido i JOIN pecas pc ON pc.id = i.peca_id WHERE i.pedido_id = ?`, req.params.id);
    const entrega = get('SELECT * FROM entregas WHERE pedido_id = ?', req.params.id) || null;
    res.json({ ...pedido, itens, entrega, disponibilidade: svc.verificarDisponibilidade(db, req.params.id) });
  });

  api.post('/pedidos', exigir('vendas:editar'), (req, res) => {
    const id = svc.criarPedido(db, { clienteId: Number(req.body.clienteId), itens: req.body.itens, usuarioId: req.usuario.id });
    if (req.body.confirmar) svc.confirmarPedido(db, id, { usuarioId: req.usuario.id });
    res.status(201).json(get('SELECT * FROM pedidos WHERE id = ?', id));
  });

  api.post('/pedidos/:id/confirmar', exigir('vendas:editar'), (req, res) => {
    res.json(svc.confirmarPedido(db, Number(req.params.id), { usuarioId: req.usuario.id, previsao: req.body?.previsao }));
  });

  api.post('/pedidos/:id/cancelar', exigir('vendas:editar'), (req, res) => {
    svc.cancelarPedido(db, Number(req.params.id));
    res.json(get('SELECT * FROM pedidos WHERE id = ?', req.params.id));
  });

  // ---------- Transporte (RF12, RF14, RF16) ----------
  api.get('/entregas', exigir('transporte:ler'), (req, res) => {
    const termo = `%${req.query.busca || ''}%`;
    res.json(all(`SELECT e.*, p.codigo AS pedido, c.nome AS cliente
                    FROM entregas e JOIN pedidos p ON p.id = e.pedido_id JOIN clientes c ON c.id = p.cliente_id
                   WHERE e.codigo LIKE ? OR e.destino LIKE ? OR IFNULL(e.motorista,'') LIKE ?
                   ORDER BY e.id DESC`, termo, termo, termo));
  });

  api.patch('/entregas/:id', exigir('transporte:editar'), (req, res) => {
    res.json(svc.atualizarEntrega(db, Number(req.params.id), req.body || {}));
  });

  // ---------- Tratamento de erros ----------
  api.use((err, req, res, _next) => {
    if (err instanceof svc.ErroNegocio) return res.status(err.status).json({ erro: err.message });
    if (/UNIQUE constraint/.test(err.message)) return res.status(409).json({ erro: 'Registro duplicado (código/documento já cadastrado).' });
    if (/(NOT NULL|CHECK) constraint/.test(err.message)) return res.status(400).json({ erro: 'Dados obrigatórios ausentes ou inválidos.' });
    console.error(err);
    res.status(500).json({ erro: 'Erro interno.' });
  });

  return api;
};
