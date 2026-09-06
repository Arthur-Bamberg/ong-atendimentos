import { Redirect } from 'expo-router'
import { useEffect, useState } from 'react'
import { ActivityIndicator, StyleSheet } from 'react-native'

import { ThemedView } from '@/components/themed-view'
import { Spacing } from '@/constants/theme'
import { useTheme } from '@/hooks/use-theme'
import { useBaseLocal } from '@/ui/base-local-provider'
import { copia } from '@/ui/copia'
import { LogoMarca } from '@/ui/marca'

export default function PortaDeEntrada() {
  const theme = useTheme()
  const { fachada } = useBaseLocal()
  const [destino, setDestino] = useState<'/formulario' | '/login' | null>(null)

  useEffect(() => {
    let cancelado = false
    fachada
      .jaPassou()
      .then((passou) => {
        if (!cancelado) {
          setDestino(passou ? '/formulario' : '/login')
        }
      })
      .catch(() => {
        if (!cancelado) {
          setDestino('/login')
        }
      })
    return () => {
      cancelado = true
    }
  }, [fachada])

  if (!destino) {
    return (
      <ThemedView style={styles.centralizado}>
        <LogoMarca compact />
        <ActivityIndicator
          accessibilityLabel={copia.carregando}
          color={theme.primary}
          style={styles.espera}
        />
      </ThemedView>
    )
  }

  return <Redirect href={destino} />
}

const styles = StyleSheet.create({
  centralizado: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  espera: {
    marginTop: Spacing.md,
  },
})
