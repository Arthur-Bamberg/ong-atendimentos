# 02: Atividade vigente, Atendimento mínimo e listagem

**What to build:** o Operador escolhe a Atividade vigente neste aparelho, grava um Atendimento só com ela (anônimo) e confere na lista o que acabou de entrar, do mais recente criado primeiro. Sem Atividade vigente o save recusa. A escolha gruda depois de salvar, ao ir à lista e ao reabrir o app. Tocar a linha abre um detalhe só leitura.

**Blocked by:** 01: App neste aparelho com Base local, Atividades semente e fachada de login

**Status:** ready-for-agent

- [ ] O Operador escolhe a Atividade vigente neste aparelho e Atendimentos seguintes herdam essa escolha até ele trocá-la
- [ ] A Atividade vigente permanece depois de salvar, depois de abrir a lista e depois de reabrir o app
- [ ] O Operador troca a Atividade vigente antes do próximo save
- [ ] O formulário recusa save sem Atividade vigente — única obrigatoriedade neste ticket
- [ ] Dá para gravar Atendimento anônimo só com a Atividade vigente
- [ ] Cada save cria um Atendimento novo; dois saves seguidos são duas linhas
- [ ] A lista mostra Atendimentos do último criado primeiro, mesmo que a data do encontro (quando existir depois) esteja no passado
- [ ] Cada linha mostra data/hora, Atividade, e Nome ou “Sem identificação”
- [ ] A lista não tem busca nem filtro
- [ ] Lista vazia explica que ainda não há Atendimento e aponta o formulário
- [ ] Tocar a linha abre detalhe só leitura desse Atendimento; no MVP o detalhe não edita nem apaga
- [ ] A data visível na linha usa o instante da criação enquanto o formulário ainda não pede data do atendimento
- [ ] Navegação entre formulário, listagem e Atividades não perde a Atividade vigente
