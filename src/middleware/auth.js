const { obterSessao, pode } = require('../services/authService');

function autenticar(req, res, next) {
  const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  const usuario = token && obterSessao(token);
  if (!usuario) return res.status(401).json({ erro: 'Sessão inválida ou expirada.' });
  req.usuario = usuario;
  req.token = token;
  next();
}

function exigir(permissao) {
  return (req, res, next) => {
    if (!pode(req.usuario.perfil, permissao)) {
      return res.status(403).json({ erro: 'Seu perfil não tem permissão para esta operação.' });
    }
    next();
  };
}

module.exports = { autenticar, exigir };
