import { Link, Stack } from 'expo-router'
import { StyleSheet } from 'react-native'

import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { Spacing } from '@/constants/theme'

export default function TelaNaoEncontrada() {
  return (
    <>
      <Stack.Screen options={{ title: 'Não encontrado' }} />
      <ThemedView style={styles.container}>
        <ThemedText type="subtitle">Tela não encontrada</ThemedText>
        <Link href="/">
          <ThemedText type="linkPrimary">Voltar</ThemedText>
        </Link>
      </ThemedView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.three,
    padding: Spacing.four,
  },
})
