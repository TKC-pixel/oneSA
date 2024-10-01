import {
  Text,
  View,
  ScrollView,
  Image,
  StyleSheet,
  ActivityIndicator,
  useWindowDimensions,
  TextInput,
  BackHandler,
  Alert,
  TouchableOpacity,
  Pressable,
  SafeAreaView,
} from "react-native";
import React, { useState, useEffect } from "react";
import * as Font from "expo-font";
import NavBar from "../components/NavBar";
import Ionicons from "@expo/vector-icons/Ionicons";
import { db, auth } from "../FirebaseConfig";
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useFocusEffect } from "@react-navigation/native";

const favicon = require("../assets/images/Favicon.png");

export default function Welcome({ navigation }) {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [department, setDepartment] = useState("Health and Science");
  const [disp, setDisp] = useState("none");
  const user = auth.currentUser;  
  const [info, setInfo] = useState([]);
  const fetchUserData = async () => {
    try {
      if (!user || !user.email) {
        throw new Error("User not authenticated or email is missing.");
      }

      const q = query(collection(db, 'Users'), where('email', '==', user.email));
      const snapshot = await getDocs(q);

      const userData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      setInfo(userData);
      
      console.log("Fetched user data: ", userData);
      
    } 
    catch (error) {
      console.log("Error fetching user data: ", error);
      Alert.alert("Error", "Failed to fetch user data.");
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleBackPress = () => {
    Alert.alert("Exit", "Are you sure you want to exit?", [
      {
        text: "Cancel",
        onPress: () => null,
        style: "cancel",
      },
      {
        text: "Exit",
        onPress: () => BackHandler.exitApp(),
      },
    ]);
    return true;
  };

  useFocusEffect(
    React.useCallback(() => {
      BackHandler.addEventListener("hardwareBackPress", handleBackPress);
      return () => {
        BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
      };
    })
  );

  const loadFonts = async () => {
    await Font.loadAsync({
      "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
      "Poppins-BlackItalic": require("../assets/fonts/Poppins-BlackItalic.ttf"),
      "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
      "Poppins-BoldItalic": require("../assets/fonts/Poppins-BoldItalic.ttf"),
      "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
      "Poppins-ExtraBoldItalic": require("../assets/fonts/Poppins-ExtraBoldItalic.ttf"),
      "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
      "Raleway-Italic-VariableFont_wght": require("../assets/fonts/Raleway-Italic-VariableFont_wght.ttf"),
      "Raleway-VariableFont_wght": require("../assets/fonts/Raleway-VariableFont_wght.ttf"),
      "Raleway-ExtraBold": require("../assets/fonts/Raleway-ExtraBold.ttf"),
    });
  };

  useEffect(() => {
    loadFonts().then(() => setFontsLoaded(true));
  }, []);

  const { width } = useWindowDimensions();

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const toggleDisplay = () => {
    setDisp((prevDisp) => (prevDisp === "none" ? "block" : "none"));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView>
        <NavBar />
        <Text style={styles.welcomeText}>Welcome {info && info.length > 0 ? `${info[0].name} ${info[0].surname}` : "User"}</Text>
        <View style={styles.searchContainer}>
          <Pressable onPress={toggleDisplay}>
            <View style={styles.menuIconContainer}>
              <Ionicons name="menu-outline" size={30} />
            </View>
          </Pressable>
          <TextInput
            placeholder={department}
            placeholderTextColor={"black"}
            style={styles.textInput}
          />
          <Ionicons name="search" size={24} />
        </View>
        <View style={[styles.dropdown, { display: disp }]}>
          {/* Dropdown items here */}
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.departmentTitle}>Department of {department}</Text>
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("Projects")}
          >
            <Text style={styles.cardText}>Projects</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("Budget")}
          >
            <Text style={styles.cardText}>Budget Allocation</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("SuccessRate")}
          >
            <Text style={styles.cardText}>Success Rates</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <Pressable
            style={styles.button}
            onPress={() => navigation.navigate("MinisterScreen")}
          >
            <Text style={styles.buttonText}>Explore Ministers</Text>
          </Pressable>
          <Pressable
            style={styles.button}
            onPress={() => navigation.navigate("Report")}
          >
            <Text style={styles.buttonText}>Report Issues</Text>
          </Pressable>
        </View>
        <View>
          <Text style={styles.favouritesTitle}>Your favourites</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 18,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  welcomeText: {
    fontSize: 24,
    fontFamily: "Poppins-Bold",
    marginVertical: 16,
  },
  searchContainer: {
    margin: 8,
    borderRadius: 20,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f1f1",
  },
  menuIconContainer: {
    marginRight: 10,
  },
  icon: {
    width: 30,
    height: 30,
  },
  textInput: {
    width: 250,
    height: 30,
    marginRight: 15,
    fontFamily: "Poppins-Regular",
  },
  dropdown: {
    backgroundColor: "rgba(0,0,0,0.1)",
    padding: 16,
    borderRadius: 10,
  },
  dropdownItem: {
    marginBottom: 10,
  },
  dropdownText: {
    fontFamily: "Poppins-Regular",
  },
  infoContainer: {
    margin: 8,
  },
  departmentTitle: {
    fontFamily: "Poppins-Bold",
    marginBottom: 20,
  },
  card: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
    height: 120,
    marginBottom: 12,
    backgroundColor: "white",
    padding: 16,
    borderRadius: 20,
  },
  cardText: {
    fontFamily: "Poppins-Regular",
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 20,
    justifyContent: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    padding: 8,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  buttonText: {
    color: "#B7C42E",
    fontSize: 20,
    fontFamily: "Poppins-Bold",
  },
  favouritesTitle: {
    fontFamily: "Poppins-Bold",
    marginTop: 20,
  },
});
