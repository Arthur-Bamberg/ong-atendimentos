import type { Atendimento, Atividade, Persistencia, RegistroLocal } from '@/registro-local/tipos'

const NOMES_SEMENTE = [
  'Abordagem de rua',
  'Acolhimento / abrigo',
  'Distribuição de alimentos',
  'Encaminhamento',
  'Atendimento psicossocial',
  'Outro',
] as const

function cpfCanonico(cpf: string | undefined): string | undefined {
  const digitos = cpf?.replace(/\D/g, '') ?? ''
  if (!digitos) {
    return undefined
  }
  if (!cpfValido(digitos)) {
    throw new Error('CPF inválido')
  }
  return digitos
}

function cpfValido(digitos: string): boolean {
  if (digitos.length !== 11 || /^(\d)\1{10}$/.test(digitos)) {
    return false
  }
  const dv = (base: number) => {
    let soma = 0
    for (let indice = 0; indice < base; indice += 1) {
      soma += Number(digitos[indice]) * (base + 1 - indice)
    }
    const resto = (soma * 10) % 11
    return resto === 10 ? 0 : resto
  }
  return dv(9) === Number(digitos[9]) && dv(10) === Number(digitos[10])
}

function textoOpcional(valor: string | undefined): string | undefined {
  const limpo = valor?.trim()
  return limpo ? limpo : undefined
}

function dataLocalHoje(): string {
  const agora = new Date()
  const mes = String(agora.getMonth() + 1).padStart(2, '0')
  const dia = String(agora.getDate()).padStart(2, '0')
  return `${agora.getFullYear()}-${mes}-${dia}`
}

function dataNascimentoCanonico(valor: string | undefined): string | undefined {
  const data = textoOpcional(valor)
  if (!data) {
    return undefined
  }
  if (data > dataLocalHoje()) {
    throw new Error('Data de nascimento no futuro não entra')
  }
  return data
}

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
      const cpf = cpfCanonico(dados.cpf)
      const nome = textoOpcional(dados.nome)
      const dataNascimento = dataNascimentoCanonico(dados.dataNascimento)
      const cidade = textoOpcional(dados.cidade)
      const bairro = textoOpcional(dados.bairro)
      const dataDoAtendimento = textoOpcional(dados.dataDoAtendimento)
      const atendimento: Atendimento = {
        id: crypto.randomUUID(),
        atividadeId,
        criadoEm: new Date().toISOString(),
        ...(nome ? { nome } : {}),
        ...(cpf ? { cpf } : {}),
        ...(dataNascimento ? { dataNascimento } : {}),
        ...(dados.racaCor ? { racaCor: dados.racaCor } : {}),
        ...(dados.escolaridade ? { escolaridade: dados.escolaridade } : {}),
        ...(dados.faixaRenda ? { faixaRenda: dados.faixaRenda } : {}),
        ...(cidade ? { cidade } : {}),
        ...(bairro ? { bairro } : {}),
        ...(dados.situacaoRua ? { situacaoRua: dados.situacaoRua } : {}),
        ...(dados.usoSubstancias ? { usoSubstancias: dados.usoSubstancias } : {}),
        ...(dataDoAtendimento ? { dataDoAtendimento } : {}),
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
