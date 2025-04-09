import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';

export default function AddMedicationHeader () {
    const router = useRouter()

  return (
    <View>
      <Image source={require('../assets/consult.png')} style={{width: '100%', height: 200 }}/>
      <TouchableOpacity style={{position: 'absolute', padding: 25}} onPress={() => router.back()}> 
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
     
    </View>
  )
}


const styles = StyleSheet.create({})