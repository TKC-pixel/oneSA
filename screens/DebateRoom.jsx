import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import DebateRooms from '../components/debateRooms'
import { SafeAreaView } from 'react-native-safe-area-context'

const DebateRoom = () => {
  return (
    <SafeAreaView style={{flex: 1}}>
    <View style={{flex: 1}}>
      <DebateRooms/>
    </View>
    </SafeAreaView>
  )
}

export default DebateRoom

const styles = StyleSheet.create({})