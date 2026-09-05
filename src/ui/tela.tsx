import {
  Pressable,
  ScrollView,
  StyleSheet,
  type PressableProps,
  type ScrollViewProps,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { Spacing } from '@/constants/theme'
import { useTheme } from '@/hooks/use-theme'

export function Tela({ children, ...rest }: ScrollViewProps) {
  return (
    <ThemedView style={styles.fundo}>
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <ScrollView
          contentContainerStyle={styles.conteudo}
          keyboardShouldPersistTaps="handled"
          {...rest}
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  )
}

export function BotaoPrincipal({ rotulo, disabled, ...rest }: PressableProps & { rotulo: string }) {
  const theme = useTheme()

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      style={({ pressed }) => [
        styles.botao,
        { backgroundColor: theme.text, opacity: disabled ? 0.5 : pressed ? 0.85 : 1 },
      ]}
      {...rest}
    >
      <ThemedText style={[styles.rotuloBotao, { color: theme.background }]}>{rotulo}</ThemedText>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  fundo: {
    flex: 1,
  },
  safe: {
    flex: 1,
  },
  conteudo: {
    padding: Spacing.four,
    gap: Spacing.three,
    maxWidth: 560,
    width: '100%',
    alignSelf: 'center',
  },
  botao: {
    minHeight: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.three,
  },
  rotuloBotao: {
    fontWeight: 700,
  },
})
