import * as SQLite from 'expo-sqlite'

import type { BaseNesteAparelho, FachadaNesteAparelho } from '@/infra/tipos-base'
import type { Atendimento, Atividade, Persistencia } from '@/registro-local/tipos'

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
  criado_em: string
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
    CREATE TABLE IF NOT EXISTS atendimentos (
      id TEXT PRIMARY KEY NOT NULL,
      atividade_id TEXT NOT NULL,
      nome TEXT,
      cpf TEXT,
      criado_em TEXT NOT NULL
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
        'SELECT id, atividade_id, nome, cpf, criado_em FROM atendimentos ORDER BY rowid',
      )
      return linhas.map(atendimentoDaLinha)
    },
    async gravarAtendimentos(atendimentos: Atendimento[]) {
      await db.withExclusiveTransactionAsync(async (txn) => {
        await txn.runAsync('DELETE FROM atendimentos')
        for (const atendimento of atendimentos) {
          await txn.runAsync(
            'INSERT INTO atendimentos (id, atividade_id, nome, cpf, criado_em) VALUES (?, ?, ?, ?, ?)',
            atendimento.id,
            atendimento.atividadeId,
            atendimento.nome ?? null,
            atendimento.cpf ?? null,
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

function atendimentoDaLinha(linha: LinhaAtendimento): Atendimento {
  return {
    id: linha.id,
    atividadeId: linha.atividade_id,
    criadoEm: linha.criado_em,
    ...(linha.nome ? { nome: linha.nome } : {}),
    ...(linha.cpf ? { cpf: linha.cpf } : {}),
  }
}
