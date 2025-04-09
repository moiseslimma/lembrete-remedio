import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getLocalStorage } from '@/service/Storage'
import Colors from '@/constant/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';

interface User {
  displayName?: string;
  email?: string;
}

export default function Header () {
    const [user, setUser] = useState<User | null>(null)
    const router = useRouter()

    useEffect(() => {
        GetUserDetail()
    }, [])

    const GetUserDetail = async() => {
        const userInfo = await getLocalStorage('userDetail')
        console.log(userInfo)
        setUser(userInfo)
    }

    return (
        <View style={{marginTop: 20}}>
            <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%'}}>
                <View style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 10
                }}>

                    <Text style={{fontWeight: 'bold', fontSize: 25}}>Olá, {user?.displayName}   👋</Text>
                </View>
                <TouchableOpacity onPress={() => router.push('/add-new-medication')} style={{marginLeft: 'auto'}}>
                    <Ionicons name="medkit-outline" size={24} color={Colors.PRIMARY} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({})