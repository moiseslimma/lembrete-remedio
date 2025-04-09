import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import Colors from '../../constant/Colors'
import { useRouter } from 'expo-router'

const index = () => {

    const router=useRouter()

  return (
    <View>
      <View style={{
        display: 'flex',
        alignItems: 'center',
        marginTop: 40
      }}>
        <Image source={require('../assets/Gemini_Generated_Image_tkjqnmtkjqnmtkjq-removebg-preview.png')} 
            style={styles.image}
        />
      </View>

      <View style={{
        padding: 25,
        backgroundColor: Colors.PRIMARY,
        height: '100%'
      }}>
        <Text style={{
            fontSize: 30,
            fontWeight: 'bold',
            color: 'white',
            textAlign: 'center'
        }}>Fique ligado, fique Saudável!</Text>
        <Text style={{
            color: 'white',
            fontSize: 17,
            textAlign: 'center',
            marginTop: 20
        }}>Não perca mais a hora dos seus remédios. Tenha controle sobre sua saúde. Seja consistente. Seja confiante.</Text>

        <TouchableOpacity style={styles.button} onPress={() => router.push('/login/sigIn')}>
            <Text style={{
                textAlign: 'center',
                fontSize: 16,
                color: Colors.PRIMARY,
            }}>Continue</Text>
        </TouchableOpacity>
        <Text style={{
            color: 'white',
            marginTop: 5
        }}>Clicando no botão Continue, você estará concordando com nossos termos e condições</Text>
      </View>
    </View>
  )
}

export default index

const styles = StyleSheet.create({
    image: {
        width: 210,
        height: 450,
        borderRadius: 23
    },
    button:{
        padding: 15,
        backgroundColor: 'white',
        borderRadius: 99,
        marginTop: 25
    }
})