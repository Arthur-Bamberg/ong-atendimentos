import { Outfit_600SemiBold, Outfit_700Bold, useFonts } from '@expo-google-fonts/outfit'
import {
  WorkSans_400Regular,
  WorkSans_500Medium,
  WorkSans_600SemiBold,
} from '@expo-google-fonts/work-sans'
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'

import '@/global.css'

import { Colors } from '@/constants/theme'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { BaseLocalProvider } from '@/ui/base-local-provider'
import { copia } from '@/ui/copia'

SplashScreen.preventAutoHideAsync()

export default function LayoutRaiz() {
  const colorScheme = useColorScheme()
  const scheme = colorScheme === 'dark' ? 'dark' : 'light'
  const tokens = Colors[scheme]
  const [fontsLoaded] = useFonts({
    Outfit_600SemiBold,
    Outfit_700Bold,
    WorkSans_400Regular,
    WorkSans_500Medium,
    WorkSans_600SemiBold,
  })

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync()
    }
  }, [fontsLoaded])

  if (!fontsLoaded) {
    return null
  }

  const navegacao = scheme === 'dark' ? DarkTheme : DefaultTheme

  return (
    <ThemeProvider
      value={{
        ...navegacao,
        colors: {
          ...navegacao.colors,
          primary: tokens.primary,
          background: tokens.background,
          card: tokens.card,
          text: tokens.foreground,
          border: tokens.border,
          notification: tokens.destructive,
        },
      }}
    >
      <BaseLocalProvider>
        <Stack
          screenOptions={{
            headerShadowVisible: false,
            headerTitleStyle: { fontFamily: 'Outfit_600SemiBold' },
            contentStyle: { backgroundColor: tokens.background },
          }}
        >
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ title: copia.loginTitulo }} />
          <Stack.Screen name="esqueci-a-senha" options={{ title: copia.esqueciTitulo }} />
          <Stack.Screen
            name="atividades"
            options={{ title: copia.atividadesTitulo, headerBackVisible: false }}
          />
          <Stack.Screen name="+not-found" options={{ title: 'Não encontrado' }} />
        </Stack>
      </BaseLocalProvider>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  )
}
