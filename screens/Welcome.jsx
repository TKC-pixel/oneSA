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
import { collection, getDocs, query, where } from "firebase/firestore";
import { useFocusEffect } from "@react-navigation/native";
import * as Location from "expo-location";
import axios from "axios";

const favicon = require("../assets/images/Favicon.png");

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

  const apiKey = "66a997da439128fae9fe1b8fd278de895bc7bbbc";
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
      } catch (error) {
        console.log("Error fetching user data: ", error);
        Alert.alert("Error", "Failed to fetch user data.");
      }
    }
  };

  //Location
  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setLocationError("Permission to access location was denied.");
      return;
    }

    let location = await Location.getCurrentPositionAsync();
    const address = await Location.reverseGeocodeAsync(location.coords);
    // console.log(address);
    setLocationData(address[0]?.city || null);
  };

  // Scraped data
  const fetchScrapedData = async () => {
    try {
      const response = await axios.get(
        `https://api.zenrows.com/v1/?apikey=${apiKey}&url=${targetURL}&css_extractor=${cssExtractor}`,
        { timeout: 10000 }
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
    scrapedData.links.forEach((link) => {
      if (link.startsWith("/units/view/")) {
        const parts = link.split("/");
        if (parts.length >= 6) {
          const provinceName = parts[4];
          const departmentName = parts[5];
          if (!provinceMap[provinceName]) {
            provinceMap[provinceName] = [];
          }
          provinceMap[provinceName].push(departmentName);
        }
      }
    });
    setProvinceDepartments(provinceMap[province] || []);
    const departments = provinceMap[province] || [];
    setProvinceDepartments(departments);
    if (departments.length > 0) {
      setDepartment(departments[0]);
    } else {
      setDepartment("Loading Departments...");
    }
  };

  useEffect(() => {
    fetchUserData();
    getLocation();
    fetchScrapedData();
  }, []);

  useEffect(() => {
    if (locationData) {
      const currentProvince = getProvinceFromCity(locationData).toLowerCase();
      // console.log('Current Province:', currentProvince);
      if (currentProvince) {
        filterDepartmentsByProvince(currentProvince);
      }
    }
  }, [locationData]);

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
    getProvinceFromCity(locationData)?.toLowerCase() || "unknown province";

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView>
        <NavBar />
        <Text style={styles.welcomeText}>
          Welcome{" "}
          {info && info.length > 0
            ? `${info[0].name} ${info[0].surname}`
            : "User"}
        </Text>
        <Text>
          Current Province based on location:{" "}
          {currentProvince
            ? currentProvince.toUpperCase()
            : "Loading Location..."}
        </Text>

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

        <View
          style={[
            styles.dropdown,
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
        <View style={styles.infoContainer}>
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
