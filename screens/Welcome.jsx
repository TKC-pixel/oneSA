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
  LogBox,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect, useContext } from "react";
import * as Font from "expo-font";
import NavBar from "../components/NavBar";
import Ionicons from "@expo/vector-icons/Ionicons";
import { db, auth } from "../FIrebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useFocusEffect } from "@react-navigation/native";
import * as Location from "expo-location";
import axios from "axios";
import { ThemeContext } from "../context/ThemeContext";
import { UserContext } from "../context/UserContext";
import AnimatedFlatList from "./AnimatedFavorites";

const favicon = require("../assets/images/Favicon.png");

LogBox.ignoreLogs([
  "VirtualizedLists should never be nested inside plain ScrollViews with the same orientation because it can break windowing and other functionality - use another VirtualizedList-backed container instead.",
]);
export default function Welcome({ navigation }) {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [department, setDepartment] = useState("provinceDepartments");
  const [disp, setDisp] = useState("none");
  const user = auth.currentUser;
  const [info, setInfo] = useState([]);
  const [locationError, setLocationError] = useState("");
  const [locationData, setLocationData] = useState(null);
  const [scrapedData, setScrapedData] = useState({ links: [] });
  const [provinceDepartments, setProvinceDepartments] = useState([]);
  const { theme } = useContext(ThemeContext);
  const { userData, updateLocationPermission, locationPermissions, setUserData, dataAccess } = useContext(UserContext);
  const [deptCodes, setDeptCodes] = useState([]);

  const apiKey = "e4a5f7fae9a8479a1897ea2e74f6c32668c5955a";
  const targetURL =
    "https://provincialgovernment.co.za/units/type/1/departments";
  const cssExtractor =
    "%7B%22links%22%3A%22a%20%40href%22%2C%20%22images%22%3A%22img%20%40src%22%7D";

  //Fonts
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

  // User data
  const fetchUserData = async () => {
    if (user && user.email) {
      try {
        const q = query(
          collection(db, "Users"),
          where("email", "==", user.email)
        );
        const snapshot = await getDocs(q);
        const userData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setInfo(userData);
        setUserData(userData);
      } catch (error) {
        console.log("Error fetching user data: ", error);
        Alert.alert("Error", "Failed to fetch user data.");
      }
    }
  };
  //Location
  const getLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        throw new Error("Permission to access location was denied.");
      }

      const newPermission = "yes";
      updateLocationPermission(newPermission);
      await AsyncStorage.setItem("location", newPermission);

      if (newPermission === "yes") {
        try {
          let location = await Location.getCurrentPositionAsync();
          // console.log("User location:", location);

          const address = await Location.reverseGeocodeAsync(location.coords);
          // console.log("Address:", address);

          setLocationData(address[0]?.city || null);
        } catch (error) {
          console.error("Error fetching location:", error);
          throw new Error("Failed to get current location.");
        }
      }
    } catch (error) {
      setLocationError(error.message);
      Alert.alert("Error", error.message);
    }
  };
  // Scraped data
  const fetchScrapedData = async () => {
    try {
      const response = await axios.get(
        `https://api.zenrows.com/v1/?apikey=${apiKey}&url=${targetURL}&css_extractor=${cssExtractor}`,
        { timeout: 70000 }
      );
      const linksData = response.data?.links || [];
      setScrapedData({ links: linksData });
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  const getProvinceFromCity = (city) => {
    const cityToProvinceMap = {
      Johannesburg: "Gauteng",
      "Cape Town": "Western Cape",
      Durban: "KwaZulu-Natal",
      Pretoria: "Gauteng",
      "Port Elizabeth": "Eastern Cape",
      Bloemfontein: "Free State",
      "East London": "Eastern Cape",
      Pietermaritzburg: "KwaZulu-Natal",
      Kimberley: "Northern Cape",
      Nelspruit: "Mpumalanga",
      Polokwane: "Limpopo",
      Mbombela: "Mpumalanga",
      George: "Western Cape",
      "Richards Bay": "KwaZulu-Natal",
      Upington: "Northern Cape",
      Tzaneen: "Limpopo",
      Vredenburg: "Western Cape",
      Krugersdorp: "Gauteng",
      Springs: "Gauteng",
      Centurion: "Gauteng",
      Klerksdorp: "North West",
      Rustenburg: "North West",
      Mahikeng: "North West",
      Mthatha: "Eastern Cape",
      Newcastle: "KwaZulu-Natal",
      Soweto: "Gauteng",
      Bellville: "Western Cape",
      "Mitchells Plain": "Western Cape",
      Germiston: "Gauteng",
      Boksburg: "Gauteng",
      Benoni: "Gauteng",
      Randburg: "Gauteng",
      Roodepoort: "Gauteng",
      Tembisa: "Gauteng",
      Witbank: "Mpumalanga",
      Secunda: "Mpumalanga",
      "Grassy Park": "Western Cape",
      Ficksburg: "Free State",
      Harrismith: "Free State",
      Kroonstad: "Free State",
      Vanderbijlpark: "Gauteng",
      Sasolburg: "Free State",
      Strand: "Western Cape",
      "Fish Hoek": "Western Cape",
      Parys: "Free State",
      Queenstown: "Eastern Cape",
      "Aliwal North": "Eastern Cape",
      Dundee: "KwaZulu-Natal",
      Ladysmith: "KwaZulu-Natal",
      Hazyview: "Mpumalanga",
      Barberton: "Mpumalanga",
      Mafikeng: "North West",
      Orkney: "North West",
      Kathu: "Northern Cape",
      "De Aar": "Northern Cape",
      Postmasburg: "Northern Cape",
      Grahamstown: "Eastern Cape",
      Uitenhage: "Eastern Cape",
      Swellendam: "Western Cape",
      Kriel: "Mpumalanga",
      Modimolle: "Limpopo",
      Thohoyandou: "Limpopo",
      Lichtenburg: "North West",
      Zeerust: "North West",
      "Piet Retief": "Mpumalanga",
      Kriel: "Mpumalanga",
      Limpopo: "Limpopo",
      Thabazimbi: "Limpopo",
      Mokopane: "Limpopo",
      "Marble Hall": "Mpumalanga",
      Steelpoort: "Mpumalanga",
    };
    return cityToProvinceMap[city] || null;
  };

  const filterDepartmentsByProvince = (province) => {
    const provinceMap = {};
    const codesMap = {};
    scrapedData.links.forEach((link) => {
      if (link.startsWith("/units/view/")) {
        const parts = link.split("/");
        if (parts.length >= 6) {
          const provinceName = parts[4];
          const departmentName = parts[5];
          const departmentCode = parts[3];
          if (!provinceMap[provinceName]) {
            provinceMap[provinceName] = [];
            codesMap[provinceName] = [];
          }
          provinceMap[provinceName].push(departmentName);
          codesMap[provinceName].push(departmentCode);
        }
      }
    });
    setProvinceDepartments(provinceMap[province] || []);
    const departments = provinceMap[province] || [];
    setProvinceDepartments(departments);
    const codes = codesMap[province] || [];
    if (departments.length > 0) {
      setDepartment(departments[0]);
      deptCodes.length = 0;
      deptCodes.push(...codes);
    } else {
      setDepartment("Loading Departments...");
    }
  };

  useEffect(() => {
    // Fetch user data and location on mount
    fetchUserData();
    getLocation(); // Make sure this is working correctly
    fetchScrapedData();
  }, []);

  useEffect(() => {
    if (locationData) {
      // console.log("Location data available: ", locationData);
      const currentProvince = getProvinceFromCity(locationData)?.toLowerCase();
      // console.log("Current province: ", currentProvince);
      if (currentProvince) {
        filterDepartmentsByProvince(currentProvince);
      }
    } else {
      console.log("Location data is null or not yet available.");
    }
  }, [locationData]); // Triggers whenever locationData is updated

  // Handle back button press
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
  // console.log("codes", deptCodes);
  useFocusEffect(
    React.useCallback(() => {
      BackHandler.addEventListener("hardwareBackPress", handleBackPress);
      return () => {
        BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
      };
    }, [])
  );

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

  const currentProvince =
    getProvinceFromCity(locationData)?.toLowerCase() ||
    "checking location permissions";
    let userInfo = null; // Initialize userInfo to null
    if (Array.isArray(userData) && userData.length > 0) {
        userInfo = userData[0]; // Assign the first element if the array is not empty
    }
    
  return (
    <SafeAreaView
      style={theme == "light" ? styles.safeArea : darkModeStyles.safeArea}
    >
      <ScrollView>
        <NavBar userInfo={userInfo} />

        <Text
          style={
            theme == "light" ? styles.welcomeText : darkModeStyles.welcomeText
          }
        >
          Hello{" "}
          {info && info.length > 0
            ? `${info[0].name} ${info[0].surname}`
            : "User"}
        </Text>
        <Text
          style={theme == "light" ? styles.cardText : darkModeStyles.cardText}
        >
          Current Province:{" "}
          {currentProvince
            ? currentProvince.toUpperCase()
            : "Loading Location..."}
        </Text>

        {/* <View style={theme == "light" ? styles.searchContainer : darkModeStyles.searchContainer}>
      <Pressable onPress={toggleDisplay}>
        <View style={theme == "light" ? styles.menuIconContainer : darkModeStyles.menuIconContainer}>
          <Ionicons name="filter-outline" size={30} />
        </View>
      </Pressable>
      <TextInput
        placeholder={department}
        placeholderTextColor={theme == "light" ? "black" : "white"}
        style={theme == "light" ? styles.textInput : darkModeStyles.textInput}
        editable={false}
      />
    </View> */}

        <View
          style={[
            theme == "light" ? styles.dropdown : darkModeStyles.dropdown,
            { display: disp, marginLeft: "5%", marginRight: "5%" },
          ]}
        >
          {provinceDepartments.length > 0 &&
          currentProvince !== "Loading..." ? (
            provinceDepartments.map((department, deptIndex) => (
              <Pressable
                key={deptIndex}
                style={{ marginLeft: 10, marginBottom: "7%" }}
                onPress={() => {
                  setDepartment(department), setDisp("none");
                }}
              >
                <Text>{department}</Text>
              </Pressable>
            ))
          ) : (
            <Text>No departments available for this province.</Text>
          )}
        </View>

        <View
          style={
            theme == "light"
              ? styles.infoContainer
              : darkModeStyles.infoContainer
          }
        >
          <TouchableOpacity
            style={theme == "light" ? styles.card : darkModeStyles.card}
            onPress={() => navigation.navigate("Projects")}
          >
            <View
              style={
                theme == "light" ? styles.cardInfo : darkModeStyles.cardInfo
              }
            >
              <Ionicons
                color="#fff"
                size={25}
                style={styles.cardIconOne}
                name="briefcase-outline"
              />
              <Text
                style={
                  theme == "light" ? styles.cardText : darkModeStyles.cardText
                }
              >
                Projects
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={theme == "light" ? styles.card : darkModeStyles.card}
            onPress={() => {
              if (deptCodes.length > 0) {
                navigation.navigate("SuccessRate", {
                  dept: provinceDepartments,
                  id: deptCodes,
                  prov: currentProvince,
                });
              } else {
                alert("Check for location permissions.");
              }
            }}
          >
            <View
              style={
                theme == "light" ? styles.cardInfo : darkModeStyles.cardInfo
              }
            >
              <Ionicons
                color="#fff"
                size={25}
                style={styles.cardIconOne}
                name="checkmark-done-outline"
              />
              <Text
                style={
                  theme == "light" ? styles.cardText : darkModeStyles.cardText
                }
              >
                Success Rates
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View
          style={
            theme == "light"
              ? styles.budgetInfoContainer
              : darkModeStyles.budgetInfoContainer
          }
        >
          <TouchableOpacity
            style={
              theme == "light" ? styles.budgetCard : darkModeStyles.budgetCard
            }
            onPress={() => {
              if (deptCodes.length > 0) {  
                navigation.navigate("Budget", {
                  dept: provinceDepartments,
                  id: deptCodes,
                  prov: currentProvince,
                });
              } else {
                alert('Check for location permissions.');
              }
            }}
          >
            <View
              style={
                theme == "light" ? styles.cardInfo : darkModeStyles.cardInfo
              }
            >
              <Ionicons
                color="#fff"
                size={25}
                style={styles.cardIconOne}
                name="cash-outline"
              />
              <Text
                style={
                  theme == "light" ? styles.cardText : darkModeStyles.cardText
                }
              >
                Budget Allocation
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View
          style={
            theme == "light"
              ? styles.buttonContainer
              : darkModeStyles.buttonContainer
          }
        >
          <View style={styles.buttonItem}>
            <TouchableOpacity
              style={theme == "light" ? styles.button : darkModeStyles.button}
              onPress={() => navigation.navigate("MinisterScreen")}
            >
              <Text
                style={
                  theme == "light"
                    ? styles.buttonText
                    : darkModeStyles.buttonText
                }
              >
                Explore Ministers
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonItem}>
            <TouchableOpacity
              style={
                theme == "light"
                  ? styles.reportButton
                  : darkModeStyles.reportButton
              }
              onPress={() => navigation.navigate("Report")}
            >
              <Text
                style={
                  theme == "light"
                    ? styles.buttonTextReport
                    : darkModeStyles.buttonTextReport
                }
              >
                Report Issues
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View>
          <Text
            style={
              theme == "light"
                ? styles.favouritesTitle
                : darkModeStyles.favouritesTitle
            }
          >
            Your favourites
          </Text>
          <AnimatedFlatList />
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
    marginTop: 15,
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
    // margin: 5,
    flexDirection: "row",
    alignSelf: "center",
  },
  budgetInfoContainer: {
    // margin: 8,
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
    width: "45%",
    marginBottom: 1,
    backgroundColor: "white",
    padding: 16,
    borderRadius: 20,
    margin: 10,
  },
  budgetCard: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
    height: 120,
    marginBottom: 11,
    marginTop: 20,
    backgroundColor: "white",
    padding: 16,
    borderRadius: 20,
    margin: 10,
  },
  cardText: {
    fontFamily: "Poppins-Bold",
  },
  buttonContainer: {
    borderWidth: 1,
    borderColor: "#D3D3D3",
    margin: 10,
    borderRadius: 99,
    padding: 5,
    flexDirection: "row",
    marginTop: 20,
    justifyContent: "space-between",
    marginBottom: 20,
  },
  button: {
    justifyContent: "center",
    backgroundColor: "#000",
    padding: 8,
    borderRadius: 99,
    alignItems: "center",

    // paddingHorizontal: 20
    // marginHorizontal: 10,
  },
  reportButton: {
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 99,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Poppins-Bold",
  },
  buttonTextReport: {
    color: "#000",
    fontSize: 16,
    fontFamily: "Poppins-Bold",
  },
  favouritesTitle: {
    fontFamily: "Poppins-Bold",
    marginTop: 20,
  },
  cardInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardIconOne: {
    backgroundColor: "#B7C42E",
    padding: 6,
    borderRadius: 99,
    marginRight: 5,
  },
  cardIconTwo: {
    backgroundColor: "#000",
    padding: 6,
    borderRadius: 99,
    marginRight: 5,
  },
  cardIconThree: {
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    padding: 6,
    borderRadius: 99,
    marginRight: 5,
  },
  buttonItem: {
    justifyContent: "center",
    // backgroundColor: "blue",
    width: 160,
  },
});

const darkModeStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#121212", // Dark background
    paddingHorizontal: 18,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212", // Dark background
  },
  welcomeText: {
    fontSize: 24,
    fontFamily: "Poppins-Bold",
    color: "#FFFFFF", // Light text color
    marginTop: 15,
  },
  searchContainer: {
    margin: 8,
    borderRadius: 20,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E1E1E", // Darker background for input
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
    color: "#FFFFFF", // Light text for input
  },
  dropdown: {
    backgroundColor: "rgba(255, 255, 255, 0.1)", // Light translucent effect for dropdown
    padding: 16,
    borderRadius: 10,
  },
  dropdownItem: {
    marginBottom: 10,
  },
  dropdownText: {
    fontFamily: "Poppins-Regular",
    color: "#FFFFFF", // Light text for dropdown items
  },
  infoContainer: {
    flexDirection: "row",
    alignSelf: "center",
  },
  budgetInfoContainer: {},
  departmentTitle: {
    fontFamily: "Poppins-Bold",
    color: "#FFFFFF", // Light text color
    marginBottom: 20,
  },
  card: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
    height: 120,
    width: "45%",
    marginBottom: 1,
    backgroundColor: "#1E1E1E", // Dark card background
    padding: 16,
    borderRadius: 20,
    margin: 10,
  },
  budgetCard: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
    height: 120,
    marginBottom: 11,
    marginTop: 20,
    backgroundColor: "#1E1E1E", // Dark card background
    padding: 16,
    borderRadius: 20,
    margin: 10,
  },
  cardText: {
    fontFamily: "Poppins-Bold",
    color: "#FFFFFF", // Light text for card content
  },
  buttonContainer: {
    borderWidth: 1,
    borderColor: "#4D4D4D", // Darker border
    margin: 10,
    borderRadius: 99,
    padding: 5,
    flexDirection: "row",
    marginTop: 20,
    justifyContent: "space-between",
    marginBottom: 20,
  },
  button: {
    justifyContent: "center",
    backgroundColor: "#1F1F1F", // Dark button background
    padding: 8,
    borderRadius: 99,
    alignItems: "center",
  },
  reportButton: {
    backgroundColor: "#333333", // Lighter dark background
    padding: 8,
    borderRadius: 99,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF", // Light text for buttons
    fontSize: 16,
    fontFamily: "Poppins-Bold",
  },
  buttonTextReport: {
    color: "#FFFFFF", // Light text for report button
    fontSize: 16,
    fontFamily: "Poppins-Bold",
  },
  favouritesTitle: {
    fontFamily: "Poppins-Bold",
    marginTop: 20,
    color: "#FFFFFF", // Light text
  },
  cardInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardIconOne: {
    backgroundColor: "#B7C42E",
    padding: 6,
    borderRadius: 99,
    marginRight: 5,
  },
  cardIconTwo: {
    backgroundColor: "#000",
    padding: 6,
    borderRadius: 99,
    marginRight: 5,
  },
  cardIconThree: {
    backgroundColor: "rgba(255, 255, 255, 0.4)", // Adjusted opacity for dark theme
    padding: 6,
    borderRadius: 99,
    marginRight: 5,
  },
  buttonItem: {
    justifyContent: "center",
    width: 160,
  },
});