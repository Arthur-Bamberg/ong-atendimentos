import { useRouter } from 'expo-router'

import { ThemedText } from '@/components/themed-text'
import { copia } from '@/ui/copia'
import { BotaoPrincipal, Tela } from '@/ui/tela'

export default function TelaEsqueciASenha() {
  const router = useRouter()

  return (
    <Tela>
      <ThemedText type="subtitle">{copia.esqueciTitulo}</ThemedText>
      <ThemedText>{copia.esqueciCorpo}</ThemedText>
      <BotaoPrincipal onPress={() => router.back()} rotulo={copia.voltarAoLogin} />
    </Tela>
  )
}
