import { useRouter } from 'expo-router'
import { useState } from 'react'

import { ThemedText } from '@/components/themed-text'
import { useBaseLocal } from '@/ui/base-local-provider'
import { copia } from '@/ui/copia'
import { LogoMarca } from '@/ui/marca'
import { AvisoAparelho, BotaoPrincipal, BotaoSecundario, CampoTexto, Tela } from '@/ui/tela'

export default function TelaLogin() {
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
      router.replace('/formulario')
    } finally {
      setEntrando(false)
    }
  }

  return (
    <Tela edges={['top', 'bottom']}>
      <LogoMarca />
      <ThemedText type="title" accessibilityRole="header">
        {copia.loginTitulo}
      </ThemedText>
      <AvisoAparelho texto={copia.avisoBaseLocal} />

      <CampoTexto
        autoCapitalize="none"
        autoComplete="username"
        autoCorrect={false}
        onChangeText={setIdentificacao}
        rotulo={copia.identificacao}
        textContentType="username"
        value={identificacao}
      />
      <CampoTexto
        autoCapitalize="none"
        autoComplete="current-password"
        autoCorrect={false}
        onChangeText={setSenha}
        rotulo={copia.senha}
        secureTextEntry
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
