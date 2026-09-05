# 04: Formulário único completo, detalhe e novo atendimento

**What to build:** um único formulário para toda Atividade, com todos os campos opcionais, informativo de que falta de identificação única distorce leitura como “pessoas”, detalhe só leitura do que foi gravado, e “Novo atendimento” em branco com a mesma Atividade vigente. Cada save é um Atendimento novo, inclusive com o mesmo CPF ou o mesmo nome.

**Blocked by:** 02: Atividade vigente, Atendimento mínimo e listagem

**Status:** ready-for-agent

- [ ] O formulário é o mesmo para qualquer Atividade; só a Atividade é marcada como obrigatória
- [ ] Nome e CPF são opcionais; Atendimento anônimo (sem os dois) grava só com a Atividade e o que mais houver
- [ ] Informativo visível no form: falta de identificação única e vários Atendimentos da mesma pessoa (com ou sem CPF) distorcem leitura como “pessoas”
- [ ] Campos opcionais e independentes: data de nascimento; raça/cor IBGE (branca, preta, parda, amarela, indígena); escolaridade fechada (sem instrução, fundamental incompleto, fundamental completo, médio incompleto, médio completo, superior incompleto, superior completo); faixa de renda (sem renda, até 1 salário mínimo, 1–2, 2–3, 3–5, mais de 5); cidade e bairro livres; situação de rua sim/não; uso de substâncias (não, álcool, outras drogas, ambos)
- [ ] Data do atendimento opcional, padrão hoje; vazia cai no instante do save para exibição
- [ ] Na lista, a data visível da linha prefere a data do atendimento quando preenchida; a ordem continua por criação, não por essa data
- [ ] CPF preenchido usa máscara 000.000.000-00, valida dígitos e bloqueia o save se inválido; CPF vazio continua válido
- [ ] CPF é guardado só com dígitos e reapresentado com máscara no form e no detalhe; pontuação diferente não cria outro valor
- [ ] Data de nascimento no futuro é recusada ou tratada como vazia para faixa etária
- [ ] Dois Atendimentos com o mesmo CPF (ou o mesmo Nome sem CPF) gravados em seguida são duas linhas, não um merge
- [ ] Depois do save, “Novo atendimento” abre form em branco com a mesma Atividade vigente e sem copiar Nome, CPF nem os demais campos
- [ ] O detalhe só leitura mostra os campos gravados; continua sem editar nem apagar Atendimento
