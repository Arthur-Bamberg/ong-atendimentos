import { useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { ActivityIndicator } from 'react-native'

import { ThemedText } from '@/components/themed-text'
import { useTheme } from '@/hooks/use-theme'
import type { Atendimento, Atividade } from '@/registro-local/tipos'
import {
  formatarInstante,
  isoParaPt,
  mascararCpf,
  nomeDaAtividade,
  nomeDoAtendimento,
  valorDoCampo,
} from '@/ui/atendimento'
import { useBaseLocal } from '@/ui/base-local-provider'
import { copia } from '@/ui/copia'
import { Tela } from '@/ui/tela'

export default function TelaDetalheAtendimento() {
  const theme = useTheme()
  const { registro } = useBaseLocal()
  const { id } = useLocalSearchParams<{ id: string }>()
  const [atendimento, setAtendimento] = useState<Atendimento | null | undefined>(undefined)
  const [atividades, setAtividades] = useState<Atividade[]>([])
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    let cancelado = false
    const atendimentoId = Array.isArray(id) ? id[0] : id
    if (!atendimentoId) {
      setAtendimento(null)
      return
    }

    Promise.all([registro.obterAtendimento(atendimentoId), registro.listarAtividades()])
      .then(([encontrado, catalogo]) => {
        if (!cancelado) {
          setAtendimento(encontrado)
          setAtividades(catalogo)
        }
      })
      .catch(() => {
        if (!cancelado) {
          setErro(copia.erroAtendimento)
        }
      })
    return () => {
      cancelado = true
    }
  }, [id, registro])

  if (erro) {
    return (
      <Tela>
        <ThemedText tone="destructive">{erro}</ThemedText>
      </Tela>
    )
  }

  if (atendimento === undefined) {
    return (
      <Tela>
        <ActivityIndicator color={theme.primary} accessibilityLabel={copia.carregando} />
      </Tela>
    )
  }

  if (!atendimento) {
    return (
      <Tela>
        <ThemedText tone="destructive">{copia.erroAtendimento}</ThemedText>
      </Tela>
    )
  }

  return (
    <Tela>
      <ThemedText type="title" accessibilityRole="header">
        {copia.detalheTitulo}
      </ThemedText>
      <CampoDetalhe
        rotulo={copia.dataDoAtendimento}
        valor={valorDoCampo(
          atendimento.dataDoAtendimento ? isoParaPt(atendimento.dataDoAtendimento) : undefined,
        )}
      />
      <CampoDetalhe rotulo={copia.dataHora} valor={formatarInstante(atendimento.criadoEm)} />
      <CampoDetalhe
        rotulo={copia.atividade}
        valor={nomeDaAtividade(atividades, atendimento.atividadeId)}
      />
      <CampoDetalhe rotulo={copia.nome} valor={nomeDoAtendimento(atendimento)} />
      <CampoDetalhe
        rotulo={copia.cpf}
        valor={atendimento.cpf ? mascararCpf(atendimento.cpf) : copia.naoInformado}
      />
      <CampoDetalhe
        rotulo={copia.dataNascimento}
        valor={valorDoCampo(
          atendimento.dataNascimento ? isoParaPt(atendimento.dataNascimento) : undefined,
        )}
      />
      <CampoDetalhe rotulo={copia.racaCor} valor={valorDoCampo(atendimento.racaCor)} />
      <CampoDetalhe rotulo={copia.escolaridade} valor={valorDoCampo(atendimento.escolaridade)} />
      <CampoDetalhe rotulo={copia.faixaRenda} valor={valorDoCampo(atendimento.faixaRenda)} />
      <CampoDetalhe rotulo={copia.cidade} valor={valorDoCampo(atendimento.cidade)} />
      <CampoDetalhe rotulo={copia.bairro} valor={valorDoCampo(atendimento.bairro)} />
      <CampoDetalhe rotulo={copia.situacaoRua} valor={valorDoCampo(atendimento.situacaoRua)} />
      <CampoDetalhe
        rotulo={copia.usoSubstancias}
        valor={valorDoCampo(atendimento.usoSubstancias)}
      />
    </Tela>
  )
}

function CampoDetalhe({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <>
      <ThemedText type="label">{rotulo}</ThemedText>
      <ThemedText>{valor}</ThemedText>
    </>
  )
}
