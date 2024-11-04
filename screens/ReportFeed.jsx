import React, { useState, useEffect, useContext } from "react";
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
import { db } from "../FIrebaseConfig"; 
import LoadingScreen from "../components/LoadingScreen";
import { ThemeContext } from "../context/ThemeContext";
import NavBar from "../components/NavBar";
import { UserContext } from "../context/UserContext";

const ReportFeed = ({ navigation }) => {
  const { theme } = useContext(ThemeContext); // Access theme from context
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true); // State to manage loading
  const { userData } = useContext(UserContext);

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

  const renderReport = ({ item }) => {
    // Determine the sentiment style based on the sentiment value
    const sentimentStyle = {
      backgroundColor:
        item.sentiment === "Good"
          ? "#00B637"
          : item.sentiment === "Neutral"
          ? "#FFC300"
          : item.sentiment === "Bad"
          ? "#B60000"
          : "transparent", // Default to transparent if sentiment doesn't match
      borderRadius: 4,
      padding: 4,
      width: 63,
      justifyContent: "center",
      alignItems: "center",
    };

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate("UserReportDetails", { item })}
        key={item.id}
        style={[ 
          styles.card,
          theme === "dark" ? styles.cardDark : styles.cardLight,
        ]}
      >
        <View style={styles.profileContainer}>
          {item.profileImage ? (
            <Image source={{ uri: item.profileImage }} style={styles.profImage} />
          ) : (
            <Ionicons 
              name="person-circle-outline" 
              size={40} 
              color={theme === "dark" ? "#fff" : "#808080"} // Grey in light mode, white in dark mode
            />
          )}
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
          <View style={styles.infoContainer}>
            <Text
              style={[
                styles.reportTitle,
                theme === "dark" ? styles.textDark : styles.textLight,
              ]}
              numberOfLines={1} // Limit title to one line
              ellipsizeMode="tail" // Show ellipsis if title is too long
            >
              {item.title || "No Title"}
            </Text>
            <View style={sentimentStyle}>
              <Text style={[{ color: "white", fontFamily: "Poppins-Regular" }]}>
                {item.sentiment || "No Sentiment"}
              </Text>
            </View>
          </View>
          <Text
            style={[
              styles.reportDescription,
              theme === "dark" ? styles.textNormalDark : styles.textNormalLight,
            ]}
            numberOfLines={2} // Limit description to two lines
            ellipsizeMode="tail" // Show ellipsis if description is too long
          >
            {item.description || "No Description"}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

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
        <View style={{ flex: 1 }}>
          <NavBar userInfo={userData} />
          <FlatList
            style={{ marginBottom: 180 }}
            data={reports}
            renderItem={renderReport}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}
      <TouchableOpacity
        style={[
          styles.editButton,
          { backgroundColor: theme === "light" ? "#fff" : "#000" },
        ]}
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
    width: 300,
    height: 300,
    borderRadius: 8,
    marginBottom: 10,
    resizeMode: "cover",
    alignSelf: "center",
  },
  info: {
    padding: 10,
  },
  reportTitle: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    flex: 1, // Allow the title to take available space
  },
  reportDescription: {
    color: "#6F6F6F",
    fontFamily: "Poppins-Regular",
  },
  textLight: {
    color: "#000",
    fontFamily: "Poppins-Bold",
  },
  textNormalLight: {
    color: "#6F6F6F",
    fontFamily: "Poppins-Regular",
    fontSize: 15,
  },
  textDark: {
    color: "#fff",
    fontFamily: "Poppins-Bold",
  },
  textNormalDark: {
    color: "#6F6F6F",
    fontFamily: "Poppins-Regular",
    fontSize: 15,
  },
  lightBackground: {
    backgroundColor: "#fff",
  },
  darkBackground: {
    backgroundColor: "#1c1c1e",
  },
  editButton: {
    position: "absolute",
    right: 7,
    top: 700,
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
  infoContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 5,
  },
  name: {
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
  },
});
