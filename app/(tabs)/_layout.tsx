import { StyleSheet, Text, View } from 'react-native'
import React,{useEffect, useState} from 'react'
import {Tabs} from 'expo-router'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import {useRouter} from 'expo-router'
import {auth} from './../../config/FirebaseConfig'
import { getLocalStorage } from '@/service/Storage'

const TabLayout = () => {
  const router=useRouter()

  useEffect(() => {
    GetUserDetail()
  }, [])

  const GetUserDetail = async() => {
    const userInfo = await getLocalStorage('userDetail')

    if(!userInfo){
      router.replace('/login')
    }
  }




  return (
    <Tabs screenOptions={{headerShown: false}}>
      <Tabs.Screen name='index' 
        options={{
            tabBarLabel:'Home',
            tabBarIcon:({color, size}) => (
                <FontAwesome name="home" size={24} color={color} />
            )
        }}/>
      <Tabs.Screen name='History' 
        options={{
            tabBarLabel:'Histórico',
            tabBarIcon:({color, size}) => (
                <FontAwesome name="plus-square" size={24} color={color} />
            )
          }}
      />
      <Tabs.Screen name='Profile' 
        options={{
            tabBarLabel:'Perfil',
            tabBarIcon:({color, size}) => (
                <FontAwesome name="user" size={24} color={color} />
            )
          }}
      />
    </Tabs>
  )
}

export default TabLayout

