import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import Aviso from '@/constant/Aviso'
import Colors from '@/constant/Colors'
import {useRouter} from 'expo-router'

export default function EmptyState () {
    const router = useRouter()
  return (
    <View style={{
        marginTop: 80,
        display: 'flex',
        alignItems: 'center'
    }}>
      <Image source={require('../assets/medicina.png')} style={{width: 120, height: 120}}/>
      <Text style={{fontSize: 35, fontWeight: 'bold', marginTop: 30}}>{Aviso.NoMedication}</Text>
      <Text style={{fontSize: 16, color: Colors.DARK_GRAY, textAlign: 'center', marginTop: 20}}>
        {Aviso.MedicationSubTex}
      </Text>

      <TouchableOpacity style={{backgroundColor: Colors.PRIMARY, padding: 15, borderRadius: 10, width: '90%', marginTop: 30}} onPress={() => router.push('/add-new-medication')}><Text style={{textAlign: 'center', fontSize: 17, color: 'white'}}>{Aviso.AddNewMedication}</Text></TouchableOpacity>
    </View>
  )
}
