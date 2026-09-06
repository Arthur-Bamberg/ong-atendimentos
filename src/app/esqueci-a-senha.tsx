import { useRouter } from 'expo-router'

import { copia } from '@/ui/copia'
import { AvisoAparelho, BotaoPrincipal, Tela } from '@/ui/tela'

export default function TelaEsqueciASenha() {
  const router = useRouter()

  return (
    <Tela>
      <AvisoAparelho texto={copia.esqueciCorpo} />
      <BotaoPrincipal onPress={() => router.back()} rotulo={copia.voltarAoLogin} />
    </Tela>
  )
}
