import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../FIrebaseConfig"; // Ensure Firebase is properly set up
import { SafeAreaView } from "react-native-safe-area-context";
import LoadingScreen from "../components/LoadingScreen";
import { ThemeContext } from "../context/ThemeContext";
import NavBar from "../components/NavBar";

const ReportFeed = ({ navigation }) => {
  const { theme } = useContext(ThemeContext); // Access theme from context
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true); // State to manage loading
  const favicon = require("../assets/images/Favicon.png");

  // Listen to real-time Firestore updates
  useEffect(() => {
    const reportsCollection = collection(db, "reports");

    const unsubscribe = onSnapshot(reportsCollection, (snapshot) => {
      const reportData = snapshot.docs.map((doc) => ({
        id: doc.id, // include document ID
        ...doc.data(),
      }));
      setReports(reportData);
      setLoading(false); // Set loading to false once data is fetched
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const renderReport = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("UserReportDetails", { item })}
      key={item.id}
      style={[
        styles.card,
        theme === "dark" ? styles.cardDark : styles.cardLight,
      ]}
    >
      <View style={styles.profileContainer}>
        <Image source={favicon} style={styles.profImage} />
        <Text
          style={[
            styles.name,
            theme === "dark" ? styles.textDark : styles.textLight,
          ]}
        >
          {item.name || "Unknown Reporter"}
        </Text>
      </View>
      {item.projectImage && (
        <Image source={{ uri: item.projectImage }} style={styles.image} />
      )}
      <View style={styles.info}>
        <Text
          style={[
            styles.reportTitle,
            theme === "dark" ? styles.textDark : styles.textLight,
          ]}
        >
          {item.title || "No Title"}
        </Text>
        <Text
          style={[
            styles.reportDescription,
            theme === "dark" ? styles.textDark : styles.textLight,
          ]}
        >
          {item.description || "No Description"}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View
      style={[
        styles.safeArea,
        theme === "dark" ? styles.darkBackground : styles.lightBackground,
      ]}
    >
      {loading ? ( // Conditionally render the loader
        <LoadingScreen />
      ) : (
        <View>
          <NavBar />
          <FlatList
            data={reports}
            renderItem={renderReport}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.container}
          />
        </View>
      )}
      <TouchableOpacity
        style={[styles.editButton, {backgroundColor: theme === 'light' ? "#fff" : "#000"}]}
        onPress={() => navigation.navigate("CreateReport")}
        accessibilityLabel="Create New Report"
      >
        <Ionicons
          size={30}
          name="add-outline"
          color={theme === "dark" ? "#fff" : "#000"}
        />
      </TouchableOpacity>
    </View>
  );
};

export default ReportFeed;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingHorizontal: 18,
  },
  container: {
    padding: 10,
  },
  card: {
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 3,
  },
  cardLight: {
    backgroundColor: "#fff",
    shadowColor: "#000",
  },
  cardDark: {
    backgroundColor: "#333",
    shadowColor: "#888",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  profImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
    resizeMode: "cover",
  },
  info: {
    padding: 10,
  },
  reportTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },
  reportDescription: {
    color: "#666",
  },
  textLight: {
    color: "#000",
  },
  textDark: {
    color: "#fff",
  },
  lightBackground: {
    backgroundColor: "#f9f9f9",
  },
  darkBackground: {
    backgroundColor: "#1c1c1e",
  },
  editButton: {
    position: "absolute",
    right: 0,
    top: 750,
    justifyContent: "center",
    alignItems: "center",
    width: 50,
    height: 50,
    marginRight: 20,
    borderRadius: 10,
    
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    
    // Elevation for Android
    elevation: 5,
  },
  
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
