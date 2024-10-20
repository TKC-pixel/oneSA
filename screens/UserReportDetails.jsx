import React, { useContext, useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import * as Font from "expo-font";
import { SafeAreaView } from "react-native-safe-area-context";
import LoadingScreen from "../components/LoadingScreen";
import { Ionicons } from "@expo/vector-icons";
import { ThemeContext } from "../context/ThemeContext";

const UserReportDetails = ({ route }) => {
  const { item } = route.params; // Access the passed item data
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const { theme } = useContext(ThemeContext);
  console.log(item);

  const loadFonts = async () => {
    await Font.loadAsync({
      "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
      "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    });
  };

  const renderStatus = (status) => {
    switch (status) {
      case "not_started":
        return <Text style={[styles.statusText, styles.notStarted]}>Not Started</Text>;
      case "in_progress":
        return <Text style={[styles.statusText, styles.inProgress]}>In Progress</Text>;
      case "completed":
        return <Text style={[styles.statusText, styles.completed]}>Completed</Text>;
      default:
        return <Text style={styles.statusText}>Unknown Status</Text>;
    }
  };

  useEffect(() => {
    loadFonts().then(() => setFontsLoaded(true));
  }, []);

  if (!fontsLoaded) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme === "light" ? "#fff" : "#1e1e1e" }]}>
      {item.projectImage && (
        <Image source={{ uri: item.projectImage }} style={styles.reportImage} />
      )}
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme === "light" ? "#343a40" : "#ffffff" }]}>{item.title}</Text>

        <Text style={[styles.info, { color: theme === "light" ? "#6c757d" : "#adb5bd" }]}>{item.description}</Text>

        <Text style={[styles.info, { color: theme === "light" ? "#6c757d" : "#adb5bd" }]}>
          <Ionicons name="location-outline" color={theme === "light" ? "#6c757d" : "#adb5bd"} />
          {item.location}
        </Text>

        <Text style={[styles.description, { color: theme === "light" ? "#495057" : "#e9ecef" }]}>Status:</Text>
        {renderStatus(item.status)}  

        <Text style={[styles.description, { color: theme === "light" ? "#495057" : "#e9ecef" }]}>Additional Comments:</Text>
        <Text style={[styles.info, { color: theme === "light" ? "#6c757d" : "#adb5bd" }]}>{item.additionalComments || "N/A"}</Text>
      </View>
    </SafeAreaView>
  );
};

export default UserReportDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    marginHorizontal: 18,
  },
  title: {
    fontSize: 24,
    fontFamily: "Poppins-Bold",
    marginBottom: 20,
  },
  reportImage: {
    width: "100%",
    height: 390,
    borderRadius: 45,
    marginBottom: 21,
    shadowColor: '#000', 
    shadowOffset: {
      width: 0,
      height: 2, 
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
    resizeMode: "cover"
  },
  description: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    marginVertical: 10,
  },
  info: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    marginBottom: 15,
    lineHeight: 24,
  },
  statusText: {
    fontSize: 16,
    fontFamily: "Poppins-Bold", 
    marginBottom: 15,
    lineHeight: 24,
  },
  notStarted: {
    color: "#dc3545", 
  },
  inProgress: {
    color: "#ffc107", 
  },
  completed: {
    color: "#28a745", 
  },
});
