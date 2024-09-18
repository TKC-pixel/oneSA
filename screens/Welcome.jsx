import {
  Text,
  View,
  ScrollView,
  Image,
  StyleSheet,
  ActivityIndicator,
  useWindowDimensions,
  TextInput,
  Pressable,
  SafeAreaView,
} from "react-native";
import { useState, useEffect } from "react";
import * as Font from "expo-font";
import NavBar from "../components/NavBar";
import Ionicons from "@expo/vector-icons/Ionicons";
import { auth } from "./Home";

const favicon = require("../assets/images/Favicon.png");

export default function Welcome() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [department, setDepartment] = useState("Health and Science");
  const [disp, setDisp] = useState("none");
  const user = auth.currentUser

  console.log(user)

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
        <Text style={styles.welcomeText}>Welcome {user.phoneNumber}</Text>
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
          <Pressable
            style={styles.dropdownItem}
            onPress={() => {
              setDepartment("Agriculture, Land Reform and Rural Development"),
                setDisp("none");
            }}
          >
            <Text style={styles.dropdownText}>
              Agriculture, Land Reform and Rural Development
            </Text>
          </Pressable>
          <Pressable
            style={styles.dropdownItem}
            onPress={() => {
              setDepartment("Basic Education"), setDisp("none");
            }}
          >
            <Text style={styles.dropdownText}>Basic Education</Text>
          </Pressable>
          <Pressable
            style={styles.dropdownItem}
            onPress={() => {
              setDepartment("Communications and Digital Technologies"),
                setDisp("none");
            }}
          >
            <Text style={styles.dropdownText}>
              Communications and Digital Technologies
            </Text>
          </Pressable>
          <Pressable
            style={styles.dropdownItem}
            onPress={() => {
              setDepartment("Defense and Military Veterans"), setDisp("none");
            }}
          >
            <Text style={styles.dropdownText}>
              Defense and Military Veterans
            </Text>
          </Pressable>
          <Pressable
            style={styles.dropdownItem}
            onPress={() => {
              setDepartment("Health and Science"), setDisp("none");
            }}
          >
            <Text style={styles.dropdownText}>Health and Science</Text>
          </Pressable>
          <Pressable
            style={styles.dropdownItem}
            onPress={() => {
              setDepartment("Home Affairs"), setDisp("none");
            }}
          >
            <Text style={styles.dropdownText}>Home Affairs</Text>
          </Pressable>
          <Pressable
            style={styles.dropdownItem}
            onPress={() => {
              setDepartment("International Relations and Cooperation"),
                setDisp("none");
            }}
          >
            <Text style={styles.dropdownText}>
              International Relations and Cooperation
            </Text>
          </Pressable>
          <Pressable
            style={styles.dropdownItem}
            onPress={() => {
              setDepartment("Justice and Constitutional Development"),
                setDisp("none");
            }}
          >
            <Text style={styles.dropdownText}>
              Justice and Constitutional Development
            </Text>
          </Pressable>
          <Pressable
            style={styles.dropdownItem}
            onPress={() => {
              setDepartment("Public Works and Infrastructure"), setDisp("none");
            }}
          >
            <Text style={styles.dropdownText}>
              Public Works and Infrastructure
            </Text>
          </Pressable>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.departmentTitle}>Department of {department}</Text>
          <View style={styles.card}>
            <Text style={styles.cardText}>Projects</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardText}>Budget Allocation</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardText}>Success Rates</Text>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>Explore Ministers</Text>
          </Pressable>
          <Pressable style={styles.button}>
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
