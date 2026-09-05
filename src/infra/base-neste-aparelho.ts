import * as SQLite from 'expo-sqlite'

import type { BaseNesteAparelho, FachadaNesteAparelho } from '@/infra/tipos-base'
import type {
  Atendimento,
  Atividade,
  Escolaridade,
  FaixaRenda,
  Persistencia,
  RacaCor,
  SituacaoRua,
  UsoSubstancias,
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
  data_do_atendimento: string | null
  criado_em: string
}

type LinhaPreferencia = {
  valor: string
}

const COLUNAS_ATENDIMENTO = [
  ['data_nascimento', 'TEXT'],
  ['raca_cor', 'TEXT'],
  ['escolaridade', 'TEXT'],
  ['faixa_renda', 'TEXT'],
  ['cidade', 'TEXT'],
  ['bairro', 'TEXT'],
  ['situacao_rua', 'TEXT'],
  ['uso_substancias', 'TEXT'],
  ['data_do_atendimento', 'TEXT'],
] as const

export async function abrirBaseNesteAparelho(): Promise<BaseNesteAparelho> {
  const db = await SQLite.openDatabaseAsync('base-local.db')

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
      await db.withExclusiveTransactionAsync(async (txn) => {
        await txn.runAsync('DELETE FROM atividades')
        for (const atividade of atividades) {
          await txn.runAsync(
            'INSERT INTO atividades (id, nome, criada_em, atualizada_em) VALUES (?, ?, ?, ?)',
            atividade.id,
            atividade.nome,
            atividade.criadaEm,
            atividade.atualizadaEm,
          )
        }
        await txn.runAsync(
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
                cidade, bairro, situacao_rua, uso_substancias, data_do_atendimento, criado_em
         FROM atendimentos ORDER BY rowid`,
      )
      return linhas.map(atendimentoDaLinha)
    },
    async gravarAtendimentos(atendimentos: Atendimento[]) {
      await db.withExclusiveTransactionAsync(async (txn) => {
        await txn.runAsync('DELETE FROM atendimentos')
        for (const atendimento of atendimentos) {
          await txn.runAsync(
            `INSERT INTO atendimentos (
               id, atividade_id, nome, cpf, data_nascimento, raca_cor, escolaridade, faixa_renda,
               cidade, bairro, situacao_rua, uso_substancias, data_do_atendimento, criado_em
             ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
            atendimento.dataDoAtendimento ?? null,
            atendimento.criadoEm,
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
    ...(opcional(linha.data_do_atendimento)
      ? { dataDoAtendimento: linha.data_do_atendimento as string }
      : {}),
  }
}
