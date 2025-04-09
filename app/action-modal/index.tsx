import { StyleSheet, Text, View, Image, TouchableOpacity, ToastAndroid, Alert } from 'react-native'
import React from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import Colors from '@/constant/Colors'
import MedicationCardItem from './../components/MedicationCardItem';
import Ionicons from '@expo/vector-icons/Ionicons';
import moment from 'moment'
import { db } from '@/config/FirebaseConfig';
import { arrayUnion, doc, updateDoc } from 'firebase/firestore';

interface Medicine {
  id: string;
  name: string;
  type: {
    name: string;
    icon: string;
  };
  when: string;
  dose: string;
  reminder: string;
  selectedDate: string;
}

export default function MedicationActionModal () {
    const medicine = useLocalSearchParams() as unknown as Medicine;
    const router = useRouter()

    const UpdateActionStatus = async (status: 'Tomou' | 'Não tomou') => {
        try {
            const docRef = doc(db, 'medication', medicine.id);
            await updateDoc(docRef, {
                action: arrayUnion({
                    status: status,
                    time: moment().format('LT'),
                    date: medicine.selectedDate
                })
            });

            Alert.alert(
                status,
                'Ação atualizada com sucesso!',
                [
                    {
                        text: 'OK',
                        onPress: () => router.replace('/(tabs)')
                    }
                ]
            );
        } catch(error) {
            console.error('Erro ao atualizar documento:', error);
        }
    }

    return (
        <View style={styles.container}>
            <Image source={require('../assets/notification.gif')} style={{width: 120, height: 120}}/>
            <Text style={{fontSize:19}}>{medicine?.selectedDate}</Text>
            <Text style={{fontSize:30, fontWeight:'bold', color:Colors.PRIMARY}}>{medicine?.reminder}</Text>
            <Text style={{fontSize:30, fontWeight:'bold', color:Colors.PRIMARY}}>Está na hora de tomar o remédio!</Text>

            <MedicationCardItem medicine={medicine} selectedDate={''}/>

            <View style={styles.btnContainer}>
                <TouchableOpacity style={styles.closeBtn} onPress={() => UpdateActionStatus('Não tomou')}>
                    <Ionicons name="close-outline" size={24} color="red" />
                    <Text style={{fontSize:20, color:'red'}}>Não tomei</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.sucessBtn} onPress={() => UpdateActionStatus('Tomou')}>
                    <Ionicons name="checkmark-outline" size={24} color="white" />
                    <Text style={{fontSize:20, color:'white'}}>Tomei</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={{position: 'absolute', bottom: 25}} onPress={() => router.back()}>
                <Ionicons name="close-circle" size={45} color={Colors.GRAY} />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        padding: 25,
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        backgroundColor: 'white',
    },
    btnContainer:{
        gap:10,
        flexDirection: 'row',
        marginTop: 25,
    },
    closeBtn:{
        padding: 10,
        gap:8,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: Colors.LIGHT_GRAY_BORDER,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 25,
        width: '45%',
    },
    sucessBtn:{
        padding: 10,
        backgroundColor: Colors.GREEN,
        borderRadius: 10,
        gap: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 25,
        width: '45%',
    }
})