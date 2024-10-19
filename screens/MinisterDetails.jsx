import { StyleSheet, Text, View, Image, Dimensions } from "react-native";
import React, { useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Font from "expo-font"; // Import font loading
import { useEffect, useState } from "react";
import { ThemeContext } from "../context/ThemeContext";
import LoadingScreen from "../components/LoadingScreen";

const MinisterDetail = ({ route }) => {
  const { minister } = route.params;
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const { theme } = useContext(ThemeContext);

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
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView
      style={{
        backgroundColor: theme === "light" ? "#fff" : "#1e1e1e",
        flex: 1,
      }}
    >
      <Image
        source={{ uri: minister.ministerProfileImage }}
        resizeMode="cover"
        style={styles.ministerImage}
      />
      <View style={styles.container}>
        <Text
          style={[
            styles.ministerName,
            { color: theme === "light" ? "#000" : "#fff" },
          ]}
        >
          {minister.ministerName}
        </Text>
        <Text
          style={[
            styles.ministerDepartment,
            { color: theme === "light" ? "gray" : "#aaa" },
          ]}
        >
          {minister.ministerDepartment.name}
        </Text>
        <Text
          style={[
            styles.ministerBio,
            { color: theme === "light" ? "#555" : "#ccc" },
          ]}
        >
          {minister.bio}
        </Text>
        <Text
          style={[
            styles.kpiText,
            { color: theme === "light" ? "#333" : "#bbb" },
          ]}
        >
          Approval Rating: {minister.kpi.approvalRating}%
        </Text>
        <Text
          style={[
            styles.kpiText,
            { color: theme === "light" ? "#333" : "#bbb" },
          ]}
        >
          Budget Utilization: {minister.kpi.budgetUtilization}%
        </Text>
        <Text
          style={[
            styles.kpiText,
            { color: theme === "light" ? "#333" : "#bbb" },
          ]}
        >
          Projects Completed: {minister.kpi.completedProjects}/
          {minister.kpi.totalProjects}
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default MinisterDetail;

const { width } = Dimensions.get("window"); // Get screen width

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 18,
  },
  ministerImage: {
    width: "100%",
    height: 430,
    borderRadius: 75,
    marginBottom: 20,
  },
  ministerName: {
    fontSize: 24,
    fontFamily: "Poppins-Bold",
    marginBottom: 10,
  },
  ministerDepartment: {
    fontSize: 18,
    fontFamily: "Poppins-Regular",
    marginBottom: 10,
  },
  ministerBio: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    marginVertical: 10,
  },
  kpiText: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    marginBottom: 5,
  },
});
