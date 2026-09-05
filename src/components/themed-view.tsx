import { View, type ViewProps } from 'react-native'

import type { SurfaceName } from '@/constants/theme'
import { useTheme } from '@/hooks/use-theme'

export type ThemedViewProps = ViewProps & {
  surface?: SurfaceName
}

export function ThemedView({ style, surface = 'background', ...otherProps }: ThemedViewProps) {
  const theme = useTheme()

  return <View style={[{ backgroundColor: theme[surface] }, style]} {...otherProps} />
}
