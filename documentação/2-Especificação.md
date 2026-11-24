# Especificações do Projeto

<span style="color:red">Pré-requisitos: <a href="1-Contexto.md"> Documentação de Contexto</a></span>

Esta seção define o problema e a ideia de solução a partir da perspectiva do usuário. Os requisitos foram levantados a partir da problemática, dos objetivos específicos e da análise de cenários de uso dos três setores — técnica em que as interações entre usuários e sistema são descritas para revelar necessidades (SOMMERVILLE, 2011). Cada requisito recebeu um código (RF ou RNF), o módulo ou categoria correspondente e uma prioridade, o que permite acompanhar sua implementação ao longo das versões do aplicativo.

## Personas

**Marcos — gestor de uma loja de autopeças (perfil Administrador).** Tem 45 anos e é dono de uma loja de autopeças com cerca de dez funcionários. Hoje precisa abrir planilhas de estoque, conversar com o balcão e ligar para o motorista para saber como está o dia. Quer uma visão única de quanto vendeu, quais peças estão acabando e quais entregas estão atrasadas, inclusive pelo celular.

**Juliana — estoquista (perfil Estoque).** Tem 29 anos e cuida do recebimento das mercadorias e da organização do depósito. Registra entradas em uma planilha e frequentemente encontra diferenças entre o saldo anotado e o que está na prateleira, porque as vendas não são baixadas no mesmo momento. Precisa registrar entradas e saídas com rapidez e saber quem fez cada movimentação.

**Rafael — vendedor de balcão (perfil Vendas).** Tem 34 anos e atende clientes no balcão, por telefone e por aplicativo de mensagens, muitos deles oficinas mecânicas. Já perdeu vendas e passou por constrangimentos ao confirmar peças que não estavam mais disponíveis. Quer consultar o saldo na hora do pedido e informar ao cliente a situação da entrega sem depender de outras pessoas.

**Carla — responsável pela logística (perfil Logística).** Tem 38 anos e organiza as entregas da loja, acompanhando os motoristas pelo celular. Recebe os pedidos a entregar por mensagem e precisa avisar o vendedor quando cada entrega sai e é concluída. Quer uma lista única de entregas e um registro simples de saída e comprovação.

## Histórias de Usuários

|EU COMO... `PERSONA`| QUERO/PRECISO ... `FUNCIONALIDADE` |PARA ... `MOTIVO/VALOR`                 |
|--------------------|------------------------------------|----------------------------------------|
| Estoquista | Cadastrar, editar e excluir peças com código, descrição, aplicação e estoque mínimo | Manter o catálogo de peças atualizado |
| Estoquista | Registrar entradas e saídas de peças com motivo | Manter o saldo correto e saber quem fez cada movimentação |
| Estoquista | Ver quais peças estão abaixo do estoque mínimo ou zeradas | Solicitar reposição a tempo |
| Estoquista | Consultar os fornecedores de cada peça | Saber com quem fazer a reposição |
| Vendedor | Buscar peças por código, descrição ou veículo | Encontrar rapidamente a peça que o cliente pede |
| Vendedor | Cadastrar e atualizar clientes | Não precisar redigitar dados a cada pedido |
| Vendedor | Registrar um pedido e ver o saldo de cada item e o total calculado | Não prometer peças indisponíveis nem errar o valor |
| Vendedor | Ser impedido de confirmar pedidos acima do saldo | Evitar vender o que não há em estoque |
| Vendedor | Acompanhar a situação do pedido e da entrega | Informar o cliente sem ligar para a logística |
| Responsável pela logística | Receber automaticamente a ordem de entrega de um pedido confirmado | Não depender de mensagens do vendedor |
| Responsável pela logística | Registrar a saída da entrega com o motorista e a conclusão com comprovação | Manter o andamento visível para Vendas |
| Responsável pela logística | Cadastrar e consultar rotas de entrega | Organizar as entregas por região |
| Gestor | Consultar um painel com indicadores de estoque, vendas e entregas | Tomar decisões com base em dados confiáveis |
| Gestor | Restringir o que cada funcionário pode acessar | Proteger os dados e manter a integridade dos registros |

## Requisitos

Para a priorização foi utilizada uma escala de três níveis (Alta, Média e Baixa). Receberam prioridade **Alta** os requisitos indispensáveis ao fluxo integrado Vendas → Estoque → Transporte, que representam o núcleo da pergunta de pesquisa, e os requisitos de segurança e integridade dos dados; receberam prioridade **Média** os requisitos que complementam a operação ou o apoio à gestão, mas cuja ausência não impede o fluxo integrado.

### Requisitos Funcionais

|ID    | Módulo | Descrição do Requisito  | Prioridade |
|------|--------|-----------------------------------------|----|
|RF-001| Estoque    | Permitir cadastrar, consultar, editar e excluir peças automotivas. | ALTA |
|RF-002| Estoque    | Permitir cadastrar e consultar fornecedores. | MÉDIA |
|RF-003| Estoque    | Permitir registrar entradas e saídas de peças, atualizando as quantidades disponíveis. | ALTA |
|RF-004| Estoque    | Permitir consultar peças por código, descrição ou aplicação automotiva. | MÉDIA |
|RF-005| Estoque    | Identificar peças com estoque mínimo ou zerado. | MÉDIA |
|RF-006| Vendas     | Permitir cadastrar, consultar e atualizar informações de clientes. | ALTA |
|RF-007| Vendas     | Permitir registrar e consultar pedidos de venda. | ALTA |
|RF-008| Vendas     | Verificar a disponibilidade das peças antes da confirmação de um pedido. | ALTA |
|RF-009| Vendas     | Impedir a confirmação de pedidos com quantidade superior ao saldo disponível em estoque. | ALTA |
|RF-010| Vendas     | Calcular automaticamente o valor total dos pedidos. | ALTA |
|RF-011| Vendas     | Permitir acompanhar a situação dos pedidos realizados. | ALTA |
|RF-012| Transporte | Gerar uma ordem de entrega após a confirmação de um pedido. | ALTA |
|RF-013| Transporte | Permitir cadastrar e consultar informações básicas das rotas de entrega. | MÉDIA |
|RF-014| Transporte | Permitir atualizar e consultar a situação das entregas, incluindo sua conclusão. | ALTA |
|RF-015| Integração | Atualizar automaticamente o estoque após a confirmação de uma venda. | ALTA |
|RF-016| Integração | Disponibilizar a situação das entregas para consulta no módulo de Vendas. | ALTA |
|RF-017| Acesso     | Autenticar usuários e restringir funcionalidades conforme seus perfis de acesso. | ALTA |
|RF-018| Gestão     | Apresentar um painel gerencial com informações de estoque, pedidos e entregas. | MÉDIA |

### Requisitos não Funcionais

|ID     | Categoria | Descrição do Requisito  |Prioridade |
|-------|-----------|-------------------------|----|
|RNF-001| Segurança        | Restringir o acesso às funcionalidades conforme o perfil do usuário autenticado. | ALTA |
|RNF-002| Segurança        | Armazenar as senhas dos usuários de forma protegida, utilizando hash seguro. | ALTA |
|RNF-003| Integridade      | Utilizar uma base de dados única e integrada para os módulos de Estoque, Vendas e Transporte. | ALTA |
|RNF-004| Integridade      | Preservar a consistência dos dados durante as operações integradas entre os módulos. | ALTA |
|RNF-005| Usabilidade      | Possuir uma interface intuitiva, com navegação organizada e mensagens claras ao usuário. | ALTA |
|RNF-006| Responsividade   | Permitir a utilização em computadores e dispositivos móveis, adaptando a interface ao tamanho da tela. | ALTA |
|RNF-007| Compatibilidade  | Funcionar nas versões atuais dos navegadores Google Chrome e Microsoft Edge. | MÉDIA |
|RNF-008| Manutenibilidade | Possuir uma arquitetura em camadas, separando interface, regras de negócio e acesso aos dados. | MÉDIA |
|RNF-009| Rastreabilidade  | Registrar a data, a quantidade, o tipo de movimentação e o usuário responsável por cada entrada ou saída de peças do estoque. | MÉDIA |

## Restrições

O projeto está restrito pelos itens apresentados na tabela a seguir.

|ID| Restrição                                             |
|--|-------------------------------------------------------|
|01| O projeto deverá ser entregue até a 5ª etapa da disciplina (11/12/2026), com apresentação na Mostra Tecnológica. |
|02| A solução é um protótipo acadêmico; não contempla a implantação de um ERP comercial nem a medição estatística de ganhos financeiros em uma implantação real. |
|03| O escopo limita-se aos processos de Estoque, Vendas e Transporte (não inclui financeiro, fiscal, compras ou emissão de nota fiscal). |
|04| Devem ser utilizadas apenas tecnologias sem custo de licenciamento, coerentes com o público de empresas com recursos limitados. |
|05| O sistema deve ser executável em ambiente acadêmico sem instalação de servidor de banco de dados dedicado. |
