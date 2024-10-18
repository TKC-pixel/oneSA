import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Font from "expo-font"; // Import font loading
import { useEffect, useState } from "react";

const MinisterDetail = ({ route }) => {
  const { minister } = route.params;
  const [fontsLoaded, setFontsLoaded] = useState(false);

  // Load fonts asynchronously
  const loadFonts = async () => {
    await Font.loadAsync({
      "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
      "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    });
    setFontsLoaded(true);
  };

  useEffect(() => {
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return <Text>Loading...</Text>; // Return loading state if fonts are not yet loaded
  }

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
        <Text style={styles.kpiText}>
          Approval Rating: {minister.kpi.approvalRating}%
        </Text>
        <Text style={styles.kpiText}>
          Budget Utilization: {minister.kpi.budgetUtilization}%
        </Text>
        <Text style={styles.kpiText}>
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
    fontFamily: "Poppins-Bold", // Apply Poppins-Bold to minister name
    marginBottom: 10,
  },
  ministerDepartment: {
    fontSize: 18,
    fontFamily: "Poppins-Regular", // Apply Poppins-Regular to minister department
    color: "gray",
    marginBottom: 10,
  },
  ministerBio: {
    fontSize: 16,
    fontFamily: "Poppins-Regular", // Apply Poppins-Regular to bio
    marginVertical: 10,
    color: "#555",
  },
  kpiText: {
    fontSize: 16,
    fontFamily: "Poppins-Regular", // Apply Poppins-Regular to KPI text
    marginBottom: 5,
    color: "#333",
  },
});
