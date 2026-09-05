export type Atividade = {
  id: string
  nome: string
  criadaEm: string
  atualizadaEm: string
}

export type Persistencia = {
  carregarAtividades(): Promise<Atividade[]>
  gravarAtividades(atividades: Atividade[]): Promise<void>
}

export type RegistroLocal = {
  listarAtividades(): Promise<Atividade[]>
}
