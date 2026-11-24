-- SIGE AutoParts — modelo lógico da base de dados única
-- Compartilhada pelos módulos de Estoque, Vendas e Transporte (RNF03)

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS usuarios (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  nome        TEXT    NOT NULL,
  login       TEXT    NOT NULL UNIQUE,
  senha_hash  TEXT    NOT NULL,                       -- RNF02: scrypt + salt
  perfil      TEXT    NOT NULL CHECK (perfil IN ('admin','estoque','vendas','logistica'))
);

CREATE TABLE IF NOT EXISTS fornecedores (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  nome      TEXT NOT NULL,
  cnpj      TEXT UNIQUE,
  telefone  TEXT,
  email     TEXT
);

CREATE TABLE IF NOT EXISTS pecas (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  codigo          TEXT    NOT NULL UNIQUE,
  descricao       TEXT    NOT NULL,
  categoria       TEXT,
  aplicacao       TEXT,                                -- veículos compatíveis (RF04)
  quantidade      INTEGER NOT NULL DEFAULT 0 CHECK (quantidade >= 0),
  estoque_minimo  INTEGER NOT NULL DEFAULT 5 CHECK (estoque_minimo >= 0),
  preco_unitario  REAL    NOT NULL CHECK (preco_unitario >= 0),
  fornecedor_id   INTEGER REFERENCES fornecedores(id) ON DELETE SET NULL
);

-- RNF09: rastreabilidade de entradas e saídas
CREATE TABLE IF NOT EXISTS movimentacoes (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  peca_id     INTEGER NOT NULL REFERENCES pecas(id) ON DELETE CASCADE,
  tipo        TEXT    NOT NULL CHECK (tipo IN ('ENTRADA','SAIDA')),
  quantidade  INTEGER NOT NULL CHECK (quantidade > 0),
  motivo      TEXT,
  pedido_id   INTEGER REFERENCES pedidos(id) ON DELETE SET NULL,
  usuario_id  INTEGER REFERENCES usuarios(id),
  data        TEXT    NOT NULL DEFAULT (datetime('now','localtime'))
);

CREATE TABLE IF NOT EXISTS clientes (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  nome       TEXT NOT NULL,
  documento  TEXT UNIQUE,                               -- CPF/CNPJ
  telefone   TEXT,
  email      TEXT,
  endereco   TEXT,
  cidade     TEXT
);

CREATE TABLE IF NOT EXISTS pedidos (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  codigo       TEXT    NOT NULL UNIQUE,
  cliente_id   INTEGER NOT NULL REFERENCES clientes(id),
  usuario_id   INTEGER REFERENCES usuarios(id),
  data         TEXT    NOT NULL DEFAULT (datetime('now','localtime')),
  status       TEXT    NOT NULL DEFAULT 'Pendente'
               CHECK (status IN ('Pendente','Confirmado','Em entrega','Concluído','Cancelado')),
  valor_total  REAL    NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS itens_pedido (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  pedido_id       INTEGER NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
  peca_id         INTEGER NOT NULL REFERENCES pecas(id),
  quantidade      INTEGER NOT NULL CHECK (quantidade > 0),
  preco_unitario  REAL    NOT NULL
);

CREATE TABLE IF NOT EXISTS entregas (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  codigo          TEXT    NOT NULL UNIQUE,
  pedido_id       INTEGER NOT NULL UNIQUE REFERENCES pedidos(id) ON DELETE CASCADE,
  destino         TEXT    NOT NULL,
  motorista       TEXT,
  previsao        TEXT,
  data_saida      TEXT,
  data_conclusao  TEXT,
  status          TEXT    NOT NULL DEFAULT 'Pendente'
                  CHECK (status IN ('Pendente','Em trânsito','Entregue')),
  comprovacao     TEXT
);
