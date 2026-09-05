import type { Atendimento, Atividade } from '@/registro-local/tipos'
import { copia } from '@/ui/copia'

export function nomeDoAtendimento(atendimento: Atendimento): string {
  const nome = atendimento.nome?.trim()
  return nome ? nome : copia.semIdentificacao
}

export function nomeDaAtividade(atividades: Atividade[], atividadeId: string): string {
  return atividades.find((atividade) => atividade.id === atividadeId)?.nome ?? atividadeId
}

export function formatarInstante(iso: string): string {
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  })
}
