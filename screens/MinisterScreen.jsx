import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import MinistersComponent from '../components/MinistersComponent'


const MinisterScreen = () => {
  return (
    <View style={styles.safeArea}>
      <MinistersComponent/>

    </View>
  )
}

export default MinisterScreen

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "white",
        paddingHorizontal: 18,
      },
})