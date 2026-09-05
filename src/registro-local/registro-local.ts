import type { Atividade, Persistencia, RegistroLocal } from '@/registro-local/tipos'

const NOMES_SEMENTE = [
  'Abordagem de rua',
  'Acolhimento / abrigo',
  'Distribuição de alimentos',
  'Encaminhamento',
  'Atendimento psicossocial',
  'Outro',
] as const

export function criarRegistroLocal(persistencia: Persistencia): RegistroLocal {
  return {
    async listarAtividades() {
      const existentes = await persistencia.carregarAtividades()
      if (existentes.length > 0) {
        return existentes
      }

      const agora = new Date().toISOString()
      const sementes: Atividade[] = NOMES_SEMENTE.map((nome) => ({
        id: crypto.randomUUID(),
        nome,
        criadaEm: agora,
        atualizadaEm: agora,
      }))
      await persistencia.gravarAtividades(sementes)
      return sementes
    },
  }
}
