import { describe, expect, test } from 'vitest'

import { persistenciaEmMemoria } from '@/registro-local/memoria'
import { criarRegistroLocal } from '@/registro-local/registro-local'

const NOMES_SEMENTE = [
  'Abordagem de rua',
  'Acolhimento / abrigo',
  'Distribuição de alimentos',
  'Encaminhamento',
  'Atendimento psicossocial',
  'Outro',
]

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

    expect(await registro.indicadores()).toEqual({ totalAtendimentos: 2 })
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
})
