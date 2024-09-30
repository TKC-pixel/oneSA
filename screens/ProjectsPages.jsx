import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Projects from '../components/Projects'

const ProjectsPages = () => {
  return (
    <View style={styles.safeArea}>
      <Projects/>
    </View>
  )
}

export default ProjectsPages

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "white",
        paddingHorizontal: 18,
      },
})