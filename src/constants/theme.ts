import { Platform } from 'react-native'

export const Colors = {
  light: {
    background: '#F8FAFC',
    foreground: '#1E293B',
    card: '#FFFFFF',
    cardForeground: '#1E293B',
    muted: '#E9EFF8',
    mutedForeground: '#475569',
    border: '#E2E8F0',
    primary: '#2563EB',
    onPrimary: '#FFFFFF',
    accent: '#EA580C',
    onAccent: '#000000',
    destructive: '#DC2626',
    onDestructive: '#FFFFFF',
    ring: '#2563EB',
  },
  dark: {
    background: '#0F172A',
    foreground: '#F1F5F9',
    card: '#1E293B',
    cardForeground: '#F1F5F9',
    muted: '#334155',
    mutedForeground: '#CBD5E1',
    border: '#475569',
    primary: '#2563EB',
    onPrimary: '#FFFFFF',
    accent: '#FB923C',
    onAccent: '#000000',
    destructive: '#F87171',
    onDestructive: '#000000',
    ring: '#60A5FA',
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
} as const

export const MinTouch = Platform.select({ ios: 44, android: 48, default: 48 }) ?? 48
export const MaxContentWidth = 560
export const MotionMs = 150
