import { describe, expect, test } from 'vitest'

import { persistenciaEmMemoria } from '@/registro-local/memoria'
import { criarRegistroLocal } from '@/registro-local/registro-local'
import type { Atendimento } from '@/registro-local/tipos'

const NOMES_SEMENTE = [
  'Abordagem de rua',
  'Acolhimento / abrigo',
  'Distribuição de alimentos',
  'Encaminhamento',
  'Atendimento psicossocial',
  'Outro',
]

function atendimentoBase(parcial: Partial<Atendimento> & { id: string }): Atendimento {
  return {
    atividadeId: 'plantao',
    criadoEm: '2026-01-01T00:00:00.000Z',
    ...parcial,
  }
}

describe('RegistroLocal', () => {
  test('na primeira abertura com catálogo vazio existem as seis Atividades semente', async () => {
    const registro = criarRegistroLocal(persistenciaEmMemoria())

    const nomes = (await registro.listarAtividades()).map((atividade) => atividade.nome)

    expect(nomes).toEqual(NOMES_SEMENTE)
  })

  test('reabrir o catálogo já gravado não duplica nem substitui as Atividades', async () => {
    const persistencia = persistenciaEmMemoria()
    const primeiraAbertura = criarRegistroLocal(persistencia)
    await primeiraAbertura.listarAtividades()

    const naReabertura = await criarRegistroLocal(persistencia).listarAtividades()

    expect(naReabertura.map((atividade) => atividade.nome)).toEqual(NOMES_SEMENTE)
    expect(naReabertura).toHaveLength(6)
  })

  test('dois Operadores no mesmo aparelho veem o mesmo catálogo', async () => {
    const persistencia = persistenciaEmMemoria()
    const primeiro = criarRegistroLocal(persistencia)
    const segundo = criarRegistroLocal(persistencia)

    const vistoPeloPrimeiro = await primeiro.listarAtividades()
    const vistoPeloSegundo = await segundo.listarAtividades()

    expect(vistoPeloSegundo).toEqual(vistoPeloPrimeiro)
  })

  test('catálogo que já tem Atividade não recebe as sementes', async () => {
    const persistencia = persistenciaEmMemoria([
      {
        id: 'atividade-existente',
        nome: 'Mutirão de cobertores',
        criadaEm: '2026-01-01T00:00:00.000Z',
        atualizadaEm: '2026-01-01T00:00:00.000Z',
      },
    ])
    const registro = criarRegistroLocal(persistencia)

    const atividades = await registro.listarAtividades()

    expect(atividades.map((atividade) => atividade.nome)).toEqual(['Mutirão de cobertores'])
  })

  test('grava Atendimento anônimo só com a Atividade e ele entra no total', async () => {
    const registro = criarRegistroLocal(persistenciaEmMemoria())
    const [atividade] = await registro.listarAtividades()

    await registro.criarAtendimento({ atividadeId: atividade.id })

    const lista = await registro.listarAtendimentos()
    expect(lista).toHaveLength(1)
    expect(lista[0]).toMatchObject({
      atividadeId: atividade.id,
    })
    expect(lista[0]?.nome).toBeUndefined()
    expect(lista[0]?.cpf).toBeUndefined()
    expect((await registro.indicadores()).totalAtendimentos).toBe(1)
  })

  test('dois saves com o mesmo CPF são dois Atendimentos, não um cadastro de pessoa', async () => {
    const registro = criarRegistroLocal(persistenciaEmMemoria())
    const [atividade] = await registro.listarAtividades()

    await registro.criarAtendimento({
      atividadeId: atividade.id,
      nome: 'Maria',
      cpf: '52998224725',
    })
    await registro.criarAtendimento({
      atividadeId: atividade.id,
      nome: 'Maria',
      cpf: '52998224725',
    })

    const lista = await registro.listarAtendimentos()
    expect(lista).toHaveLength(2)
    expect(lista[0]?.id).not.toBe(lista[1]?.id)
    expect(lista.map((atendimento) => atendimento.cpf)).toEqual(['52998224725', '52998224725'])
    expect(lista.map((atendimento) => atendimento.nome)).toEqual(['Maria', 'Maria'])
    expect((await registro.indicadores()).totalAtendimentos).toBe(2)
  })

  test('dois Atendimentos com o mesmo nome e sem CPF não viram uma pessoa', async () => {
    const registro = criarRegistroLocal(persistenciaEmMemoria())
    const [atividade] = await registro.listarAtividades()

    await registro.criarAtendimento({ atividadeId: atividade.id, nome: 'João' })
    await registro.criarAtendimento({ atividadeId: atividade.id, nome: 'João' })

    expect(await registro.listarAtendimentos()).toHaveLength(2)
    expect((await registro.indicadores()).totalAtendimentos).toBe(2)
  })

  test('recusa gravar Atendimento sem Atividade', async () => {
    const registro = criarRegistroLocal(persistenciaEmMemoria())
    await registro.listarAtividades()

    await expect(registro.criarAtendimento({ atividadeId: '' })).rejects.toThrow(
      'Atendimento precisa de uma Atividade',
    )
    expect(await registro.listarAtendimentos()).toHaveLength(0)
    expect((await registro.indicadores()).totalAtendimentos).toBe(0)
  })

  test('recusa gravar Atendimento para Atividade que não existe neste aparelho', async () => {
    const registro = criarRegistroLocal(persistenciaEmMemoria())
    await registro.listarAtividades()

    await expect(
      registro.criarAtendimento({ atividadeId: 'atividade-inexistente' }),
    ).rejects.toThrow('Atendimento precisa de uma Atividade')
    expect(await registro.listarAtendimentos()).toHaveLength(0)
  })

  test('lista Atendimentos do último criado primeiro', async () => {
    const registro = criarRegistroLocal(persistenciaEmMemoria())
    const [atividade] = await registro.listarAtividades()

    const primeiro = await registro.criarAtendimento({
      atividadeId: atividade.id,
      nome: 'Primeiro',
    })
    const segundo = await registro.criarAtendimento({
      atividadeId: atividade.id,
      nome: 'Segundo',
    })

    expect((await registro.listarAtendimentos()).map((atendimento) => atendimento.id)).toEqual([
      segundo.id,
      primeiro.id,
    ])
  })

  test('lista Atendimentos pela data de criação, não pela ordem de inserção', async () => {
    const registro = criarRegistroLocal(
      persistenciaEmMemoria(
        [
          {
            id: 'atividade-existente',
            nome: 'Mutirão de cobertores',
            criadaEm: '2026-01-01T00:00:00.000Z',
            atualizadaEm: '2026-01-01T00:00:00.000Z',
          },
        ],
        [
          {
            id: 'mais-novo',
            atividadeId: 'atividade-existente',
            criadoEm: '2026-06-01T12:00:00.000Z',
            nome: 'Novo',
          },
          {
            id: 'mais-velho',
            atividadeId: 'atividade-existente',
            criadoEm: '2026-01-02T12:00:00.000Z',
            nome: 'Velho',
          },
        ],
      ),
    )

    expect((await registro.listarAtendimentos()).map((atendimento) => atendimento.id)).toEqual([
      'mais-novo',
      'mais-velho',
    ])
  })

  test('total de Indicadores conta Atendimentos anônimos junto com os identificados', async () => {
    const registro = criarRegistroLocal(persistenciaEmMemoria())
    const [atividade] = await registro.listarAtividades()

    await registro.criarAtendimento({ atividadeId: atividade.id })
    await registro.criarAtendimento({
      atividadeId: atividade.id,
      nome: 'Ana',
      cpf: '52998224725',
    })

    expect((await registro.indicadores()).totalAtendimentos).toBe(2)
  })

  test('Atendimento aponta para a Atividade pela identidade do cadastro auxiliar', async () => {
    const registro = criarRegistroLocal(persistenciaEmMemoria())
    const [atividade] = await registro.listarAtividades()

    await registro.criarAtendimento({ atividadeId: atividade.id, nome: 'Carla' })

    const [atendimento] = await registro.listarAtendimentos()
    const atividadeLigada = (await registro.listarAtividades()).find(
      (item) => item.id === atendimento?.atividadeId,
    )

    expect(atendimento?.atividadeId).toBe(atividade.id)
    expect(atividadeLigada?.nome).toBe(atividade.nome)
  })

  test('reabrir o aparelho preserva os Atendimentos já gravados', async () => {
    const persistencia = persistenciaEmMemoria()
    const primeiraAbertura = criarRegistroLocal(persistencia)
    const [atividade] = await primeiraAbertura.listarAtividades()
    await primeiraAbertura.criarAtendimento({ atividadeId: atividade.id, nome: 'Lia' })

    const naReabertura = criarRegistroLocal(persistencia)
    const lista = await naReabertura.listarAtendimentos()

    expect(lista).toHaveLength(1)
    expect(lista[0]?.nome).toBe('Lia')
    expect(lista[0]?.atividadeId).toBe(atividade.id)
    expect((await naReabertura.indicadores()).totalAtendimentos).toBe(1)
  })

  test('dois Operadores no mesmo aparelho veem os mesmos Atendimentos', async () => {
    const persistencia = persistenciaEmMemoria()
    const primeiro = criarRegistroLocal(persistencia)
    const segundo = criarRegistroLocal(persistencia)
    const [atividade] = await primeiro.listarAtividades()

    await primeiro.criarAtendimento({ atividadeId: atividade.id })

    expect(await segundo.listarAtendimentos()).toEqual(await primeiro.listarAtendimentos())
    expect((await segundo.indicadores()).totalAtendimentos).toBe(1)
  })

  test('escolhe a Atividade vigente neste aparelho e ela fica disponível', async () => {
    const registro = criarRegistroLocal(persistenciaEmMemoria())
    const [atividade] = await registro.listarAtividades()

    await registro.definirAtividadeVigente(atividade.id)

    expect(await registro.obterAtividadeVigente()).toEqual(atividade)
  })

  test('reabrir o aparelho preserva a Atividade vigente', async () => {
    const persistencia = persistenciaEmMemoria()
    const primeiraAbertura = criarRegistroLocal(persistencia)
    const [atividade] = await primeiraAbertura.listarAtividades()
    await primeiraAbertura.definirAtividadeVigente(atividade.id)

    expect(await criarRegistroLocal(persistencia).obterAtividadeVigente()).toEqual(atividade)
  })

  test('Atendimentos seguintes herdam a Atividade vigente até o Operador trocá-la', async () => {
    const registro = criarRegistroLocal(persistenciaEmMemoria())
    const [primeira, segunda] = await registro.listarAtividades()
    await registro.definirAtividadeVigente(primeira.id)

    const primeiro = await registro.criarAtendimento({})
    const segundo = await registro.criarAtendimento({})
    await registro.definirAtividadeVigente(segunda.id)
    const terceiro = await registro.criarAtendimento({})

    expect(primeiro.atividadeId).toBe(primeira.id)
    expect(segundo.atividadeId).toBe(primeira.id)
    expect(terceiro.atividadeId).toBe(segunda.id)
    expect((await registro.obterAtividadeVigente())?.id).toBe(segunda.id)
  })

  test('recusa gravar Atendimento sem Atividade vigente', async () => {
    const registro = criarRegistroLocal(persistenciaEmMemoria())
    await registro.listarAtividades()

    await expect(registro.criarAtendimento({})).rejects.toThrow(
      'Atendimento precisa de uma Atividade',
    )
    expect(await registro.listarAtendimentos()).toHaveLength(0)
  })

  test('obtém o Atendimento pelo id para conferência só leitura', async () => {
    const registro = criarRegistroLocal(persistenciaEmMemoria())
    const [atividade] = await registro.listarAtividades()
    await registro.definirAtividadeVigente(atividade.id)
    const gravado = await registro.criarAtendimento({})

    expect(await registro.obterAtendimento(gravado.id)).toEqual(gravado)
    expect(await registro.obterAtendimento('inexistente')).toBeNull()
  })

  test('dois Operadores no mesmo aparelho veem a mesma Atividade vigente', async () => {
    const persistencia = persistenciaEmMemoria()
    const primeiro = criarRegistroLocal(persistencia)
    const segundo = criarRegistroLocal(persistencia)
    const [atividade] = await primeiro.listarAtividades()
    await primeiro.definirAtividadeVigente(atividade.id)

    expect(await segundo.obterAtividadeVigente()).toEqual(await primeiro.obterAtividadeVigente())
  })

  test('cria Atividade pelo nome e ela classifica Atendimento', async () => {
    const registro = criarRegistroLocal(persistenciaEmMemoria())
    await registro.listarAtividades()

    const criada = await registro.criarAtividade('Mutirão de cobertores')
    const atendimento = await registro.criarAtendimento({ atividadeId: criada.id, nome: 'Lia' })

    expect(criada.nome).toBe('Mutirão de cobertores')
    expect((await registro.listarAtividades()).map((atividade) => atividade.nome)).toContain(
      'Mutirão de cobertores',
    )
    expect(atendimento.atividadeId).toBe(criada.id)
  })

  test('renomear Atividade atualiza o rótulo e mantém a identidade vigente', async () => {
    const registro = criarRegistroLocal(persistenciaEmMemoria())
    const criada = await registro.criarAtividade('Mutirão')
    await registro.definirAtividadeVigente(criada.id)
    await registro.criarAtendimento({ nome: 'Lia' })

    await registro.renomearAtividade(criada.id, 'Mutirão de cobertores')

    const [atendimento] = await registro.listarAtendimentos()
    const vigente = await registro.obterAtividadeVigente()
    const ligada = (await registro.listarAtividades()).find(
      (atividade) => atividade.id === atendimento?.atividadeId,
    )

    expect(atendimento?.atividadeId).toBe(criada.id)
    expect(ligada?.nome).toBe('Mutirão de cobertores')
    expect(vigente?.id).toBe(criada.id)
    expect(vigente?.nome).toBe('Mutirão de cobertores')
  })

  test('apaga Atividade com zero Atendimentos', async () => {
    const registro = criarRegistroLocal(persistenciaEmMemoria())
    const criada = await registro.criarAtividade('Erro de digitação')

    await registro.apagarAtividade(criada.id)

    expect(
      (await registro.listarAtividades()).some((atividade) => atividade.id === criada.id),
    ).toBe(false)
  })

  test('recusa apagar Atividade que já tem Atendimento', async () => {
    const registro = criarRegistroLocal(persistenciaEmMemoria())
    const criada = await registro.criarAtividade('Plantão')
    await registro.criarAtendimento({ atividadeId: criada.id })

    await expect(registro.apagarAtividade(criada.id)).rejects.toThrow(
      'Não dá para apagar Atividade que já tem Atendimento. Mover Atendimentos entre Atividades vem depois.',
    )
    expect(
      (await registro.listarAtividades()).some((atividade) => atividade.id === criada.id),
    ).toBe(true)
    expect(await registro.listarAtendimentos()).toHaveLength(1)
  })

  test('apagar a Atividade vigente força escolher outra antes do próximo save', async () => {
    const registro = criarRegistroLocal(persistenciaEmMemoria())
    const criada = await registro.criarAtividade('Turno da manhã')
    await registro.definirAtividadeVigente(criada.id)

    await registro.apagarAtividade(criada.id)

    expect(await registro.obterAtividadeVigente()).toBeNull()
    await expect(registro.criarAtendimento({})).rejects.toThrow(
      'Atendimento precisa de uma Atividade',
    )
  })

  test('Outro se comporta como qualquer Atividade: dá para renomear e apagar se não tiver Atendimento', async () => {
    const registro = criarRegistroLocal(persistenciaEmMemoria())
    const outro = (await registro.listarAtividades()).find(
      (atividade) => atividade.nome === 'Outro',
    )

    await registro.renomearAtividade(outro!.id, 'Plantão noturno')
    expect((await registro.listarAtividades()).map((atividade) => atividade.nome)).not.toContain(
      'Outro',
    )
    expect(
      (await registro.listarAtividades()).some((atividade) => atividade.nome === 'Plantão noturno'),
    ).toBe(true)

    await registro.apagarAtividade(outro!.id)
    expect(
      (await registro.listarAtividades()).some((atividade) => atividade.id === outro!.id),
    ).toBe(false)
  })

  test('recusa gravar Atendimento com CPF inválido e não cria a linha', async () => {
    const registro = criarRegistroLocal(persistenciaEmMemoria())
    const [atividade] = await registro.listarAtividades()

    await expect(
      registro.criarAtendimento({
        atividadeId: atividade.id,
        cpf: '111.111.111-11',
      }),
    ).rejects.toThrow('CPF inválido')
    expect(await registro.listarAtendimentos()).toHaveLength(0)
  })

  test('CPF vazio continua válido no Atendimento anônimo', async () => {
    const registro = criarRegistroLocal(persistenciaEmMemoria())
    const [atividade] = await registro.listarAtividades()

    const gravado = await registro.criarAtendimento({
      atividadeId: atividade.id,
      cpf: '',
    })

    expect(gravado.cpf).toBeUndefined()
    expect(await registro.obterAtendimento(gravado.id)).toEqual(gravado)
  })

  test('CPF com pontuação diferente guarda o mesmo valor só com dígitos', async () => {
    const registro = criarRegistroLocal(persistenciaEmMemoria())
    const [atividade] = await registro.listarAtividades()

    const comMascara = await registro.criarAtendimento({
      atividadeId: atividade.id,
      cpf: '529.982.247-25',
    })
    const semMascara = await registro.criarAtendimento({
      atividadeId: atividade.id,
      cpf: '52998224725',
    })

    expect(comMascara.cpf).toBe('52998224725')
    expect(semMascara.cpf).toBe('52998224725')
    expect(await registro.listarAtendimentos()).toHaveLength(2)
  })

  test('grava os campos opcionais independentemente e o detalhe lê o que foi salvo', async () => {
    const registro = criarRegistroLocal(persistenciaEmMemoria())
    const [atividade] = await registro.listarAtividades()

    const completo = await registro.criarAtendimento({
      atividadeId: atividade.id,
      nome: 'Maria',
      cpf: '529.982.247-25',
      dataNascimento: '1990-05-17',
      racaCor: 'parda',
      escolaridade: 'médio completo',
      faixaRenda: '1–2',
      cidade: 'Canoas',
      bairro: 'Centro',
      situacaoRua: 'não',
      usoSubstancias: 'álcool',
      dataDoAtendimento: '2026-03-10',
    })
    const soCidade = await registro.criarAtendimento({
      atividadeId: atividade.id,
      cidade: 'Porto Alegre',
    })

    expect(await registro.obterAtendimento(completo.id)).toMatchObject({
      nome: 'Maria',
      cpf: '52998224725',
      dataNascimento: '1990-05-17',
      racaCor: 'parda',
      escolaridade: 'médio completo',
      faixaRenda: '1–2',
      cidade: 'Canoas',
      bairro: 'Centro',
      situacaoRua: 'não',
      usoSubstancias: 'álcool',
      dataDoAtendimento: '2026-03-10',
    })
    expect(soCidade.cidade).toBe('Porto Alegre')
    expect(soCidade.nome).toBeUndefined()
    expect(soCidade.racaCor).toBeUndefined()
    expect(soCidade.dataDoAtendimento).toBeUndefined()
  })

  test('recusa data de nascimento no futuro', async () => {
    const registro = criarRegistroLocal(persistenciaEmMemoria())
    const [atividade] = await registro.listarAtividades()

    await expect(
      registro.criarAtendimento({
        atividadeId: atividade.id,
        dataNascimento: '2099-01-01',
      }),
    ).rejects.toThrow('Data de nascimento no futuro não entra')
    expect(await registro.listarAtendimentos()).toHaveLength(0)
  })

  test('data do atendimento no passado não muda a ordem da lista, que continua pela criação', async () => {
    const registro = criarRegistroLocal(persistenciaEmMemoria())
    const [atividade] = await registro.listarAtividades()

    const primeiro = await registro.criarAtendimento({
      atividadeId: atividade.id,
      nome: 'Primeiro',
      dataDoAtendimento: '2020-01-01',
    })
    const segundo = await registro.criarAtendimento({
      atividadeId: atividade.id,
      nome: 'Segundo',
      dataDoAtendimento: '2019-01-01',
    })

    expect((await registro.listarAtendimentos()).map((atendimento) => atendimento.id)).toEqual([
      segundo.id,
      primeiro.id,
    ])
    expect(primeiro.dataDoAtendimento).toBe('2020-01-01')
    expect(segundo.dataDoAtendimento).toBe('2019-01-01')
  })

  test('apagar até zerar o catálogo não traz as sementes de volta', async () => {
    const registro = criarRegistroLocal(persistenciaEmMemoria())
    const iniciais = await registro.listarAtividades()
    for (const atividade of iniciais) {
      await registro.apagarAtividade(atividade.id)
    }

    expect(await registro.listarAtividades()).toEqual([])
    await registro.criarAtividade('Plantão da casa')
    expect((await registro.listarAtividades()).map((atividade) => atividade.nome)).toEqual([
      'Plantão da casa',
    ])
  })

  test('sem Atendimento os Indicadores ficam no estado vazio, sem recorte quebrado', async () => {
    const registro = criarRegistroLocal(persistenciaEmMemoria())
    await registro.listarAtividades()

    expect(await registro.indicadores()).toEqual({
      totalAtendimentos: 0,
      porAtividade: [],
      porRacaCor: [],
      porEscolaridade: [],
      porFaixaRenda: [],
      porFaixaEtaria: [],
      porSituacaoRua: [],
      porUsoSubstancias: [],
      porCidade: [],
    })
  })

  test('Atendimento anônimo entra no total e os campos vazios viram Não informado', async () => {
    const registro = criarRegistroLocal(persistenciaEmMemoria())
    const [atividade] = await registro.listarAtividades()
    await registro.criarAtendimento({ atividadeId: atividade.id })
    await registro.criarAtendimento({ atividadeId: atividade.id })

    const naoInformado = { chave: 'Não informado', quantidade: 2 }
    expect(await registro.indicadores()).toEqual({
      totalAtendimentos: 2,
      porAtividade: [{ chave: atividade.nome, quantidade: 2 }],
      porRacaCor: [naoInformado],
      porEscolaridade: [naoInformado],
      porFaixaRenda: [naoInformado],
      porFaixaEtaria: [naoInformado],
      porSituacaoRua: [naoInformado],
      porUsoSubstancias: [naoInformado],
      porCidade: [naoInformado],
    })
  })

  test('faixa etária deriva da data de nascimento e nascimento futuro cai em Não informado', async () => {
    const registro = criarRegistroLocal(
      persistenciaEmMemoria(
        [
          {
            id: 'plantao',
            nome: 'Plantão',
            criadaEm: '2026-01-01T00:00:00.000Z',
            atualizadaEm: '2026-01-01T00:00:00.000Z',
          },
        ],
        [
          atendimentoBase({ id: 'crianca', dataNascimento: '2020-01-15' }),
          atendimentoBase({ id: 'adolescente', dataNascimento: '2012-01-15' }),
          atendimentoBase({ id: 'jovem', dataNascimento: '2000-01-15' }),
          atendimentoBase({ id: 'adulto', dataNascimento: '1980-01-15' }),
          atendimentoBase({ id: 'idoso', dataNascimento: '1950-01-15' }),
          atendimentoBase({ id: 'futuro', dataNascimento: '2099-01-01' }),
          atendimentoBase({ id: 'sem-data' }),
        ],
      ),
    )

    expect((await registro.indicadores()).porFaixaEtaria).toEqual([
      { chave: '0–11', quantidade: 1 },
      { chave: '12–17', quantidade: 1 },
      { chave: '18–29', quantidade: 1 },
      { chave: '30–59', quantidade: 1 },
      { chave: '60+', quantidade: 1 },
      { chave: 'Não informado', quantidade: 2 },
    ])
  })

  test('filtro recorta Indicadores por uma Atividade e Atividade sem linha fica vazia', async () => {
    const registro = criarRegistroLocal(persistenciaEmMemoria())
    const [rua, abrigo] = await registro.listarAtividades()
    await registro.criarAtendimento({
      atividadeId: rua.id,
      racaCor: 'parda',
      cidade: 'Canoas',
    })
    await registro.criarAtendimento({
      atividadeId: abrigo.id,
      racaCor: 'branca',
      cidade: 'Porto Alegre',
    })
    const semMovimento = await registro.criarAtividade('Mutirão novo')

    expect(await registro.indicadores()).toMatchObject({
      totalAtendimentos: 2,
      porAtividade: [
        { chave: rua.nome, quantidade: 1 },
        { chave: abrigo.nome, quantidade: 1 },
      ],
      porRacaCor: [
        { chave: 'branca', quantidade: 1 },
        { chave: 'parda', quantidade: 1 },
      ],
      porCidade: [
        { chave: 'Canoas', quantidade: 1 },
        { chave: 'Porto Alegre', quantidade: 1 },
      ],
    })
    expect(await registro.indicadores({ atividadeId: rua.id })).toMatchObject({
      totalAtendimentos: 1,
      porAtividade: [{ chave: rua.nome, quantidade: 1 }],
      porRacaCor: [{ chave: 'parda', quantidade: 1 }],
      porCidade: [{ chave: 'Canoas', quantidade: 1 }],
    })
    expect(await registro.indicadores({ atividadeId: semMovimento.id })).toEqual({
      totalAtendimentos: 0,
      porAtividade: [],
      porRacaCor: [],
      porEscolaridade: [],
      porFaixaRenda: [],
      porFaixaEtaria: [],
      porSituacaoRua: [],
      porUsoSubstancias: [],
      porCidade: [],
    })
  })

  test('Nome, CPF e bairro não entram nos Indicadores nem como categoria', async () => {
    const registro = criarRegistroLocal(persistenciaEmMemoria())
    const [atividade] = await registro.listarAtividades()
    await registro.criarAtendimento({
      atividadeId: atividade.id,
      nome: 'Maria Silva',
      cpf: '529.982.247-25',
      bairro: 'Mathias Velho',
      cidade: 'Canoas',
    })

    const indicadores = await registro.indicadores()
    const texto = JSON.stringify(indicadores)
    expect(texto).not.toContain('Maria Silva')
    expect(texto).not.toContain('52998224725')
    expect(texto).not.toContain('Mathias Velho')
    expect(indicadores.porCidade).toEqual([{ chave: 'Canoas', quantidade: 1 }])
  })

  test('renomear Atividade atualiza a chave do recorte por Atividade', async () => {
    const registro = criarRegistroLocal(persistenciaEmMemoria())
    const criada = await registro.criarAtividade('Mutirão')
    await registro.criarAtendimento({ atividadeId: criada.id })

    await registro.renomearAtividade(criada.id, 'Mutirão de cobertores')

    expect((await registro.indicadores()).porAtividade).toEqual([
      { chave: 'Mutirão de cobertores', quantidade: 1 },
    ])
  })

  test('recorte fecha escolaridade, renda, situação de rua e uso de substâncias', async () => {
    const registro = criarRegistroLocal(persistenciaEmMemoria())
    const [atividade] = await registro.listarAtividades()
    await registro.criarAtendimento({
      atividadeId: atividade.id,
      escolaridade: 'médio completo',
      faixaRenda: '1–2',
      situacaoRua: 'não',
      usoSubstancias: 'álcool',
    })
    await registro.criarAtendimento({ atividadeId: atividade.id })

    const indicadores = await registro.indicadores()
    expect(indicadores.porEscolaridade).toEqual([
      { chave: 'médio completo', quantidade: 1 },
      { chave: 'Não informado', quantidade: 1 },
    ])
    expect(indicadores.porFaixaRenda).toEqual([
      { chave: '1–2', quantidade: 1 },
      { chave: 'Não informado', quantidade: 1 },
    ])
    expect(indicadores.porSituacaoRua).toEqual([
      { chave: 'não', quantidade: 1 },
      { chave: 'Não informado', quantidade: 1 },
    ])
    expect(indicadores.porUsoSubstancias).toEqual([
      { chave: 'álcool', quantidade: 1 },
      { chave: 'Não informado', quantidade: 1 },
    ])
  })
})
