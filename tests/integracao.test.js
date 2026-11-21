// Testes do fluxo integrado (cenário de uso da seção 7.3): pedido -> verificação -> baixa -> expedição -> entrega.
const test = require('node:test');
const assert = require('node:assert/strict');
const { abrir } = require('../src/database/db');
const svc = require('../src/services/integracaoService');
const { hashSenha, verificarSenha, pode } = require('../src/services/authService');

const saldo = (db, codigo) => db.prepare('SELECT quantidade FROM pecas WHERE codigo = ?').get(codigo).quantidade;
const idPeca = (db, codigo) => db.prepare('SELECT id FROM pecas WHERE codigo = ?').get(codigo).id;

test('senhas são armazenadas com hash e verificadas (RNF02)', () => {
  const h = hashSenha('segredo');
  assert.notEqual(h, 'segredo');
  assert.ok(verificarSenha('segredo', h));
  assert.ok(!verificarSenha('errada', h));
});

test('perfis restringem funcionalidades (RF17 / RNF01)', () => {
  assert.ok(pode('estoque', 'estoque:editar'));
  assert.ok(!pode('vendas', 'estoque:editar'));
  assert.ok(!pode('logistica', 'vendas:editar'));
  assert.ok(pode('admin', 'transporte:editar'));
});

test('pedido calcula total automaticamente (RF10)', () => {
  const db = abrir(':memory:');
  const id = svc.criarPedido(db, { clienteId: 1, itens: [{ pecaId: idPeca(db, 'PE-001'), quantidade: 2 }, { pecaId: idPeca(db, 'PE-003'), quantidade: 3 }] });
  assert.equal(db.prepare('SELECT valor_total FROM pedidos WHERE id = ?').get(id).valor_total, 2 * 350 + 3 * 89);
});

test('confirmação baixa o estoque, registra movimentação e gera entrega (RF12, RF15, RNF09)', () => {
  const db = abrir(':memory:');
  const antes = saldo(db, 'PE-001');
  const id = svc.criarPedido(db, { clienteId: 1, itens: [{ pecaId: idPeca(db, 'PE-001'), quantidade: 5 }] });
  svc.confirmarPedido(db, id, { usuarioId: 3 });
  assert.equal(saldo(db, 'PE-001'), antes - 5);
  const mov = db.prepare('SELECT * FROM movimentacoes WHERE pedido_id = ?').get(id);
  assert.equal(mov.tipo, 'SAIDA');
  assert.equal(mov.usuario_id, 3);
  const ent = db.prepare('SELECT * FROM entregas WHERE pedido_id = ?').get(id);
  assert.equal(ent.status, 'Pendente');
});

test('pedido acima do saldo não pode ser confirmado e nada é alterado (RF08, RF09, RNF04)', () => {
  const db = abrir(':memory:');
  const a1 = saldo(db, 'PE-001');
  const a2 = saldo(db, 'PE-002');
  const id = svc.criarPedido(db, { clienteId: 2, itens: [{ pecaId: idPeca(db, 'PE-001'), quantidade: 1 }, { pecaId: idPeca(db, 'PE-002'), quantidade: 99 }] });
  assert.throws(() => svc.confirmarPedido(db, id), /Estoque insuficiente/);
  assert.equal(saldo(db, 'PE-001'), a1);
  assert.equal(saldo(db, 'PE-002'), a2);
  assert.equal(db.prepare('SELECT status FROM pedidos WHERE id = ?').get(id).status, 'Pendente');
  assert.equal(db.prepare('SELECT COUNT(*) AS n FROM entregas').get().n, 0);
});

test('status da entrega retorna ao pedido de Vendas (RF14, RF16)', () => {
  const db = abrir(':memory:');
  const id = svc.criarPedido(db, { clienteId: 3, itens: [{ pecaId: idPeca(db, 'PE-003'), quantidade: 1 }] });
  svc.confirmarPedido(db, id);
  const ent = db.prepare('SELECT id FROM entregas WHERE pedido_id = ?').get(id).id;
  assert.throws(() => svc.atualizarEntrega(db, ent, { status: 'Entregue' }), /Transição inválida/);
  svc.atualizarEntrega(db, ent, { status: 'Em trânsito', motorista: 'Carlos Silva' });
  assert.equal(db.prepare('SELECT status FROM pedidos WHERE id = ?').get(id).status, 'Em entrega');
  svc.atualizarEntrega(db, ent, { status: 'Entregue', comprovacao: 'Recebido por João' });
  assert.equal(db.prepare('SELECT status FROM pedidos WHERE id = ?').get(id).status, 'Concluído');
});

test('indicadores do painel gerencial (RF18)', () => {
  const db = abrir(':memory:');
  const d = svc.indicadores(db);
  assert.equal(d.totalPecas, 45 + 2 + 128 + 18 + 12);
  assert.equal(d.abaixoMinimo, 2); // PE-002 e PE-004
  assert.equal(d.criticos.length, 2);
});

test('saída manual não deixa saldo negativo (RF03)', () => {
  const db = abrir(':memory:');
  assert.throws(() => svc.movimentarEstoque(db, { pecaId: idPeca(db, 'PE-002'), tipo: 'SAIDA', quantidade: 3 }), /Saldo insuficiente/);
  svc.movimentarEstoque(db, { pecaId: idPeca(db, 'PE-002'), tipo: 'ENTRADA', quantidade: 20, motivo: 'Compra' });
  assert.equal(saldo(db, 'PE-002'), 22);
});
