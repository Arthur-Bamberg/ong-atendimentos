import { Link, useRouter } from 'expo-router'
import { useState } from 'react'
import { StyleSheet, TextInput } from 'react-native'

import { ThemedText } from '@/components/themed-text'
import { Spacing } from '@/constants/theme'
import { useTheme } from '@/hooks/use-theme'
import { useBaseLocal } from '@/ui/base-local-provider'
import { copia } from '@/ui/copia'
import { BotaoPrincipal, Tela } from '@/ui/tela'

export default function TelaLogin() {
  const theme = useTheme()
  const router = useRouter()
  const { fachada } = useBaseLocal()
  const [identificacao, setIdentificacao] = useState('')
  const [senha, setSenha] = useState('')
  const [entrando, setEntrando] = useState(false)

  async function entrar() {
    if (entrando) {
      return
    }
    setEntrando(true)
    try {
      await fachada.marcarPassou()
      router.replace('/atividades')
    } finally {
      setEntrando(false)
    }
  }

  return (
    <Tela>
      <ThemedText type="smallBold">{copia.app}</ThemedText>
      <ThemedText type="subtitle">{copia.loginTitulo}</ThemedText>
      <ThemedText themeColor="textSecondary">{copia.avisoBaseLocal}</ThemedText>

      <ThemedText type="smallBold">{copia.identificacao}</ThemedText>
      <TextInput
        accessibilityLabel={copia.identificacao}
        autoCapitalize="none"
        autoCorrect={false}
        onChangeText={setIdentificacao}
        placeholder={copia.identificacao}
        placeholderTextColor={theme.textSecondary}
        style={[styles.campo, { color: theme.text, borderColor: theme.backgroundSelected }]}
        value={identificacao}
      />

      <ThemedText type="smallBold">{copia.senha}</ThemedText>
      <TextInput
        accessibilityLabel={copia.senha}
        autoCapitalize="none"
        autoCorrect={false}
        onChangeText={setSenha}
        placeholder={copia.senha}
        placeholderTextColor={theme.textSecondary}
        secureTextEntry
        style={[styles.campo, { color: theme.text, borderColor: theme.backgroundSelected }]}
        value={senha}
      />

      <BotaoPrincipal onPress={entrar} rotulo={copia.entrar} disabled={entrando} />

      <Link href="/esqueci-a-senha">
        <ThemedText type="linkPrimary">{copia.esqueciASenha}</ThemedText>
      </Link>
    </Tela>
  )
}

const styles = StyleSheet.create({
  campo: {
    minHeight: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: Spacing.three,
    fontSize: 16,
  },
})
