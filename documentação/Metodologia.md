# Metodologia

<span style="color:red">Pré-requisitos: <a href="1-Contexto.md"> Documentação de Contexto</a> e <a href="2-Especificação.md"> Especificação do Projeto</a></span>

> Seção 6 do [documento da 4ª etapa](entregas/SIGE_AutoParts_Etapa4.pdf). As referências a outras seções (ex.: "seção 7.3") seguem a numeração desse documento.

Esta seção descreve os procedimentos adotados para responder à pergunta de pesquisa e alcançar os objetivos definidos no [Contexto](1-Contexto.md#objetivos). São apresentados a caracterização da pesquisa, o método que orienta a construção do protótipo, as etapas e os procedimentos de trabalho, o processo de desenvolvimento do aplicativo, as tecnologias empregadas, a forma de versionamento do projeto, os critérios de avaliação e o cronograma de execução.

## 6.1. Caracterização da pesquisa

Quanto à natureza, a pesquisa é classificada como aplicada, pois busca gerar conhecimento voltado à solução de um problema prático e específico (PRODANOV; FREITAS, 2013): a falta de integração entre os controles de estoque, vendas e transporte em empresas do ramo de peças automotivas. O resultado esperado não é apenas a descrição do problema, mas a construção de uma solução que possa ser demonstrada e avaliada.

Quanto aos objetivos, a pesquisa é exploratória e descritiva. É exploratória porque procura proporcionar maior familiaridade com o problema, tornando-o mais explícito por meio do levantamento bibliográfico e da análise da situação-problema (GIL, 2017). É descritiva porque especifica as características da solução proposta, registrando os requisitos, o fluxo de informação entre os setores, o modelo de dados e a arquitetura do sistema.

Quanto à abordagem, a pesquisa é qualitativa. Conforme a delimitação apresentada no [Contexto](1-Contexto.md#problema), o trabalho não pretende medir estatisticamente ganhos financeiros de uma implantação real. A avaliação concentra-se em verificar se o protótipo atende aos requisitos especificados e se o fluxo integrado mantém a consistência das informações entre os módulos. Quanto aos procedimentos técnicos, o trabalho combina a pesquisa bibliográfica, que sustenta o referencial teórico, com o desenvolvimento de um artefato orientado pelo método Design Science Research, descrito na seção 6.2. O Quadro 1 sintetiza essa caracterização.

**Quadro 1 – Caracterização da pesquisa**

| **Critério**           | **Classificação**                                | **Aplicação no trabalho**                                                                                                |
|------------------------|--------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------|
| Natureza               | Aplicada                                         | Construção de uma solução para o problema de integração entre Estoque, Vendas e Transporte.                              |
| Objetivos              | Exploratória e descritiva                        | Exploração do problema por meio da literatura e descrição dos requisitos, do fluxo, do modelo de dados e da arquitetura. |
| Abordagem              | Qualitativa                                      | Avaliação do protótipo pelo atendimento aos requisitos e pela consistência do fluxo integrado, sem análise estatística.  |
| Procedimentos técnicos | Pesquisa bibliográfica e Design Science Research | Fundamentação teórica (seção 5) e projeto, construção, demonstração e avaliação do protótipo.                            |

Fonte: Elaborado pelos autores (2026), com base em Prodanov e Freitas (2013) e Gil (2017).

## 6.2. Método de pesquisa: Design Science Research

O Design Science Research (DSR) é um método voltado à concepção e à avaliação de artefatos criados para resolver problemas relevantes, sendo amplamente utilizado na área de Sistemas de Informação (HEVNER et al., 2004). Enquanto as ciências naturais buscam descrever e explicar fenômenos, o DSR tem caráter prescritivo e orienta a construção de soluções, exigindo que o artefato seja avaliado de forma rigorosa e que o conhecimento gerado seja comunicado (DRESCH; LACERDA; ANTUNES JÚNIOR, 2015).

No presente trabalho, o artefato é o próprio SIGE AutoParts, entendido como a instanciação, em software, dos conceitos de integração, do modelo de dados, do fluxo entre os módulos e das regras de negócio definidas nas seções anteriores. Para organizar o trabalho, adota-se o processo proposto por Peffers et al. (2007), composto por seis atividades: identificação do problema e motivação; definição dos objetivos da solução; projeto e desenvolvimento; demonstração; avaliação; e comunicação. O processo é iterativo, ou seja, os resultados da avaliação podem levar ao retorno às atividades de projeto e desenvolvimento para ajustes no artefato.

## 6.3. Etapas e procedimentos metodológicos

As atividades do DSR foram relacionadas às etapas do cronograma da disciplina, de modo que cada entrega parcial corresponde a uma parte do ciclo de construção do artefato. O Quadro 2 apresenta essa correspondência, os procedimentos executados e os resultados de cada atividade.

**Quadro 2 – Etapas metodológicas do trabalho**

| **Atividade (DSR)**                       | **Procedimentos**                                                                                                                                   | **Resultados**                                                                 | **Etapa** |
|-------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------|-----------|
| 1\. Identificação do problema e motivação | Pesquisa bibliográfica sobre SIGE/ERP, gestão da informação e cadeia de suprimentos; análise da situação-problema em empresas de peças automotivas. | Introdução, problemática, pergunta de pesquisa e justificativa (seções 1 a 3). | 1ª e 2ª   |
| 2\. Definição dos objetivos da solução    | Delimitação do escopo; definição dos objetivos; levantamento e especificação dos requisitos funcionais e não funcionais, com código e prioridade.   | Objetivos (seção 4) e requisitos (seção 8).                                    | 2ª e 3ª   |
| 3\. Projeto e desenvolvimento             | Modelagem conceitual e lógica dos dados; definição da arquitetura em camadas; prototipação das telas; implementação incremental do aplicativo.      | Esboço do protótipo (seção 7) e versão inicial do aplicativo (seção 9).        | 3ª e 4ª   |
| 4\. Demonstração                          | Execução de um cenário de uso completo: registro do pedido, verificação do estoque, baixa, expedição e conclusão da entrega.                        | Telas da versão inicial e dados de demonstração no repositório.                | 4ª e 5ª   |
| 5\. Avaliação                             | Testes automatizados das regras de integração; verificação da rastreabilidade dos requisitos; revisão pelo orientador; avaliação de usabilidade.    | Matriz de situação dos requisitos e resultados dos testes (seção 9).           | 4ª e 5ª   |
| 6\. Comunicação                           | Redação do trabalho no padrão PUC Minas; publicação do código no GitHub; apresentação na Mostra Tecnológica.                                        | Documento final, repositório e demonstração do aplicativo.                     | 5ª        |

Fonte: Elaborado pelos autores (2026).

Na identificação do problema, a pesquisa bibliográfica concentrou-se em livros e artigos sobre sistemas integrados, gestão e fluxo da informação, engenharia de requisitos, modelagem de dados, arquitetura de software e indicadores de desempenho, complementados por material orientativo do Sebrae sobre o comércio de peças automotivas. Esse levantamento sustentou a definição do problema e a delimitação do escopo do protótipo.

Os requisitos foram levantados a partir da problemática, dos objetivos específicos e da análise de cenários de uso dos três setores, técnica em que as interações entre usuários e sistema são descritas para revelar necessidades (SOMMERVILLE, 2011). Cada requisito recebeu um código (RF ou RNF), o módulo ou categoria correspondente e uma prioridade, o que permite acompanhar sua implementação ao longo das versões do aplicativo.

Na atividade de projeto, os requisitos foram abstraídos em um modelo conceitual e, em seguida, em um modelo lógico de dados, com a definição de entidades, atributos, relacionamentos e restrições de integridade (ELMASRI; NAVATHE, 2011). A arquitetura foi definida em camadas de apresentação, serviços e persistência (BASS; CLEMENTS; KAZMAN, 2021), e as telas foram inicialmente representadas em um protótipo navegável. Adotou-se a prototipação evolutiva, na qual o protótipo não é descartado, mas refinado progressivamente até se tornar o sistema (PRESSMAN, 2011).

## 6.4. Processo de desenvolvimento do aplicativo

O desenvolvimento segue o modelo iterativo e incremental, no qual o sistema é construído em versões sucessivas, cada uma acrescentando funcionalidades à anterior e permitindo a obtenção de retorno ao longo do projeto (SOMMERVILLE, 2011). De forma complementar, foram adaptadas práticas do Scrum ao contexto acadêmico (SCHWABER; SUTHERLAND, 2020): os requisitos RF01 a RF18 compõem o backlog do produto, ordenado pela prioridade definida na especificação; cada intervalo entre entregas do cronograma funciona como um ciclo de desenvolvimento; reuniões do grupo são utilizadas para planejar e acompanhar as tarefas; e as revisões do orientador ao final de cada etapa funcionam como revisão do incremento, cujos ajustes são incorporados no ciclo seguinte.

Foram planejados três incrementos. O primeiro, entregue na 3ª etapa, consistiu no protótipo navegável das telas, apresentado na seção 7. O segundo, correspondente a esta etapa, é a versão inicial funcional, com base de dados, API, autenticação por perfil, módulos de Estoque, Vendas e Transporte e o fluxo integrado entre eles. Nesse incremento foram priorizados os requisitos de prioridade alta, sobretudo os de integração (RF08, RF09, RF12, RF15 e RF16), por representarem o núcleo da pergunta de pesquisa. O terceiro incremento, previsto para a 5ª etapa, contemplará os requisitos restantes, os refinamentos de interface e a avaliação com usuários.

## 6.5. Tecnologias e ferramentas

A escolha das tecnologias considerou três critérios: aderência à arquitetura em camadas, ausência de custos de licenciamento, coerente com a justificativa voltada a empresas com recursos limitados, e facilidade de execução do protótipo em ambiente acadêmico. O Quadro 3 apresenta as tecnologias e ferramentas utilizadas.

**Quadro 3 – Tecnologias e ferramentas utilizadas**

| **Camada / finalidade** | **Tecnologia**                               | **Uso no projeto**                                                                                     |
|-------------------------|----------------------------------------------|--------------------------------------------------------------------------------------------------------|
| Apresentação            | HTML5, CSS3 e JavaScript                     | Interface web responsiva, acessada por computador ou celular (RNF06), executada no navegador (RNF07).  |
| Serviços                | Node.js 22 e Express 4                       | API REST que recebe as operações, aplica as regras de negócio e controla o acesso por perfil.          |
| Persistência            | SQLite                                       | Base de dados única compartilhada pelos módulos, com chaves estrangeiras e transações (RNF03 e RNF04). |
| Segurança               | Algoritmo scrypt (módulo crypto do Node.js)  | Armazenamento das senhas com hash e salt (RNF02).                                                      |
| Testes                  | node:test                                    | Testes automatizados das regras de integração e de acesso.                                             |
| Versionamento           | Git e GitHub                                 | Controle de versões do código e dos documentos e publicação do repositório.                            |
| Documentação            | Editor de textos e ferramenta de diagramação | Redação do trabalho e elaboração das figuras e quadros.                                                |

Fonte: Elaborado pelos autores (2026).

O SQLite foi escolhido por armazenar toda a base em um único arquivo, sem exigir a instalação de um servidor de banco de dados, o que simplifica a execução do protótipo. Como o acesso aos dados está isolado na camada de persistência, a base pode ser migrada futuramente para um sistema gerenciador cliente-servidor, como o PostgreSQL, sem alterações na camada de apresentação.

## 6.6. Versionamento e repositório do projeto

O projeto utiliza o Git, sistema de controle de versões distribuído que registra o histórico de alterações e permite que vários integrantes trabalhem sobre o mesmo código (CHACON; STRAUB, 2014). O repositório é hospedado no GitHub e reúne o código-fonte do aplicativo, os testes automatizados e os documentos de cada etapa do trabalho. O repositório está disponível no endereço:

**Repositório:** https://github.com/thetabelini/sige-autoparts

O repositório segue o template TI SIGE: a pasta `código-fonte` reúne o aplicativo (`src` — camadas de serviços e persistência; `public` — camada de apresentação; `tests` — testes automatizados; `db` — script SQL) e a pasta `documentação` reúne a documentação do projeto, as imagens e os documentos entregues em cada etapa. O arquivo README descreve o projeto, as instruções de execução, os usuários de demonstração e a situação de cada requisito. As alterações são registradas em commits com mensagens descritivas, e cada entrega é marcada por uma tag de versão: a versão v0.1.0 corresponde à versão inicial apresentada nesta etapa, e a versão v1.0.0 corresponderá à versão final.

## 6.7. Avaliação e validação do protótipo

No DSR, a avaliação verifica se o artefato cumpre o propósito para o qual foi construído (HEVNER et al., 2004). Neste trabalho, a avaliação é realizada de quatro formas complementares. A primeira são os testes automatizados, que verificam as regras de negócio que sustentam a integração, como o cálculo do total do pedido, a baixa automática do estoque, o bloqueio de pedidos acima do saldo sem alteração parcial dos dados, a geração da ordem de entrega e o retorno do status para Vendas.

A segunda forma é a demonstração por cenário de uso, na qual o fluxo descrito na seção 7.3 é executado no aplicativo com dados de demonstração, utilizando os perfis de vendas, estoque e logística. A terceira é a verificação da rastreabilidade dos requisitos, que relaciona cada requisito à funcionalidade implementada e à evidência correspondente, indicando se está implementado, parcial ou previsto. A quarta, prevista para a versão final, é a avaliação de usabilidade com potenciais usuários, por meio de tarefas guiadas e de um questionário padronizado, como a System Usability Scale (BROOKE, 1996). Os indicadores propostos na seção 5.7 são calculados pelo painel gerencial a partir dos registros do sistema, permitindo observar se a integração gera informações úteis ao gestor. O Quadro 4 relaciona os critérios de avaliação às formas de verificação.

**Quadro 4 – Critérios de avaliação do protótipo**

| **Critério**                 | **Forma de verificação**                                                                                               | **Requisitos**          |
|------------------------------|------------------------------------------------------------------------------------------------------------------------|-------------------------|
| Integração dos dados         | A confirmação de um pedido atualiza o estoque e gera a entrega sem redigitação; testes automatizados e cenário de uso. | RF12, RF15, RF16, RNF03 |
| Consistência                 | Um pedido com saldo insuficiente é bloqueado e nenhum dado é alterado parcialmente; teste automatizado.                | RF08, RF09, RNF04       |
| Controle de acesso           | Cada perfil acessa apenas as funções permitidas; senhas armazenadas com hash; testes e acesso pelos quatro perfis.     | RF17, RNF01, RNF02      |
| Rastreabilidade              | Cada entrada ou saída registra data, quantidade, tipo, motivo e usuário; consulta das movimentações.                   | RF03, RNF09             |
| Apoio à decisão              | O painel apresenta indicadores calculados a partir dos registros dos três módulos.                                     | RF05, RF18              |
| Usabilidade e responsividade | Navegação em computador e celular; tarefas guiadas e questionário com usuários na versão final.                        | RNF05, RNF06            |

Fonte: Elaborado pelos autores (2026).

## 6.8. Cronograma de execução

O trabalho é desenvolvido de acordo com o cronograma de atividades da disciplina, apresentado no Quadro 5, que relaciona cada etapa às entregas correspondentes.

**Quadro 5 – Cronograma de execução do trabalho**

| **Etapa** | **Data** | **Entregas**                                                                                                | **Situação** |
|-----------|----------|-------------------------------------------------------------------------------------------------------------|--------------|
| 1ª        | 28/08    | Tema, título e introdução revisada pelo orientador; repositório GitHub.                                     | Concluída    |
| 2ª        | 25/09    | Introdução, problemática, justificativa e objetivos; esboço do protótipo.                                   | Concluída    |
| 3ª        | 30/10    | Referencial teórico; protótipo do aplicativo e requisitos.                                                  | Concluída    |
| 4ª        | 27/11    | Metodologia; versão inicial do aplicativo; repositório atualizado.                                          | Esta entrega |
| 5ª        | 11/12    | Versão final do aplicativo; Mostra Tecnológica; apresentação final e trabalho completo no padrão PUC Minas. | Prevista     |

Fonte: Elaborado pelos autores (2026), com base no cronograma da disciplina.
