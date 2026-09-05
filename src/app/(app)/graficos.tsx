import { useFocusEffect } from 'expo-router'
import { useCallback, useState } from 'react'
import { ActivityIndicator, StyleSheet, View } from 'react-native'

import { ThemedText } from '@/components/themed-text'
import { Fonts, Radius, Spacing } from '@/constants/theme'
import { useTheme } from '@/hooks/use-theme'
import type { Atividade, Bucket, Indicadores } from '@/registro-local/tipos'
import { useBaseLocal } from '@/ui/base-local-provider'
import { copia } from '@/ui/copia'
import { Aviso, LinhaPressionavel, Tela } from '@/ui/tela'

export default function TelaGraficos() {
  const theme = useTheme()
  const { registro } = useBaseLocal()
  const [atividades, setAtividades] = useState<Atividade[] | null>(null)
  const [indicadores, setIndicadores] = useState<Indicadores | null>(null)
  const [atividadeId, setAtividadeId] = useState<string | undefined>(undefined)
  const [erro, setErro] = useState<string | null>(null)

  useFocusEffect(
    useCallback(() => {
      let cancelado = false
      Promise.all([
        registro.listarAtividades(),
        registro.indicadores(atividadeId ? { atividadeId } : undefined),
      ])
        .then(([catalogo, recortes]) => {
          if (!cancelado) {
            setAtividades(catalogo)
            setIndicadores(recortes)
            setErro(null)
          }
        })
        .catch(() => {
          if (!cancelado) {
            setErro(copia.erroGraficos)
          }
        })
      return () => {
        cancelado = true
      }
    }, [atividadeId, registro]),
  )

  if (erro) {
    return (
      <Tela edges={[]}>
        <ThemedText tone="destructive">{erro}</ThemedText>
      </Tela>
    )
  }

  if (!atividades || !indicadores) {
    return (
      <Tela edges={[]}>
        <ActivityIndicator color={theme.primary} accessibilityLabel={copia.carregando} />
      </Tela>
    )
  }

  return (
    <Tela edges={[]}>
      <ThemedText type="title" accessibilityRole="header">
        {copia.graficosTitulo}
      </ThemedText>
      <Aviso texto={copia.informativoIdentificacao} />
      <ThemedText type="kicker">{copia.atendimentosTitulo}</ThemedText>
      <ThemedText
        accessibilityLabel={`${indicadores.totalAtendimentos} ${copia.atendimentosTitulo}`}
        style={styles.total}
      >
        {indicadores.totalAtendimentos}
      </ThemedText>
      <ThemedText type="label">{copia.filtroAtividade}</ThemedText>
      <LinhaPressionavel
        accessibilityLabel={copia.todasAtividades}
        onPress={() => setAtividadeId(undefined)}
        selecionada={atividadeId === undefined}
      >
        <ThemedText>{copia.todasAtividades}</ThemedText>
      </LinhaPressionavel>
      {atividades.map((atividade) => (
        <LinhaPressionavel
          key={atividade.id}
          accessibilityLabel={atividade.nome}
          onPress={() => setAtividadeId(atividade.id)}
          selecionada={atividadeId === atividade.id}
        >
          <ThemedText>{atividade.nome}</ThemedText>
        </LinhaPressionavel>
      ))}
      {indicadores.totalAtendimentos === 0 ? (
        <ThemedText>{copia.graficosVazio}</ThemedText>
      ) : (
        [
          { titulo: copia.atividade, buckets: indicadores.porAtividade },
          { titulo: copia.racaCor, buckets: indicadores.porRacaCor },
          { titulo: copia.escolaridade, buckets: indicadores.porEscolaridade },
          { titulo: copia.faixaRenda, buckets: indicadores.porFaixaRenda },
          { titulo: copia.faixaEtaria, buckets: indicadores.porFaixaEtaria },
          { titulo: copia.situacaoRua, buckets: indicadores.porSituacaoRua },
          { titulo: copia.usoSubstancias, buckets: indicadores.porUsoSubstancias },
          { titulo: copia.cidade, buckets: indicadores.porCidade },
        ].map((recorte) => (
          <RecorteBarras
            buckets={recorte.buckets}
            key={recorte.titulo}
            titulo={recorte.titulo}
            total={indicadores.totalAtendimentos}
          />
        ))
      )}
    </Tela>
  )
}

function RecorteBarras({
  titulo,
  buckets,
  total,
}: {
  titulo: string
  buckets: Bucket[]
  total: number
}) {
  const theme = useTheme()
  if (buckets.length === 0) {
    return null
  }

  return (
    <View style={styles.recorte}>
      <ThemedText type="label">{titulo}</ThemedText>
      {buckets.map((bucket) => {
        const largura = total === 0 ? 0 : (bucket.quantidade / total) * 100
        return (
          <View
            accessibilityLabel={`${bucket.chave}: ${bucket.quantidade}`}
            accessibilityRole="text"
            key={bucket.chave}
            style={styles.barraBloco}
          >
            <View style={styles.barraCabecalho}>
              <ThemedText style={styles.barraChave}>{bucket.chave}</ThemedText>
              <ThemedText tone="mutedForeground">{bucket.quantidade}</ThemedText>
            </View>
            <View style={[styles.trilha, { backgroundColor: theme.muted }]}>
              <View
                style={[
                  styles.preenchimento,
                  { width: `${largura}%`, backgroundColor: theme.primary },
                ]}
              />
            </View>
          </View>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  total: {
    fontFamily: Fonts.headingBold,
    fontSize: 56,
    lineHeight: 64,
  },
  recorte: {
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  barraBloco: {
    gap: Spacing.xs,
  },
  barraCabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    gap: Spacing.sm,
  },
  barraChave: {
    flex: 1,
  },
  trilha: {
    height: 10,
    borderRadius: Radius.sm,
    overflow: 'hidden',
    width: '100%',
  },
  preenchimento: {
    height: 10,
    borderRadius: Radius.sm,
  },
})
