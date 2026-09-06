import { StyleSheet, Text, type TextProps } from 'react-native'

import { Fonts, type TextTone } from '@/constants/theme'
import { useTheme } from '@/hooks/use-theme'

export type ThemedTextProps = TextProps & {
  type?: 'title' | 'body' | 'label' | 'link'
  tone?: TextTone
}

export function ThemedText({ style, type = 'body', tone, ...rest }: ThemedTextProps) {
  const theme = useTheme()
  const colorKey: TextTone = tone ?? (type === 'link' ? 'primary' : 'foreground')

  return (
    <Text
      style={[
        { color: theme[colorKey] },
        type === 'title' && styles.title,
        type === 'body' && styles.body,
        type === 'label' && styles.label,
        type === 'link' && styles.link,
        style,
      ]}
      {...rest}
    />
  )
}

const styles = StyleSheet.create({
  title: {
    fontFamily: Fonts.heading,
    fontSize: 28,
    lineHeight: 34,
  },
  body: {
    fontFamily: Fonts.body,
    fontSize: 16,
    lineHeight: 24,
  },
  label: {
    fontFamily: Fonts.bodySemi,
    fontSize: 16,
    lineHeight: 24,
  },
  link: {
    fontFamily: Fonts.bodySemi,
    fontSize: 16,
    lineHeight: 24,
    textDecorationLine: 'underline',
  },
})
