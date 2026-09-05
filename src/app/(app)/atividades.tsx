import { useEffect, useState } from 'react'
import { ActivityIndicator, StyleSheet } from 'react-native'

import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { Radius, Spacing } from '@/constants/theme'
import { useTheme } from '@/hooks/use-theme'
import type { Atividade } from '@/registro-local/tipos'
import { useBaseLocal } from '@/ui/base-local-provider'
import { copia } from '@/ui/copia'
import { AvisoAparelho, Tela } from '@/ui/tela'

export default function TelaAtividades() {
  const theme = useTheme()
  const { registro } = useBaseLocal()
  const [atividades, setAtividades] = useState<Atividade[] | null>(null)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    let cancelado = false
    registro
      .listarAtividades()
      .then((lista) => {
        if (!cancelado) {
          setAtividades(lista)
        }
      })
      .catch(() => {
        if (!cancelado) {
          setErro(copia.erroAtividades)
        }
      })
    return () => {
      cancelado = true
    }
  }, [registro])

  if (erro) {
    return (
      <Tela edges={[]}>
        <ThemedText tone="destructive">{erro}</ThemedText>
      </Tela>
    )
  }

  if (!atividades) {
    return (
      <Tela edges={[]}>
        <ActivityIndicator color={theme.primary} accessibilityLabel={copia.carregando} />
      </Tela>
    )
  }

  return (
    <Tela edges={[]}>
      <ThemedText type="title" accessibilityRole="header">
        {copia.atividadesTitulo}
      </ThemedText>
      <AvisoAparelho texto={copia.avisoCatalogo} />
      {atividades.map((atividade) => (
        <ThemedView
          key={atividade.id}
          surface="card"
          style={[styles.item, { borderColor: theme.border }]}
        >
          <ThemedText>{atividade.nome}</ThemedText>
        </ThemedView>
      ))}
    </Tela>
  )
}

const styles = StyleSheet.create({
  item: {
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    gap: Spacing.sm,
  },
})
