// Camada de persistência: conexão única com o SQLite compartilhada pelos módulos.
const fs = require('node:fs');
const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');
const { hashSenha } = require('../services/authService');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', '..', 'data', 'sige.db');

function abrir(caminho = DB_PATH) {
  if (caminho !== ':memory:') fs.mkdirSync(path.dirname(caminho), { recursive: true });
  const db = new DatabaseSync(caminho);
  db.exec(fs.readFileSync(path.join(__dirname, '..', '..', 'db', 'schema.sql'), 'utf8'));
  const { n } = db.prepare('SELECT COUNT(*) AS n FROM usuarios').get();
  if (n === 0) popular(db);
  return db;
}

/** Executa fn dentro de uma transação (RNF04 — consistência entre módulos). */
function transacao(db, fn) {
  db.exec('BEGIN');
  try {
    const r = fn();
    db.exec('COMMIT');
    return r;
  } catch (e) {
    db.exec('ROLLBACK');
    throw e;
  }
}

/** Dados de demonstração para a versão inicial. */
function popular(db) {
  const u = db.prepare('INSERT INTO usuarios (nome, login, senha_hash, perfil) VALUES (?,?,?,?)');
  u.run('Administrador', 'admin', hashSenha('admin123'), 'admin');
  u.run('Operador de Estoque', 'estoque', hashSenha('estoque123'), 'estoque');
  u.run('Vendedor', 'vendas', hashSenha('vendas123'), 'vendas');
  u.run('Motorista / Logística', 'logistica', hashSenha('logistica123'), 'logistica');

  const f = db.prepare('INSERT INTO fornecedores (nome, cnpj, telefone) VALUES (?,?,?)');
  f.run('Distribuidora Minas Peças', '11.111.111/0001-11', '(31) 3333-1000');
  f.run('Elétrica Auto Center', '22.222.222/0001-22', '(31) 3333-2000');

  const p = db.prepare(`INSERT INTO pecas (codigo, descricao, categoria, aplicacao, quantidade, estoque_minimo, preco_unitario, fornecedor_id)
                        VALUES (?,?,?,?,?,?,?,?)`);
  p.run('PE-001', 'Alternador 120A', 'Elétrica', 'Gol, Voyage, Saveiro', 45, 5, 350, 2);
  p.run('PE-002', 'Filtro de Ar', 'Filtros', 'Onix, Prisma', 2, 10, 45, 1);
  p.run('PE-003', 'Pastilha de Freio', 'Freios', 'HB20, Creta', 128, 20, 89, 1);
  p.run('PE-004', 'Bateria 60Ah', 'Elétrica', 'Universal', 18, 20, 420, 2);
  p.run('PE-005', 'Amortecedor Dianteiro', 'Suspensão', 'Palio, Uno', 12, 4, 260, 1);

  const c = db.prepare('INSERT INTO clientes (nome, documento, telefone, cidade, endereco) VALUES (?,?,?,?,?)');
  c.run('Oficina São Paulo', '33.333.333/0001-33', '(31) 99999-0001', 'Belo Horizonte', 'Av. Amazonas, 1000');
  c.run('Mecânica Central', '44.444.444/0001-44', '(31) 99999-0002', 'Contagem', 'Rua João César, 200');
  c.run('Auto Peças Premium', '55.555.555/0001-55', '(31) 99999-0003', 'Divinópolis', 'Rua Goiás, 45');
}

module.exports = { abrir, transacao, DB_PATH };
