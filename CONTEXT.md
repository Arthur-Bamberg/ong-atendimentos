# Atendimentos da ONG

App local, neste aparelho, em que a equipe anota Atendimentos classificados por Atividade e vê recortes desses Atendimentos. Não há cadastro de pessoa nem base compartilhada entre aparelhos.

## Language

**Atendimento**:
O registro de um encontro naquela Atividade, com um instantâneo dos dados preenchidos na hora. Cada salvamento é um Atendimento novo, inclusive quando a mesma pessoa volta ou quando não há nome nem CPF.
_Avoid_: cadastro, ficha da pessoa, visita, ticket, atendido (como sinônimo do registro)

**Atendimento anônimo**:
Atendimento sem nome e sem CPF. Continua sendo um Atendimento e entra no total.
_Avoid_: registro inválido, rascunho, pessoa não cadastrada (como se o encontro não existisse)

**Atividade**:
O tipo de trabalho da ONG ao qual o Atendimento pertence. Tem identidade própria (CRUD). O Operador escolhe uma Atividade vigente neste aparelho até trocá-la.
_Avoid_: trabalho, serviço, categoria, tipo, projeto, campanha

**Operador**:
Quem usa o aplicativo neste aparelho.
_Avoid_: usuário, voluntário (como nome do papel no sistema), atendente

**Pessoa atendida**:
Não é um cadastro neste contexto. Nome e CPF, quando existem, são só atributos opcionais do Atendimento.
_Avoid_: beneficiário, assistido, cliente, usuário, paciente, cadastro

**Indicador**:
Dado do Atendimento que entra em gráfico ou no total. Nome e CPF nunca são Indicador.
_Avoid_: métrica de pessoas, alcance, atendidos (como se fosse unicidade)

**Base local**:
O conjunto de Atividades e Atendimentos guardados neste aparelho. É a única base do MVP.
_Avoid_: base da ONG, servidor, nuvem, sincronização
