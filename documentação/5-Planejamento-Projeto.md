# 5. Planejamento do Projeto

O desenvolvimento segue o modelo **iterativo e incremental** (SOMMERVILLE, 2011), com práticas do Scrum adaptadas ao contexto acadêmico (SCHWABER; SUTHERLAND, 2020): os requisitos RF01 a RF18 compõem o *backlog* do produto, ordenado pela prioridade definida na [especificação](2-Especificação.md); cada intervalo entre entregas do cronograma funciona como uma *sprint*; reuniões do grupo planejam e acompanham as tarefas; e a revisão do orientador ao final de cada etapa funciona como revisão do incremento, cujos ajustes são incorporados na *sprint* seguinte.

Foram planejados três incrementos: (1) protótipo navegável das telas (3ª etapa); (2) versão inicial funcional, com base de dados, API, autenticação por perfil, módulos e fluxo integrado (4ª etapa), priorizando os requisitos de integração RF08, RF09, RF12, RF15 e RF16; e (3) versão final, com os requisitos restantes, refinamentos de interface e avaliação com usuários (5ª etapa).

## 5.1. Divisão de Papéis

> Preencher com os papéis assumidos por cada integrante em cada sprint.

### Sprint 1 (1ª e 2ª etapas — até 25/09)
- _Scrum master_: 
- Documentação (introdução, problemática, justificativa, objetivos): 
- Esboço do protótipo: 

### Sprint 2 (3ª etapa — até 30/10)
- _Scrum master_: 
- Referencial teórico: 
- Protótipo de telas: 
- Requisitos: 

### Sprint 3 (4ª etapa — até 27/11)
- _Scrum master_: 
- Desenvolvedor _front-end_: 
- Desenvolvedor _back-end_ / banco de dados: 
- Testes: 
- Documentação (metodologia): 

### Sprint 4 (5ª etapa — até 11/12)
- _Scrum master_: 
- Desenvolvimento (RF02, RF13, relatórios): 
- Avaliação de usabilidade: 
- Apresentação e Mostra Tecnológica: 

## 5.2. Quadro de tarefas

Atualizado em: 24/11/2026

### Cronograma das etapas

| Etapa | Data | Entregas | Status |
| :---- | :----: | :---- | :----: |
| 1ª | 28/08 | Tema, título e introdução revisada pelo orientador; repositório GitHub | ✔️ |
| 2ª | 25/09 | Introdução, problemática, justificativa e objetivos; esboço do protótipo | ✔️ |
| 3ª | 30/10 | Referencial teórico; protótipo do aplicativo e requisitos | ✔️ |
| 4ª | 27/11 | Metodologia; versão inicial do aplicativo (v0.1.0); repositório atualizado | 📝 |
| 5ª | 11/12 | Versão final do aplicativo (v1.0.0); Mostra Tecnológica; apresentação final e trabalho completo no padrão PUC Minas | ❌ |

### Sprint 3 — versão inicial do aplicativo

| Responsável   | Tarefa/Requisito | Iniciado em    | Prazo      | Status | Terminado em    |
| :----         |    :----         |      :----:    | :----:     | :----: | :----:          |
|               | Base de dados única (RNF03) e script SQL | | 27/11/2026 | ✔️ | |
|               | Autenticação e perfis de acesso (RF17, RNF01, RNF02) | | 27/11/2026 | ✔️ | |
|               | Módulo Estoque (RF01, RF03, RF04, RF05, RNF09) | | 27/11/2026 | ✔️ | |
|               | Módulo Vendas (RF06 a RF11) | | 27/11/2026 | ✔️ | |
|               | Módulo Transporte (RF12, RF14) | | 27/11/2026 | ✔️ | |
|               | Integração Vendas → Estoque → Transporte (RF15, RF16, RNF04) | | 27/11/2026 | ✔️ | |
|               | Painel gerencial (RF18) | | 27/11/2026 | ✔️ | |
|               | Testes automatizados (8 testes aprovados em 20/11/2026) | | 27/11/2026 | ✔️ | 20/11/2026 |
|               | Documento da Etapa 4 (metodologia e versão inicial) | | 27/11/2026 | ✔️ | |

### Sprint 4 — versão final

| Responsável   | Tarefa/Requisito | Iniciado em    | Prazo      | Status | Terminado em    |
| :----         |    :----         |      :----:    | :----:     | :----: | :----:          |
|               | Tela de cadastro de fornecedores (RF02) | | 11/12/2026 | ❌ | |
|               | Cadastro e consulta de rotas de entrega (RF13) | | 11/12/2026 | ❌ | |
|               | Exportação de relatórios de estoque, pedidos e entregas | | 11/12/2026 | ❌ | |
|               | Avaliação de usabilidade com usuários — SUS (RNF05) | | 11/12/2026 | ❌ | |
|               | Confirmação de compatibilidade com Microsoft Edge (RNF07) | | 11/12/2026 | ❌ | |
|               | Ambiente de demonstração para a Mostra Tecnológica | | 11/12/2026 | ❌ | |
|               | Diagramas BPMN AS-IS e TO-BE | | 11/12/2026 | ❌ | |
|               | Apresentação final | | 11/12/2026 | ❌ | |

Legenda:
- ✔️: terminado
- 📝: em execução
- ⌛: atrasado
- ❌: não iniciado
