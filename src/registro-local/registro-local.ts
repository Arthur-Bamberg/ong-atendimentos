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
  async function catalogo() {
    const existentes = await persistencia.carregarAtividades()
    if (existentes.length > 0 || (await persistencia.jaIniciouCatalogo())) {
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
  }

  return {
    async listarAtividades() {
      return catalogo()
    },
    async criarAtividade(nome) {
      const atividades = await catalogo()
      const agora = new Date().toISOString()
      const atividade: Atividade = {
        id: crypto.randomUUID(),
        nome,
        criadaEm: agora,
        atualizadaEm: agora,
      }
      await persistencia.gravarAtividades([...atividades, atividade])
      return atividade
    },
    async renomearAtividade(id, nome) {
      const atividades = await persistencia.carregarAtividades()
      const atual = atividades.find((atividade) => atividade.id === id)
      if (!atual) {
        throw new Error('Atividade precisa existir neste aparelho')
      }
      const atualizada: Atividade = {
        ...atual,
        nome,
        atualizadaEm: new Date().toISOString(),
      }
      await persistencia.gravarAtividades(
        atividades.map((atividade) => (atividade.id === id ? atualizada : atividade)),
      )
      return atualizada
    },
    async apagarAtividade(id) {
      const atendimentos = await persistencia.carregarAtendimentos()
      if (atendimentos.some((atendimento) => atendimento.atividadeId === id)) {
        throw new Error(
          'Não dá para apagar Atividade que já tem Atendimento. Mover Atendimentos entre Atividades vem depois.',
        )
      }
      const atividades = await persistencia.carregarAtividades()
      await persistencia.gravarAtividades(atividades.filter((atividade) => atividade.id !== id))
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
