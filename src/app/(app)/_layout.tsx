import { Ionicons } from '@expo/vector-icons'
import { Tabs } from 'expo-router'

import { Fonts } from '@/constants/theme'
import { useTheme } from '@/hooks/use-theme'
import { copia } from '@/ui/copia'

export default function LayoutApp() {
  const theme = useTheme()

  return (
    <Tabs
      screenOptions={{
        headerShadowVisible: false,
        headerTitleStyle: { fontFamily: Fonts.heading },
        headerStyle: { backgroundColor: theme.background },
        headerTintColor: theme.foreground,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.mutedForeground,
        tabBarLabelStyle: { fontFamily: Fonts.bodySemi, fontSize: 12 },
        tabBarStyle: {
          backgroundColor: theme.card,
          borderTopColor: theme.border,
        },
        sceneStyle: { backgroundColor: theme.background },
      }}
    >
      <Tabs.Screen
        name="formulario"
        options={{
          title: copia.formularioTitulo,
          tabBarLabel: copia.formularioAba,
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons color={color} name={focused ? 'create' : 'create-outline'} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="atendimentos"
        options={{
          title: copia.atendimentosTitulo,
          tabBarLabel: copia.atendimentosAba,
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons color={color} name={focused ? 'list' : 'list-outline'} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="graficos"
        options={{
          title: copia.graficosTitulo,
          tabBarLabel: copia.graficosAba,
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons
              color={color}
              name={focused ? 'bar-chart' : 'bar-chart-outline'}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="atividades"
        options={{
          title: copia.atividadesTitulo,
          tabBarLabel: copia.atividadesAba,
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons color={color} name={focused ? 'layers' : 'layers-outline'} size={size} />
          ),
        }}
      />
    </Tabs>
  )
}
