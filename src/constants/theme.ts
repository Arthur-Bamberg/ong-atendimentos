import { Platform } from 'react-native'

export const Colors = {
  light: {
    background: '#FFFFFF',
    foreground: '#3A1A36',
    card: '#FFFFFF',
    cardForeground: '#3A1A36',
    muted: '#F6E8F1',
    mutedForeground: '#6B4A66',
    border: '#B07086',
    primary: '#5F2357',
    onPrimary: '#FFFFFF',
    accent: '#EAB92E',
    onAccent: '#3A1A36',
    destructive: '#DC2626',
    onDestructive: '#FFFFFF',
    ring: '#5F2357',
  },
  dark: {
    background: '#1A0F18',
    foreground: '#F8F1F6',
    card: '#2A1826',
    cardForeground: '#F8F1F6',
    muted: '#3D2438',
    mutedForeground: '#D4B8CE',
    border: '#8A6268',
    primary: '#C48BB8',
    onPrimary: '#1A0F18',
    accent: '#EAB92E',
    onAccent: '#1A0F18',
    destructive: '#F87171',
    onDestructive: '#1A0F18',
    ring: '#C48BB8',
  },
} as const

export type ThemeTokens = (typeof Colors)[keyof typeof Colors]
export type SurfaceName = 'background' | 'card' | 'muted'
export type TextTone = 'foreground' | 'mutedForeground' | 'primary' | 'destructive'

export const Fonts = {
  heading: 'Outfit_600SemiBold',
  headingBold: 'Outfit_700Bold',
  body: 'WorkSans_400Regular',
  bodyMedium: 'WorkSans_500Medium',
  bodySemi: 'WorkSans_600SemiBold',
} as const

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
} as const

export const MinTouch = Platform.select({ ios: 44, android: 48, default: 48 }) ?? 48
export const MaxContentWidth = 560
export const MotionMs = 150
export const LogoMarcaAspecto = 1460 / 647
