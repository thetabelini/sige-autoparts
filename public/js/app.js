// SIGE AutoParts — camada de apresentação (SPA sem framework)
const $ = (s, el = document) => el.querySelector(s);
const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const moeda = (v) => Number(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const num = (v) => Number(v || 0).toLocaleString('pt-BR');
const data = (v) => (v ? new Date(v.replace(' ', 'T')).toLocaleDateString('pt-BR') : '—');
const dataHora = (v) => (v ? new Date(v.replace(' ', 'T')).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }) : '—');
const tag = (t) => `<span class="tag ${esc(t)}">${esc(t)}</span>`;

const estado = { token: null, usuario: null, permissoes: [] };
const pode = (p) => estado.permissoes.includes(p);

// ---------------- API ----------------
async function api(caminho, opcoes = {}) {
  const r = await fetch(`/api${caminho}`, {
    ...opcoes,
    headers: { 'Content-Type': 'application/json', ...(estado.token && { Authorization: `Bearer ${estado.token}` }) },
    body: opcoes.body ? JSON.stringify(opcoes.body) : undefined,
  });
  if (r.status === 401 && caminho !== '/login') { sair(); throw new Error('Sessão expirada.'); }
  if (r.status === 204) return null;
  const json = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(json.erro || 'Falha na operação.');
  return json;
}

function toast(msg, erro = false) {
  const t = $('#toast');
  t.textContent = msg;
  t.className = `visivel${erro ? ' erro' : ''}`;
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => (t.className = ''), 3200);
}

// ---------------- Modal ----------------
function modal(titulo, corpoHtml, botoes, aoAbrir) {
  const dlg = $('#modal');
  $('#modal-titulo').textContent = titulo;
  $('#modal-corpo').innerHTML = corpoHtml;
  $('#modal-erro').textContent = '';
  const rodape = $('#modal-rodape');
  rodape.innerHTML = `<button value="cancel" formnovalidate class="btn">${botoes.length ? 'Cancelar' : 'Fechar'}</button>`;
  botoes.forEach((b) => {
    const el = document.createElement('button');
    el.type = 'button';
    el.className = `btn ${b.classe || 'primario'}`;
    el.textContent = b.texto;
    el.onclick = async () => {
      const form = $('#modal-form');
      if (!form.reportValidity()) return;
      el.disabled = true;
      try {
        await b.acao(Object.fromEntries(new FormData(form)));
        dlg.close();
      } catch (e) {
        $('#modal-erro').textContent = e.message;
      } finally { el.disabled = false; }
    };
    rodape.append(el);
  });
  dlg.showModal();
  aoAbrir?.($('#modal-corpo'));
}

// ---------------- Login / sessão ----------------
async function entrar(ev) {
  ev.preventDefault();
  const dados = Object.fromEntries(new FormData(ev.target));
  try {
    const r = await api('/login', { method: 'POST', body: dados });
    Object.assign(estado, r);
    sessionStorage.setItem('sige-token', r.token);
    iniciar();
  } catch (e) { $('#erro-login').textContent = e.message; }
}

function sair() {
  if (estado.token) fetch('/api/logout', { method: 'POST', headers: { Authorization: `Bearer ${estado.token}` } });
  sessionStorage.removeItem('sige-token');
  Object.assign(estado, { token: null, usuario: null, permissoes: [] });
  $('#app').hidden = true;
  $('#tela-login').hidden = false;
}

async function restaurar() {
  const token = sessionStorage.getItem('sige-token');
  if (!token) return sair();
  estado.token = token;
  try { Object.assign(estado, await api('/me')); iniciar(); } catch { sair(); }
}

// ---------------- Navegação ----------------
const PAGINAS = {
  dashboard:  { titulo: 'Dashboard', icone: '📊', perm: 'dashboard', render: paginaDashboard },
  estoque:    { titulo: 'Gerenciar estoque', menu: 'Estoque', icone: '📦', perm: 'estoque:ler', render: paginaEstoque },
  vendas:     { titulo: 'Vendas', icone: '🛒', perm: 'vendas:ler', render: paginaVendas },
  transporte: { titulo: 'Rastreamento de entregas', menu: 'Transporte', icone: '🚚', perm: 'transporte:ler', render: paginaTransporte },
};

function iniciar() {
  $('#tela-login').hidden = true;
  $('#app').hidden = false;
  $('#usuario-nome').textContent = estado.usuario.nome;
  $('#usuario-perfil').textContent = `Perfil: ${estado.usuario.perfil}`;
  $('#menu').innerHTML = Object.entries(PAGINAS)
    .filter(([, p]) => pode(p.perm))
    .map(([id, p]) => `<a href="#${id}" data-id="${id}"><span>${p.icone}</span>${p.menu || p.titulo}</a>`).join('');
  rota();
}

async function rota() {
  if (!estado.token) return;
  let id = location.hash.slice(1) || 'dashboard';
  if (!PAGINAS[id] || !pode(PAGINAS[id].perm)) id = 'dashboard';
  const pagina = PAGINAS[id];
  document.querySelectorAll('#menu a').forEach((a) => a.classList.toggle('ativo', a.dataset.id === id));
  $('#titulo').textContent = pagina.titulo;
  $('#acoes-topo').innerHTML = '';
  $('#lateral').classList.remove('aberta');
  try { await pagina.render($('#pagina')); } catch (e) { toast(e.message, true); }
}

function painel(titulo, idBusca, botaoHtml, tabelaHtml) {
  return `<section class="painel">
    <header><h2>${titulo}</h2>
      ${idBusca ? `<input type="search" id="${idBusca}" placeholder="Buscar…">` : ''}${botaoHtml || ''}
    </header>
    <div class="tabela">${tabelaHtml}</div></section>`;
}

function tabela(colunas, linhas, vazio = 'Nenhum registro encontrado.') {
  if (!linhas.length) return `<p class="vazio">${vazio}</p>`;
  return `<table><thead><tr>${colunas.map((c) => `<th>${c}</th>`).join('')}</tr></thead>
    <tbody>${linhas.join('')}</tbody></table>`;
}

function comBusca(id, carregar) {
  let t;
  $(`#${id}`)?.addEventListener('input', (e) => { clearTimeout(t); t = setTimeout(() => carregar(e.target.value), 250); });
}

// ---------------- Dashboard ----------------
async function paginaDashboard(el) {
  const d = await api('/dashboard');
  el.innerHTML = `
    <div class="cards">
      <div class="card info"><small>Total de peças em estoque</small><strong>${num(d.totalPecas)}</strong></div>
      <div class="card alerta"><small>Itens abaixo do mínimo</small><strong>${num(d.abaixoMinimo)}</strong></div>
      <div class="card"><small>Valor em estoque</small><strong>${moeda(d.valorEstoque)}</strong></div>
      <div class="card bom"><small>Total de pedidos</small><strong>${num(d.totalPedidos)}</strong></div>
      <div class="card"><small>Faturamento (pedidos confirmados)</small><strong>${moeda(d.faturamento)}</strong></div>
      <div class="card info"><small>Entregas ativas</small><strong>${num(d.entregasAtivas)}</strong></div>
      <div class="card bom"><small>Entregas no prazo</small><strong>${d.percentualNoPrazo == null ? '—' : d.percentualNoPrazo + '%'}</strong></div>
      <div class="card alerta"><small>Pedidos pendentes</small><strong>${num(d.pendentes)}</strong></div>
    </div>
    ${painel('Peças em situação crítica', null, '', tabela(['Código', 'Descrição', 'Saldo', 'Mínimo'],
      d.criticos.map((p) => `<tr><td>${esc(p.codigo)}</td><td>${esc(p.descricao)}</td><td>${p.quantidade}</td><td>${p.estoque_minimo}</td></tr>`),
      'Nenhuma peça abaixo do estoque mínimo.'))}`;
}

// ---------------- Estoque ----------------
async function paginaEstoque(el) {
  const editar = pode('estoque:editar');
  el.innerHTML = painel('Peças em estoque', 'busca-peca', editar ? '<button class="btn primario" id="nova-peca">+ Nova peça</button>' : '', '<div id="lista-pecas"></div>')
    + painel('Últimas movimentações', null, '', '<div id="lista-mov"></div>');
  const carregar = async (busca = '') => {
    const pecas = await api(`/pecas?busca=${encodeURIComponent(busca)}`);
    $('#lista-pecas').innerHTML = tabela(['Código', 'Descrição', 'Aplicação', 'Quantidade', 'Mínimo', 'Preço unit.', 'Status', editar ? 'Ações' : ''],
      pecas.map((p) => `<tr><td>${esc(p.codigo)}</td><td>${esc(p.descricao)}</td><td>${esc(p.aplicacao)}</td><td>${p.quantidade}</td>
        <td>${p.estoque_minimo}</td><td>${moeda(p.preco_unitario)}</td><td>${tag(p.situacao)}</td>
        <td class="acoes">${editar ? `<button class="btn pequeno" data-mov="${p.id}">± Movimentar</button>
          <button class="btn pequeno" data-edit="${p.id}">Editar</button>
          <button class="btn pequeno perigo" data-del="${p.id}">Excluir</button>` : ''}</td></tr>`));
    $('#lista-pecas').onclick = (e) => {
      const b = e.target.closest('button'); if (!b) return;
      const p = pecas.find((x) => x.id == (b.dataset.mov || b.dataset.edit || b.dataset.del));
      if (b.dataset.mov) formMovimentacao(p, recarregar);
      if (b.dataset.edit) formPeca(p, recarregar);
      if (b.dataset.del && confirm(`Excluir ${p.codigo} — ${p.descricao}?`)) {
        api(`/pecas/${p.id}`, { method: 'DELETE' }).then(() => { toast('Peça excluída.'); recarregar(); }).catch((x) => toast(x.message, true));
      }
    };
  };
  const movs = async () => {
    const m = await api('/movimentacoes');
    $('#lista-mov').innerHTML = tabela(['Data', 'Peça', 'Tipo', 'Qtd.', 'Motivo', 'Usuário'],
      m.slice(0, 10).map((x) => `<tr><td>${dataHora(x.data)}</td><td>${esc(x.codigo)} — ${esc(x.descricao)}</td><td>${tag(x.tipo)}</td>
        <td>${x.quantidade}</td><td>${esc(x.motivo)}</td><td>${esc(x.usuario)}</td></tr>`), 'Nenhuma movimentação registrada.');
  };
  const recarregar = () => { carregar($('#busca-peca').value); movs(); };
  $('#nova-peca')?.addEventListener('click', () => formPeca(null, recarregar));
  comBusca('busca-peca', carregar);
  await Promise.all([carregar(), movs()]);
}

async function formPeca(p, depois) {
  const forn = await api('/fornecedores');
  const v = p || { estoque_minimo: 5 };
  modal(p ? 'Editar peça' : 'Nova peça', `
    <div class="grade">
      <label>Código <input name="codigo" required value="${esc(v.codigo)}"></label>
      <label>Categoria <input name="categoria" value="${esc(v.categoria)}"></label>
    </div>
    <label>Descrição <input name="descricao" required value="${esc(v.descricao)}"></label>
    <label>Aplicação (veículos) <input name="aplicacao" value="${esc(v.aplicacao)}"></label>
    <div class="grade">
      <label>Preço unitário (R$) <input name="preco_unitario" type="number" min="0" step="0.01" required value="${esc(v.preco_unitario)}"></label>
      <label>Estoque mínimo <input name="estoque_minimo" type="number" min="0" required value="${esc(v.estoque_minimo)}"></label>
      ${p ? '' : '<label>Quantidade inicial <input name="quantidade" type="number" min="0" value="0"></label>'}
      <label>Fornecedor <select name="fornecedor_id"><option value="">—</option>
        ${forn.map((f) => `<option value="${f.id}" ${f.id === v.fornecedor_id ? 'selected' : ''}>${esc(f.nome)}</option>`).join('')}</select></label>
    </div>`, [{
    texto: 'Salvar peça',
    acao: async (d) => {
      await api(p ? `/pecas/${p.id}` : '/pecas', { method: p ? 'PUT' : 'POST', body: d });
      toast('Peça salva.'); depois();
    },
  }]);
}

function formMovimentacao(p, depois) {
  modal(`Movimentar ${p.codigo}`, `
    <p>${esc(p.descricao)} — saldo atual: <strong>${p.quantidade}</strong></p>
    <div class="grade">
      <label>Tipo <select name="tipo"><option value="ENTRADA">Entrada</option><option value="SAIDA">Saída</option></select></label>
      <label>Quantidade <input name="quantidade" type="number" min="1" required></label>
    </div>
    <label>Motivo <input name="motivo" placeholder="Ex.: compra de fornecedor, avaria, ajuste de inventário"></label>`, [{
    texto: 'Registrar',
    acao: async (d) => { await api(`/pecas/${p.id}/movimentacoes`, { method: 'POST', body: d }); toast('Movimentação registrada.'); depois(); },
  }]);
}

// ---------------- Vendas ----------------
async function paginaVendas(el, aba = 'pedidos') {
  el.innerHTML = `<div class="abas"><button data-aba="pedidos">Pedidos</button><button data-aba="clientes">Clientes</button></div><div id="aba"></div>`;
  el.querySelectorAll('.abas button').forEach((b) => {
    b.classList.toggle('ativo', b.dataset.aba === aba);
    b.onclick = () => paginaVendas(el, b.dataset.aba);
  });
  if (aba === 'pedidos') await abaPedidos($('#aba')); else await abaClientes($('#aba'));
}

async function abaPedidos(el) {
  const editar = pode('vendas:editar');
  el.innerHTML = painel('Pedidos cadastrados', 'busca-pedido', editar ? '<button class="btn primario" id="novo-pedido">+ Novo pedido</button>' : '', '<div id="lista-pedidos"></div>');
  const carregar = async (busca = '') => {
    const pedidos = await api(`/pedidos?busca=${encodeURIComponent(busca)}`);
    $('#lista-pedidos').innerHTML = tabela(['Pedido', 'Cliente', 'Data', 'Valor total', 'Status', 'Entrega', 'Ações'],
      pedidos.map((p) => `<tr><td>${esc(p.codigo)}</td><td>${esc(p.cliente)}</td><td>${data(p.data)}</td><td>${moeda(p.valor_total)}</td>
        <td>${tag(p.status)}</td><td>${p.entrega ? `${esc(p.entrega)} ${tag(p.status_entrega)}` : '—'}</td>
        <td class="acoes"><button class="btn pequeno" data-ver="${p.id}">Detalhes</button>
        ${editar && p.status === 'Pendente' ? `<button class="btn pequeno sucesso" data-conf="${p.id}">Confirmar</button>
          <button class="btn pequeno perigo" data-canc="${p.id}">Cancelar</button>` : ''}</td></tr>`));
  };
  $('#lista-pedidos').onclick = async (e) => {
    const b = e.target.closest('button'); if (!b) return;
    try {
      if (b.dataset.ver) await detalhePedido(b.dataset.ver);
      if (b.dataset.conf) { await api(`/pedidos/${b.dataset.conf}/confirmar`, { method: 'POST', body: {} }); toast('Pedido confirmado: estoque baixado e ordem de entrega gerada.'); carregar(); }
      if (b.dataset.canc && confirm('Cancelar este pedido?')) { await api(`/pedidos/${b.dataset.canc}/cancelar`, { method: 'POST', body: {} }); toast('Pedido cancelado.'); carregar(); }
    } catch (x) { toast(x.message, true); }
  };
  $('#novo-pedido')?.addEventListener('click', () => formPedido(() => carregar()));
  comBusca('busca-pedido', carregar);
  await carregar();
}

async function detalhePedido(id) {
  const p = await api(`/pedidos/${id}`);
  const disp = Object.fromEntries(p.disponibilidade.map((d) => [d.peca_id, d]));
  modal(`Pedido ${p.codigo}`, `
    <p><strong>Cliente:</strong> ${esc(p.cliente)}<br><strong>Status:</strong> ${tag(p.status)}
    ${p.entrega ? `<br><strong>Entrega:</strong> ${esc(p.entrega.codigo)} ${tag(p.entrega.status)} — ${esc(p.entrega.motorista || 'motorista não definido')}` : ''}</p>
    <table class="detalhe"><thead><tr><th>Peça</th><th>Qtd.</th><th>Preço</th><th>Subtotal</th>${p.status === 'Pendente' ? '<th>Estoque</th>' : ''}</tr></thead><tbody>
    ${p.itens.map((i) => `<tr><td>${esc(i.codigo)} — ${esc(i.descricao)}</td><td>${i.quantidade}</td><td>${moeda(i.preco_unitario)}</td>
      <td>${moeda(i.quantidade * i.preco_unitario)}</td>
      ${p.status === 'Pendente' ? `<td>${disp[i.peca_id].ok ? tag('OK') : `<span class="tag Crítico">disp. ${disp[i.peca_id].disponivel}</span>`}</td>` : ''}</tr>`).join('')}
    </tbody></table><p class="total">Total: ${moeda(p.valor_total)}</p>`, []);
}

async function formPedido(depois) {
  const [clientes, pecas] = await Promise.all([api('/clientes'), api('/pecas')]);
  const opcoes = pecas.map((p) => `<option value="${p.id}" data-preco="${p.preco_unitario}" data-saldo="${p.quantidade}">${esc(p.codigo)} — ${esc(p.descricao)} (saldo ${p.quantidade})</option>`).join('');
  const linha = () => `<div class="item-pedido"><label>Peça <select name="peca" required><option value="">Selecione…</option>${opcoes}</select></label>
    <label>Qtd. <input name="qtd" type="number" min="1" value="1" required></label><button type="button" class="btn pequeno perigo" data-rem>×</button></div>`;
  const coletar = (corpo) => [...corpo.querySelectorAll('.item-pedido')].map((l) => ({
    pecaId: Number($('select', l).value), quantidade: Number($('input', l).value), sel: $('select', l).selectedOptions[0],
  })).filter((i) => i.pecaId);
  const salvar = (confirmar) => async (d) => {
    const itens = coletar($('#modal-corpo'));
    if (!itens.length) throw new Error('Adicione ao menos uma peça.');
    const r = await api('/pedidos', { method: 'POST', body: { clienteId: d.cliente, itens: itens.map(({ pecaId, quantidade }) => ({ pecaId, quantidade })), confirmar } });
    toast(confirmar ? `Pedido ${r.codigo} confirmado e enviado ao Transporte.` : `Pedido ${r.codigo} salvo como pendente.`);
    depois();
  };
  modal('Novo pedido', `
    <label>Cliente <select name="cliente" required><option value="">Selecione…</option>
      ${clientes.map((c) => `<option value="${c.id}">${esc(c.nome)}</option>`).join('')}</select></label>
    <div id="itens">${linha()}</div>
    <button type="button" class="btn pequeno" id="add-item">+ Adicionar peça</button>
    <p class="total" id="total-pedido">Total: ${moeda(0)}</p>`,
  [{ texto: 'Salvar pendente', classe: '', acao: salvar(false) }, { texto: 'Salvar e confirmar', acao: salvar(true) }],
  (corpo) => {
    const atualizar = () => {
      let total = 0; let aviso = '';
      coletar(corpo).forEach((i) => {
        total += i.quantidade * Number(i.sel.dataset.preco);
        if (i.quantidade > Number(i.sel.dataset.saldo)) aviso = 'Atenção: há item com quantidade acima do saldo — o pedido não poderá ser confirmado.';
      });
      $('#total-pedido').textContent = `Total: ${moeda(total)}`;
      $('#modal-erro').textContent = aviso;
    };
    $('#add-item', corpo).onclick = () => { $('#itens', corpo).insertAdjacentHTML('beforeend', linha()); };
    corpo.addEventListener('input', atualizar);
    corpo.addEventListener('change', atualizar);
    corpo.addEventListener('click', (e) => { if (e.target.dataset.rem !== undefined && corpo.querySelectorAll('.item-pedido').length > 1) { e.target.parentElement.remove(); atualizar(); } });
  });
}

async function abaClientes(el) {
  const editar = pode('vendas:editar');
  el.innerHTML = painel('Clientes', 'busca-cliente', editar ? '<button class="btn primario" id="novo-cliente">+ Novo cliente</button>' : '', '<div id="lista-clientes"></div>');
  let clientes = [];
  const carregar = async (busca = '') => {
    clientes = await api(`/clientes?busca=${encodeURIComponent(busca)}`);
    $('#lista-clientes').innerHTML = tabela(['Nome', 'CPF/CNPJ', 'Telefone', 'Cidade', editar ? 'Ações' : ''],
      clientes.map((c) => `<tr><td>${esc(c.nome)}</td><td>${esc(c.documento)}</td><td>${esc(c.telefone)}</td><td>${esc(c.cidade)}</td>
        <td class="acoes">${editar ? `<button class="btn pequeno" data-edit="${c.id}">Editar</button>` : ''}</td></tr>`));
  };
  const form = (c) => modal(c ? 'Editar cliente' : 'Novo cliente', `
    <label>Nome / Razão social <input name="nome" required value="${esc(c?.nome)}"></label>
    <div class="grade"><label>CPF/CNPJ <input name="documento" value="${esc(c?.documento)}"></label>
    <label>Telefone <input name="telefone" value="${esc(c?.telefone)}"></label></div>
    <label>E-mail <input name="email" type="email" value="${esc(c?.email)}"></label>
    <div class="grade"><label>Endereço <input name="endereco" value="${esc(c?.endereco)}"></label>
    <label>Cidade <input name="cidade" value="${esc(c?.cidade)}"></label></div>`, [{
    texto: 'Salvar cliente',
    acao: async (d) => { await api(c ? `/clientes/${c.id}` : '/clientes', { method: c ? 'PUT' : 'POST', body: d }); toast('Cliente salvo.'); carregar(); },
  }]);
  $('#lista-clientes').onclick = (e) => { const id = e.target.dataset.edit; if (id) form(clientes.find((c) => c.id == id)); };
  $('#novo-cliente')?.addEventListener('click', () => form(null));
  comBusca('busca-cliente', carregar);
  await carregar();
}

// ---------------- Transporte ----------------
async function paginaTransporte(el) {
  const editar = pode('transporte:editar');
  el.innerHTML = painel('Entregas cadastradas', 'busca-entrega', '', '<div id="lista-entregas"></div>');
  let entregas = [];
  const carregar = async (busca = '') => {
    entregas = await api(`/entregas?busca=${encodeURIComponent(busca)}`);
    $('#lista-entregas').innerHTML = tabela(['Entrega', 'Pedido', 'Cliente', 'Destino', 'Motorista', 'Previsão', 'Saída', 'Status', editar ? 'Ações' : ''],
      entregas.map((e) => `<tr><td>${esc(e.codigo)}</td><td>${esc(e.pedido)}</td><td>${esc(e.cliente)}</td><td class="q">${esc(e.destino)}</td>
        <td>${esc(e.motorista || '—')}</td><td>${data(e.previsao)}</td><td>${data(e.data_saida)}</td><td>${tag(e.status)}</td>
        <td class="acoes">${editar && e.status === 'Pendente' ? `<button class="btn pequeno primario" data-saida="${e.id}">Registrar saída</button>` : ''}
        ${editar && e.status === 'Em trânsito' ? `<button class="btn pequeno sucesso" data-concluir="${e.id}">Concluir entrega</button>` : ''}</td></tr>`),
      'Nenhuma entrega. As ordens de entrega são geradas automaticamente quando um pedido é confirmado em Vendas.');
  };
  $('#lista-entregas').onclick = (ev) => {
    const b = ev.target.closest('button'); if (!b) return;
    const e = entregas.find((x) => x.id == (b.dataset.saida || b.dataset.concluir));
    if (b.dataset.saida) {
      modal(`Saída da entrega ${e.codigo}`, `<p>Destino: ${esc(e.destino)}</p><label>Motorista <input name="motorista" required value="${esc(e.motorista)}"></label>`,
        [{ texto: 'Confirmar saída', acao: async (d) => { await api(`/entregas/${e.id}`, { method: 'PATCH', body: { status: 'Em trânsito', motorista: d.motorista } }); toast('Entrega em trânsito.'); carregar(); } }]);
    } else {
      modal(`Concluir entrega ${e.codigo}`, `<p>Cliente: ${esc(e.cliente)}</p><label>Comprovação (nome de quem recebeu / observação) <input name="comprovacao" required></label>`,
        [{ texto: 'Concluir', classe: 'sucesso', acao: async (d) => { await api(`/entregas/${e.id}`, { method: 'PATCH', body: { status: 'Entregue', comprovacao: d.comprovacao } }); toast('Entrega concluída e pedido finalizado.'); carregar(); } }]);
    }
  };
  comBusca('busca-entrega', carregar);
  await carregar();
}

// ---------------- Inicialização ----------------
$('#form-login').addEventListener('submit', entrar);
// Enter dentro do modal não deve fechá-lo; só os botões Cancelar/× fecham.
$('#modal-form').addEventListener('submit', (e) => { if (e.submitter?.value !== 'cancel') e.preventDefault(); });
$('#sair').addEventListener('click', sair);
$('#abrir-menu').addEventListener('click', () => $('#lateral').classList.toggle('aberta'));
window.addEventListener('hashchange', rota);
restaurar();
