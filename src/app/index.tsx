import { Redirect } from 'expo-router'
import { useEffect, useState } from 'react'
import { ActivityIndicator, StyleSheet } from 'react-native'

import { ThemedView } from '@/components/themed-view'
import { useBaseLocal } from '@/ui/base-local-provider'

export default function PortaDeEntrada() {
  const { fachada } = useBaseLocal()
  const [destino, setDestino] = useState<'/atividades' | '/login' | null>(null)

  useEffect(() => {
    let cancelado = false
    fachada
      .jaPassou()
      .then((passou) => {
        if (!cancelado) {
          setDestino(passou ? '/atividades' : '/login')
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
        <ActivityIndicator />
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
  },
})
