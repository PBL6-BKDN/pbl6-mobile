import { Tabs } from 'expo-router'
import React from 'react'
import { View, ViewStyle } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

export const tabBarStyle: ViewStyle = {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
    height: 78, // Giảm chiều cao tổng thể (mặc định ~83)
    paddingBottom: 40,
}
export default function TabsLayout() {
    return (
        <>
            <Tabs
                screenOptions={{
                    headerShown: false,
                    tabBarActiveTintColor: '#0c4a6e',
                    tabBarStyle: tabBarStyle,
                    tabBarLabelStyle: {
                        fontSize: 12,
                        fontWeight: '500',
                    },
                }}
            >
                <Tabs.Screen
                    name="home1"
                    options={{
                        title: 'Home 1',
                        tabBarIcon: ({ color, size, focused }) => (
                            <Ionicons name={focused ? 'home' : 'home-outline'} size={size} color={color} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="home2"
                    options={{
                        title: 'Home 2',
                        tabBarIcon: ({ color, size, focused }) => (
                            <Ionicons name={focused ? 'home' : 'home-outline'} size={size} color={color} />
                        ),
                    }}
                />
            </Tabs>
        </>
    )
}
