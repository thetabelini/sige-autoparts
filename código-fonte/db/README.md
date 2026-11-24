## Arquivo .sql

[`schema.sql`](schema.sql) contém o script de criação das oito tabelas da base de dados única do SIGE AutoParts (usuarios, fornecedores, pecas, movimentacoes, clientes, pedidos, itens_pedido e entregas), compartilhada pelos módulos de Estoque, Vendas e Transporte (RNF03).

O script é executado automaticamente pela aplicação na inicialização (`src/database/db.js`), usando `CREATE TABLE IF NOT EXISTS`, e pode ser aberto em qualquer cliente SQLite.
