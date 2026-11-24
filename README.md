# SIGE AutoParts: protótipo de um Sistema Integrado de Gestão Empresarial para empresas do ramo de peças automotivas

`Bacharelado em Sistemas de Informação — PUC Minas (Contagem)`

`Trabalho Interdisciplinar — Sistemas Integrados de Gestão Empresarial (SIGE)`

`2º semestre de 2026`

O SIGE AutoParts é um protótipo de sistema integrado que reúne os processos de **Estoque**, **Vendas** e **Transporte** de uma empresa do ramo de peças automotivas em uma **base de dados única**. O objetivo é eliminar a redigitação de informações entre os setores, reduzir divergências entre o estoque registrado e o real e permitir que o andamento das entregas seja consultado diretamente por Vendas.

Um pedido registrado em Vendas tem a disponibilidade verificada no Estoque, gera a baixa automática do saldo e uma ordem de entrega no Transporte; o status da entrega volta para Vendas sem redigitação. Um painel gerencial apresenta indicadores calculados a partir dos registros dos três módulos.

```
Pedido (Vendas) → Verificação (Estoque) → Baixa automática → Ordem de entrega (Transporte) → Status devolvido a Vendas
```

## Integrantes

* Álefe de Almeida Sousa
* Arthur Eduardo da Silva Marins
* Felipe Tabelini Pena
* Fernando Augusto Fabiano de Souza
* Gabriel Hiury Pereira Bernardo
* Igor Miranda Lio Santos
* Igor Rodrigues Leão Bonfim

## Orientador

* Prof. Dr. Paulo Isnard

## Instruções de utilização

Pré-requisito: **Node.js 22.13 ou superior** (o projeto usa o módulo nativo `node:sqlite`, sem necessidade de instalar um servidor de banco de dados).

```bash
git clone https://github.com/thetabelini/sige-autoparts.git
cd sige-autoparts/código-fonte
npm install
npm start          # http://localhost:3000
```

Na primeira execução o banco `código-fonte/data/sige.db` é criado a partir do script [`código-fonte/db/schema.sql`](código-fonte/db/schema.sql) e populado com dados de demonstração. Para recomeçar do zero, apague a pasta `código-fonte/data/`.

Para rodar os testes automatizados:

```bash
cd código-fonte
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

# Documentação

<ol>
<li><a href="documentação/1-Contexto.md"> Documentação de Contexto</a></li>
<li><a href="documentação/2-Especificação.md"> Especificação do Projeto</a></li>
<li><a href="documentação/3-Modelagem-Processos-Negócio.md"> Modelagem dos Processos de Negócio</a></li>
<li><a href="documentação/4-Projeto-Solucao.md"> Projeto da Solução</a></li>
<li><a href="documentação/5-Planejamento-Projeto.md"> Planejamento do Projeto</a></li>
<li><a href="documentação/Metodologia.md"> Metodologia</a></li>
<li><a href="documentação/6-Interface-Sistema.md"> Interface do Sistema (versão inicial do aplicativo)</a></li>
<li><a href="documentação/7-Indicadores.md"> Indicadores de Desempenho</a></li>
<li><a href="documentação/8-Conclusão.md"> Conclusão</a></li>
<li><a href="documentação/9-Referências.md"> Referências</a></li>
</ol>

**Entrega atual (4ª etapa — 27/11):** [Metodologia](documentação/Metodologia.md) e versão inicial do aplicativo, tag [`v0.1.0`](https://github.com/thetabelini/sige-autoparts/releases/tag/v0.1.0) (código em [`código-fonte`](código-fonte)).

Os documentos entregues em cada etapa (PDF/DOCX) estão em [`documentação/entregas`](documentação/entregas).

# Código

<li><a href="código-fonte/README.md"> Código Fonte</a></li>

# Apresentação

<li><a href="documentação/apresentação/README.md"> Apresentação da solução</a></li>

## Histórico de versões

* 0.1.1
    * CHANGE: Reorganização do repositório no template TI SIGE (pastas `código-fonte` e `documentação`) e inclusão da página de Metodologia. Código permaneceu inalterado, exceto pelo caminho do script SQL.
* 0.1.0 (4ª etapa — 27/11)
    * Versão inicial do aplicativo: base de dados única, API REST, autenticação por perfil, módulos de Estoque, Vendas e Transporte, fluxo integrado e painel gerencial.
* 0.0.1 (1ª a 3ª etapas)
    * Introdução, problemática, justificativa, objetivos, referencial teórico, protótipo de telas e especificação de requisitos.
