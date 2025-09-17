import { useFonts } from 'expo-font'

import '@/global.css'
import * as SplashScreen from 'expo-splash-screen'
import { useContext, useEffect } from 'react'
import 'react-native-reanimated'

import { QueryClientProvider } from '@tanstack/react-query'

import { GestureHandlerRootView } from 'react-native-gesture-handler'

import { fonts } from '@/assets/fonts/fonts'

import { QueryClient } from '@tanstack/react-query'

import { router, Stack, usePathname } from 'expo-router'
import { LogBox, View } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'
const queryClient = new QueryClient()
SplashScreen.preventAutoHideAsync()
// Disable specific warnings
LogBox.ignoreLogs(['[Reanimated] Reading from `value` during component render'])

function LayoutContent() {
    useEffect(() => {
        router.replace('/(tabs)/HomeScreen')
    }, [])
    return (
        <SafeAreaProvider>
            <Stack>
                <Stack.Screen name="auth" options={{ headerShown: false }} />
                {/* Stack để hỗ trợ điều hướng đến các share screens và modals */}
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                {/* Các share screens */}
                <Stack.Screen name="(share)" options={{ headerShown: false }} />

                {/* Modal screens */}
                <Stack.Screen
                    name="(modal)"
                    options={{
                        headerShown: false,
                        sheetCornerRadius: 30,
                        sheetGrabberVisible: true,
                        presentation: 'modal',
                    }}
                />
            </Stack>
        </SafeAreaProvider>
    )
}

export default function RootLayout() {
    const [loaded] = useFonts(fonts)

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync()
        }
    }, [loaded])

    if (!loaded) {
        return null
    }

    return (
        <QueryClientProvider client={queryClient}>
            <GestureHandlerRootView className="flex-1">
                <LayoutContent />
                <Toast position="top" />
            </GestureHandlerRootView>
        </QueryClientProvider>
    )
}
