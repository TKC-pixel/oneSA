import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../FIrebaseConfig"; // Ensure Firebase is properly set up
import { SafeAreaView } from "react-native-safe-area-context";

const ReportFeed = ({ navigation }) => {
  const [reports, setReports] = useState([]);
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
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const renderReport = ({ item }) => (
    <TouchableOpacity key={item.id} style={styles.card}>
      <View style={styles.profileContainer}>
        <Image source={favicon} style={styles.profImage} />
        <Text style={styles.name}>{item.name || "Unknown Reporter"}</Text>
      </View>
      {item.projectImage && (
        <Image source={{ uri: item.projectImage }} style={styles.image} />
      )}
      <View style={styles.info}>
        <Text style={styles.reportTitle}>{item.title || "No Title"}</Text>
        <Text style={styles.reportDescription}>
          {item.description || "No Description"}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={reports}
        renderItem={renderReport}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.container}
      />
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => navigation.navigate("CreateReport")}
        accessibilityLabel="Create New Report"
      >
        <Ionicons size={30} name="add-outline" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ReportFeed;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    padding: 10,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 3,
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
  editButton: {
    position: "absolute",
    right: 0,
    top: 750,
    justifyContent: "center",
    alignItems: "center",
    width: 50,
    height: 50,
    marginRight: 20,
    backgroundColor: "white",
    borderRadius: 10,
  },
});
