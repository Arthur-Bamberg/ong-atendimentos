import type { Atendimento, Atividade, Persistencia, RegistroLocal } from '@/registro-local/tipos'

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
    async obterAtividadeVigente() {
      const vigenteId = await persistencia.carregarAtividadeVigenteId()
      if (!vigenteId) {
        return null
      }
      const atividades = await persistencia.carregarAtividades()
      return atividades.find((atividade) => atividade.id === vigenteId) ?? null
    },
    async definirAtividadeVigente(atividadeId) {
      const atividades = await persistencia.carregarAtividades()
      if (!atividades.some((atividade) => atividade.id === atividadeId)) {
        throw new Error('Atividade vigente precisa existir neste aparelho')
      }
      await persistencia.gravarAtividadeVigenteId(atividadeId)
    },
    async criarAtendimento(dados) {
      const atividades = await persistencia.carregarAtividades()
      const atividadeId = dados.atividadeId || (await persistencia.carregarAtividadeVigenteId())
      if (!atividadeId || !atividades.some((atividade) => atividade.id === atividadeId)) {
        throw new Error('Atendimento precisa de uma Atividade')
      }
      const atendimento: Atendimento = {
        id: crypto.randomUUID(),
        atividadeId,
        criadoEm: new Date().toISOString(),
        ...(dados.nome ? { nome: dados.nome } : {}),
        ...(dados.cpf ? { cpf: dados.cpf } : {}),
      }
      const existentes = await persistencia.carregarAtendimentos()
      await persistencia.gravarAtendimentos([...existentes, atendimento])
      return atendimento
    },
    async listarAtendimentos() {
      const atendimentos = await persistencia.carregarAtendimentos()
      return [...atendimentos].reverse().sort((a, b) => b.criadoEm.localeCompare(a.criadoEm))
    },
    async obterAtendimento(id) {
      const atendimentos = await persistencia.carregarAtendimentos()
      return atendimentos.find((atendimento) => atendimento.id === id) ?? null
    },
    async indicadores() {
      const atendimentos = await persistencia.carregarAtendimentos()
      return { totalAtendimentos: atendimentos.length }
    },
  }
}
