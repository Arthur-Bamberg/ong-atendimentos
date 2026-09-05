Status: ready-for-agent

# MVP: anotar Atendimentos e ver Indicadores neste aparelho

## Problem Statement

A equipe da ONG precisa anotar encontros de trabalhos distintos (rua, acolhimento, alimentos, encaminhamento, psicossocial e outros) num celular, sem servidor e sem cadastro complexo de pessoa. Hoje não há um lugar único neste aparelho para guardar o que foi preenchido, conferir o que entrou e ver recortes (escolaridade, raça/cor, renda, etc.). Nome e CPF muitas vezes não existem; mesmo assim o encontro precisa contar. Login “de verdade” não entra agora — só as telas.

## Solution

Um aplicativo React Native com Expo, só neste aparelho. O Operador passa por telas de login e “esqueci a senha” que não autenticam. Depois trabalha em três superfícies: formulário único de Atendimento (única obrigatoriedade: Atividade), listagem só de consulta (mais recente criado primeiro) e tela de gráficos com o total de Atendimentos e os Indicadores. Atividade tem CRUD; não se apaga Atividade que já tenha Atendimento. Depois de salvar, um botão abre outro Atendimento em branco com a mesma Atividade grudada. Nome e CPF, quando existem, ficam fora dos gráficos. Um informativo avisa que falta de identificação única distorce qualquer leitura como se fosse “pessoas”.

## User Stories

1. As an Operador, I want to see a login screen, so that the app looks like a product with access control even though the MVP does not authenticate.
2. As an Operador, I want to submit the login screen and enter the app regardless of the credentials typed, so that I am not blocked by fake auth.
3. As an Operador, I want a “forgot password” screen, so that the access UI is complete.
4. As an Operador, I want the forgot-password screen to explain that there is no e-mail recovery because the Base local lives on this device, so that I do not expect a reset message.
5. As an Operador, I want the app to reopen already past the login facade after the first entry on this device, so that I do not re-type a fake login every time.
6. As an Operador, I want the six seed Atividades (Abordagem de rua, Acolhimento / abrigo, Distribuição de alimentos, Encaminhamento, Atendimento psicossocial, Outro) to exist on first launch, so that I can start recording without an empty catalog.
7. As an Operador, I want to create a new Atividade by name, so that trabalhos that are not in the seed list still classify Atendimentos.
8. As an Operador, I want to see the list of Atividades, so that I know what I can pick and edit.
9. As an Operador, I want to rename an Atividade, so that a wrong or outdated label is fixed everywhere it appears.
10. As an Operador, I want renaming an Atividade to update the label on every linked Atendimento, so that charts and the list do not keep a stale name.
11. As an Operador, I want to delete an Atividade that has zero Atendimentos, so that I can remove a name created by mistake.
12. As an Operador, I want delete to be refused when the Atividade already has at least one Atendimento, so that history is not orphaned.
13. As an Operador, I want a clear message when delete is refused, so that I understand I must wait for a later “move between Atividades” feature.
14. As an Operador, I want to choose the current Atividade for this device, so that successive Atendimentos inherit it until I change it.
15. As an Operador, I want the current Atividade to remain selected after saving, after opening the list, and after restarting the app, so that I do not re-pick it for every person in the same shift.
16. As an Operador, I want to change the current Atividade before the next save, so that the afternoon’s work is not tagged with the morning’s Atividade.
17. As an Operador, I want the form to refuse save without a current Atividade, so that every Atendimento is classified.
18. As an Operador, I want a single form for every Atividade, so that I do not learn a different ficha per trabalho.
19. As an Operador, I want Nome to be optional, so that I can still record the encounter when the person cannot or will not identify themselves.
20. As an Operador, I want CPF to be optional, so that lack of documents does not block the Atendimento.
21. As an Operador, I want to save an Atendimento anônimo (no Nome and no CPF) with only Atividade (and whatever else I have), so that volume of work is not lost.
22. As an Operador, I want a visible informative on the form stating that missing unique identification can distort readings of “people” when the same person generates multiple Atendimentos, so that I do not treat the total as unique heads.
23. As an Operador, I want to fill data de nascimento optionally, so that age bands can be derived later without asking for a raw age.
24. As an Operador, I want to pick raça/cor from the IBGE set (branca, preta, parda, amarela, indígena), so that the chart has a closed vocabulary.
25. As an Operador, I want to pick escolaridade from a closed list (sem instrução, fundamental incompleto, fundamental completo, médio incompleto, médio completo, superior incompleto, superior completo), so that the chart does not fragment on free text.
26. As an Operador, I want to pick faixa de renda from a closed list (sem renda, até 1 salário mínimo, 1–2, 2–3, 3–5, mais de 5), so that income is comparable.
27. As an Operador, I want to type cidade and bairro as free text, so that localidade is captured without a geo database.
28. As an Operador, I want to mark situação de rua as sim or não, so that that recorte exists for the chart.
29. As an Operador, I want to mark uso de substâncias as não, álcool, outras drogas, or ambos, so that that recorte exists for the chart.
30. As an Operador, I want every field except Atividade to be skippable, so that I only record what the person can give in that moment.
31. As an Operador, I want an optional data do atendimento that defaults to today, so that I can backfill an encounter that I only type at the end of the day.
32. As an Operador, I want empty data do atendimento to fall back to the save timestamp for display, so that the list always has a date.
33. As an Operador, I want CPF, when filled, to use mask 000.000.000-00 and to validate check digits, so that typos do not pollute the Base local.
34. As an Operador, I want save to be blocked when CPF is present but invalid, so that I fix it before it lands in the list.
35. As an Operador, I want empty CPF to remain valid, so that Atendimento anônimo still saves.
36. As an Operador, I want saving to create a new Atendimento every time, so that a return visit is another row, not an overwrite.
37. As an Operador, I want a “Novo atendimento” action after a successful save, so that I can immediately record the next encounter in the same shift.
38. As an Operador, I want that action to open a blank form with the same current Atividade already selected and no copied Nome, CPF, or other fields, so that I do not clone the previous person by accident.
39. As an Operador, I want a list of Atendimentos ordered by last created (newest first), so that I can conferir what just entered.
40. As an Operador, I want each list row to show date/time, Atividade, and Nome or “Sem identificação”, so that I can scan without opening every row.
41. As an Operador, I want the list to have no search and no filter in the MVP, so that the surface stays a simple chronological mural.
42. As an Operador, I want tapping a row to open a read-only detail of that Atendimento, so that I can check the fields that were saved.
43. As an Operador, I want the detail not to allow edit or delete in the MVP, so that we do not build correction flows yet.
44. As an Operador, I want an empty list state that tells me no Atendimento exists yet, so that I know to use the form.
45. As an Operador, I want a charts screen whose big number is the total of Atendimentos on this device, including anônimos, so that I see volume of work.
46. As an Operador, I want that number labelled Atendimentos, not “atendidos”, so that the UI does not pretend uniqueness of people.
47. As an Operador, I want the same identification informative on the charts screen, so that I do not read the dashboard as unique people.
48. As an Operador, I want a chart of Atendimentos by Atividade, so that I see how work splits across trabalhos.
49. As an Operador, I want a chart of raça/cor, so that that recorte is visible.
50. As an Operador, I want a chart of escolaridade, so that that recorte is visible.
51. As an Operador, I want a chart of faixa de renda, so that that recorte is visible.
52. As an Operador, I want a chart of faixa etária (0–11, 12–17, 18–29, 30–59, 60+) derived from data de nascimento, so that I do not chart raw dates of birth.
53. As an Operador, I want a chart of situação de rua, so that that recorte is visible.
54. As an Operador, I want a chart of uso de substâncias, so that that recorte is visible.
55. As an Operador, I want a chart of cidade, so that localidade has a coarse recorte.
56. As an Operador, I want bairro not to appear as its own chart in the MVP, so that sparse free text does not explode the dashboard.
57. As an Operador, I want Nome and CPF never to appear on any chart or as a chart category, so that identification stays off the dashboard.
58. As an Operador, I want each chart to include a “Não informado” slice/bar for Atendimentos that left that field empty (or have no data de nascimento, for age), so that optional fields do not silently disappear from the denominator.
59. As an Operador, I want a filter on the charts screen for all Atividades or one Atividade, so that I can recortar one trabalho without leaving the dashboard.
60. As an Operador, I want charts to use all time on this device, with no month/year period filter in the MVP, so that the first dashboard stays small.
61. As an Operador, I want charts with no matching rows (for example a brand-new Atividade) to show an empty state, so that I do not see a broken graphic.
62. As an Operador, I want Atendimentos and Atividades to survive killing and reopening the app, so that the Base local is real.
63. As an Operador, I want two Operadores who take turns on this same phone to see the same Base local, so that the device is the unit of data.
64. As an Operador, I want to know that another phone will not receive these records, so that I do not assume a shared ONG-wide base.
65. As an Operador, I want the current Atividade picker to exclude nothing that still exists after a rename, so that the sticky selection still points at the same Atividade identity.
66. As an Operador, I want, if I delete the unused Atividade that was current, to be forced to pick another before the next save, so that I cannot save against a missing Atividade.
67. As an Operador, I want UI copy in pt-BR, so that the team can use the app in the field.
68. As an Operador, I want required vs optional state to be obvious on the form (only Atividade marked required), so that I am not afraid to leave gaps.
69. As an Operador, I want to leave raça/cor, escolaridade, renda, situação de rua, substâncias, cidade, bairro, and nascimento empty independently, so that one refused question does not block the others.
70. As an Operador, I want the list order to follow created-at descending even when data do atendimento is in the past, so that “último criado” matches what I just typed, not the backfilled encounter date.
71. As an Operador, I want the row’s visible date to prefer data do atendimento when it was filled, so that I conferir the day of the encounter.
72. As an Operador, I want a future data de nascimento to be rejected or treated as empty for age banding, so that faixa etária does not go negative.
73. As an Operador, I want CPF stored in a canonical digit-only form internally while showing the mask on the form and detail, so that the same CPF typed with or without punctuation is the same value.
74. As an Operador, I want creating two Atendimentos with the same CPF to succeed as two rows, so that return visits are not blocked.
75. As an Operador, I want creating two Atendimentos with the same Nome and no CPF to succeed as two rows, so that homonyms and anônimos are not merged.
76. As an Operador, I want the seed Atividade “Outro” to behave like any other Atividade, so that I can still create more specific names via CRUD instead of overloading “Outro”.
77. As an Operador, I want navigation among formulário, listagem, gráficos, and Atividades without losing the sticky Atividade, so that the shift context is global to the device, not to one screen.
78. As an Operador, I want the informative to mention multiple Atendimentos of the same person (with or without CPF), so that even identified return visits are not read as two people.

## Implementation Decisions

- Greenfield React Native app with Expo. No backend, no remote API, no multi-device sync (ADR 0001).
- Single domain context. Persist Atividade and Atendimento on device; persist the sticky current Atividade id as device preference.
- Login and forgot-password are presentational only: login submit always succeeds; a device flag records that the facade was passed. Forgot-password is static copy. No PIN, no hashed password, no per-Operador account.
- Atividade is an entity with identity: id, name, and timestamps. Seed the six names on first launch if the catalog is empty. Rename updates the stored name; list/charts read through the entity. Delete is allowed only when the count of linked Atendimentos is zero.
- Atendimento references Atividade by id (not a copied name). Fields: optional nome, optional cpf (digits), optional data de nascimento, optional raça/cor, optional escolaridade, optional faixa de renda, optional cidade, optional bairro, optional situação de rua, optional uso de substâncias, optional data do atendimento, required created-at. No Pessoa table (ADR 0002).
- Closed enums as specified in the stories. Faixa etária is not stored; it is derived at read time from data de nascimento.
- After save, “Novo atendimento” routes to a fresh form; current Atividade stays; all other fields reset.
- List: sort by created-at descending. No search, filter, edit, or delete of Atendimento. Detail is read-only.
- Charts: one dashboard, all-time, optional filter by Atividade id or all. KPI = count of Atendimentos. Eight distributions: Atividade, raça/cor, escolaridade, faixa de renda, faixa etária, situação de rua, uso de substâncias, cidade. Each distribution always emits a Não informado bucket for missing source data. Never pass nome or cpf into chart projections.
- Informativo copy on form and charts, in pt-BR, covering Atendimento anônimo and repeat Atendimentos.
- **Test seam (one):** a pure application port, `RegistroLocal`, that is the only thing tests talk to. It exposes Atividade CRUD (with the delete guard), device current-Atividade get/set, create Atendimento, list Atendimentos newest first, get Atendimento by id, and `indicadores({ atividadeId | all })` returning the KPI plus the eight distributions. UI screens and the SQLite (or equivalent) adapter sit outside this port. Do not add a second seam for charts or for Atividade — both go through `RegistroLocal`.

### `RegistroLocal` shape (from this spec, not from a prototype)

```ts
type Indicadores = {
  totalAtendimentos: number
  porAtividade: Bucket[]
  porRacaCor: Bucket[]
  porEscolaridade: Bucket[]
  porFaixaRenda: Bucket[]
  porFaixaEtaria: Bucket[]
  porSituacaoRua: Bucket[]
  porUsoSubstancias: Bucket[]
  porCidade: Bucket[]
}
type Bucket = { chave: string; quantidade: number } // include chave "Não informado"
```

## Testing Decisions

- Good tests assert external behavior of `RegistroLocal` only: what is stored, listed, refused, and projected. They do not assert React tree, navigation, SQL, or file paths.
- Cover: seed Atividades; create/rename/delete Atividade; refuse delete when linked; sticky current Atividade across creates; refuse Atendimento without Atividade; accept Atendimento anônimo; reject invalid CPF and accept empty CPF; canonical CPF digits; every save inserts a new row (same CPF twice = two Atendimentos); list order by created-at desc; indicadores total includes anônimos; filter by Atividade; Não informado buckets; idade bands; nome/cpf absent from `Indicadores`; “Novo atendimento” equivalent is just another create with only Atividade reused — no copy of previous fields (that copy behavior lives in UI; the port must not auto-clone the last Atendimento).
- There is no prior art in this repo; it is empty. In-memory fake of the persistence adapter behind `RegistroLocal` is the test double. Do not require a device or Expo runtime for the seam tests.

## Out of Scope

- API, conta de Operador, senha real, e-mail, “esqueci a senha” funcional.
- Vários aparelhos, sincronização, exportação, backup na nuvem.
- Cadastro de Pessoa atendida, merge, unicidade por CPF, foto, reconhecimento facial.
- Editar ou apagar Atendimento; busca e filtro na listagem.
- Mover Atendimentos entre Atividades.
- KPI de pessoas distintas; filtros de período nos gráficos; gráfico de bairro; série temporal.
- Campos extra (gênero, telefone, benefício, deficiência, observações, nome social).
- Formulário que muda campos conforme a Atividade.
- i18n além de pt-BR.

## Further Notes

- Vocabulário: `CONTEXT.md`. Não usar “atendidos” no KPI. Não chamar o Operador de usuário na UI de domínio.
- Depois do MVP (já combinado, não implementar agora): foto e face para unicidade; edição de Atendimento; transacionar Atendimentos entre Atividades; busca na lista.
- A Base local cabe num único telefone de referência da equipe. Três celulares no campo são três mundos.
- Costura de teste combinada nesta spec: um único porto `RegistroLocal`. Se isso não bater com o que você quer (por exemplo testar telas Expo), diga antes de implementar.
