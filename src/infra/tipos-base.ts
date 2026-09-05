import type { Persistencia } from '@/registro-local/tipos'

export type FachadaNesteAparelho = {
  jaPassou(): Promise<boolean>
  marcarPassou(): Promise<void>
}

export type BaseNesteAparelho = {
  persistencia: Persistencia
  fachada: FachadaNesteAparelho
}
