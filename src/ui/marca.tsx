import { Image } from 'expo-image'
import { StyleSheet, View } from 'react-native'

import { LogoMarcaAspecto, MaxContentWidth, Spacing } from '@/constants/theme'
import { copia } from '@/ui/copia'

const logo = require('../../assets/images/logo-caminho-do-bem.png')

export function LogoMarca({ compact = false }: { compact?: boolean }) {
  return (
    <View
      accessibilityLabel={copia.marca}
      accessibilityRole="image"
      style={[styles.caixa, compact ? styles.compacta : styles.completa]}
    >
      <Image
        accessibilityElementsHidden
        contentFit="contain"
        importantForAccessibility="no"
        source={logo}
        style={styles.imagem}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  caixa: {
    alignSelf: 'center',
    width: '100%',
    aspectRatio: LogoMarcaAspecto,
    marginBottom: Spacing.sm,
    backgroundColor: 'transparent',
  },
  completa: {
    maxWidth: 280,
  },
  compacta: {
    maxWidth: 200,
  },
  imagem: {
    width: '100%',
    height: '100%',
    maxWidth: MaxContentWidth,
    backgroundColor: 'transparent',
  },
})
