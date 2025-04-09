import { ActivityIndicator, Alert, FlatList, ScrollView, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native'
import React, {useState} from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';
import Colors from '@/constant/Colors';
import { TypeList, WhenToTake } from '@/constant/Options';
import {Picker} from '@react-native-picker/picker';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import { FormatDate, formatDateForText } from './../../service/ConvertDateTime';
import { getLocalStorage } from '@/service/Storage';
import { useRouter } from 'expo-router';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/config/FirebaseConfig';
import moment from 'moment';

interface FormData {
  name?: string;
  type?: { name: string; icon: string };
  dose?: string;
  when?: string;
  startDate?: string;
  endDate?: string;
  reminder?: string;
}

export default function AddMedicationForm () {
  const [formData, setFormData] = useState<FormData>({})
  const [showStartDate, setShowStartDate] = useState<boolean>(false)
  const [showEndDate, setShowEndDate] = useState<boolean>(false)
  const [showTimePicker, setShowTimePicker] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const router = useRouter()
  
  const onHandleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const getDatesRange = (startDate: string, endDate: string) => {
    const dates = [];
    const start = moment(startDate, 'DD/MM/YYYY');
    const end = moment(endDate, 'DD/MM/YYYY');
    
    while (start <= end) {
      dates.push(start.format('YYYY-MM-DD'));
      start.add(1, 'days');
    }
    
    return dates;
  }

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }

  const saveMedication = async() => {
    const docId = Date.now().toString()
    const user = await getLocalStorage('userDetail')

    if(!formData.name || !formData.type || !formData.dose || !formData.startDate || !formData.endDate || !formData.reminder) {
      ToastAndroid.show('Preencha todos os campos', ToastAndroid.BOTTOM)
      return
    }

    if (!user?.email) {
      ToastAndroid.show('Usuário não encontrado', ToastAndroid.BOTTOM)
      return
    }

    const dates = getDatesRange(formData.startDate, formData.endDate)
    console.log('Salvando medicação:', {
      ...formData,
      userEmail: user.email,
      docId: docId,
      dates: dates
    })

    setLoading(true)

    try {
      await setDoc(doc(db, 'medication', docId), {
        ...formData,
        when: formData.when || WhenToTake[0],
        userEmail: user.email,
        docId: docId,
        dates: dates,
        createdAt: new Date().toISOString()
      })

      console.log('Medicação salva com sucesso!')
      setLoading(false)
      Alert.alert('Sucesso', 'Nova medicação adicionada', [
        {
          text: 'OK',
          onPress: () => router.push('/(tabs)')
        }
      ])
    } catch(error) {
      console.error('Erro ao salvar medicação:', error)
      setLoading(false)
      ToastAndroid.show('Erro ao salvar medicação', ToastAndroid.BOTTOM)
    }
  }

  return (
    <View style={{padding: 25}}>
      <Text style={styles.header}>Adicione uma medicação</Text>

      <View style={styles.inputGroup}>
        <Ionicons style={styles.icon} name="medkit-outline" size={24} color="black" />
        <TextInput 
          style={styles.textInput} 
          placeholder='Nome da medicação' 
          onChangeText={(value) => onHandleInputChange('name', value)}
        />
      </View>

      <FlatList 
        data={TypeList} 
        horizontal 
        style={{marginTop: 5}}
        renderItem={({item, index}) => (
          <TouchableOpacity 
            style={[
              styles.inputGroup, 
              {marginRight: 10}, 
              {backgroundColor: item.name === formData?.type?.name ? Colors.PRIMARY : 'white'}
            ]}
            onPress={() => onHandleInputChange('type', item)}
          >
            <Text style={[
              styles.typeText, 
              {color: item.name === formData?.type?.name ? 'white' : 'black'}
            ]}>
              {item?.name}
            </Text>
          </TouchableOpacity>
        )}
      />
        
      <View style={styles.inputGroup}>
        <Ionicons style={styles.icon} name="eyedrop-outline" size={24} color="black" />
        <TextInput 
          style={styles.textInput} 
          placeholder='Dose(Ex: 2.5ml)' 
          onChangeText={(value) => onHandleInputChange('dose', value)}
        />
      </View>

      <View style={styles.inputGroup}>
        <Ionicons style={styles.icon} name="time-outline" size={24} color="black" />
        <Picker 
          selectedValue={formData?.when} 
          onValueChange={(itemValue) => onHandleInputChange('when', itemValue)}
          style={{width: '90%'}}
        >
          {WhenToTake.map((item, index) => (
            <Picker.Item key={index} label={item} value={item} />
          ))}
        </Picker>
      </View>

      <View style={styles.dateGroup}>
        <TouchableOpacity 
          style={[styles.inputGroup, {flex:1}]} 
          onPress={() => setShowStartDate(true)}
        >
          <Ionicons style={styles.icon} name="calendar-outline" size={24} color="black" />
          <Text style={styles.text}>
            {formData?.startDate ? formatDateForText(formData.startDate) : 'Data de início'}
          </Text>
        </TouchableOpacity>
        
        {showStartDate && (
          <RNDateTimePicker 
            minimumDate={new Date()}
            onChange={(ev) => {
              if (ev.nativeEvent.timestamp) {
                const date = moment(ev.nativeEvent.timestamp).format('DD/MM/YYYY');
                onHandleInputChange('startDate', date);
              }
              setShowStartDate(false)
            }}
            value={formData?.startDate ? moment(formData.startDate, 'DD/MM/YYYY').toDate() : new Date()}
          />
        )}

        <TouchableOpacity 
          style={[styles.inputGroup, {flex:1}]} 
          onPress={() => setShowEndDate(true)}
        >
          <Ionicons style={styles.icon} name="calendar-outline" size={24} color="black" />
          <Text style={styles.text}>
            {formData?.endDate ? formatDateForText(formData.endDate) : 'Data de término'}
          </Text>
        </TouchableOpacity>

        {showEndDate && (
          <RNDateTimePicker 
            minimumDate={new Date()}
            onChange={(ev) => {
              if (ev.nativeEvent.timestamp) {
                const date = moment(ev.nativeEvent.timestamp).format('DD/MM/YYYY');
                onHandleInputChange('endDate', date);
              }
              setShowEndDate(false)
            }}
            value={formData?.endDate ? moment(formData.endDate, 'DD/MM/YYYY').toDate() : new Date()}
          />
        )}
      </View>

      <View style={styles.dateGroup}>
        <TouchableOpacity 
          style={[styles.inputGroup, {flex:1}]} 
          onPress={() => setShowTimePicker(true)}
        >
          <Ionicons style={styles.icon} name="timer-outline" size={24} color="black" />
          <Text style={styles.text}>
            {formData?.reminder || 'Defina a hora do lembrete'}
          </Text>
        </TouchableOpacity>
      </View>

      {showTimePicker && (
        <RNDateTimePicker 
          mode='time'
          onChange={(ev) => {
            if (ev.nativeEvent.timestamp) {
              onHandleInputChange('reminder', formatTime(ev.nativeEvent.timestamp))
            }
            setShowTimePicker(false)
          }}
          value={formData?.reminder ? new Date(`1970-01-01T${formData.reminder}`) : new Date()}
        />
      )}

      <TouchableOpacity style={styles.button} onPress={saveMedication}>
        {loading ? 
          <ActivityIndicator size={'large'} color={'white'}/> 
          :
          <Text style={styles.buttonText}>Adicione uma nova medicação</Text>
        }
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
    header: {
        fontSize: 25,
        fontWeight: 'bold'
    },
    inputGroup: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.LIGHT_GRAY_BORDER,
        marginTop: 10,
        backgroundColor: 'white'
    },
    textInput:{
        marginLeft: 10,
        flex: 1,
        fontSize: 16

    },
    icon:{
        color: Colors.PRIMARY,
        borderRightWidth: 1,
        paddingRight: 12,
        borderColor: Colors.LIGHT_GRAY_BORDER
    },
    typeText:{
        fontSize: 16
    },
    text:{
      fontSize: 16,
      padding: 5,
      flex: 1,
      marginLeft:10
    },
    dateGroup:{
      flexDirection: 'row',
      gap: 10
    },
    button:{
      padding:15,
      backgroundColor: Colors.PRIMARY,
      borderRadius: 15,
      width: '100%',
      marginTop: 20
    },
    buttonText:{
      fontSize: 17,
      textAlign: 'center',
      color: 'white'
    }
})