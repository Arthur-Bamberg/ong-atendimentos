# 01: App neste aparelho com Base local, Atividades semente e fachada de login

**What to build:** na primeira abertura, o Operador passa por login e “esqueci a senha” que não autenticam, entra mesmo assim, e já encontra as seis Atividades semente neste aparelho. Reabrir o app pula a fachada; matar o processo não apaga o catálogo. A tela de senha deixa claro que a Base local vive neste aparelho — sem e-mail e sem outro telefone recebendo esses dados.

**Blocked by:** None (can start immediately)

**Status:** claimed

- [x] Há tela de login; o submit entra no app independentemente das credenciais digitadas
- [x] Há tela de “esqueci a senha” que explica que não há recuperação por e-mail porque a Base local vive neste aparelho
- [x] Depois da primeira entrada neste aparelho, reabrir o app já passa da fachada de login
- [x] Na primeira abertura com catálogo vazio existem as seis Atividades semente: Abordagem de rua, Acolhimento / abrigo, Distribuição de alimentos, Encaminhamento, Atendimento psicossocial, Outro
- [x] O Operador vê a lista dessas Atividades
- [x] Matar e reabrir o app preserva as Atividades e o fato de a fachada já ter sido passada
- [x] Dois Operadores que se revezam no mesmo telefone veem o mesmo catálogo
- [x] A cópia deixa claro que outro aparelho não recebe esses registros
- [x] A UI de domínio está em pt-BR e não chama o Operador de usuário

## Comments

Implementado no app Expo: porto `RegistroLocal` (sementes + listagem) com fake em memória nos testes; SQLite neste aparelho; fachada de login/esqueci a senha só presentacional; flag e catálogo sobrevivem a reabrir.
