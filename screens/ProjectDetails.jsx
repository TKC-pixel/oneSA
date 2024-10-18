import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ProjectDetails = ({ route }) => {
  const { project } = route.params;
  console.log(project)
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{project.projectName}</Text>
      <Text style={styles.detail}>Department: {project.projectDepartment}</Text>
      <Text style={styles.detail}>Budget: {project.projectBudgetAllocation}</Text>
      <Text style={styles.detail}>Status: {project.projectCompletionStatus}</Text>
      <Text style={styles.description}>{project.description}</Text>
    </SafeAreaView>
  );
};

export default ProjectDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    fontFamily: 'Poppins-Bold',
  },
  detail: {
    fontSize: 16,
    marginBottom: 5,
    fontFamily: 'Poppins-Regular',
  },
  description: {
    marginTop: 20,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
});
