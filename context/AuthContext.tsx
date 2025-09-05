import React, { createContext, useEffect, useState } from 'react'
import { User } from '@/services/user.service'
import userService from '@/services/user.service'
import { router } from 'expo-router'
import { useMutation } from '@tanstack/react-query'
import { Loading } from '@/components'
import { View } from 'react-native'

// Define the UserContext type
type UserContextType = {
    user: User | null
    updateUser: (newUserInfo: User | null) => void
    loading: boolean
}

// Create the context
export const UserContext = createContext<UserContextType>({
    user: null,
    updateUser: () => {},
    loading: false,
})

// Provider component
export const UserProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null)

    const { mutate, isPending } = useMutation({
        mutationFn: userService.getMyInfo,
        onSuccess: (data) => {
            setUser(data)
        },
        onError: (error) => {
            console.log('Chưa login, chuyển hướng tới /auth/login')
            setUser(null)
        },
    })

    const updateUser = (newUserInfo: User | null) => {
        setUser(newUserInfo)
    }

    useEffect(() => {
        mutate()
    }, [mutate])
    if (isPending) {
        return (
            <View className="items-center justify-center flex-1 w-full h-full">
                <Loading />
            </View>
        )
    }
    return <UserContext.Provider value={{ user, updateUser, loading: isPending }}>{children}</UserContext.Provider>
}
