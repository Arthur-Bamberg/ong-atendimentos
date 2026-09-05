import { useEffect, useState } from 'react'
import { ActivityIndicator, StyleSheet } from 'react-native'

import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { Spacing } from '@/constants/theme'
import type { Atividade } from '@/registro-local/tipos'
import { useBaseLocal } from '@/ui/base-local-provider'
import { copia } from '@/ui/copia'
import { Tela } from '@/ui/tela'

export default function TelaAtividades() {
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
      <Tela>
        <ThemedText>{erro}</ThemedText>
      </Tela>
    )
  }

  if (!atividades) {
    return (
      <Tela>
        <ActivityIndicator />
      </Tela>
    )
  }

  return (
    <Tela>
      <ThemedText type="subtitle">{copia.atividadesTitulo}</ThemedText>
      <ThemedText themeColor="textSecondary">{copia.avisoCatalogo}</ThemedText>
      {atividades.map((atividade) => (
        <ThemedView key={atividade.id} type="backgroundElement" style={styles.item}>
          <ThemedText>{atividade.nome}</ThemedText>
        </ThemedView>
      ))}
    </Tela>
  )
}

const styles = StyleSheet.create({
  item: {
    padding: Spacing.three,
    borderRadius: 8,
  },
})
