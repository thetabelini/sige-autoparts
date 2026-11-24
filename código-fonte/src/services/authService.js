// Autenticação e controle de acesso por perfil (RF17, RNF01, RNF02).
const crypto = require('node:crypto');

function hashSenha(senha) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(senha, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function verificarSenha(senha, armazenado) {
  const [salt, hash] = String(armazenado).split(':');
  if (!salt || !hash) return false;
  const calc = crypto.scryptSync(senha, salt, 64);
  const ref = Buffer.from(hash, 'hex');
  return ref.length === calc.length && crypto.timingSafeEqual(ref, calc);
}

// Sessões em memória (versão inicial). Expiram em 8 horas.
const SESSAO_MS = 8 * 60 * 60 * 1000;
const sessoes = new Map();

function criarSessao(usuario) {
  const token = crypto.randomBytes(32).toString('hex');
  sessoes.set(token, { usuario, expira: Date.now() + SESSAO_MS });
  return token;
}

function obterSessao(token) {
  const s = sessoes.get(token);
  if (!s) return null;
  if (s.expira < Date.now()) { sessoes.delete(token); return null; }
  return s.usuario;
}

function encerrarSessao(token) { sessoes.delete(token); }

/** Matriz de permissões por perfil. */
const PERMISSOES = {
  admin:     ['dashboard', 'estoque:ler', 'estoque:editar', 'vendas:ler', 'vendas:editar', 'transporte:ler', 'transporte:editar'],
  estoque:   ['dashboard', 'estoque:ler', 'estoque:editar', 'vendas:ler'],
  vendas:    ['dashboard', 'estoque:ler', 'vendas:ler', 'vendas:editar', 'transporte:ler'],
  logistica: ['dashboard', 'transporte:ler', 'transporte:editar', 'vendas:ler'],
};

function pode(perfil, permissao) {
  return (PERMISSOES[perfil] || []).includes(permissao);
}

module.exports = { hashSenha, verificarSenha, criarSessao, obterSessao, encerrarSessao, pode, PERMISSOES };
