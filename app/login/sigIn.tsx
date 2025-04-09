import { View, Text, StyleSheet, TextInput, TouchableOpacity, ToastAndroid } from 'react-native'
import React,{useState} from 'react'
import Colors from '@/constant/Colors'
import { useRouter } from 'expo-router'
import {auth} from './../../config/FirebaseConfig'
import { setLocalStorage } from '@/service/Storage'
import { signInWithEmailAndPassword } from 'firebase/auth'


const sigIn = () => {

  const router = useRouter()
  const [email, setEmail] =useState()
  const [password, setPassword] =useState()

  const OnSignInClick=()=> {

    if(!email || !password) {
      ToastAndroid.show('Por favor, preencha os campos de email e senha', ToastAndroid.BOTTOM)
      return
    }

    signInWithEmailAndPassword(auth, email, password)
      .then(async(userCredential:any) => {
        const user = userCredential.user 
        console.log(user)
        await setLocalStorage('userDetail', user)
        router.replace('/(tabs)')
      })
      .catch((error:any) => {
        const errorCode = error.code 
        const errorMessage = error.message

        if(errorCode=='auth/invalid-credential'){
          ToastAndroid.show('Email ou senha é inválido', ToastAndroid.BOTTOM)
        }
      })
      
  } 
    
  

  return (
    <View style={{
        padding: 25
    }}>
      <Text style={styles.textHeader}>Faça seu Login</Text>
      <Text>Bem vindo(a) de Volta</Text>

      <View style={{marginTop: 25}}>
        <Text>Email</Text>
        <TextInput placeholder='Email' style={styles.textInput}  onChangeText={(value:any) =>setEmail(value)}/>
      </View>
      <View style={{marginTop: 25}}>
        <Text>Password</Text>
        
        <TextInput placeholder='Senha' style={styles.textInput} secureTextEntry={true} onChangeText={(value:any) =>setPassword(value)}/>
      </View>

      <TouchableOpacity style={styles.button} onPress={(OnSignInClick)}>
        <Text style={{fontSize: 17, color: 'white', textAlign:'center'}}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonCreate} onPress={() => router.push('/login/signUp')}>
        <Text style={{fontSize: 17, color: Colors.PRIMARY, textAlign:'center'}}>Crie sua Conta</Text>
      </TouchableOpacity>
    </View>
  )
}

export default sigIn

const styles = StyleSheet.create({
    textHeader:{
        fontSize: 30,
        fontWeight: 'bold',
        marginTop: 15
    },
    subText:{
        fontSize: 30,
        fontWeight: 'bold',
        marginTop: 10,
        color: Colors.GRAY
    },
    textInput:{
      padding: 10,
      borderWidth:1,
      marginTop: 5,
      borderRadius: 5,
      fontSize: 17,
      backgroundColor: 'white'
    },
    button:{
      padding: 20,
      backgroundColor: Colors.PRIMARY,
      borderRadius: 10,
      marginTop: 35
    },
    buttonCreate:{
      padding: 20,
      backgroundColor: 'white',
      borderRadius: 10,
      marginTop: 20,
      borderWidth: 1,
      borderColor: Colors.PRIMARY
    }
})