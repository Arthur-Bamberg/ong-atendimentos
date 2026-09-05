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
})
