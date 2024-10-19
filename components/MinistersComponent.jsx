import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator, // Import ActivityIndicator
} from "react-native";
import React, { useEffect, useState, useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import { db } from "../FIrebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import NavBar from "./NavBar";
import { ThemeContext } from "../context/ThemeContext";
import * as Font from "expo-font";
import { SafeAreaView } from "react-native-safe-area-context";
import LoadingScreen from "./LoadingScreen";

const MinistersComponent = () => {
  const [ministers, setMinisters] = useState([]);
  const navigation = useNavigation();
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Load custom fonts
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

  const { theme } = useContext(ThemeContext); // Access theme from context

  const fetchMinisters = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "ministers"));
      const ministersData = querySnapshot.docs.map((doc) => doc.data());
      setMinisters(ministersData);
    } catch (err) {
      setError("Failed to load ministers.");
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  useEffect(() => {
    fetchMinisters();
  }, []);

  const handlePress = (minister) => {
    navigation.navigate("MinisterDetails", { minister });
  };

  const renderMinister = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.ministerCard,
        theme === "light" ? styles.lightCard : styles.darkCard,
      ]}
      onPress={() => handlePress(item)}
      accessible={true} // Accessibility
      accessibilityLabel={`View details for ${item.ministerName}`}
    >
      <Image
        style={styles.ministerProfileImage}
        source={{ uri: item.ministerProfileImage }}
      />
      <View>
        <Text
          style={[
            styles.ministerName,
            theme === "light" ? styles.lightText : styles.darkText,
          ]}
        >
          {item.ministerName}
        </Text>
        <Text
          style={[
            styles.ministerDepartment,
            theme === "light" ? styles.lightText : styles.darkText,
          ]}
        >
          {item.ministerDepartment.name}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (!fontsLoaded) {
    return (
      <LoadingScreen/>
    ); // Loading indicator
  }

  if (loading) {
    return (
      <LoadingScreen/>
    ); // Loading state
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>; // Display error
  }

  return (
    <View
      style={[
        theme === "light" ? styles.lightBackground : styles.darkBackground,
        styles.fullWidth,
      ]}
    >
      <NavBar />
      <FlatList
        data={ministers}
        keyExtractor={(item) => item.ministerID}
        renderItem={renderMinister}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.flatListContainer}
      />
    </View>
  );
};
export default MinistersComponent;

const styles = StyleSheet.create({
  fullWidth: {
    flex: 1,
    paddingHorizontal: 18,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    margin: 20,
  },
  ministerCard: {
    padding: 16,
    marginVertical: 10,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    marginHorizontal: 0, // Set horizontal margin to 0 to remove space
    width: "100%", // Ensure the card takes up the full width
  },
  ministerProfileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  ministerName: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    marginBottom: 5,
  },
  ministerDepartment: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
  },
  // Light theme styles
  lightBackground: {
    backgroundColor: "#f9f9f9",
  },
  lightCard: {
    backgroundColor: "#fff",
    borderColor: "#e0e0e0",
    borderWidth: 1,
  },
  lightText: {
    color: "#333",
  },
  // Dark theme styles
  darkBackground: {
    backgroundColor: "#222",
  },
  darkCard: {
    backgroundColor: "#333",
    borderColor: "#444",
    borderWidth: 1,
  },
  darkText: {
    color: "#fff",
  },
  flatListContainer: {
    paddingHorizontal: 0, // Remove padding around FlatList
    marginHorizontal: 0, // Remove any margin around FlatList
  },
});
