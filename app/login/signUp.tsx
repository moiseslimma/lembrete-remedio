import { StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native'
import React,{useState} from 'react'
import {useRouter} from 'expo-router'
import Colors from '@/constant/Colors'
import {auth} from './../../config/FirebaseConfig'
import { setLocalStorage } from '@/service/Storage'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'

const signUp = () => {
  const router = useRouter()
  const [email, setEmail] =useState()
  const [password, setPassword] =useState()
  const [userName, setUserName] = useState()

  const OnCreateAccount=()=> {

    if(!email || !password || !userName) {
      ToastAndroid.show('Por favor, preencha todos os dados', ToastAndroid.BOTTOM)
      return
    }

    createUserWithEmailAndPassword(auth, email, password)
    .then(async(userCredential:any) => {
      const user = userCredential.user
      
      await updateProfile(user, {
        displayName:userName
      })

      await setLocalStorage('userDetail', user)
      router.push('/(tabs)')
    })
    .catch((error:any)=> {
      const errorCode = error.code
      const errorMessage = error.message
      console.log(errorCode)

      if(errorCode=='auth/email-already-in-use'){
        ToastAndroid.show('Email já existe', ToastAndroid.BOTTOM)
      }
    })
  }

  return (
    <View style={{
        padding: 25
    }}>
      <Text style={styles.textHeader}>Crie Uma Nova Conta</Text>
      <Text>Bem vindo(a) de Volta</Text>

      <View style={{marginTop: 25}}>
        <Text>Seu Nome</Text>
        <TextInput placeholder='Nome' style={styles.textInput} onChangeText={(value:any) => setUserName(value)}/>
      </View>
      <View style={{marginTop: 25}}>
        <Text>Email</Text>
        <TextInput placeholder='Email' style={styles.textInput} onChangeText={(value:any) =>setEmail(value)}/>
      </View>
      <View style={{marginTop: 25}}>
        <Text>Password</Text>
        
        <TextInput placeholder='Senha' style={styles.textInput} secureTextEntry={true} onChangeText={(value:any) =>setPassword(value)}/>
      </View>

      <TouchableOpacity style={styles.button} onPress={(OnCreateAccount)}>
        <Text style={{fontSize: 17, color: 'white', textAlign:'center'}}>Criar Conta</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonCreate} onPress={() => router.push('/login/signUp')}>
        <Text style={{fontSize: 17, color: Colors.PRIMARY, textAlign:'center'}}>Já tem uma conta? Faça seu login</Text>
      </TouchableOpacity>
    </View>
  )
}

export default signUp

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