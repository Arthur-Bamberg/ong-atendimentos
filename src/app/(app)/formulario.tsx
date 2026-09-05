import { useFocusEffect, useRouter } from 'expo-router'
import { useCallback, useState } from 'react'
import { ActivityIndicator } from 'react-native'

import { ThemedText } from '@/components/themed-text'
import { useTheme } from '@/hooks/use-theme'
import type { Atividade } from '@/registro-local/tipos'
import { useBaseLocal } from '@/ui/base-local-provider'
import { copia } from '@/ui/copia'
import { BotaoPrincipal, LinhaPressionavel, Tela } from '@/ui/tela'

export default function TelaFormulario() {
  const theme = useTheme()
  const router = useRouter()
  const { registro } = useBaseLocal()
  const [atividades, setAtividades] = useState<Atividade[] | null>(null)
  const [vigenteId, setVigenteId] = useState<string | null>(null)
  const [erro, setErro] = useState<string | null>(null)
  const [gravando, setGravando] = useState(false)

  useFocusEffect(
    useCallback(() => {
      let cancelado = false
      Promise.all([registro.listarAtividades(), registro.obterAtividadeVigente()])
        .then(([lista, vigente]) => {
          if (!cancelado) {
            setAtividades(lista)
            setVigenteId(vigente?.id ?? null)
            setErro(null)
          }
        })
        .catch(() => {
          if (!cancelado) {
            setErro(copia.erroAtividades)
          }
        })
      return () => {
        cancelado = true
      }
    }, [registro]),
  )

  async function escolherVigente(atividadeId: string) {
    try {
      await registro.definirAtividadeVigente(atividadeId)
      setVigenteId(atividadeId)
      setErro(null)
    } catch {
      setErro(copia.erroEscolherVigente)
    }
  }

  async function gravar() {
    if (gravando) {
      return
    }
    if (!vigenteId) {
      setErro(copia.erroSemAtividadeVigente)
      return
    }
    setGravando(true)
    try {
      await registro.criarAtendimento({})
      setErro(null)
      router.navigate('/atendimentos')
    } catch {
      setErro(copia.erroGravarAtendimento)
    } finally {
      setGravando(false)
    }
  }

  if (!atividades && !erro) {
    return (
      <Tela edges={[]}>
        <ActivityIndicator color={theme.primary} accessibilityLabel={copia.carregando} />
      </Tela>
    )
  }

  return (
    <Tela edges={[]}>
      <ThemedText type="title" accessibilityRole="header">
        {copia.formularioTitulo}
      </ThemedText>
      <ThemedText type="label">
        {copia.atividadeVigente} ({copia.obrigatoria})
      </ThemedText>
      {erro ? <ThemedText tone="destructive">{erro}</ThemedText> : null}
      {atividades?.map((atividade) => (
        <LinhaPressionavel
          key={atividade.id}
          accessibilityLabel={atividade.nome}
          onPress={() => escolherVigente(atividade.id)}
          selecionada={atividade.id === vigenteId}
        >
          <ThemedText>{atividade.nome}</ThemedText>
        </LinhaPressionavel>
      ))}
      <BotaoPrincipal onPress={gravar} ocupado={gravando} rotulo={copia.gravarAtendimento} />
    </Tela>
  )
}
