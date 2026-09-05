import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { ActivityIndicator, StyleSheet } from 'react-native'

import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { abrirBaseNesteAparelho } from '@/infra/base-neste-aparelho'
import type { FachadaNesteAparelho } from '@/infra/tipos-base'
import { criarRegistroLocal } from '@/registro-local/registro-local'
import type { RegistroLocal } from '@/registro-local/tipos'
import { copia } from '@/ui/copia'

type BaseLocalContexto = {
  registro: RegistroLocal
  fachada: FachadaNesteAparelho
}

const Contexto = createContext<BaseLocalContexto | null>(null)

export function BaseLocalProvider({ children }: { children: ReactNode }) {
  const [contexto, setContexto] = useState<BaseLocalContexto | null>(null)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    let cancelado = false

    abrirBaseNesteAparelho()
      .then((base) => {
        if (cancelado) {
          return
        }
        setContexto({
          registro: criarRegistroLocal(base.persistencia),
          fachada: base.fachada,
        })
      })
      .catch(() => {
        if (!cancelado) {
          setErro('Não foi possível abrir a Base local neste aparelho.')
        }
      })

    return () => {
      cancelado = true
    }
  }, [])

  if (erro) {
    return (
      <ThemedView style={styles.centralizado}>
        <ThemedText>{erro}</ThemedText>
      </ThemedView>
    )
  }

  if (!contexto) {
    return (
      <ThemedView style={styles.centralizado}>
        <ActivityIndicator />
        <ThemedText type="small" themeColor="textSecondary">
          {copia.carregando}
        </ThemedText>
      </ThemedView>
    )
  }

  return <Contexto.Provider value={contexto}>{children}</Contexto.Provider>
}

export function useBaseLocal(): BaseLocalContexto {
  const contexto = useContext(Contexto)
  if (!contexto) {
    throw new Error('useBaseLocal precisa do BaseLocalProvider')
  }
  return contexto
}

const styles = StyleSheet.create({
  centralizado: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 24,
  },
})
