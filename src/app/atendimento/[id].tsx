import { useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { ActivityIndicator } from 'react-native'

import { ThemedText } from '@/components/themed-text'
import { useTheme } from '@/hooks/use-theme'
import type { Atendimento, Atividade } from '@/registro-local/tipos'
import { formatarInstante, nomeDaAtividade, nomeDoAtendimento } from '@/ui/atendimento'
import { useBaseLocal } from '@/ui/base-local-provider'
import { copia } from '@/ui/copia'
import { Tela } from '@/ui/tela'

export default function TelaDetalheAtendimento() {
  const theme = useTheme()
  const { registro } = useBaseLocal()
  const { id } = useLocalSearchParams<{ id: string }>()
  const [atendimento, setAtendimento] = useState<Atendimento | null | undefined>(undefined)
  const [atividades, setAtividades] = useState<Atividade[]>([])
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    let cancelado = false
    const atendimentoId = Array.isArray(id) ? id[0] : id
    if (!atendimentoId) {
      setAtendimento(null)
      return
    }

    Promise.all([registro.obterAtendimento(atendimentoId), registro.listarAtividades()])
      .then(([encontrado, catalogo]) => {
        if (!cancelado) {
          setAtendimento(encontrado)
          setAtividades(catalogo)
        }
      })
      .catch(() => {
        if (!cancelado) {
          setErro(copia.erroAtendimento)
        }
      })
    return () => {
      cancelado = true
    }
  }, [id, registro])

  if (erro) {
    return (
      <Tela>
        <ThemedText tone="destructive">{erro}</ThemedText>
      </Tela>
    )
  }

  if (atendimento === undefined) {
    return (
      <Tela>
        <ActivityIndicator color={theme.primary} accessibilityLabel={copia.carregando} />
      </Tela>
    )
  }

  if (!atendimento) {
    return (
      <Tela>
        <ThemedText tone="destructive">{copia.erroAtendimento}</ThemedText>
      </Tela>
    )
  }

  return (
    <Tela>
      <ThemedText type="title" accessibilityRole="header">
        {copia.detalheTitulo}
      </ThemedText>
      <ThemedText type="label">{copia.dataHora}</ThemedText>
      <ThemedText>{formatarInstante(atendimento.criadoEm)}</ThemedText>
      <ThemedText type="label">{copia.atividade}</ThemedText>
      <ThemedText>{nomeDaAtividade(atividades, atendimento.atividadeId)}</ThemedText>
      <ThemedText type="label">{copia.nome}</ThemedText>
      <ThemedText>{nomeDoAtendimento(atendimento)}</ThemedText>
    </Tela>
  )
}
