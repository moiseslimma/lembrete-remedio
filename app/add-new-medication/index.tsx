import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import AddMedicationHeader from '../components/AddMedicationHeader'
import AddMedicationForm from '../components/AddMedicationForm'

export default function AddNewMedication () {
  return (
    <ScrollView>
      <AddMedicationHeader />
      <AddMedicationForm />
    </ScrollView>
  )
}

const styles = StyleSheet.create({})