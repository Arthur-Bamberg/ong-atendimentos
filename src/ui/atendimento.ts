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

export function dataLocalHojeIso(): string {
  const agora = new Date()
  const mes = String(agora.getMonth() + 1).padStart(2, '0')
  const dia = String(agora.getDate()).padStart(2, '0')
  return `${agora.getFullYear()}-${mes}-${dia}`
}

export function isoParaPt(iso: string): string {
  const [ano, mes, dia] = iso.split('-')
  if (!ano || !mes || !dia) {
    return iso
  }
  return `${dia}/${mes}/${ano}`
}

export function ptParaIso(pt: string): string | undefined {
  const digitos = pt.replace(/\D/g, '')
  if (digitos.length !== 8) {
    return undefined
  }
  return `${digitos.slice(4, 8)}-${digitos.slice(2, 4)}-${digitos.slice(0, 2)}`
}

export function mascararData(valor: string): string {
  const digitos = valor.replace(/\D/g, '').slice(0, 8)
  if (digitos.length <= 2) {
    return digitos
  }
  if (digitos.length <= 4) {
    return `${digitos.slice(0, 2)}/${digitos.slice(2)}`
  }
  return `${digitos.slice(0, 2)}/${digitos.slice(2, 4)}/${digitos.slice(4)}`
}

export function mascararCpf(valor: string): string {
  const digitos = valor.replace(/\D/g, '').slice(0, 11)
  if (digitos.length <= 3) {
    return digitos
  }
  if (digitos.length <= 6) {
    return `${digitos.slice(0, 3)}.${digitos.slice(3)}`
  }
  if (digitos.length <= 9) {
    return `${digitos.slice(0, 3)}.${digitos.slice(3, 6)}.${digitos.slice(6)}`
  }
  return `${digitos.slice(0, 3)}.${digitos.slice(3, 6)}.${digitos.slice(6, 9)}-${digitos.slice(9)}`
}

export function dataVisivelDoAtendimento(atendimento: Atendimento): string {
  if (atendimento.dataDoAtendimento) {
    return isoParaPt(atendimento.dataDoAtendimento)
  }
  return formatarInstante(atendimento.criadoEm)
}

export function valorDoCampo(valor: string | undefined): string {
  return valor?.trim() ? valor : copia.naoInformado
}
