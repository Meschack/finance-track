import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import * as SystemUI from 'expo-system-ui'
import { useEffect } from 'react'
import { Platform } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { AppProvider, useAppContext } from '../src/context/app-context'

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppProvider>
        <ThemedStack />
      </AppProvider>
    </GestureHandlerRootView>
  )
}

function ThemedStack() {
  const { theme, settings } = useAppContext()

  useEffect(() => {
    // Set navigation bar color to match tab bar (Android only)
    if (Platform.OS === 'android') {
      SystemUI.setBackgroundColorAsync(theme.tabBar)
    }
  }, [theme.tabBar])

  return (
    <>
      <StatusBar style={settings.theme === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: theme.background },
          headerTintColor: theme.text,
          headerTitleStyle: { fontWeight: 'bold' },
          contentStyle: { backgroundColor: theme.background }
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </>
  )
}
