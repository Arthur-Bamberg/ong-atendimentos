import type { Atividade, Persistencia } from '@/registro-local/tipos'

export function persistenciaEmMemoria(atividadesIniciais: Atividade[] = []): Persistencia {
  let atividades = atividadesIniciais.map((atividade) => ({ ...atividade }))

  return {
    async carregarAtividades() {
      return atividades.map((atividade) => ({ ...atividade }))
    },
    async gravarAtividades(proxima) {
      atividades = proxima.map((atividade) => ({ ...atividade }))
    },
  }
}
