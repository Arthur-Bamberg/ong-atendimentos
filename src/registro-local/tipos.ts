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
  criadoEm: string
}

export type NovoAtendimento = {
  atividadeId: string
  nome?: string
  cpf?: string
}

export type Indicadores = {
  totalAtendimentos: number
}

export type Persistencia = {
  carregarAtividades(): Promise<Atividade[]>
  gravarAtividades(atividades: Atividade[]): Promise<void>
  carregarAtendimentos(): Promise<Atendimento[]>
  gravarAtendimentos(atendimentos: Atendimento[]): Promise<void>
}

export type RegistroLocal = {
  listarAtividades(): Promise<Atividade[]>
  criarAtendimento(dados: NovoAtendimento): Promise<Atendimento>
  listarAtendimentos(): Promise<Atendimento[]>
  indicadores(): Promise<Indicadores>
}
