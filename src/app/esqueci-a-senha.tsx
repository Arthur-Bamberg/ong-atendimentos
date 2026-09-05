import { useRouter } from 'expo-router'

import { ThemedText } from '@/components/themed-text'
import { copia } from '@/ui/copia'
import { AvisoAparelho, BotaoPrincipal, Tela } from '@/ui/tela'

export default function TelaEsqueciASenha() {
  const router = useRouter()

  return (
    <Tela>
      <ThemedText type="title" accessibilityRole="header">
        {copia.esqueciTitulo}
      </ThemedText>
      <AvisoAparelho texto={copia.esqueciCorpo} />
      <BotaoPrincipal onPress={() => router.back()} rotulo={copia.voltarAoLogin} />
    </Tela>
  )
}
