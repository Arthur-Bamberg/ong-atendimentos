export const OPCOES_RACA_COR = ['branca', 'preta', 'parda', 'amarela', 'indígena'] as const
export const OPCOES_ESCOLARIDADE = [
  'sem instrução',
  'fundamental incompleto',
  'fundamental completo',
  'médio incompleto',
  'médio completo',
  'superior incompleto',
  'superior completo',
] as const
export const OPCOES_FAIXA_RENDA = [
  'sem renda',
  'até 1 salário mínimo',
  '1–2',
  '2–3',
  '3–5',
  'mais de 5',
] as const
export const OPCOES_SITUACAO_RUA = ['sim', 'não'] as const
export const OPCOES_USO_SUBSTANCIAS = ['não', 'álcool', 'outras drogas', 'ambos'] as const

export type RacaCor = (typeof OPCOES_RACA_COR)[number]
export type Escolaridade = (typeof OPCOES_ESCOLARIDADE)[number]
export type FaixaRenda = (typeof OPCOES_FAIXA_RENDA)[number]
export type SituacaoRua = (typeof OPCOES_SITUACAO_RUA)[number]
export type UsoSubstancias = (typeof OPCOES_USO_SUBSTANCIAS)[number]

export type Atividade = {
  id: string
  nome: string
  criadaEm: string
  atualizadaEm: string
}

export type Atendimento = {
  id: string
  atividadeId: string
  nome?: string
  cpf?: string
  dataNascimento?: string
  racaCor?: RacaCor
  escolaridade?: Escolaridade
  faixaRenda?: FaixaRenda
  cidade?: string
  bairro?: string
  situacaoRua?: SituacaoRua
  usoSubstancias?: UsoSubstancias
  dataDoAtendimento?: string
  criadoEm: string
}

export type NovoAtendimento = {
  atividadeId?: string
  nome?: string
  cpf?: string
  dataNascimento?: string
  racaCor?: RacaCor
  escolaridade?: Escolaridade
  faixaRenda?: FaixaRenda
  cidade?: string
  bairro?: string
  situacaoRua?: SituacaoRua
  usoSubstancias?: UsoSubstancias
  dataDoAtendimento?: string
}

export type Indicadores = {
  totalAtendimentos: number
}

export type Persistencia = {
  carregarAtividades(): Promise<Atividade[]>
  gravarAtividades(atividades: Atividade[]): Promise<void>
  jaIniciouCatalogo(): Promise<boolean>
  carregarAtendimentos(): Promise<Atendimento[]>
  gravarAtendimentos(atendimentos: Atendimento[]): Promise<void>
  carregarAtividadeVigenteId(): Promise<string | null>
  gravarAtividadeVigenteId(atividadeId: string): Promise<void>
}

export type RegistroLocal = {
  listarAtividades(): Promise<Atividade[]>
  criarAtividade(nome: string): Promise<Atividade>
  renomearAtividade(id: string, nome: string): Promise<Atividade>
  apagarAtividade(id: string): Promise<void>
  obterAtividadeVigente(): Promise<Atividade | null>
  definirAtividadeVigente(atividadeId: string): Promise<void>
  criarAtendimento(dados: NovoAtendimento): Promise<Atendimento>
  listarAtendimentos(): Promise<Atendimento[]>
  obterAtendimento(id: string): Promise<Atendimento | null>
  indicadores(): Promise<Indicadores>
}
