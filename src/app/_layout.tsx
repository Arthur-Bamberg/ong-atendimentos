import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useColorScheme } from 'react-native'

import { BaseLocalProvider } from '@/ui/base-local-provider'
import { copia } from '@/ui/copia'

export default function LayoutRaiz() {
  const colorScheme = useColorScheme()

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <BaseLocalProvider>
        <Stack>
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
      <StatusBar style="auto" />
    </ThemeProvider>
  )
}
