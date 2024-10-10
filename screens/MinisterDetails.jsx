// MinisterDetail.js
import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const MinisterDetail = ({ route }) => {
  const { minister } = route.params;

  return (
    <SafeAreaView>
      <Image
        source={{ uri: minister.ministerProfileImage }}
        resizeMode="cover"
        style={styles.ministerImage}
      />
      <View style={styles.container}>
        <Text style={styles.ministerName}>{minister.ministerName}</Text>
        <Text style={styles.ministerDepartment}>
          {minister.ministerDepartment.name}
        </Text>
        <Text style={styles.ministerBio}>{minister.bio}</Text>
        <Text>Approval Rating: {minister.kpi.approvalRating}%</Text>
        <Text>Budget Utilization: {minister.kpi.budgetUtilization}%</Text>
        <Text>
          Projects Completed: {minister.kpi.completedProjects}/
          {minister.kpi.totalProjects}
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default MinisterDetail;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 18,
  },
  ministerImage: {
    width: 430,
    height: 430,
    borderRadius: 75,
    marginBottom: 20,
  },
  ministerName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  ministerDepartment: {
    fontSize: 18,
    color: "gray",
    marginBottom: 10,
  },
  ministerBio: {
    fontSize: 16,
    marginVertical: 10,
    color: "#555",
  },
});
