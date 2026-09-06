import * as SQLite from 'expo-sqlite'

import type { BaseNesteAparelho, FachadaNesteAparelho } from '@/infra/tipos-base'
import {
  OPCOES_PROGRAMA_SOCIAL,
  type Atendimento,
  type Atividade,
  type Escolaridade,
  type FaixaRenda,
  type Persistencia,
  type ProgramaSocial,
  type RacaCor,
  type SituacaoRua,
  type UsoSubstancias,
} from '@/registro-local/tipos'

type LinhaAtividade = {
  id: string
  nome: string
  criada_em: string
  atualizada_em: string
}

type LinhaAtendimento = {
  id: string
  atividade_id: string
  nome: string | null
  cpf: string | null
  data_nascimento: string | null
  raca_cor: string | null
  escolaridade: string | null
  faixa_renda: string | null
  cidade: string | null
  bairro: string | null
  situacao_rua: string | null
  uso_substancias: string | null
  programas_sociais: string | null
  observacao_programas_sociais: string | null
  pode_participar_programas_sociais: string | null
  data_do_atendimento: string | null
  criado_em: string
}

type LinhaPreferencia = {
  valor: string
}

const NOME_BASE = 'base-local.db'

let abertura: Promise<BaseNesteAparelho> | null = null

const COLUNAS_ATENDIMENTO = [
  ['data_nascimento', 'TEXT'],
  ['raca_cor', 'TEXT'],
  ['escolaridade', 'TEXT'],
  ['faixa_renda', 'TEXT'],
  ['cidade', 'TEXT'],
  ['bairro', 'TEXT'],
  ['situacao_rua', 'TEXT'],
  ['uso_substancias', 'TEXT'],
  ['programas_sociais', 'TEXT'],
  ['observacao_programas_sociais', 'TEXT'],
  ['pode_participar_programas_sociais', 'TEXT'],
  ['data_do_atendimento', 'TEXT'],
] as const

export function abrirBaseNesteAparelho(): Promise<BaseNesteAparelho> {
  if (!abertura) {
    abertura = abrirNovaBase().catch((erro: unknown) => {
      abertura = null
      throw erro
    })
  }
  return abertura
}

async function abrirNovaBase(): Promise<BaseNesteAparelho> {
  const db = await SQLite.openDatabaseAsync(NOME_BASE, { useNewConnection: true })

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS atividades (
      id TEXT PRIMARY KEY NOT NULL,
      nome TEXT NOT NULL,
      criada_em TEXT NOT NULL,
      atualizada_em TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS preferencias (
      chave TEXT PRIMARY KEY NOT NULL,
      valor TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS atendimentos (
      id TEXT PRIMARY KEY NOT NULL,
      atividade_id TEXT NOT NULL,
      nome TEXT,
      cpf TEXT,
      criado_em TEXT NOT NULL
    );
  `)
  await garantirColunasAtendimento(db)

  const persistencia: Persistencia = {
    async carregarAtividades() {
      const linhas = await db.getAllAsync<LinhaAtividade>(
        'SELECT id, nome, criada_em, atualizada_em FROM atividades ORDER BY rowid',
      )
      return linhas.map((linha) => ({
        id: linha.id,
        nome: linha.nome,
        criadaEm: linha.criada_em,
        atualizadaEm: linha.atualizada_em,
      }))
    },
    async gravarAtividades(atividades: Atividade[]) {
      await db.withTransactionAsync(async () => {
        await db.runAsync('DELETE FROM atividades')
        for (const atividade of atividades) {
          await db.runAsync(
            'INSERT INTO atividades (id, nome, criada_em, atualizada_em) VALUES (?, ?, ?, ?)',
            [atividade.id, atividade.nome, atividade.criadaEm, atividade.atualizadaEm],
          )
        }
        await db.runAsync(
          "INSERT OR REPLACE INTO preferencias (chave, valor) VALUES ('catalogo_iniciado', 'sim')",
        )
      })
    },
    async jaIniciouCatalogo() {
      const preferencia = await db.getFirstAsync<LinhaPreferencia>(
        "SELECT valor FROM preferencias WHERE chave = 'catalogo_iniciado'",
      )
      if (preferencia?.valor === 'sim') {
        return true
      }
      const linha = await db.getFirstAsync<{ quantidade: number }>(
        'SELECT COUNT(*) AS quantidade FROM atividades',
      )
      return (linha?.quantidade ?? 0) > 0
    },
    async carregarAtendimentos() {
      const linhas = await db.getAllAsync<LinhaAtendimento>(
        `SELECT id, atividade_id, nome, cpf, data_nascimento, raca_cor, escolaridade, faixa_renda,
                cidade, bairro, situacao_rua, uso_substancias, programas_sociais,
                observacao_programas_sociais, pode_participar_programas_sociais,
                data_do_atendimento, criado_em
         FROM atendimentos ORDER BY rowid`,
      )
      return linhas.map(atendimentoDaLinha)
    },
    async gravarAtendimentos(atendimentos: Atendimento[]) {
      await db.withTransactionAsync(async () => {
        await db.runAsync('DELETE FROM atendimentos')
        for (const atendimento of atendimentos) {
          await db.runAsync(
            `INSERT INTO atendimentos (
               id, atividade_id, nome, cpf, data_nascimento, raca_cor, escolaridade, faixa_renda,
               cidade, bairro, situacao_rua, uso_substancias, programas_sociais,
               observacao_programas_sociais, pode_participar_programas_sociais,
               data_do_atendimento, criado_em
             ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              atendimento.id,
              atendimento.atividadeId,
              atendimento.nome ?? null,
              atendimento.cpf ?? null,
              atendimento.dataNascimento ?? null,
              atendimento.racaCor ?? null,
              atendimento.escolaridade ?? null,
              atendimento.faixaRenda ?? null,
              atendimento.cidade ?? null,
              atendimento.bairro ?? null,
              atendimento.situacaoRua ?? null,
              atendimento.usoSubstancias ?? null,
              atendimento.programasSociais ? JSON.stringify(atendimento.programasSociais) : null,
              atendimento.observacaoProgramasSociais ?? null,
              atendimento.podeParticiparProgramasSociais ? 'sim' : null,
              atendimento.dataDoAtendimento ?? null,
              atendimento.criadoEm,
            ],
          )
        }
      })
    },
    async carregarAtividadeVigenteId() {
      const linha = await db.getFirstAsync<LinhaPreferencia>(
        "SELECT valor FROM preferencias WHERE chave = 'atividade_vigente'",
      )
      return linha?.valor ?? null
    },
    async gravarAtividadeVigenteId(atividadeId: string) {
      await db.runAsync(
        "INSERT OR REPLACE INTO preferencias (chave, valor) VALUES ('atividade_vigente', ?)",
        atividadeId,
      )
    },
  }

  const fachada: FachadaNesteAparelho = {
    async jaPassou() {
      const linha = await db.getFirstAsync<LinhaPreferencia>(
        "SELECT valor FROM preferencias WHERE chave = 'fachada_passada'",
      )
      return linha?.valor === 'sim'
    },
    async marcarPassou() {
      await db.runAsync(
        "INSERT OR REPLACE INTO preferencias (chave, valor) VALUES ('fachada_passada', 'sim')",
      )
    },
  }

  return { persistencia, fachada }
}

async function garantirColunasAtendimento(db: SQLite.SQLiteDatabase) {
  const colunas = await db.getAllAsync<{ name: string }>('PRAGMA table_info(atendimentos)')
  const nomes = new Set(colunas.map((coluna) => coluna.name))
  for (const [nome, tipo] of COLUNAS_ATENDIMENTO) {
    if (!nomes.has(nome)) {
      await db.execAsync(`ALTER TABLE atendimentos ADD COLUMN ${nome} ${tipo}`)
    }
  }
}

function opcional(valor: string | null): string | undefined {
  return valor ? valor : undefined
}

function atendimentoDaLinha(linha: LinhaAtendimento): Atendimento {
  const programasSociais = programasDaLinha(linha.programas_sociais)
  return {
    id: linha.id,
    atividadeId: linha.atividade_id,
    criadoEm: linha.criado_em,
    ...(opcional(linha.nome) ? { nome: linha.nome as string } : {}),
    ...(opcional(linha.cpf) ? { cpf: linha.cpf as string } : {}),
    ...(opcional(linha.data_nascimento) ? { dataNascimento: linha.data_nascimento as string } : {}),
    ...(opcional(linha.raca_cor) ? { racaCor: linha.raca_cor as RacaCor } : {}),
    ...(opcional(linha.escolaridade) ? { escolaridade: linha.escolaridade as Escolaridade } : {}),
    ...(opcional(linha.faixa_renda) ? { faixaRenda: linha.faixa_renda as FaixaRenda } : {}),
    ...(opcional(linha.cidade) ? { cidade: linha.cidade as string } : {}),
    ...(opcional(linha.bairro) ? { bairro: linha.bairro as string } : {}),
    ...(opcional(linha.situacao_rua) ? { situacaoRua: linha.situacao_rua as SituacaoRua } : {}),
    ...(opcional(linha.uso_substancias)
      ? { usoSubstancias: linha.uso_substancias as UsoSubstancias }
      : {}),
    ...(programasSociais ? { programasSociais } : {}),
    ...(opcional(linha.observacao_programas_sociais)
      ? { observacaoProgramasSociais: linha.observacao_programas_sociais as string }
      : {}),
    ...(linha.pode_participar_programas_sociais === 'sim'
      ? { podeParticiparProgramasSociais: true }
      : {}),
    ...(opcional(linha.data_do_atendimento)
      ? { dataDoAtendimento: linha.data_do_atendimento as string }
      : {}),
  }
}

function programasDaLinha(bruto: string | null): ProgramaSocial[] | undefined {
  if (!bruto) {
    return undefined
  }
  try {
    const lido = JSON.parse(bruto) as unknown
    if (!Array.isArray(lido)) {
      return undefined
    }
    const escolhidos = new Set(lido.filter((item) => typeof item === 'string'))
    const ordenados = OPCOES_PROGRAMA_SOCIAL.filter((opcao) => escolhidos.has(opcao))
    return ordenados.length > 0 ? [...ordenados] : undefined
  } catch {
    return undefined
  }
}
