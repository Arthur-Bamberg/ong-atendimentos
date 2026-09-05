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
  atividadeId?: string
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
  carregarAtividadeVigenteId(): Promise<string | null>
  gravarAtividadeVigenteId(atividadeId: string): Promise<void>
}

export type RegistroLocal = {
  listarAtividades(): Promise<Atividade[]>
  obterAtividadeVigente(): Promise<Atividade | null>
  definirAtividadeVigente(atividadeId: string): Promise<void>
  criarAtendimento(dados: NovoAtendimento): Promise<Atendimento>
  listarAtendimentos(): Promise<Atendimento[]>
  obterAtendimento(id: string): Promise<Atendimento | null>
  indicadores(): Promise<Indicadores>
}
