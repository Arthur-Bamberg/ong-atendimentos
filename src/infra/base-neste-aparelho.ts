import * as SQLite from 'expo-sqlite'

import type { BaseNesteAparelho, FachadaNesteAparelho } from '@/infra/tipos-base'
import type { Atividade, Persistencia } from '@/registro-local/tipos'

type LinhaAtividade = {
  id: string
  nome: string
  criada_em: string
  atualizada_em: string
}

type LinhaPreferencia = {
  valor: string
}

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
  `)

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
      })
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
