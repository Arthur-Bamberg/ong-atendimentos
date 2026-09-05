import { useFocusEffect } from 'expo-router'
import { useCallback, useState } from 'react'
import { ActivityIndicator, Platform, Pressable, StyleSheet, TextInput, View } from 'react-native'

import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { Fonts, MinTouch, Radius, Spacing } from '@/constants/theme'
import { useTheme } from '@/hooks/use-theme'
import type { Atividade } from '@/registro-local/tipos'
import { useBaseLocal } from '@/ui/base-local-provider'
import { copia } from '@/ui/copia'
import { AvisoAparelho, BotaoPrincipal, Tela } from '@/ui/tela'

export default function TelaAtividades() {
  const theme = useTheme()
  const { registro } = useBaseLocal()
  const [atividades, setAtividades] = useState<Atividade[] | null>(null)
  const [idsComAtendimento, setIdsComAtendimento] = useState<ReadonlySet<string>>(new Set())
  const [nomeNovo, setNomeNovo] = useState('')
  const [editandoId, setEditandoId] = useState<string | null>(null)
  const [nomeEdicao, setNomeEdicao] = useState('')
  const [erro, setErro] = useState<string | null>(null)
  const [ocupado, setOcupado] = useState<'criar' | 'renomear' | 'apagar' | null>(null)
  const [focoNovo, setFocoNovo] = useState(false)
  const [focoEdicao, setFocoEdicao] = useState(false)

  const recarregar = useCallback(async () => {
    const [lista, atendimentos] = await Promise.all([
      registro.listarAtividades(),
      registro.listarAtendimentos(),
    ])
    setAtividades(lista)
    setIdsComAtendimento(new Set(atendimentos.map((atendimento) => atendimento.atividadeId)))
  }, [registro])

  useFocusEffect(
    useCallback(() => {
      let cancelado = false
      Promise.all([registro.listarAtividades(), registro.listarAtendimentos()])
        .then(([lista, atendimentos]) => {
          if (!cancelado) {
            setAtividades(lista)
            setIdsComAtendimento(
              new Set(atendimentos.map((atendimento) => atendimento.atividadeId)),
            )
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

  async function criar() {
    const nome = nomeNovo.trim()
    if (ocupado) {
      return
    }
    if (!nome) {
      setErro(copia.erroNomeAtividade)
      return
    }
    setOcupado('criar')
    try {
      await registro.criarAtividade(nome)
      setNomeNovo('')
      setErro(null)
      await recarregar()
    } catch {
      setErro(copia.erroCriarAtividade)
    } finally {
      setOcupado(null)
    }
  }

  async function guardarNome(id: string) {
    const nome = nomeEdicao.trim()
    if (ocupado || !nome) {
      return
    }
    setOcupado('renomear')
    try {
      await registro.renomearAtividade(id, nome)
      setEditandoId(null)
      setNomeEdicao('')
      setErro(null)
      await recarregar()
    } catch {
      setErro(copia.erroRenomearAtividade)
    } finally {
      setOcupado(null)
    }
  }

  async function apagar(id: string) {
    if (ocupado || idsComAtendimento.has(id)) {
      return
    }
    setOcupado('apagar')
    try {
      await registro.apagarAtividade(id)
      if (editandoId === id) {
        setEditandoId(null)
        setNomeEdicao('')
      }
      setErro(null)
      await recarregar()
    } catch (falha) {
      setErro(falha instanceof Error ? falha.message : copia.erroApagarAtividade)
    } finally {
      setOcupado(null)
    }
  }

  if (erro && !atividades) {
    return (
      <Tela edges={[]}>
        <ThemedText tone="destructive">{erro}</ThemedText>
      </Tela>
    )
  }

  if (!atividades) {
    return (
      <Tela edges={[]}>
        <ActivityIndicator color={theme.primary} accessibilityLabel={copia.carregando} />
      </Tela>
    )
  }

  return (
    <Tela edges={[]}>
      <ThemedText type="title" accessibilityRole="header">
        {copia.atividadesTitulo}
      </ThemedText>
      <AvisoAparelho texto={copia.avisoCatalogo} />
      {erro ? <ThemedText tone="destructive">{erro}</ThemedText> : null}

      <ThemedText type="label">{copia.novaAtividade}</ThemedText>
      <TextInput
        accessibilityLabel={copia.novaAtividade}
        onBlur={() => setFocoNovo(false)}
        onChangeText={setNomeNovo}
        onFocus={() => setFocoNovo(true)}
        placeholder={copia.nome}
        placeholderTextColor={theme.mutedForeground}
        style={[
          styles.campo,
          {
            color: theme.foreground,
            backgroundColor: theme.card,
            borderColor: focoNovo ? theme.ring : theme.border,
            minHeight: MinTouch,
          },
        ]}
        value={nomeNovo}
      />
      <BotaoPrincipal
        disabled={ocupado !== null}
        onPress={criar}
        ocupado={ocupado === 'criar'}
        rotulo={copia.criarAtividade}
      />

      {atividades.map((atividade) => {
        const temAtendimento = idsComAtendimento.has(atividade.id)
        const apagarInativo = temAtendimento || ocupado !== null

        return (
          <ThemedView
            key={atividade.id}
            surface="card"
            style={[styles.item, { borderColor: theme.border }]}
          >
            {editandoId === atividade.id ? (
              <>
                <TextInput
                  accessibilityLabel={`${copia.renomear} ${atividade.nome}`}
                  onBlur={() => setFocoEdicao(false)}
                  onChangeText={setNomeEdicao}
                  onFocus={() => setFocoEdicao(true)}
                  placeholder={copia.nome}
                  placeholderTextColor={theme.mutedForeground}
                  style={[
                    styles.campo,
                    {
                      color: theme.foreground,
                      backgroundColor: theme.background,
                      borderColor: focoEdicao ? theme.ring : theme.border,
                      minHeight: MinTouch,
                    },
                  ]}
                  value={nomeEdicao}
                />
                <BotaoPrincipal
                  disabled={!nomeEdicao.trim() || ocupado !== null}
                  onPress={() => guardarNome(atividade.id)}
                  ocupado={ocupado === 'renomear'}
                  rotulo={copia.guardarNome}
                />
                <Pressable
                  accessibilityRole="button"
                  onPress={() => {
                    setEditandoId(null)
                    setNomeEdicao('')
                  }}
                  style={({ pressed }) => [
                    styles.acao,
                    Platform.OS === 'web' ? styles.clicavelWeb : null,
                    { opacity: pressed ? 0.7 : 1 },
                  ]}
                >
                  <ThemedText type="link">{copia.cancelar}</ThemedText>
                </Pressable>
              </>
            ) : (
              <>
                <ThemedText>{atividade.nome}</ThemedText>
                <View style={styles.acoes}>
                  <Pressable
                    accessibilityLabel={`${copia.renomear} ${atividade.nome}`}
                    accessibilityRole="button"
                    onPress={() => {
                      setEditandoId(atividade.id)
                      setNomeEdicao(atividade.nome)
                      setErro(null)
                    }}
                    style={({ pressed }) => [
                      styles.acao,
                      Platform.OS === 'web' ? styles.clicavelWeb : null,
                      { opacity: pressed ? 0.7 : 1 },
                    ]}
                  >
                    <ThemedText type="link">{copia.renomear}</ThemedText>
                  </Pressable>
                  <Pressable
                    accessibilityHint={temAtendimento ? copia.apagarComAtendimento : undefined}
                    accessibilityLabel={`${copia.apagar} ${atividade.nome}`}
                    accessibilityRole="button"
                    accessibilityState={{ disabled: apagarInativo }}
                    disabled={apagarInativo}
                    onPress={() => apagar(atividade.id)}
                    style={({ pressed }) => [
                      styles.acao,
                      Platform.OS === 'web' ? styles.clicavelWeb : null,
                      { opacity: apagarInativo ? 0.5 : pressed ? 0.7 : 1 },
                    ]}
                  >
                    <ThemedText
                      type="link"
                      tone={temAtendimento ? 'mutedForeground' : 'destructive'}
                    >
                      {copia.apagar}
                    </ThemedText>
                  </Pressable>
                </View>
              </>
            )}
          </ThemedView>
        )
      })}
    </Tela>
  )
}

const styles = StyleSheet.create({
  item: {
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    gap: Spacing.sm,
  },
  campo: {
    borderWidth: 1,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.md,
    fontFamily: Fonts.body,
    fontSize: 16,
    lineHeight: 24,
  },
  acoes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  acao: {
    minHeight: MinTouch,
    justifyContent: 'center',
  },
  clicavelWeb: {
    cursor: 'pointer',
  },
})
