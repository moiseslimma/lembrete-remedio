import { ScrollView, StyleSheet, View } from 'react-native'
import React from 'react'

import { RemoveLocalStorage } from '@/service/Storage'
import Header from '../components/Header'

import MedicationList from '../components/MedicationList'


const HomeScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Header />
        <MedicationList />
      </View>
    </ScrollView>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    padding: 25,
    minHeight: '100%',
  }
})