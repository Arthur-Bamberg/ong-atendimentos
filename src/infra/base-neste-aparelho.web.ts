import type { BaseNesteAparelho, FachadaNesteAparelho } from '@/infra/tipos-base'
import type { Atendimento, Atividade, Persistencia } from '@/registro-local/tipos'

const CHAVE_ATIVIDADES = 'ong-atendimentos.atividades'
const CHAVE_ATENDIMENTOS = 'ong-atendimentos.atendimentos'
const CHAVE_FACHADA = 'ong-atendimentos.fachada-passada'

function lerJson<T>(chave: string, fallback: T): T {
  const bruto = globalThis.localStorage.getItem(chave)
  if (!bruto) {
    return fallback
  }
  return JSON.parse(bruto) as T
}

export async function abrirBaseNesteAparelho(): Promise<BaseNesteAparelho> {
  const persistencia: Persistencia = {
    async carregarAtividades() {
      return lerJson<Atividade[]>(CHAVE_ATIVIDADES, [])
    },
    async gravarAtividades(atividades) {
      globalThis.localStorage.setItem(CHAVE_ATIVIDADES, JSON.stringify(atividades))
    },
    async carregarAtendimentos() {
      return lerJson<Atendimento[]>(CHAVE_ATENDIMENTOS, [])
    },
    async gravarAtendimentos(atendimentos) {
      globalThis.localStorage.setItem(CHAVE_ATENDIMENTOS, JSON.stringify(atendimentos))
    },
  }

  const fachada: FachadaNesteAparelho = {
    async jaPassou() {
      return globalThis.localStorage.getItem(CHAVE_FACHADA) === 'sim'
    },
    async marcarPassou() {
      globalThis.localStorage.setItem(CHAVE_FACHADA, 'sim')
    },
  }

  return { persistencia, fachada }
}
