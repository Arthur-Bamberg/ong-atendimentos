import {
  FAIXAS_ETARIAS,
  OPCOES_ESCOLARIDADE,
  OPCOES_FAIXA_RENDA,
  OPCOES_RACA_COR,
  OPCOES_SITUACAO_RUA,
  OPCOES_USO_SUBSTANCIAS,
  type Atendimento,
  type Atividade,
  type Bucket,
  type Persistencia,
  type RegistroLocal,
} from '@/registro-local/tipos'

const NAO_INFORMADO = 'Não informado'

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

function bucketsDe(valores: (string | undefined)[], ordem?: readonly string[]): Bucket[] {
  if (valores.length === 0) {
    return []
  }
  const mapa = new Map<string, number>()
  for (const valor of valores) {
    const chave = valor?.trim() ? valor : NAO_INFORMADO
    mapa.set(chave, (mapa.get(chave) ?? 0) + 1)
  }
  const conhecidas =
    ordem?.filter((chave) => mapa.has(chave)) ??
    [...mapa.keys()].filter((chave) => chave !== NAO_INFORMADO)
  const extras = ordem
    ? [...mapa.keys()].filter((chave) => chave !== NAO_INFORMADO && !ordem.includes(chave))
    : []
  const buckets = [...conhecidas, ...extras].map((chave) => ({
    chave,
    quantidade: mapa.get(chave) ?? 0,
  }))
  const naoInformado = mapa.get(NAO_INFORMADO)
  if (naoInformado) {
    buckets.push({ chave: NAO_INFORMADO, quantidade: naoInformado })
  }
  return buckets
}

function idadeEmAnos(nascimento: string, hoje: string): number | undefined {
  const [anoNasc, mesNasc, diaNasc] = nascimento.split('-').map(Number)
  const [anoHoje, mesHoje, diaHoje] = hoje.split('-').map(Number)
  if (!anoNasc || !mesNasc || !diaNasc || !anoHoje || !mesHoje || !diaHoje) {
    return undefined
  }
  let idade = anoHoje - anoNasc
  if (mesHoje < mesNasc || (mesHoje === mesNasc && diaHoje < diaNasc)) {
    idade -= 1
  }
  return idade
}

function faixaEtaria(dataNascimento: string | undefined, hoje: string): string | undefined {
  if (!dataNascimento || dataNascimento > hoje) {
    return undefined
  }
  const idade = idadeEmAnos(dataNascimento, hoje)
  if (idade === undefined || idade < 0) {
    return undefined
  }
  if (idade <= 11) {
    return '0–11'
  }
  if (idade <= 17) {
    return '12–17'
  }
  if (idade <= 29) {
    return '18–29'
  }
  if (idade <= 59) {
    return '30–59'
  }
  return '60+'
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
    async indicadores(filtro) {
      const todos = await persistencia.carregarAtendimentos()
      const atendimentos = filtro?.atividadeId
        ? todos.filter((atendimento) => atendimento.atividadeId === filtro.atividadeId)
        : todos
      const atividades = await persistencia.carregarAtividades()
      const nomePorId = new Map(atividades.map((atividade) => [atividade.id, atividade.nome]))
      return {
        totalAtendimentos: atendimentos.length,
        porAtividade: bucketsDe(
          atendimentos.map((atendimento) => nomePorId.get(atendimento.atividadeId)),
        ),
        porRacaCor: bucketsDe(
          atendimentos.map((atendimento) => atendimento.racaCor),
          OPCOES_RACA_COR,
        ),
        porEscolaridade: bucketsDe(
          atendimentos.map((atendimento) => atendimento.escolaridade),
          OPCOES_ESCOLARIDADE,
        ),
        porFaixaRenda: bucketsDe(
          atendimentos.map((atendimento) => atendimento.faixaRenda),
          OPCOES_FAIXA_RENDA,
        ),
        porFaixaEtaria: bucketsDe(
          atendimentos.map((atendimento) =>
            faixaEtaria(atendimento.dataNascimento, dataLocalHoje()),
          ),
          FAIXAS_ETARIAS,
        ),
        porSituacaoRua: bucketsDe(
          atendimentos.map((atendimento) => atendimento.situacaoRua),
          OPCOES_SITUACAO_RUA,
        ),
        porUsoSubstancias: bucketsDe(
          atendimentos.map((atendimento) => atendimento.usoSubstancias),
          OPCOES_USO_SUBSTANCIAS,
        ),
        porCidade: bucketsDe(atendimentos.map((atendimento) => atendimento.cidade)),
      }
    },
  }
}
