# SIGE AutoParts

**Protótipo de um Sistema Integrado de Gestão Empresarial para empresas do ramo de peças automotivas**

Trabalho Interdisciplinar — Sistemas Integrados de Gestão Empresarial (SIGE)
Bacharelado em Sistemas de Informação — PUC Minas (Contagem) — 2º semestre de 2026
Orientador: Prof. Dr. Paulo Isnard

## Integrantes

- Álefe de Almeida Sousa
- Arthur Eduardo da Silva Marins
- Felipe Tabelini Pena
- Fernando Augusto Fabiano de Souza
- Gabriel Hiury Pereira Bernardo
- Igor Miranda Lio Santos
- Igor Rodrigues Leão Bonfim

## Sobre o projeto

O SIGE AutoParts integra os processos de **Estoque**, **Vendas** e **Transporte** em uma **base de dados única**.
Um pedido registrado em Vendas tem a disponibilidade verificada no Estoque, gera a baixa automática do saldo e
uma ordem de entrega no Transporte; o status da entrega volta para Vendas sem redigitação.

```
Pedido (Vendas) → Verificação (Estoque) → Baixa automática → Ordem de entrega (Transporte) → Status devolvido a Vendas
```

## Entregas por etapa

| Etapa | Data | Conteúdo | Onde está |
|---|---|---|---|
| 1ª | 28/08 | Tema, título e Introdução | `docs/` |
| 2ª | 25/09 | Problemática, Justificativa, Objetivos, esboço do protótipo | `docs/` |
| 3ª | 30/10 | Referencial teórico, protótipo e requisitos | `docs/etapa3/` |
| **4ª** | **27/11** | **Metodologia + versão inicial do APP** | `docs/etapa4/` e código-fonte (`v0.1.0`) |
| 5ª | 11/12 | Versão final do APP e apresentação | — |

## Arquitetura (em camadas)

```
public/            Camada de apresentação  — SPA em HTML, CSS e JavaScript (responsiva)
src/routes/        Camada de serviços      — API REST (Express) + autenticação por perfil
src/services/      Regras de negócio       — integração Vendas → Estoque → Transporte (transações)
src/database/      Camada de persistência  — SQLite, base única (schema.sql)
tests/             Testes automatizados do fluxo integrado (node:test)
docs/              Documentos acadêmicos de cada etapa
```

## Tecnologias

- **Node.js 22.13+** (usa o módulo nativo `node:sqlite`)
- **Express 4** para a API REST
- **SQLite** como base de dados única
- **HTML5, CSS3 e JavaScript** (sem framework) no front-end
- **node:test** para testes automatizados
- **Git + GitHub** para versionamento

## Como executar

```bash
git clone https://github.com/thetabelini/sige-autoparts.git
cd sige-autoparts
npm install
npm start          # http://localhost:3000
```

Na primeira execução o banco `data/sige.db` é criado com dados de demonstração. Para recomeçar do zero, apague a pasta `data/`.

Rodar os testes:

```bash
npm test
```

### Usuários de demonstração

| Perfil | Usuário | Senha | Acesso |
|---|---|---|---|
| Administrador | `admin` | `admin123` | Todos os módulos |
| Estoque | `estoque` | `estoque123` | Estoque (edição), consulta de pedidos |
| Vendas | `vendas` | `vendas123` | Clientes e pedidos, consulta de estoque e entregas |
| Logística | `logistica` | `logistica123` | Entregas (edição), consulta de pedidos |

> Senhas de demonstração para ambiente acadêmico. São armazenadas com hash `scrypt` + salt (RNF02).

## Situação dos requisitos na versão inicial (v0.1.0)

✅ implementado · ◐ parcial · ⏳ previsto para a versão final

| Código | Requisito | Situação |
|---|---|---|
| RF01 | Cadastrar, consultar, editar e excluir peças | ✅ |
| RF02 | Cadastrar e consultar fornecedores | ◐ consulta e vínculo com a peça; cadastro na versão final |
| RF03 | Registrar entradas e saídas de peças | ✅ |
| RF04 | Consultar peças por código, descrição ou aplicação | ✅ |
| RF05 | Identificar peças com estoque mínimo ou zerado | ✅ |
| RF06 | Cadastrar, consultar e atualizar clientes | ✅ |
| RF07 | Registrar e consultar pedidos de venda | ✅ |
| RF08 | Verificar disponibilidade antes da confirmação | ✅ |
| RF09 | Impedir confirmação acima do saldo | ✅ |
| RF10 | Calcular automaticamente o total do pedido | ✅ |
| RF11 | Acompanhar a situação dos pedidos | ✅ |
| RF12 | Gerar ordem de entrega após confirmação | ✅ |
| RF13 | Cadastrar e consultar rotas de entrega | ⏳ destino é preenchido pelo endereço do cliente |
| RF14 | Atualizar e consultar a situação das entregas | ✅ |
| RF15 | Atualizar estoque automaticamente após a venda | ✅ |
| RF16 | Disponibilizar a situação da entrega em Vendas | ✅ |
| RF17 | Autenticar usuários e restringir por perfil | ✅ |
| RF18 | Painel gerencial com estoque, pedidos e entregas | ✅ |
| RNF01–RNF04 | Segurança e integridade (perfis, hash, base única, transações) | ✅ |
| RNF05 | Usabilidade | ◐ avaliação com usuários na versão final |
| RNF06–RNF09 | Responsividade, compatibilidade, camadas, rastreabilidade | ✅ |

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

## Licença

MIT — uso acadêmico.
