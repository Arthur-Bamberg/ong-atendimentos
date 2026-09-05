import { Ionicons } from '@expo/vector-icons'
import { type ReactNode } from 'react'
import { Platform, Pressable, ScrollView, StyleSheet, View, type PressableProps } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { Fonts, MaxContentWidth, MinTouch, Radius, Spacing } from '@/constants/theme'
import { useTheme } from '@/hooks/use-theme'

export function Tela({ children }: { children: ReactNode }) {
  return (
    <ThemedView style={styles.fundo}>
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <ScrollView contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled">
          <View style={styles.coluna}>{children}</View>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  )
}

export function BotaoPrincipal({
  rotulo,
  disabled,
  ocupado,
  ...rest
}: PressableProps & { rotulo: string; ocupado?: boolean }) {
  const theme = useTheme()
  const inativo = Boolean(disabled || ocupado)

  return (
    <Pressable
      {...rest}
      accessibilityRole="button"
      accessibilityState={{ disabled: inativo, busy: Boolean(ocupado) }}
      disabled={inativo}
      style={({ pressed }) => [
        styles.botao,
        Platform.OS === 'web' ? styles.clicavelWeb : null,
        {
          backgroundColor: theme.primary,
          minHeight: MinTouch,
          opacity: inativo ? 0.5 : pressed ? 0.88 : 1,
        },
      ]}
    >
      <ThemedText style={[styles.rotuloBotao, { color: theme.onPrimary }]}>
        {ocupado ? `${rotulo}…` : rotulo}
      </ThemedText>
    </Pressable>
  )
}

export function BotaoSecundario({ rotulo, ...rest }: PressableProps & { rotulo: string }) {
  const theme = useTheme()

  return (
    <Pressable
      {...rest}
      accessibilityRole="link"
      style={({ pressed }) => [
        styles.botaoSecundario,
        Platform.OS === 'web' ? styles.clicavelWeb : null,
        {
          minHeight: MinTouch,
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      <ThemedText type="link" style={{ color: theme.primary }}>
        {rotulo}
      </ThemedText>
    </Pressable>
  )
}

export function AvisoAparelho({ texto }: { texto: string }) {
  const theme = useTheme()

  return (
    <ThemedView
      surface="muted"
      style={[styles.aviso, { borderColor: theme.border, borderLeftColor: theme.primary }]}
      accessibilityRole="text"
    >
      <Ionicons
        name="phone-portrait-outline"
        size={22}
        color={theme.primary}
        accessibilityElementsHidden
        importantForAccessibility="no"
      />
      <ThemedText tone="mutedForeground" style={styles.avisoTexto}>
        {texto}
      </ThemedText>
    </ThemedView>
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
    flexGrow: 1,
    padding: Spacing.lg,
    width: '100%',
  },
  coluna: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    gap: Spacing.md,
  },
  botao: {
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.sm,
  },
  rotuloBotao: {
    fontFamily: Fonts.bodySemi,
    fontSize: 16,
    lineHeight: 24,
  },
  clicavelWeb: {
    cursor: 'pointer',
  },
  botaoSecundario: {
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  aviso: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderLeftWidth: 4,
  },
  avisoTexto: {
    flex: 1,
  },
})
