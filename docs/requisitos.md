# Requisitos — Atendimentos da ONG

Lista dos requisitos funcionais e não funcionais do aplicativo **Atendimentos**, usado pela equipe da **Caminho do bem OSC** para anotar encontros neste aparelho.

Vocabulário canônico: [`CONTEXT.md`](../CONTEXT.md). Decisões de corte: [ADR 0001](./adr/0001-base-local-neste-aparelho.md) (Base local neste aparelho) e [ADR 0002](./adr/0002-atendimento-unico-agregado.md) (Atendimento é o único agregado).

Cada item é testável: descreve o que o Operador ou o sistema deve fazer, não como a tela é desenhada.

---

## 1. Contexto

A equipe anota encontros de trabalhos distintos (rua, acolhimento, alimentos, encaminhamento, psicossocial e outros) num celular, sem servidor e sem cadastro de pessoa. Nome e CPF muitas vezes não existem; o encontro precisa contar mesmo assim. O total exibido é quantidade de Atendimentos, inclusive anônimos — nunca “pessoas distintas”.

A Base local é **este aparelho**. Vários aparelhos no campo são várias bases que não se somam.

## 2. Atores

| Ator | Papel |
| --- | --- |
| **Operador** | Quem usa o aplicativo neste aparelho. Não há conta individual: quem se reveza no mesmo telefone vê a mesma Base local. |

Não há cadastro de Pessoa atendida. Nome e CPF, quando existem, são atributos opcionais do Atendimento.

## 3. Escopo deste recorte

**Entra:** fachada de login (sem autenticação), CRUD de Atividade com guarda de exclusão, Atividade vigente neste aparelho, formulário único de Atendimento, listagem e detalhe só leitura, Indicadores all-time neste aparelho.

**Não entra:** API, conta de Operador, senha real, e-mail, vários aparelhos, sincronização, exportação, backup na nuvem, cadastro/merge de Pessoa, unicidade por CPF, foto/face, editar ou apagar Atendimento, busca/filtro na lista, mover Atendimentos entre Atividades, KPI de pessoas distintas, filtro de período nos gráficos, gráfico de bairro, série temporal, formulário que muda conforme a Atividade, i18n além de pt-BR.

---

## 4. Requisitos funcionais

### 4.1 Fachada de acesso

| ID | Requisito |
| --- | --- |
| RF-01 | O aplicativo apresenta uma tela de login com campos de identificação e senha e um botão Entrar. |
| RF-02 | Submeter o login entra no aplicativo independentemente das credenciais digitadas. Não há autenticação, PIN, senha com hash nem conta por Operador. |
| RF-03 | Há uma tela “Esqueci a senha” acessível a partir do login. |
| RF-04 | Essa tela explica que não há recuperação por e-mail porque a Base local vive neste aparelho, e que nenhum e-mail e nenhum outro telefone recebe esses dados. Não envia mensagem. |
| RF-05 | A tela de login também avisa que a Base local vive neste aparelho e que nenhum e-mail e nenhum outro telefone recebe estes registros. |
| RF-06 | Depois da primeira entrada bem-sucedida neste aparelho, reabrir o aplicativo já passa da fachada de login e abre o formulário. |
| RF-07 | Se a verificação da fachada falhar, o Operador cai na tela de login. |
| RF-08 | Durante a verificação inicial, o aplicativo mostra a marca da OSC e um estado de carregamento (“Abrindo a Base local neste aparelho…”). |

### 4.2 Base local e Atividades semente

| ID | Requisito |
| --- | --- |
| RF-09 | Na primeira abertura com catálogo vazio, existem as seis Atividades semente: Abordagem de rua; Acolhimento / abrigo; Distribuição de alimentos; Encaminhamento; Atendimento psicossocial; Outro. |
| RF-10 | Reabrir o catálogo já gravado não duplica nem substitui as Atividades. Catálogo que já tem Atividade não recebe as sementes. |
| RF-11 | Matar e reabrir o aplicativo preserva Atividades, Atendimentos, a Atividade vigente e o fato de a fachada já ter sido passada. |
| RF-12 | Dois Operadores que se revezam no mesmo aparelho veem o mesmo catálogo e os mesmos Atendimentos. |
| RF-13 | A cópia deixa claro que outro aparelho não recebe estes registros. |

### 4.3 CRUD de Atividade

| ID | Requisito |
| --- | --- |
| RF-14 | O Operador vê a lista de Atividades que pode escolher e editar. |
| RF-15 | O Operador cria uma Atividade pelo nome; ela passa a classificar Atendimentos. Nome vazio é recusado. |
| RF-16 | O Operador renomeia uma Atividade. O rótulo novo aparece em todo Atendimento ligado (lista, detalhe, seletor vigente e Indicadores). |
| RF-17 | Depois de um rename, o seletor da Atividade vigente continua apontando para a mesma identidade, agora com o nome novo. |
| RF-18 | Dá para apagar Atividade com zero Atendimentos. |
| RF-19 | Apagar é recusado quando a Atividade já tem pelo menos um Atendimento. A recusa vem com a mensagem: *Não dá para apagar Atividade que já tem Atendimento. Mover Atendimentos entre Atividades vem depois.* |
| RF-20 | Se a Atividade vigente (sem Atendimentos) for apagada, o Operador é forçado a escolher outra antes do próximo save. |
| RF-21 | A Atividade semente “Outro” se comporta como qualquer outra: não é um balde especial; nomes mais específicos vêm deste CRUD. |

### 4.4 Atividade vigente neste aparelho

| ID | Requisito |
| --- | --- |
| RF-22 | O Operador escolhe a Atividade vigente neste aparelho. Atendimentos seguintes herdam essa escolha até ele trocá-la. |
| RF-23 | A Atividade vigente permanece depois de salvar, depois de abrir a lista, depois de navegar entre abas e depois de reabrir o aplicativo. |
| RF-24 | O Operador troca a Atividade vigente antes do próximo save. |
| RF-25 | Sem Atividade vigente (ou com vigente inexistente), o save é recusado. Mensagem: *Escolha a Atividade vigente para gravar o Atendimento.* |
| RF-26 | A Atividade é a única obrigatoriedade do formulário e aparece marcada como obrigatória. |

### 4.5 Formulário único de Atendimento

O formulário é o mesmo para qualquer Atividade. Cada campo abaixo, exceto Atividade, é opcional e independente: um recusado não bloqueia os outros.

| ID | Requisito |
| --- | --- |
| RF-27 | O Operador preenche **Nome** (texto livre, opcional). |
| RF-28 | O Operador preenche **CPF** (opcional). Vazio continua válido e grava Atendimento anônimo. |
| RF-29 | CPF preenchido usa máscara `000.000.000-00` na UI, valida dígitos verificadores e bloqueia o save se inválido. Sequências com todos os dígitos iguais são inválidas. |
| RF-30 | CPF é guardado só com dígitos e reapresentado com máscara no formulário e no detalhe. Pontuação diferente não cria outro valor. |
| RF-31 | O Operador preenche **data de nascimento** (opcional), com máscara `dd/mm/aaaa`. Data no futuro é recusada. |
| RF-32 | O Operador escolhe **raça/cor** no conjunto IBGE: branca, preta, parda, amarela, indígena. |
| RF-33 | O Operador escolhe **escolaridade** na lista fechada: sem instrução, fundamental incompleto, fundamental completo, médio incompleto, médio completo, superior incompleto, superior completo. |
| RF-34 | O Operador escolhe **faixa de renda** na lista fechada: sem renda, até 1 salário mínimo, 1–2, 2–3, 3–5, mais de 5. |
| RF-35 | O Operador preenche **cidade** e **bairro** como texto livre. |
| RF-36 | O Operador marca **situação de rua**: sim ou não. |
| RF-37 | O Operador marca **uso de substâncias**: não, álcool, outras drogas, ou ambos. |
| RF-38 | O Operador marca zero ou mais **programas sociais** da lista fechada: Minha Casa Minha Vida, ProUni, FIES, Bolsa Família, Lei Rouanet, Gás do Povo. A ordem gravada segue a ordem da lista. |
| RF-39 | O Operador preenche **observação** (texto livre, opcional) relativa a programas sociais. |
| RF-40 | O Operador marca se a pessoa **pode participar de programas sociais** (sim/não; omitido quando não marcado). |
| RF-41 | O Operador preenche **data do atendimento** (opcional), com máscara `dd/mm/aaaa`. O padrão no formulário é hoje. Vazia cai no instante do save para exibição. |
| RF-42 | Campos de escolha fechada permitem desmarcar (voltar a vazio) sem gravar valor. |
| RF-43 | Obrigatório vs opcional é óbvio no formulário: só Atividade marcada como obrigatória; os demais campos trazem “(opcional)”. |
| RF-44 | Há informativo visível no formulário: falta de identificação única e vários Atendimentos da mesma pessoa (com ou sem CPF) distorcem qualquer leitura como se fosse “pessoas”. |
| RF-45 | Cada save cria um Atendimento novo. Dois saves seguidos são duas linhas — inclusive com o mesmo CPF, ou o mesmo Nome sem CPF. Não há merge nem cadastro de pessoa. |
| RF-46 | Dá para gravar Atendimento anônimo (sem Nome e sem CPF) só com a Atividade vigente e o que mais houver. |
| RF-47 | Depois do save bem-sucedido, o formulário fica em branco para o próximo encontro, com a mesma Atividade vigente e sem copiar Nome, CPF nem os demais campos. |
| RF-48 | Falha ao gravar mostra mensagem compreensível; o rascunho não é descartado. Duplo toque no botão de gravar não cria dois Atendimentos. |

### 4.6 Listagem de Atendimentos

| ID | Requisito |
| --- | --- |
| RF-49 | A lista mostra Atendimentos do último criado primeiro (`criadoEm` descendente), mesmo que a data do encontro esteja no passado. |
| RF-50 | Cada linha mostra data/hora visível, Atividade e Nome — ou “Sem identificação” quando não há Nome. |
| RF-51 | A data visível da linha prefere a data do atendimento quando preenchida; senão, usa o instante de criação. |
| RF-52 | A lista não tem busca nem filtro. |
| RF-53 | Lista vazia explica que ainda não há Atendimento neste aparelho e oferece ir ao formulário. |
| RF-54 | Tocar a linha abre o detalhe desse Atendimento. |
| RF-55 | Falha ao carregar a lista mostra mensagem de erro. |

### 4.7 Detalhe do Atendimento

| ID | Requisito |
| --- | --- |
| RF-56 | O detalhe é só leitura: não edita nem apaga Atendimento. |
| RF-57 | O detalhe mostra os campos gravados: data do atendimento, data e hora de criação, Atividade (pelo nome atual da entidade), Nome, CPF mascarado, data de nascimento, raça/cor, escolaridade, faixa de renda, cidade, bairro, situação de rua, uso de substâncias, programas sociais, observação e se pode participar de programas sociais. |
| RF-58 | Campo vazio aparece como “Não informado”. Nome vazio aparece como “Sem identificação”. |
| RF-59 | Atendimento inexistente ou falha ao abrir mostra mensagem de erro. |

### 4.8 Indicadores e gráficos

| ID | Requisito |
| --- | --- |
| RF-60 | O número grande é o total de Atendimentos neste aparelho, incluindo anônimos, rotulado **Atendimentos** — nunca “atendidos”. |
| RF-61 | O mesmo informativo do formulário (RF-44) aparece nos gráficos: anônimo e reincidência não são pessoas distintas. |
| RF-62 | Há recortes de Atendimentos por: Atividade; raça/cor; escolaridade; faixa de renda; faixa etária; situação de rua; uso de substâncias; cidade. |
| RF-63 | Faixa etária não é gravada: deriva da data de nascimento nas faixas 0–11, 12–17, 18–29, 30–59, 60+. Data de nascimento no futuro (ou inválida) cai em vazio / “Não informado”, sem faixa negativa. |
| RF-64 | Bairro não tem gráfico próprio. Nome e CPF nunca entram em gráfico nem como categoria. Programas sociais, observação e a marcação “pode participar” também ficam fora dos Indicadores neste recorte. |
| RF-65 | Cada recorte inclui fatia/barra “Não informado” quando o campo (ou a data de nascimento, na idade) está vazio, para que campos opcionais não desapareçam do denominador. |
| RF-66 | Há filtro no dashboard para todas as Atividades ou uma Atividade. O recorte é all-time neste aparelho, sem filtro de período. |
| RF-67 | Sem linhas correspondentes (por exemplo Atividade nova sem Atendimento) aparece estado vazio, não gráfico quebrado. |
| RF-68 | Cada barra anuncia chave e quantidade de forma acessível. O KPI anuncia o total como quantidade de Atendimentos. |
| RF-69 | Falha ao carregar Indicadores mostra mensagem de erro. |

### 4.9 Navegação

| ID | Requisito |
| --- | --- |
| RF-70 | Depois da fachada, o Operador navega por quatro abas: Anotar (formulário), Lista, Gráficos e Atividades. |
| RF-71 | Tocar um Atendimento na lista abre o detalhe numa tela empilhada, com título “Atendimento”, e dá para voltar à lista. |
| RF-72 | Rota desconhecida mostra “Tela não encontrada” e um caminho de volta. |
| RF-73 | Navegação entre as superfícies não perde a Atividade vigente. |

### 4.10 Vocabulário na interface

| ID | Requisito |
| --- | --- |
| RF-74 | Toda a UI de domínio está em pt-BR. |
| RF-75 | A UI não chama o Operador de “usuário”. |
| RF-76 | O KPI e os totais usam “Atendimentos”, nunca “atendidos”. |
| RF-77 | Datas e horários de exibição usam locale pt-BR (data `dd/mm/aaaa`; instante com hora 24 h). |

---

## 5. Requisitos não funcionais

### 5.1 Plataforma e implantação

| ID | Requisito |
| --- | --- |
| RNF-01 | Aplicativo mobile-first em React Native com Expo, utilizável neste aparelho (Android e iOS) e também em web para desenvolvimento. |
| RNF-02 | Orientação retrato. |
| RNF-03 | Não há backend, API remota nem sincronização entre aparelhos. |
| RNF-04 | Persistência nativa em SQLite neste aparelho; na web, equivalente em armazenamento local do navegador. |
| RNF-05 | Ícone, splash e favicon usam a identidade visual da OSC. O splash e o fundo do app são brancos. |

### 5.2 Persistência e integridade

| ID | Requisito |
| --- | --- |
| RNF-06 | Atendimento referencia Atividade por identidade (`atividadeId`), não por nome copiado. |
| RNF-07 | Cada Atendimento tem identidade própria e instante de criação gravado. |
| RNF-08 | Textos opcionais são gravados só se, depois de trim, restar conteúdo. |
| RNF-09 | A preferência de Atividade vigente e a flag da fachada são do aparelho, não da sessão. |
| RNF-10 | Esquema da Base local sobrevive a reabertura: colunas novas de Atendimento são acrescentadas sem perder linhas já gravadas. |
| RNF-11 | Gravação de catálogo e de Atendimentos é transacional no aparelho (não deixa metade da lista). |

### 5.3 Privacidade e dados pessoais

| ID | Requisito |
| --- | --- |
| RNF-12 | Nome e CPF não saem deste aparelho: não há envio a servidor, e-mail ou outro telefone. |
| RNF-13 | Nome e CPF não entram em Indicadores. |
| RNF-14 | CPF, quando existe, fica internamente só com dígitos; a máscara é só de apresentação. |
| RNF-15 | Não há cadastro de Pessoa atendida; identificação opcional não implica unicidade. |

### 5.4 Usabilidade e interface

| ID | Requisito |
| --- | --- |
| RNF-16 | Layout phone-first: conteúdo com largura máxima 560 px e gutters de 24 px. |
| RNF-17 | Uma ação primária por tela; no máximo quatro abas inferiores. |
| RNF-18 | Alvos de toque ≥ 48 dp no Android e ≥ 44 pt no iOS. |
| RNF-19 | Rótulos visíveis acima dos campos; placeholder não substitui rótulo. |
| RNF-20 | Contraste de texto no modo claro ≥ 4,5:1. Amarelo do sol da marca não é usado como texto de corpo nem como preenchimento de botão. |
| RNF-21 | Interface em modo claro (identidade da OSC). Tokens de modo escuro existem no sistema de design, mas o aplicativo opera em claro. |
| RNF-22 | Tipografia: Outfit em títulos, Work Sans no corpo. |
| RNF-23 | Marca oficial (lockup sol + coração + wordmark) na entrada e no splash; não recolorir, esticar nem substituir. Nas telas internas, chrome em ameixa, sem repetir o wordmark em todo cabeçalho. |
| RNF-24 | Botão primário em ameixa `#5F2357` com texto branco e borda de profundidade `#3A1A36`. |
| RNF-25 | Estado pressionado altera só opacidade (~150 ms), sem deslocar layout. |
| RNF-26 | Estado ocupado no botão de submit (busy), sem transformar que empurre o layout. |
| RNF-27 | Login aceita colar e autocompletar de gerenciador de senha (`username` / `current-password`), mesmo sem autenticar. |
| RNF-28 | Telas respeitam a área segura do aparelho; teclado não engole o campo em edição (`keyboardShouldPersistTaps`). |
| RNF-29 | Sem rolagem horizontal no telefone; conteúdo não fica escondido atrás da barra de abas. |

### 5.5 Acessibilidade

| ID | Requisito |
| --- | --- |
| RNF-30 | Controles interativos têm papel e rótulo acessíveis (botão, alerta, imagem da marca). |
| RNF-31 | Foco visível em campos (anel da cor primária). |
| RNF-32 | Mensagens de erro usam papel de alerta. |
| RNF-33 | Avisos da Base local combinam ícone e texto; a cor não é o único sinal. |
| RNF-34 | Ícones decorativos ficam fora da árvore acessível. |
| RNF-35 | Não usar emoji como ícone; ícones vêm de um conjunto consistente (Ionicons). |
| RNF-36 | Respeitar `prefers-reduced-motion` para movimento não essencial. |

### 5.6 Confiabilidade e desempenho

| ID | Requisito |
| --- | --- |
| RNF-37 | Abrir, gravar e listar neste aparelho funciona sem rede. |
| RNF-38 | Estados de carregamento, vazio e erro são explícitos em cada superfície (formulário, lista, detalhe, gráficos, Atividades). |
| RNF-39 | Fontes da marca carregam antes de esconder o splash, para não haver flash de fallback. |
| RNF-40 | Recortes de Indicadores e listagem devem permanecer usáveis no volume típico de um único telefone de referência da equipe (centenas a poucos milhares de Atendimentos). |

### 5.7 Testabilidade e qualidade

| ID | Requisito |
| --- | --- |
| RNF-41 | Há um único porto de aplicação (`RegistroLocal`) para CRUD de Atividade (com guarda de exclusão), Atividade vigente, criar/listar/obter Atendimento e projetar Indicadores. Testes de domínio falam só com esse porto. |
| RNF-42 | Testes do porto não dependem de dispositivo, SQLite nem runtime Expo; usam persistência em memória. |
| RNF-43 | Testes cobrem: sementes; criar/renomear/apagar Atividade; recusa de exclusão com Atendimento ligado; Atividade vigente; recusa sem Atividade; Atendimento anônimo; CPF inválido vs vazio; CPF canônico; cada save é linha nova; ordem da lista por criação; total inclui anônimos; filtro por Atividade; buckets “Não informado”; faixas etárias; Nome/CPF ausentes dos Indicadores. |
| RNF-44 | Desenvolvimento em Node 22.13+ (ver `.nvmrc`). Typecheck e testes automatizados fazem parte do fluxo (`npm run typecheck`, `npm test`). |

### 5.8 Idioma e localização

| ID | Requisito |
| --- | --- |
| RNF-45 | Único idioma de produto: português do Brasil. Sem i18n adicional neste recorte. |
| RNF-46 | Cópias de domínio, erros e estados vazios são centralizados e reutilizados entre telas. |

---

## 6. Regras de negócio

1. **O agregado gravado é o Atendimento.** Não existe tabela de Pessoa. Cada salvamento é um encontro novo, inclusive quando a mesma pessoa volta ou quando não há Nome nem CPF.
2. **Atendimento anônimo conta.** Sem Nome e sem CPF o registro entra no total e nos recortes (com “Não informado” onde couber).
3. **Atividade classifica o Atendimento** por identidade. Renomear muda o rótulo em todo lugar; apagar só vale com zero Atendimentos ligados.
4. **Indicador** é dado do Atendimento que entra em gráfico ou no total. Nome e CPF nunca são Indicador.
5. **Faixa etária** é derivada na leitura, nunca armazenada.
6. **A unidade de dados é o aparelho.** Quem se reveza neste telefone vê a mesma Base local; outro telefone é outro mundo.

---

## 7. Fora de escopo (explícito)

Não implementar neste recorte:

- API, conta de Operador, senha real, e-mail funcional, “esqueci a senha” que envie recuperação
- Vários aparelhos, sincronização, exportação, backup na nuvem
- Cadastro de Pessoa atendida, merge, unicidade por CPF, foto, reconhecimento facial
- Editar ou apagar Atendimento
- Busca e filtro na listagem
- Mover Atendimentos entre Atividades
- KPI de pessoas distintas; filtros de mês/ano nos gráficos; gráfico de bairro; série temporal
- Campos extras ainda não previstos (gênero, telefone, deficiência, nome social, observações gerais além da observação de programas sociais)
- Formulário com campos diferentes por Atividade
- Tradução para outros idiomas

Já combinado para depois (não é requisito atual): foto/face para unicidade; edição de Atendimento; transacionar Atendimentos entre Atividades; busca na lista.
