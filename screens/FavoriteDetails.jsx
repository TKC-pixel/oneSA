import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Font from "expo-font";

const FavoriteDetails = ({ route, navigation }) => {
  const { item } = route.params; // Get the item data passed from the previous screen
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

  // Render a loading state while fonts are loading
  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Image
        style={styles.image}
        source={{
          uri: "https://masterbuilders.site-ym.com/resource/resmgr/docs/2022/Cabinet_approves_National_In.jpg",
        }}
      />
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => navigation.navigate("Welcome")}
      >
        <Ionicons name="arrow-back-outline" size={24} color="black" />
      </TouchableOpacity>
      <View style={styles.textContainer}>
        <Text style={styles.projectName}>{item.projectName}</Text>
        <Text style={styles.projectDescription}>{item.projectDepartment}</Text>
        <Text style={styles.projectStatus}>
          Status: {item.projectCompletionStatus}
        </Text>
        <Text style={styles.projectStartDate}>
          Start Date: {item.projectStartDate}
        </Text>
        <Text style={styles.projectBudget}>
          Budget Allocation: R{item.projectBudgetAllocation.toLocaleString()}
        </Text>
        <Text style={styles.projectTenderCompany}>
          Tender Company: {item.projectTenderCompany}
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  projectName: {
    fontSize: 24,
    fontFamily: "Poppins-Bold", // Applying Poppins-Bold for the project name
    color: "#333",
    marginBottom: 10,
  },
  image: {
    width: "100%",
    height: 390,
    borderRadius: 45,
    marginBottom: 21,
  },
  projectDescription: {
    fontSize: 18,
    fontFamily: "Poppins-Regular", // Applying Poppins-Regular for description
    color: "#555",
    marginBottom: 5,
  },
  projectStatus: {
    fontSize: 16,
    fontFamily: "Poppins-Regular", // Applying Poppins-Regular for status
    color: "#555",
    marginBottom: 5,
  },
  projectStartDate: {
    fontSize: 16,
    fontFamily: "Poppins-Regular", // Applying Poppins-Regular for start date
    color: "#555",
    marginBottom: 5,
  },
  projectBudget: {
    fontSize: 16,
    fontFamily: "Poppins-Regular", // Applying Poppins-Regular for budget
    color: "#555",
    marginBottom: 5,
  },
  projectTenderCompany: {
    fontSize: 16,
    fontFamily: "Poppins-Regular", // Applying Poppins-Regular for tender company
    color: "#555",
    marginBottom: 20,
  },
  backBtn: {
    position: "absolute",
    width: 50,
    height: 50,
    backgroundColor: "#D9D9D9",
    borderRadius: 25,
    top: 60,
    left: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    paddingHorizontal: 18,
  },
});

export default FavoriteDetails;
