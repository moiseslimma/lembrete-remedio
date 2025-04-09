import { StyleSheet, Text, View, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import Colors from '@/constant/Colors'
import Ionicons from '@expo/vector-icons/Ionicons';

interface Medicine {
  name: string;
  type: {
    name: string;
    icon: string;
  };
  when: string;
  dose: string;
  reminder: string;
  action?: Array<{
    date: string;
    status: 'Tomou' | 'Não tomou';
  }>;
}

interface Props {
  medicine: Medicine;
  selectedDate: string;
}

export default function MedicationCardItem({ medicine, selectedDate = '' }: Props) {
    const [status, setStatus] = useState<{ date: string; status: 'Tomou' | 'Não tomou' } | null>(null)

    useEffect(() => {
        CheckStatus()
    }, [medicine])

    const CheckStatus = () => {
        const data = medicine?.action?.find((item) => item.date === selectedDate)
        if (data) {
            setStatus(data)
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.subContainer}>
                <View style={styles.imageContainer}>
                    <Image source={{uri: medicine?.type?.icon}} style={{width: 40, height: 40}}/>
                </View>
                <View>
                    <Text style={{fontSize:22, fontWeight: 'bold'}}>{medicine?.name}</Text>
                    <Text style={{fontSize:17}}>{medicine?.when}</Text>
                    <Text style={{color:'white', fontWeight: 'bold'}}>{medicine?.dose} {medicine?.type.name}</Text>
                </View>

            
                {status && (
                    <View style={styles.statusContainer}>
                        {status.status === 'Tomou' ? (
                            <Ionicons name="checkmark-circle" size={24} color={Colors.GREEN} />
                        ) : (
                            <Ionicons name="close-circle" size={24} color="red" />
                        )}
                    </View>
                )}
            </View>

            <View style={styles.reminderContainer}>
                    <Ionicons name="timer-outline" size={24} color="black" />
                    <Text style={{fontWeight:'bold', fontSize: 17}}>{medicine?.reminder}</Text>
                </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        padding:10,
        backgroundColor:Colors.PRIMARY,
        marginTop: 10,
        borderRadius: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        alignItems: 'center'
    },
    imageContainer:{
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 15,
        marginRight: 15,
    },
    subContainer:{
        flexDirection: 'row',
        alignItems: 'center'
    },
    reminderContainer:{
        padding: 12,
        backgroundColor: 'white',
        borderRadius: 15,
        alignItems: 'center'
    },
    statusContainer:{
        position: 'absolute',
        top:5,
        padding:8
    }
})
