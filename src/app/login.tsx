import { useRouter } from 'expo-router'
import { useState } from 'react'
import { StyleSheet, TextInput } from 'react-native'

import { ThemedText } from '@/components/themed-text'
import { Fonts, MinTouch, Radius, Spacing } from '@/constants/theme'
import { useTheme } from '@/hooks/use-theme'
import { useBaseLocal } from '@/ui/base-local-provider'
import { copia } from '@/ui/copia'
import { AvisoAparelho, BotaoPrincipal, BotaoSecundario, Tela } from '@/ui/tela'

export default function TelaLogin() {
  const theme = useTheme()
  const router = useRouter()
  const { fachada } = useBaseLocal()
  const [identificacao, setIdentificacao] = useState('')
  const [senha, setSenha] = useState('')
  const [entrando, setEntrando] = useState(false)
  const [focoIdentificacao, setFocoIdentificacao] = useState(false)
  const [focoSenha, setFocoSenha] = useState(false)

  async function entrar() {
    if (entrando) {
      return
    }
    setEntrando(true)
    try {
      await fachada.marcarPassou()
      router.replace('/formulario')
    } finally {
      setEntrando(false)
    }
  }

  return (
    <Tela>
      <ThemedText type="kicker" tone="primary">
        {copia.app}
      </ThemedText>
      <ThemedText type="title" accessibilityRole="header">
        {copia.loginTitulo}
      </ThemedText>
      <AvisoAparelho texto={copia.avisoBaseLocal} />

      <ThemedText type="label">{copia.identificacao}</ThemedText>
      <TextInput
        accessibilityLabel={copia.identificacao}
        autoCapitalize="none"
        autoComplete="username"
        autoCorrect={false}
        onBlur={() => setFocoIdentificacao(false)}
        onChangeText={setIdentificacao}
        onFocus={() => setFocoIdentificacao(true)}
        placeholderTextColor={theme.mutedForeground}
        style={[
          styles.campo,
          {
            color: theme.foreground,
            backgroundColor: theme.card,
            borderColor: focoIdentificacao ? theme.ring : theme.border,
            minHeight: MinTouch,
          },
        ]}
        textContentType="username"
        value={identificacao}
      />

      <ThemedText type="label">{copia.senha}</ThemedText>
      <TextInput
        accessibilityLabel={copia.senha}
        autoCapitalize="none"
        autoComplete="current-password"
        autoCorrect={false}
        onBlur={() => setFocoSenha(false)}
        onChangeText={setSenha}
        onFocus={() => setFocoSenha(true)}
        placeholderTextColor={theme.mutedForeground}
        secureTextEntry
        style={[
          styles.campo,
          {
            color: theme.foreground,
            backgroundColor: theme.card,
            borderColor: focoSenha ? theme.ring : theme.border,
            minHeight: MinTouch,
          },
        ]}
        textContentType="password"
        value={senha}
      />

      <BotaoPrincipal onPress={entrar} ocupado={entrando} rotulo={copia.entrar} />
      <BotaoSecundario
        onPress={() => router.push('/esqueci-a-senha')}
        rotulo={copia.esqueciASenha}
      />
    </Tela>
  )
}

const styles = StyleSheet.create({
  campo: {
    borderWidth: 1,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.md,
    fontFamily: Fonts.body,
    fontSize: 16,
    lineHeight: 24,
  },
})
