# 05: Indicadores e gráficos neste aparelho

**What to build:** o Operador vê um dashboard com o total de Atendimentos neste aparelho (incluindo anônimos, nunca “atendidos”), os oito recortes, fatia “Não informado”, filtro por uma Atividade ou todas, e o mesmo informativo do form. Nome, CPF e bairro ficam fora dos gráficos. Sem filtro de período.

**Blocked by:** 04: Formulário único completo, detalhe e novo atendimento

**Status:** resolved

- [x] O número grande é o total de Atendimentos neste aparelho, incluindo anônimos, rotulado Atendimentos — nunca “atendidos”
- [x] O mesmo informativo do form aparece nos gráficos (anônimo e reincidência não são pessoas distintas)
- [x] Há recortes de Atendimentos por: Atividade, raça/cor, escolaridade, faixa de renda, faixa etária (0–11, 12–17, 18–29, 30–59, 60+ derivada da data de nascimento), situação de rua, uso de substâncias, cidade
- [x] Bairro não tem gráfico próprio; Nome e CPF nunca entram em gráfico nem como categoria
- [x] Cada recorte inclui fatia/barra “Não informado” quando o campo (ou a data de nascimento, na idade) está vazio
- [x] Há filtro no dashboard para todas as Atividades ou uma Atividade; o recorte é all-time neste aparelho, sem período
- [x] Sem linhas correspondentes (por exemplo Atividade nova sem Atendimento) aparece estado vazio, não gráfico quebrado
- [x] Data de nascimento no futuro não gera faixa etária negativa (cai em vazio / Não informado, alinhado ao form)

## Answer

`RegistroLocal.indicadores({ atividadeId? })` devolve o total de Atendimentos (incluindo anônimos) e os oito recortes, com “Não informado” quando a origem está vazia e faixa etária derivada da data de nascimento (futuro cai em vazio). A aba Gráficos mostra o KPI rotulado Atendimentos, o mesmo informativo do form, filtro todas/uma Atividade all-time, e estado vazio sem gráfico quebrado. Nome, CPF e bairro ficam fora da projeção.
