import { useFocusEffect, useRouter } from 'expo-router'
import { useCallback, useState } from 'react'
import { ActivityIndicator } from 'react-native'

import { ThemedText } from '@/components/themed-text'
import { useTheme } from '@/hooks/use-theme'
import type { Atendimento, Atividade } from '@/registro-local/tipos'
import { formatarInstante, nomeDaAtividade, nomeDoAtendimento } from '@/ui/atendimento'
import { useBaseLocal } from '@/ui/base-local-provider'
import { copia } from '@/ui/copia'
import { BotaoPrincipal, LinhaPressionavel, Tela } from '@/ui/tela'

export default function TelaAtendimentos() {
  const theme = useTheme()
  const router = useRouter()
  const { registro } = useBaseLocal()
  const [atendimentos, setAtendimentos] = useState<Atendimento[] | null>(null)
  const [atividades, setAtividades] = useState<Atividade[]>([])
  const [erro, setErro] = useState<string | null>(null)

  useFocusEffect(
    useCallback(() => {
      let cancelado = false
      Promise.all([registro.listarAtendimentos(), registro.listarAtividades()])
        .then(([lista, catalogo]) => {
          if (!cancelado) {
            setAtendimentos(lista)
            setAtividades(catalogo)
            setErro(null)
          }
        })
        .catch(() => {
          if (!cancelado) {
            setErro(copia.erroLista)
          }
        })
      return () => {
        cancelado = true
      }
    }, [registro]),
  )

  if (erro) {
    return (
      <Tela edges={[]}>
        <ThemedText tone="destructive">{erro}</ThemedText>
      </Tela>
    )
  }

  if (!atendimentos) {
    return (
      <Tela edges={[]}>
        <ActivityIndicator color={theme.primary} accessibilityLabel={copia.carregando} />
      </Tela>
    )
  }

  return (
    <Tela edges={[]}>
      <ThemedText type="title" accessibilityRole="header">
        {copia.atendimentosTitulo}
      </ThemedText>
      {atendimentos.length === 0 ? (
        <>
          <ThemedText>{copia.listaVazia}</ThemedText>
          <BotaoPrincipal
            onPress={() => router.navigate('/formulario')}
            rotulo={copia.irAoFormulario}
          />
        </>
      ) : (
        atendimentos.map((atendimento) => {
          const atividade = nomeDaAtividade(atividades, atendimento.atividadeId)
          const nome = nomeDoAtendimento(atendimento)
          const instante = formatarInstante(atendimento.criadoEm)
          return (
            <LinhaPressionavel
              key={atendimento.id}
              accessibilityLabel={`${instante}, ${atividade}, ${nome}`}
              onPress={() => router.push(`/atendimento/${atendimento.id}`)}
            >
              <ThemedText type="label">{instante}</ThemedText>
              <ThemedText>{atividade}</ThemedText>
              <ThemedText tone="mutedForeground">{nome}</ThemedText>
            </LinhaPressionavel>
          )
        })
      )}
    </Tela>
  )
}
