// Regras de negócio que atravessam os módulos (Vendas -> Estoque -> Transporte).
// Toda operação que altera mais de um módulo roda em uma única transação.
const { transacao } = require('../database/db');

class ErroNegocio extends Error {
  constructor(msg, status = 422) { super(msg); this.status = status; }
}

function proximoCodigo(db, tabela, prefixo, inicio) {
  const { m } = db.prepare(`SELECT MAX(id) AS m FROM ${tabela}`).get();
  return `${prefixo}-${inicio + (m || 0) + 1}`;
}

/** RF03 / RNF09 — entrada ou saída manual de estoque, com registro da movimentação. */
function movimentarEstoque(db, { pecaId, tipo, quantidade, motivo, usuarioId }) {
  quantidade = Number(quantidade);
  if (!['ENTRADA', 'SAIDA'].includes(tipo)) throw new ErroNegocio('Tipo de movimentação inválido.');
  if (!Number.isInteger(quantidade) || quantidade <= 0) throw new ErroNegocio('Quantidade deve ser um inteiro positivo.');
  return transacao(db, () => {
    const peca = db.prepare('SELECT * FROM pecas WHERE id = ?').get(pecaId);
    if (!peca) throw new ErroNegocio('Peça não encontrada.', 404);
    const delta = tipo === 'ENTRADA' ? quantidade : -quantidade;
    if (peca.quantidade + delta < 0) throw new ErroNegocio(`Saldo insuficiente: disponível ${peca.quantidade}.`);
    db.prepare('UPDATE pecas SET quantidade = quantidade + ? WHERE id = ?').run(delta, pecaId);
    db.prepare('INSERT INTO movimentacoes (peca_id, tipo, quantidade, motivo, usuario_id) VALUES (?,?,?,?,?)')
      .run(pecaId, tipo, quantidade, motivo || null, usuarioId || null);
    return db.prepare('SELECT * FROM pecas WHERE id = ?').get(pecaId);
  });
}

/** RF07 / RF10 — registra um pedido pendente e calcula o total automaticamente. */
function criarPedido(db, { clienteId, itens, usuarioId }) {
  if (!Array.isArray(itens) || itens.length === 0) throw new ErroNegocio('Informe ao menos um item.');
  return transacao(db, () => {
    const cliente = db.prepare('SELECT id FROM clientes WHERE id = ?').get(clienteId);
    if (!cliente) throw new ErroNegocio('Cliente não encontrado.', 404);
    const codigo = proximoCodigo(db, 'pedidos', 'PED', 2844);
    const { lastInsertRowid: pedidoId } = db
      .prepare('INSERT INTO pedidos (codigo, cliente_id, usuario_id) VALUES (?,?,?)')
      .run(codigo, clienteId, usuarioId || null);
    let total = 0;
    const ins = db.prepare('INSERT INTO itens_pedido (pedido_id, peca_id, quantidade, preco_unitario) VALUES (?,?,?,?)');
    for (const it of itens) {
      const qtd = Number(it.quantidade);
      if (!Number.isInteger(qtd) || qtd <= 0) throw new ErroNegocio('Quantidade de item inválida.');
      const peca = db.prepare('SELECT id, preco_unitario FROM pecas WHERE id = ?').get(it.pecaId);
      if (!peca) throw new ErroNegocio('Peça do pedido não encontrada.', 404);
      ins.run(pedidoId, peca.id, qtd, peca.preco_unitario);
      total += qtd * peca.preco_unitario;
    }
    db.prepare('UPDATE pedidos SET valor_total = ? WHERE id = ?').run(Math.round(total * 100) / 100, pedidoId);
    return Number(pedidoId);
  });
}

/** RF08 — verifica a disponibilidade de cada item do pedido. */
function verificarDisponibilidade(db, pedidoId) {
  return db.prepare(`
    SELECT i.peca_id, p.codigo, p.descricao, i.quantidade AS solicitado, p.quantidade AS disponivel,
           (p.quantidade >= i.quantidade) AS ok
      FROM itens_pedido i JOIN pecas p ON p.id = i.peca_id
     WHERE i.pedido_id = ?`).all(pedidoId);
}

/**
 * RF09 + RF15 + RF12 — confirma o pedido:
 *  1) bloqueia se algum item não tiver saldo;
 *  2) dá baixa automática no estoque e registra a movimentação;
 *  3) gera a ordem de entrega para o Transporte.
 */
function confirmarPedido(db, pedidoId, { usuarioId, previsao } = {}) {
  return transacao(db, () => {
    const pedido = db.prepare(`SELECT p.*, c.endereco, c.cidade FROM pedidos p JOIN clientes c ON c.id = p.cliente_id WHERE p.id = ?`).get(pedidoId);
    if (!pedido) throw new ErroNegocio('Pedido não encontrado.', 404);
    if (pedido.status !== 'Pendente') throw new ErroNegocio(`Pedido já está "${pedido.status}".`);

    const itens = verificarDisponibilidade(db, pedidoId);
    const faltas = itens.filter((i) => !i.ok);
    if (faltas.length) {
      const lista = faltas.map((f) => `${f.codigo} (pedido ${f.solicitado}, disponível ${f.disponivel})`).join('; ');
      throw new ErroNegocio(`Estoque insuficiente: ${lista}.`);
    }

    const baixa = db.prepare('UPDATE pecas SET quantidade = quantidade - ? WHERE id = ?');
    const mov = db.prepare(`INSERT INTO movimentacoes (peca_id, tipo, quantidade, motivo, pedido_id, usuario_id)
                            VALUES (?, 'SAIDA', ?, ?, ?, ?)`);
    for (const i of itens) {
      baixa.run(i.solicitado, i.peca_id);
      mov.run(i.peca_id, i.solicitado, `Venda ${pedido.codigo}`, pedidoId, usuarioId || null);
    }

    db.prepare(`UPDATE pedidos SET status = 'Confirmado' WHERE id = ?`).run(pedidoId);

    const prev = previsao || db.prepare(`SELECT date('now','localtime','+2 days') AS d`).get().d;
    const codigo = proximoCodigo(db, 'entregas', 'ENT', 5417);
    const destino = [pedido.endereco, pedido.cidade].filter(Boolean).join(' — ') || 'A definir';
    db.prepare('INSERT INTO entregas (codigo, pedido_id, destino, previsao) VALUES (?,?,?,?)')
      .run(codigo, pedidoId, destino, prev);
    return db.prepare('SELECT * FROM pedidos WHERE id = ?').get(pedidoId);
  });
}

/** Cancela um pedido ainda pendente (não houve baixa de estoque). */
function cancelarPedido(db, pedidoId) {
  const pedido = db.prepare('SELECT status FROM pedidos WHERE id = ?').get(pedidoId);
  if (!pedido) throw new ErroNegocio('Pedido não encontrado.', 404);
  if (pedido.status !== 'Pendente') throw new ErroNegocio('Só é possível cancelar pedidos pendentes.');
  db.prepare(`UPDATE pedidos SET status = 'Cancelado' WHERE id = ?`).run(pedidoId);
}

const FLUXO_ENTREGA = { 'Pendente': 'Em trânsito', 'Em trânsito': 'Entregue' };

/** RF14 + RF16 — avança o status da entrega e devolve a situação ao pedido de Vendas. */
function atualizarEntrega(db, entregaId, { status, motorista, comprovacao }) {
  return transacao(db, () => {
    const e = db.prepare('SELECT * FROM entregas WHERE id = ?').get(entregaId);
    if (!e) throw new ErroNegocio('Entrega não encontrada.', 404);
    if (motorista !== undefined) db.prepare('UPDATE entregas SET motorista = ? WHERE id = ?').run(motorista, entregaId);
    if (status && status !== e.status) {
      if (FLUXO_ENTREGA[e.status] !== status) throw new ErroNegocio(`Transição inválida: ${e.status} → ${status}.`);
      if (status === 'Em trânsito') {
        if (!(motorista || e.motorista)) throw new ErroNegocio('Informe o motorista antes da saída.');
        db.prepare(`UPDATE entregas SET status = ?, data_saida = datetime('now','localtime') WHERE id = ?`).run(status, entregaId);
        db.prepare(`UPDATE pedidos SET status = 'Em entrega' WHERE id = ?`).run(e.pedido_id);
      } else {
        db.prepare(`UPDATE entregas SET status = ?, data_conclusao = datetime('now','localtime'), comprovacao = ? WHERE id = ?`)
          .run(status, comprovacao || null, entregaId);
        db.prepare(`UPDATE pedidos SET status = 'Concluído' WHERE id = ?`).run(e.pedido_id);
      }
    }
    return db.prepare('SELECT * FROM entregas WHERE id = ?').get(entregaId);
  });
}

/** RF18 — indicadores do painel gerencial (seção 5.7). */
function indicadores(db) {
  const q = (sql) => db.prepare(sql).get();
  const estoque = q(`SELECT COALESCE(SUM(quantidade),0) AS totalPecas,
                            COALESCE(SUM(quantidade * preco_unitario),0) AS valorEstoque,
                            SUM(quantidade <= estoque_minimo) AS abaixoMinimo,
                            SUM(quantidade = 0) AS zerados
                       FROM pecas`);
  const vendas = q(`SELECT COUNT(*) AS totalPedidos,
                           COALESCE(SUM(CASE WHEN status NOT IN ('Pendente','Cancelado') THEN valor_total END),0) AS faturamento,
                           SUM(status = 'Pendente') AS pendentes
                      FROM pedidos`);
  const ent = q(`SELECT SUM(status <> 'Entregue') AS ativas,
                        SUM(status = 'Entregue') AS concluidas,
                        SUM(status = 'Entregue' AND date(data_conclusao) <= date(previsao)) AS noPrazo
                   FROM entregas`);
  const criticos = db.prepare(`SELECT codigo, descricao, quantidade, estoque_minimo FROM pecas
                                WHERE quantidade <= estoque_minimo ORDER BY quantidade`).all();
  return {
    ...estoque,
    abaixoMinimo: estoque.abaixoMinimo || 0,
    zerados: estoque.zerados || 0,
    ...vendas,
    pendentes: vendas.pendentes || 0,
    entregasAtivas: ent.ativas || 0,
    entregasConcluidas: ent.concluidas || 0,
    percentualNoPrazo: ent.concluidas ? Math.round((100 * (ent.noPrazo || 0)) / ent.concluidas) : null,
    criticos,
  };
}

module.exports = {
  ErroNegocio, movimentarEstoque, criarPedido, verificarDisponibilidade,
  confirmarPedido, cancelarPedido, atualizarEntrega, indicadores,
};
