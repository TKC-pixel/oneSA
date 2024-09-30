import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import SuccessRate from '../components/SuccessRate'

const SuccessRateScreen = () => {
  return (
    <View style={styles.safeArea}>
      <SuccessRate/>
    </View>
  )
}

export default SuccessRateScreen

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "white",
        paddingHorizontal: 18,
      },
})