import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import React, { useState, useEffect, useContext } from "react"; // Added useContext here
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Font from "expo-font";
import { ThemeContext } from "../context/ThemeContext"; // Ensure this path is correct

const FavoriteDetails = ({ route, navigation }) => {
  const { item } = route.params; // Get the item data passed from the previous screen
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const { theme } = useContext(ThemeContext); // Accessing the theme from context

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
    <SafeAreaView
      style={theme === "light" ? styles.container : darkModeStyles.container}
    >
      <Image
        style={styles.image}
        source={{
          uri:
            item.imageUrl ||
            "https://masterbuilders.site-ym.com/resource/resmgr/docs/2022/Cabinet_approves_National_In.jpg",
        }}
      />
      {/* <TouchableOpacity
        style={theme === "light" ? styles.backBtn : darkModeStyles.backBtn}
        onPress={() => navigation.navigate("Welcome")}
      >
        <Ionicons
          name="arrow-back-outline"
          size={24}
          color={theme === "light" ? "black" : "white"}
        />
      </TouchableOpacity> */}
      <View style={styles.textContainer}>
        <Text
          style={
            theme === "light" ? styles.projectName : darkModeStyles.projectName
          }
        >
          {item.projectName}
        </Text>
        <Text
          style={
            theme === "light"
              ? styles.projectDescription
              : darkModeStyles.projectDescription
          }
        >
          {item.projectDepartment}
        </Text>
        <Text
          style={
            theme === "light"
              ? styles.projectStatus
              : darkModeStyles.projectStatus
          }
        >
          Status: {item.projectCompletionStatus}
        </Text>
        <Text
          style={
            theme === "light"
              ? styles.projectStartDate
              : darkModeStyles.projectStartDate
          }
        >
          Start Date: {item.projectStartDate}
        </Text>
        <Text
          style={
            theme === "light"
              ? styles.projectBudget
              : darkModeStyles.projectBudget
          }
        >
          Budget Allocation: R{item.projectBudgetAllocation.toLocaleString()}
        </Text>
        <Text
          style={
            theme === "light"
              ? styles.projectTenderCompany
              : darkModeStyles.projectTenderCompany
          }
        >
          Tender Company: {item.projectTenderCompany}
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  projectName: {
    fontSize: 24,
    fontFamily: "Poppins-Bold",
    color: "#333",
    marginBottom: 10,
  },
  image: {
    width: "100%",
    height: 430,
    borderRadius: 45,
    marginBottom: 21,
  },
  projectDescription: {
    fontSize: 18,
    fontFamily: "Poppins-Regular",
    color: "#555",
    marginBottom: 5,
  },
  projectStatus: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "#555",
    marginBottom: 5,
  },
  projectStartDate: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "#555",
    marginBottom: 5,
  },
  projectBudget: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "#555",
    marginBottom: 5,
  },
  projectTenderCompany: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
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

const darkModeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212", // Dark background
  },
  projectName: {
    fontSize: 24,
    fontFamily: "Poppins-Bold",
    color: "#fff", // White text for dark mode
    marginBottom: 10,
  },
  projectDescription: {
    fontSize: 18,
    fontFamily: "Poppins-Regular",
    color: "#ccc", // Light text for dark mode
    marginBottom: 5,
  },
  projectStatus: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "#ccc",
    marginBottom: 5,
  },
  projectStartDate: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "#ccc",
    marginBottom: 5,
  },
  projectBudget: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "#ccc",
    marginBottom: 5,
  },
  projectTenderCompany: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "#ccc",
    marginBottom: 20,
  },
  backBtn: {
    position: "absolute",
    width: 50,
    height: 50,
    backgroundColor: "#333",
    borderRadius: 25,
    top: 60,
    left: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default FavoriteDetails;
