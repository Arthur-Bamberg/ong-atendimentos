import { useFocusEffect } from 'expo-router'
import { useCallback, useState } from 'react'
import { ActivityIndicator } from 'react-native'

import { ThemedText } from '@/components/themed-text'
import { useTheme } from '@/hooks/use-theme'
import {
  OPCOES_ESCOLARIDADE,
  OPCOES_FAIXA_RENDA,
  OPCOES_PROGRAMA_SOCIAL,
  OPCOES_RACA_COR,
  OPCOES_SITUACAO_RUA,
  OPCOES_USO_SUBSTANCIAS,
  type Atividade,
  type Escolaridade,
  type FaixaRenda,
  type ProgramaSocial,
  type RacaCor,
  type SituacaoRua,
  type UsoSubstancias,
} from '@/registro-local/tipos'
import { dataLocalHojeIso, isoParaPt, mascararCpf, mascararData, ptParaIso } from '@/ui/atendimento'
import { useBaseLocal } from '@/ui/base-local-provider'
import { copia } from '@/ui/copia'
import {
  Aviso,
  BotaoPrincipal,
  CampoTexto,
  EscolhaFechada,
  EscolhaMultipla,
  LinhaPressionavel,
  Marcacao,
  Tela,
} from '@/ui/tela'

type Rascunho = {
  nome: string
  cpf: string
  dataNascimento: string
  racaCor: RacaCor | ''
  escolaridade: Escolaridade | ''
  faixaRenda: FaixaRenda | ''
  cidade: string
  bairro: string
  situacaoRua: SituacaoRua | ''
  usoSubstancias: UsoSubstancias | ''
  programasSociais: ProgramaSocial[]
  observacaoProgramasSociais: string
  podeParticiparProgramasSociais: boolean
  dataDoAtendimento: string
}

function rascunhoEmBranco(): Rascunho {
  return {
    nome: '',
    cpf: '',
    dataNascimento: '',
    racaCor: '',
    escolaridade: '',
    faixaRenda: '',
    cidade: '',
    bairro: '',
    situacaoRua: '',
    usoSubstancias: '',
    programasSociais: [],
    observacaoProgramasSociais: '',
    podeParticiparProgramasSociais: false,
    dataDoAtendimento: isoParaPt(dataLocalHojeIso()),
  }
}

function rotuloOpcional(campo: string) {
  return `${campo} (${copia.opcional})`
}

export default function TelaFormulario() {
  const theme = useTheme()
  const { registro } = useBaseLocal()
  const [atividades, setAtividades] = useState<Atividade[] | null>(null)
  const [vigenteId, setVigenteId] = useState<string | null>(null)
  const [rascunho, setRascunho] = useState(rascunhoEmBranco)
  const [erro, setErro] = useState<string | null>(null)
  const [gravando, setGravando] = useState(false)
  const [gravado, setGravado] = useState(false)

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

  function atualizar<K extends keyof Rascunho>(campo: K, valor: Rascunho[K]) {
    setRascunho((atual) => ({ ...atual, [campo]: valor }))
  }

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
      await registro.criarAtendimento({
        nome: rascunho.nome,
        cpf: rascunho.cpf,
        dataNascimento: ptParaIso(rascunho.dataNascimento),
        racaCor: rascunho.racaCor || undefined,
        escolaridade: rascunho.escolaridade || undefined,
        faixaRenda: rascunho.faixaRenda || undefined,
        cidade: rascunho.cidade,
        bairro: rascunho.bairro,
        situacaoRua: rascunho.situacaoRua || undefined,
        usoSubstancias: rascunho.usoSubstancias || undefined,
        programasSociais: rascunho.programasSociais,
        observacaoProgramasSociais: rascunho.observacaoProgramasSociais,
        podeParticiparProgramasSociais: rascunho.podeParticiparProgramasSociais,
        dataDoAtendimento: ptParaIso(rascunho.dataDoAtendimento),
      })
      setErro(null)
      setGravado(true)
    } catch (falha) {
      setErro(falha instanceof Error ? falha.message : copia.erroGravarAtendimento)
    } finally {
      setGravando(false)
    }
  }

  function abrirNovo() {
    setRascunho(rascunhoEmBranco())
    setErro(null)
    setGravado(false)
  }

  if (!atividades && !erro) {
    return (
      <Tela edges={[]}>
        <ActivityIndicator color={theme.primary} accessibilityLabel={copia.carregando} />
      </Tela>
    )
  }

  if (gravado) {
    return (
      <Tela edges={[]}>
        <ThemedText type="title" accessibilityRole="header">
          {copia.formularioTitulo}
        </ThemedText>
        <ThemedText>{copia.atendimentoGravado}</ThemedText>
        <BotaoPrincipal onPress={abrirNovo} rotulo={copia.novoAtendimento} />
      </Tela>
    )
  }

  return (
    <Tela edges={[]}>
      <ThemedText type="title" accessibilityRole="header">
        {copia.formularioTitulo}
      </ThemedText>
      <Aviso texto={copia.informativoIdentificacao} />
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
      <CampoTexto
        autoCapitalize="words"
        onChangeText={(valor) => atualizar('nome', valor)}
        rotulo={rotuloOpcional(copia.nome)}
        value={rascunho.nome}
      />
      <CampoTexto
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="number-pad"
        onChangeText={(valor) => atualizar('cpf', mascararCpf(valor))}
        placeholder="000.000.000-00"
        rotulo={rotuloOpcional(copia.cpf)}
        value={rascunho.cpf}
      />
      <CampoTexto
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="number-pad"
        onChangeText={(valor) => atualizar('dataNascimento', mascararData(valor))}
        placeholder="dd/mm/aaaa"
        rotulo={rotuloOpcional(copia.dataNascimento)}
        value={rascunho.dataNascimento}
      />
      <EscolhaFechada
        onChange={(valor) => atualizar('racaCor', valor)}
        opcoes={OPCOES_RACA_COR}
        rotulo={rotuloOpcional(copia.racaCor)}
        valor={rascunho.racaCor}
      />
      <EscolhaFechada
        onChange={(valor) => atualizar('escolaridade', valor)}
        opcoes={OPCOES_ESCOLARIDADE}
        rotulo={rotuloOpcional(copia.escolaridade)}
        valor={rascunho.escolaridade}
      />
      <EscolhaFechada
        onChange={(valor) => atualizar('faixaRenda', valor)}
        opcoes={OPCOES_FAIXA_RENDA}
        rotulo={rotuloOpcional(copia.faixaRenda)}
        valor={rascunho.faixaRenda}
      />
      <CampoTexto
        autoCapitalize="words"
        onChangeText={(valor) => atualizar('cidade', valor)}
        rotulo={rotuloOpcional(copia.cidade)}
        value={rascunho.cidade}
      />
      <CampoTexto
        autoCapitalize="words"
        onChangeText={(valor) => atualizar('bairro', valor)}
        rotulo={rotuloOpcional(copia.bairro)}
        value={rascunho.bairro}
      />
      <EscolhaFechada
        onChange={(valor) => atualizar('situacaoRua', valor)}
        opcoes={OPCOES_SITUACAO_RUA}
        rotulo={rotuloOpcional(copia.situacaoRua)}
        valor={rascunho.situacaoRua}
      />
      <EscolhaFechada
        onChange={(valor) => atualizar('usoSubstancias', valor)}
        opcoes={OPCOES_USO_SUBSTANCIAS}
        rotulo={rotuloOpcional(copia.usoSubstancias)}
        valor={rascunho.usoSubstancias}
      />
      <EscolhaMultipla
        onChange={(valor) => atualizar('programasSociais', valor)}
        opcoes={OPCOES_PROGRAMA_SOCIAL}
        rotulo={rotuloOpcional(copia.programasSociais)}
        valores={rascunho.programasSociais}
      />
      <CampoTexto
        autoCapitalize="sentences"
        multiline
        onChangeText={(valor) => atualizar('observacaoProgramasSociais', valor)}
        rotulo={rotuloOpcional(copia.observacaoProgramasSociais)}
        value={rascunho.observacaoProgramasSociais}
      />
      <Marcacao
        marcada={rascunho.podeParticiparProgramasSociais}
        onChange={(valor) => atualizar('podeParticiparProgramasSociais', valor)}
        rotulo={rotuloOpcional(copia.podeParticiparProgramasSociais)}
      />
      <CampoTexto
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="number-pad"
        onChangeText={(valor) => atualizar('dataDoAtendimento', mascararData(valor))}
        placeholder="dd/mm/aaaa"
        rotulo={rotuloOpcional(copia.dataDoAtendimento)}
        value={rascunho.dataDoAtendimento}
      />
      {erro ? <ThemedText tone="destructive">{erro}</ThemedText> : null}
      <BotaoPrincipal onPress={gravar} ocupado={gravando} rotulo={copia.gravarAtendimento} />
    </Tela>
  )
}
