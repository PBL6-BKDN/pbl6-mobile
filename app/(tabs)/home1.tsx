import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Home1() {
    return (
        <SafeAreaView>
            <View>
                <Text className="text-red-500 text-[100px]">Trang Home 1</Text>
                <Text>Chào mừng đến với trang chủ đầu tiên!</Text>
            </View>
        </SafeAreaView>
    )
}
