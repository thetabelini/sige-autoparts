## 8. Conclusão

<span style="color:red">Pré-requisitos: <a href="6-Interface-Sistema.md"> Interface do Sistema</a></span>

> Seção parcial, referente à versão inicial (v0.1.0, 4ª etapa). A conclusão final será redigida após a versão final e a avaliação com usuários (5ª etapa).

A versão inicial do SIGE AutoParts demonstra que é possível fazer com que **uma mesma informação — o pedido de venda — seja utilizada automaticamente pelos setores de Estoque, Vendas e Transporte**, a partir de uma base de dados única. A confirmação de um pedido verifica o saldo, realiza a baixa no estoque, registra a movimentação com o usuário responsável e gera a ordem de entrega em uma única transação; a situação da entrega volta ao pedido sem redigitação. Com isso, os principais gargalos do processo atual — retrabalho, divergência entre estoque registrado e real e perda de informação sobre as entregas — são tratados pelo próprio fluxo do sistema.

Dos dezoito requisitos funcionais, **dezesseis foram implementados**, um parcialmente (RF02 — fornecedores) e um está previsto para a versão final (RF13 — rotas). Os oito testes automatizados das regras de integração e de acesso foram aprovados em 20/11/2026, e o cenário de uso completo foi executado com os perfis de vendas e logística.

**Limitações:** o trabalho é um protótipo e não mede ganhos financeiros de uma implantação real; não contempla emissão de nota fiscal, contas a receber, compras ou roteirização automática; a base SQLite atende ao ambiente acadêmico, mas um uso com vários usuários simultâneos exigiria migração para um SGBD cliente-servidor; e a usabilidade ainda não foi avaliada com usuários reais.

**Próximos passos e trabalhos futuros:** concluir o cadastro de fornecedores (RF02) e de rotas (RF13); permitir a exportação de relatórios; avaliar a usabilidade com potenciais usuários (System Usability Scale); confirmar a compatibilidade com o Microsoft Edge; e, como linhas futuras, integrar o módulo de compras com reposição automática a partir do estoque mínimo e aplicar o protótipo em uma empresa real para medir o efeito nos indicadores.
