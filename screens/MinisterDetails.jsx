// MinisterDetail.js
import { StyleSheet, Text, View, Image } from 'react-native';
import React from 'react';

const MinisterDetail = ({ route }) => {
  const { minister } = route.params;

  return (
    <View style={styles.container}>
      <Image source={{ uri: minister.ministerProfileImage }} style={styles.ministerImage} />
      <Text style={styles.ministerName}>{minister.ministerName}</Text>
      <Text style={styles.ministerDepartment}>{minister.ministerDepartment.name}</Text>
      <Text style={styles.ministerBio}>{minister.bio}</Text>
      <Text>Approval Rating: {minister.kpi.approvalRating}%</Text>
      <Text>Budget Utilization: {minister.kpi.budgetUtilization}%</Text>
      <Text>Projects Completed: {minister.kpi.completedProjects}/{minister.kpi.totalProjects}</Text>
    </View>
  );
};

export default MinisterDetail;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  ministerImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  ministerName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  ministerDepartment: {
    fontSize: 18,
    color: 'gray',
    marginBottom: 10,
  },
  ministerBio: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 10,
    color: '#555',
  },
});
