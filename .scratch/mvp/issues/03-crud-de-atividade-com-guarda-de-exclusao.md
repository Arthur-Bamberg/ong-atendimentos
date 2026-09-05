# 03: CRUD de Atividade com guarda de exclusão

**What to build:** o Operador cria, lista, renomeia e apaga Atividade neste aparelho. O nome novo aparece em todo Atendimento ligado. Apagar só vale quando não há Atendimento; se já houver, a exclusão é recusada com a mensagem de que mover entre Atividades vem depois. Se a vigente for apagada, o próximo save exige outra. “Outro” se comporta como qualquer Atividade.

**Blocked by:** 02: Atividade vigente, Atendimento mínimo e listagem

**Status:** claimed

- [x] O Operador cria uma Atividade pelo nome e ela passa a classificar Atendimentos
- [x] O Operador vê a lista de Atividades que pode escolher e editar
- [x] Renomear uma Atividade atualiza o rótulo em todo Atendimento ligado (lista e, quando existirem, Indicadores)
- [x] Depois de um rename, o seletor da Atividade vigente continua apontando para a mesma identidade, agora com o nome novo
- [x] Dá para apagar Atividade com zero Atendimentos
- [x] Apagar é recusado quando a Atividade já tem pelo menos um Atendimento
- [x] A recusa vem com mensagem clara de que é preciso esperar a feature de mover Atendimentos entre Atividades
- [x] Se a Atividade vigente (sem Atendimentos) for apagada, o Operador é forçado a escolher outra antes do próximo save
- [x] A Atividade semente “Outro” se comporta como qualquer outra: não é um balde especial; nomes mais específicos vêm deste CRUD

## Comments

CRUD no porto `RegistroLocal` (criar/renomear/apagar) com guarda de exclusão: apagar só vale com zero Atendimentos; a recusa avisa que mover entre Atividades vem depois. Rename muda o nome da entidade — lista e seletor vigente leem pela identidade. “Outro” não tem tratamento especial. Indicadores por Atividade ficam para o ticket 05; o rótulo já segue o cadastro auxiliar.
