import { Ionicons } from '@expo/vector-icons'
import { type ReactNode, useState } from 'react'
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  type PressableProps,
  type TextInputProps,
} from 'react-native'
import { SafeAreaView, type Edges } from 'react-native-safe-area-context'

import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { Fonts, MaxContentWidth, MinTouch, Radius, Spacing } from '@/constants/theme'
import { useTheme } from '@/hooks/use-theme'

export function Tela({ children, edges = ['bottom'] }: { children: ReactNode; edges?: Edges }) {
  return (
    <ThemedView style={styles.fundo}>
      <SafeAreaView style={styles.safe} edges={edges}>
        <ScrollView contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled">
          <View style={styles.coluna}>{children}</View>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  )
}

export function Grupo({ children }: { children: ReactNode }) {
  return <View style={styles.grupo}>{children}</View>
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
          borderBottomColor: theme.foreground,
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

export function BotaoContorno({
  rotulo,
  disabled,
  ocupado,
  tom = 'primary',
  style,
  ...rest
}: PressableProps & {
  rotulo: string
  ocupado?: boolean
  tom?: 'primary' | 'destructive'
}) {
  const theme = useTheme()
  const inativo = Boolean(disabled || ocupado)
  const fundo = tom === 'destructive' ? theme.destructive : theme.primary
  const letra = tom === 'destructive' ? theme.onDestructive : theme.onPrimary

  return (
    <Pressable
      {...rest}
      accessibilityRole="button"
      accessibilityState={{ disabled: inativo, busy: Boolean(ocupado) }}
      disabled={inativo}
      style={(estado) => [
        styles.botaoContorno,
        Platform.OS === 'web' ? styles.clicavelWeb : null,
        {
          backgroundColor: fundo,
          minHeight: MinTouch,
          opacity: inativo ? 0.5 : estado.pressed ? 0.88 : 1,
        },
        typeof style === 'function' ? style(estado) : style,
      ]}
    >
      <ThemedText style={[styles.rotuloBotao, { color: letra }]}>
        {ocupado ? `${rotulo}…` : rotulo}
      </ThemedText>
    </Pressable>
  )
}

export function LinhaPressionavel({
  children,
  selecionada,
  ...rest
}: PressableProps & { children: ReactNode; selecionada?: boolean }) {
  const theme = useTheme()

  return (
    <Pressable
      {...rest}
      accessibilityRole="button"
      accessibilityState={{ ...rest.accessibilityState, selected: Boolean(selecionada) }}
      style={({ pressed }) => [
        styles.linha,
        Platform.OS === 'web' ? styles.clicavelWeb : null,
        {
          borderColor: selecionada ? theme.primary : theme.border,
          backgroundColor: selecionada ? theme.muted : theme.card,
          minHeight: MinTouch,
          opacity: pressed ? 0.88 : 1,
        },
      ]}
    >
      <View style={styles.linhaMiolo}>
        {selecionada ? (
          <Ionicons
            accessibilityElementsHidden
            color={theme.primary}
            importantForAccessibility="no"
            name="checkmark-circle"
            size={22}
          />
        ) : null}
        <View style={styles.linhaConteudo}>{children}</View>
      </View>
    </Pressable>
  )
}

export function AvisoAparelho({ texto }: { texto: string }) {
  return <Aviso icone="phone-portrait-outline" texto={texto} />
}

export function Aviso({
  icone = 'information-circle-outline',
  texto,
}: {
  icone?: keyof typeof Ionicons.glyphMap
  texto: string
}) {
  const theme = useTheme()

  return (
    <ThemedView
      surface="muted"
      style={[styles.aviso, { borderColor: theme.border }]}
      accessibilityRole="text"
    >
      <Ionicons
        name={icone}
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

export function CampoTexto({
  rotulo,
  ...rest
}: TextInputProps & { rotulo: string; value: string }) {
  const theme = useTheme()
  const [foco, setFoco] = useState(false)

  return (
    <Grupo>
      <ThemedText type="label">{rotulo}</ThemedText>
      <TextInput
        {...rest}
        accessibilityLabel={rest.accessibilityLabel ?? rotulo}
        onBlur={(evento) => {
          setFoco(false)
          rest.onBlur?.(evento)
        }}
        onFocus={(evento) => {
          setFoco(true)
          rest.onFocus?.(evento)
        }}
        placeholderTextColor={theme.mutedForeground}
        style={[
          styles.campo,
          {
            color: theme.foreground,
            backgroundColor: theme.card,
            borderColor: foco ? theme.ring : theme.border,
            minHeight: rest.multiline ? MinTouch * 2 : MinTouch,
          },
          rest.multiline ? styles.campoMultilinha : null,
          rest.style,
        ]}
      />
    </Grupo>
  )
}

export function EscolhaFechada<T extends string>({
  rotulo,
  opcoes,
  valor,
  onChange,
}: {
  rotulo: string
  opcoes: readonly T[]
  valor: T | ''
  onChange: (valor: T | '') => void
}) {
  return (
    <Grupo>
      <ThemedText type="label">{rotulo}</ThemedText>
      {opcoes.map((opcao) => (
        <LinhaPressionavel
          key={opcao}
          accessibilityLabel={opcao}
          onPress={() => onChange(valor === opcao ? '' : opcao)}
          selecionada={valor === opcao}
        >
          <ThemedText>{opcao}</ThemedText>
        </LinhaPressionavel>
      ))}
    </Grupo>
  )
}

export function EscolhaMultipla<T extends string>({
  rotulo,
  opcoes,
  valores,
  onChange,
}: {
  rotulo: string
  opcoes: readonly T[]
  valores: readonly T[]
  onChange: (valores: T[]) => void
}) {
  return (
    <Grupo>
      <ThemedText type="label">{rotulo}</ThemedText>
      {opcoes.map((opcao) => {
        const selecionada = valores.includes(opcao)
        return (
          <LinhaPressionavel
            key={opcao}
            accessibilityLabel={opcao}
            onPress={() => {
              const escolhidos = new Set(valores)
              if (selecionada) {
                escolhidos.delete(opcao)
              } else {
                escolhidos.add(opcao)
              }
              onChange(opcoes.filter((item) => escolhidos.has(item)))
            }}
            selecionada={selecionada}
          >
            <ThemedText>{opcao}</ThemedText>
          </LinhaPressionavel>
        )
      })}
    </Grupo>
  )
}

export function Marcacao({
  rotulo,
  marcada,
  onChange,
}: {
  rotulo: string
  marcada: boolean
  onChange: (marcada: boolean) => void
}) {
  return (
    <LinhaPressionavel
      accessibilityLabel={rotulo}
      onPress={() => onChange(!marcada)}
      selecionada={marcada}
    >
      <ThemedText>{rotulo}</ThemedText>
    </LinhaPressionavel>
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
  grupo: {
    gap: Spacing.sm,
  },
  botao: {
    borderRadius: Radius.md,
    borderBottomWidth: 3,
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
  botaoContorno: {
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.md,
  },
  linha: {
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    justifyContent: 'center',
  },
  linhaMiolo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  linhaConteudo: {
    flex: 1,
    gap: Spacing.xs,
    justifyContent: 'center',
  },
  aviso: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  avisoTexto: {
    flex: 1,
  },
  campo: {
    borderWidth: 1,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.md,
    fontFamily: Fonts.body,
    fontSize: 16,
    lineHeight: 24,
  },
  campoMultilinha: {
    paddingVertical: Spacing.sm,
    textAlignVertical: 'top',
  },
})
