# 02: Atividade vigente, Atendimento mínimo e listagem

**What to build:** o Operador escolhe a Atividade vigente neste aparelho, grava um Atendimento só com ela (anônimo) e confere na lista o que acabou de entrar, do mais recente criado primeiro. Sem Atividade vigente o save recusa. A escolha gruda depois de salvar, ao ir à lista e ao reabrir o app. Tocar a linha abre um detalhe só leitura.

**Blocked by:** 01: App neste aparelho com Base local, Atividades semente e fachada de login

**Status:** claimed

- [x] O Operador escolhe a Atividade vigente neste aparelho e Atendimentos seguintes herdam essa escolha até ele trocá-la
- [x] A Atividade vigente permanece depois de salvar, depois de abrir a lista e depois de reabrir o app
- [x] O Operador troca a Atividade vigente antes do próximo save
- [x] O formulário recusa save sem Atividade vigente — única obrigatoriedade neste ticket
- [x] Dá para gravar Atendimento anônimo só com a Atividade vigente
- [x] Cada save cria um Atendimento novo; dois saves seguidos são duas linhas
- [x] A lista mostra Atendimentos do último criado primeiro, mesmo que a data do encontro (quando existir depois) esteja no passado
- [x] Cada linha mostra data/hora, Atividade, e Nome ou “Sem identificação”
- [x] A lista não tem busca nem filtro
- [x] Lista vazia explica que ainda não há Atendimento e aponta o formulário
- [x] Tocar a linha abre detalhe só leitura desse Atendimento; no MVP o detalhe não edita nem apaga
- [x] A data visível na linha usa o instante da criação enquanto o formulário ainda não pede data do atendimento
- [x] Navegação entre formulário, listagem e Atividades não perde a Atividade vigente

## Comments

Formulário mínimo com Atividade vigente neste aparelho, Atendimento anônimo só com ela, lista do último criado primeiro e detalhe só leitura. A escolha gruda no porto `RegistroLocal` (preferência do aparelho) depois de salvar, ao mudar de aba e ao reabrir.
