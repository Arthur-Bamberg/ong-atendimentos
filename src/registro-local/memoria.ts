import type { Atendimento, Atividade, Persistencia } from '@/registro-local/tipos'

export function persistenciaEmMemoria(
  atividadesIniciais: Atividade[] = [],
  atendimentosIniciais: Atendimento[] = [],
): Persistencia {
  let atividades = atividadesIniciais.map((atividade) => ({ ...atividade }))
  let atendimentos = atendimentosIniciais.map((atendimento) => ({ ...atendimento }))
  let atividadeVigenteId: string | null = null

  return {
    async carregarAtividades() {
      return atividades.map((atividade) => ({ ...atividade }))
    },
    async gravarAtividades(proxima) {
      atividades = proxima.map((atividade) => ({ ...atividade }))
    },
    async carregarAtendimentos() {
      return atendimentos.map((atendimento) => ({ ...atendimento }))
    },
    async gravarAtendimentos(proxima) {
      atendimentos = proxima.map((atendimento) => ({ ...atendimento }))
    },
    async carregarAtividadeVigenteId() {
      return atividadeVigenteId
    },
    async gravarAtividadeVigenteId(id) {
      atividadeVigenteId = id
    },
  }
}
