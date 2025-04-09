import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { GetDateRangeToDisplay, FormatDate } from './../../service/ConvertDateTime';
import Colors from '@/constant/Colors';
import moment from 'moment';
import { getLocalStorage } from '@/service/Storage';
import MedicationCardItem from './MedicationCardItem';
import EmptyState from './EmptyState';
import { useRouter } from 'expo-router';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/config/FirebaseConfig';

interface Medication {
  id: string;
  name: string;
  type: {
    name: string;
    icon: string;
  };
  when: string;
  dose: string;
  reminder: string;
  dates: string[];
  docId: string;
  userEmail: string;
}

interface DateRangeItem {
  day: string;
  date: string;
  formattedDate: string;
}

export default function MedicationList() {
  const [medList, setMedList] = useState<Medication[]>([])
  const [dateRange, setDateRange] = useState<DateRangeItem[]>([])
  const [selectedDate, setSelectedDate] = useState(moment().format('DD/MM/YYYY'))
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    GetDateRangeList()
    GetMedicationList(selectedDate)
  }, [])

  const GetDateRangeList = () => {
    const today = moment().format('DD/MM/YYYY')
    const endDay = moment().add(6, 'days').format('DD/MM/YYYY')
    const datesString = GetDateRangeToDisplay(today, endDay)
    
    const formattedDates: DateRangeItem[] = datesString.map(date => {
      const momentDate = moment(date, 'DD/MM/YYYY')
      return {
        day: momentDate.format('ddd'),
        date: momentDate.format('DD'),
        formattedDate: date
      }
    })
    
    setDateRange(formattedDates)
  }

  const GetMedicationList = async (selectedDate: string) => {
    setLoading(true)
    const user = await getLocalStorage('userDetail')
    setMedList([])
    
    if (!user?.email) {
      console.log('Usuário não encontrado')
      setLoading(false)
      return
    }

    try {
      const formattedDate = moment(selectedDate, 'DD/MM/YYYY').format('YYYY-MM-DD')
      console.log('Buscando medicações para:', user.email, 'na data:', selectedDate)
      
      const medicationsRef = collection(db, 'medication')
      const q = query(
        medicationsRef,
        where('userEmail', '==', user.email),
        where('dates', 'array-contains', formattedDate)
      )

      const querySnapshot = await getDocs(q)
      const medications: Medication[] = []

      querySnapshot.forEach((doc) => {
        const data = doc.data()
        console.log('Medicação encontrada:', data)
        medications.push({
          id: doc.id,
          name: data.name,
          type: data.type,
          when: data.when,
          dose: data.dose,
          reminder: data.reminder,
          dates: data.dates,
          docId: data.docId,
          userEmail: data.userEmail
        })
      })

      console.log('Total de medicações encontradas:', medications.length)
      setMedList(medications)
    } catch (error) {
      console.error('Erro ao buscar medicações:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={{marginTop: 25}}>
      <Image source={require('../assets/medication.jpeg')} style={{width: '100%', height: 200, borderRadius: 15}}/>

      <FlatList 
        data={dateRange}
        horizontal={true}
        style={{marginTop: 15}}
        renderItem={({item}) => (
          <TouchableOpacity 
            style={[
              styles.dateGroup, 
              {backgroundColor: item.formattedDate === selectedDate ? Colors.PRIMARY : Colors.LIGHT_GRAY_BORDER}
            ]} 
            onPress={() => {
              setSelectedDate(item.formattedDate)
              GetMedicationList(item.formattedDate)
            }}
          >
            <Text style={[styles.day, {color: item.formattedDate === selectedDate ? 'white' : 'black'}]}>
              {item.day}
            </Text>
            <Text style={[styles.date, {color: item.formattedDate === selectedDate ? 'white' : 'black'}]}>
              {item.date}
            </Text>
          </TouchableOpacity>
        )}
      />

      {medList.length > 0 ? 
        <FlatList 
          data={medList}
          refreshing={loading}
          onRefresh={() => GetMedicationList(selectedDate)}
          renderItem={({item, index}) => (
            <TouchableOpacity 
              onPress={() => router.push({
                pathname: '/action-modal',
                params: {
                  id: item.id,
                  name: item.name,
                  type: JSON.stringify(item.type),
                  when: item.when,
                  dose: item.dose,
                  reminder: item.reminder,
                  selectedDate: selectedDate
                }
              })}
            >
              <MedicationCardItem medicine={item} selectedDate={selectedDate}/>
            </TouchableOpacity>
          )}
        />
       : 
        <EmptyState/>
      }
    </View>
  )
}

const styles = StyleSheet.create({
  dateGroup:{
    padding: 10,
    backgroundColor: Colors.LIGHT_GRAY_BORDER,
    display: 'flex',
    alignItems: 'center',
    marginRight: 10,
    borderRadius: 10,
    height: 90,
    justifyContent: 'center',
  },
  day:{
    fontSize: 20,
    marginBottom: 5,
  },
  date:{
    fontSize: 26,
    fontWeight: 'bold',
  }
})