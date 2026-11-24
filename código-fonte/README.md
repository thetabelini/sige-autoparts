# Código-fonte do projeto

Aqui ficam os arquivos-fonte do SIGE AutoParts: front-end (HTML, CSS e JavaScript), API, regras de negócio, scripts do banco de dados e testes.

## Estrutura (arquitetura em camadas)

```
public/            Camada de apresentação  — SPA em HTML, CSS e JavaScript (responsiva)
src/routes/        Camada de serviços      — API REST (Express) + autenticação por perfil
src/middleware/    Autenticação por token e verificação de permissões
src/services/      Regras de negócio       — integração Vendas → Estoque → Transporte (transações)
src/database/      Camada de persistência  — conexão SQLite e dados de demonstração
db/                Script SQL da base de dados única (schema.sql)
tests/             Testes automatizados do fluxo integrado (node:test)
```

## Tecnologias

- **Node.js 22.13+** (módulo nativo `node:sqlite`)
- **Express 4** para a API REST
- **SQLite** como base de dados única
- **HTML5, CSS3 e JavaScript** (sem framework) no front-end
- **node:test** para testes automatizados

## Como executar

```bash
npm install
npm start          # http://localhost:3000
npm test           # testes automatizados
```

O banco é criado em `data/sige.db` na primeira execução. Para usar outro caminho, defina a variável de ambiente `DB_PATH`.

## Endpoints principais da API

| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/login` | Autenticação, retorna token |
| GET | `/api/dashboard` | Indicadores do painel gerencial |
| GET/POST/PUT/DELETE | `/api/pecas` | Peças (busca por `?busca=`) |
| POST | `/api/pecas/:id/movimentacoes` | Entrada/saída de estoque |
| GET/POST/PUT | `/api/clientes` | Clientes |
| GET/POST | `/api/pedidos` | Pedidos (`confirmar: true` confirma na criação) |
| POST | `/api/pedidos/:id/confirmar` | Verifica saldo, dá baixa e gera entrega |
| GET | `/api/entregas` | Entregas |
| PATCH | `/api/entregas/:id` | Avança status: Pendente → Em trânsito → Entregue |
