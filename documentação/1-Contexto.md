# Introdução

A crescente competitividade do mercado exige que as organizações adotem soluções tecnológicas capazes de integrar processos, reduzir custos operacionais e apoiar a tomada de decisões. Os Sistemas Integrados de Gestão Empresarial (SIGE), também conhecidos como *Enterprise Resource Planning* (ERP), centralizam as informações de diferentes setores em uma única plataforma, promovendo eficiência, confiabilidade dos dados e agilidade nos processos (DAVENPORT, 1998; LAUDON; LAUDON, 2020). A adoção desse tipo de sistema envolve também a revisão dos processos de negócio e da forma como a informação circula entre as áreas (O'LEARY, 2000).

No segmento de peças automotivas, a diversidade de produtos e sua aplicação em diferentes veículos exigem atenção especial à identificação dos itens e à atualização dos saldos. O Sebrae destaca a necessidade de organizar as peças, monitorar os níveis de estoque e acompanhar as vendas para evitar faltas e excessos (SEBRAE, s. d.). A integração entre os processos da cadeia de suprimentos proporciona redução de custos e melhoria do nível de serviço (CHOPRA; MEINDL, 2016).

Este Trabalho Interdisciplinar delimita-se à concepção e ao desenvolvimento de um **protótipo** — e não à implantação de um pacote comercial — que integra três áreas da organização: **Estoque** (entrada, saída e disponibilidade dos produtos), **Vendas** (clientes, pedidos e acompanhamento das vendas) e **Transporte** (entregas e acompanhamento logístico). O título do trabalho é *"SIGE AutoParts: protótipo de um Sistema Integrado de Gestão Empresarial para empresas do ramo de peças automotivas"*.

## Problema

O mercado de reposição de peças automotivas possui grande variedade de produtos, diferentes fornecedores e forte necessidade de atender aos pedidos dentro do prazo. Em empresas de pequeno e médio porte é comum que:

- o **estoque** seja registrado em planilhas ou em sistemas antigos sem integração com outras ferramentas;
- os **pedidos** sejam registrados em outro sistema, em anotações ou em aplicativos de mensagens;
- o **acompanhamento das entregas** dependa do contato direto com o motorista por telefone ou mensagem.

Essa falta de integração gera diferenças entre o estoque registrado e a quantidade realmente disponível (o vendedor pode oferecer uma peça que já foi vendida), retrabalho pela necessidade de registrar a mesma informação em diferentes controles — aumentando a chance de erros de digitação — e dificuldade de saber a situação de uma entrega sem consultar outras pessoas.

O problema, portanto, não está na falta de dados, mas na maneira como as informações são registradas, armazenadas e compartilhadas entre os setores (ISNARD; VIEGAS, 2009; GOMES et al., 2015).

**Pergunta de pesquisa:** de que forma um protótipo de Sistema Integrado de Gestão Empresarial, capaz de integrar os processos de estoque, vendas e transporte em uma única base de dados, pode contribuir para melhorar a confiabilidade das informações e a eficiência operacional de uma empresa do ramo de peças automotivas?

## Objetivos

**Objetivo geral:** desenvolver um protótipo de Sistema Integrado de Gestão Empresarial (SIGE), acessível por meio de aplicativo, que integre os processos de estoque, vendas e transporte de uma empresa do ramo de peças automotivas em uma única base de dados, buscando aumentar a confiabilidade das informações, reduzir o retrabalho entre os setores e apoiar a tomada de decisão gerencial.

**Objetivos específicos:**

- Levantar os requisitos funcionais e não funcionais dos processos de estoque, vendas e transporte de uma empresa do ramo de peças automotivas;
- Mapear o fluxo de informação previsto entre esses três setores, identificando possíveis pontos de retrabalho, de duplicidade e de perda de informação;
- Modelar a base de dados única que sustentará a integração entre os módulos, abstraindo os requisitos levantados em um modelo lógico de dados;
- Definir a arquitetura da solução, especificando suas camadas, seus componentes e a forma de comunicação entre eles;
- Prototipar as interfaces, contemplando as telas de painel gerencial, estoque, vendas e acompanhamento de entregas;
- Representar e verificar o fluxo integrado por meio de um cenário de uso, acompanhando a sequência entre registro do pedido, conferência do estoque e geração da ordem de entrega;
- Propor indicadores de acompanhamento que permitam ao gestor avaliar o desempenho dos processos integrados.

## Justificativa

- **Importância econômica do setor:** no comércio de peças automotivas, a falta de uma peça pode resultar na perda da venda para um concorrente, enquanto o excesso representa dinheiro parado em itens de pouca movimentação (SEBRAE, s. d.). A integração entre vendas, estoque e transporte pode reduzir custos operacionais e melhorar o atendimento (CHOPRA; MEINDL, 2016).
- **Gestão da informação:** as organizações produzem muitos dados que nem sempre são usados de forma adequada, por dificuldade de acesso ou pela forma como são apresentados (ISNARD; VIEGAS, 2009). Reunir em uma única base informações hoje dispersas permite ao gestor consultar itens críticos, pedidos realizados e entregas pendentes como apoio à decisão.
- **Acesso à tecnologia:** sistemas integrados de maior porte envolvem custos de licenciamento, infraestrutura e consultoria nem sempre compatíveis com pequenas empresas, que continuam usando planilhas e controles manuais. Um protótipo mais simples, sem custo de licença e acessível por dispositivos móveis, demonstra uma possibilidade de aplicação para empresas com recursos limitados.
- **Relevância acadêmica e interdisciplinar:** o trabalho relaciona tecnologia da informação e melhoria de processos (FERREIRA et al., 2018) e aplica conhecimentos de levantamento de requisitos, modelagem de dados, arquitetura de software, prototipação de interfaces e gestão de processos.

## Público-Alvo

O público-alvo são **micro, pequenas e médias empresas do comércio de peças automotivas** (lojas de autopeças e distribuidoras) que ainda controlam suas operações com planilhas, anotações e aplicativos de mensagens. Dentro dessas empresas, o sistema atende a quatro perfis de usuário:

| Perfil | Quem é | Relação com a tecnologia | O que espera do sistema |
|---|---|---|---|
| Gestor / proprietário (Administrador) | Responsável pelas decisões da loja; acompanha faturamento, estoque e entregas | Usa computador e celular no dia a dia; pouco tempo para consultar várias planilhas | Visão consolidada da operação em um painel |
| Estoquista (Estoque) | Recebe mercadorias, organiza prateleiras e confere saldos | Familiaridade básica com planilhas | Registrar entradas e saídas rapidamente e saber o que está acabando |
| Vendedor (Vendas) | Atende clientes no balcão, por telefone ou mensagem | Usa sistemas de vendas e aplicativos de mensagens | Saber na hora se a peça está disponível e acompanhar a entrega sem ligar para ninguém |
| Responsável pela logística (Logística) | Organiza as entregas e acompanha motoristas | Usa principalmente o celular | Ver as entregas a fazer e registrar saída e conclusão |

Em termos hierárquicos, o gestor supervisiona os demais perfis; estoque, vendas e logística trabalham de forma interdependente, já que a informação gerada por um setor é utilizada pelos outros.
