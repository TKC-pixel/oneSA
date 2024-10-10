import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
const favicon = require("../assets/images/Favicon.png");
import * as Font from "expo-font";
import { useNavigation } from "@react-navigation/native";

const NavBar = ({ userInfo }) => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const navigation = useNavigation();

  const loadFonts = async () => {
    await Font.loadAsync({
      "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
      "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
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

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleProfile = () => {
    toggleDropdown();
    navigation.navigate("Profile");
  };

  const handleSettings = () => {
    toggleDropdown();
    // Navigate to settings screen or handle settings logic
    console.log("Navigating to Settings");
  };

  const handleHelpCenter = () => {
    toggleDropdown();
    // Navigate to Help Center screen or handle help center logic
    console.log("Navigating to Help Center");
  };

  const handleAppInfo = () => {
    toggleDropdown();
    // Show app information or navigate
    console.log("Showing App Information");
  };

  const handleRateApp = () => {
    toggleDropdown();
    // Handle app rating logic (e.g., redirect to app store)
    console.log("Redirecting to Rate the App");
  };

  const handleLogout = () => {
    toggleDropdown();
    // Handle logout logic
    console.log("Logging Out");
  };

  return (
    <SafeAreaView style={[styles.NavTop, { position: "relative" }]}>
      <Image style={styles.favIcon} source={favicon} />
      <View style={styles.cornerIcons}>
        <TouchableOpacity style={styles.Icon}>
          <Ionicons name="notifications-outline" size={32} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.Icon}>
          <Ionicons name="sunny-outline" size={32} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleDropdown}>
          <Image
            style={styles.favIcon}
            source={{
              uri: "https://img.freepik.com/free-photo/portrait-fair-haired-woman-with-warm-blue-eyes-dry-lips-healthy-skin-looking-directly-alluring-girl-with-beautiful-appearance-dressed-casually-posing_273609-7635.jpg",
            }}
          />
        </TouchableOpacity>
      </View>

      {dropdownVisible && (
        <View style={styles.dropdownMenu}>
          <TouchableOpacity onPress={handleProfile} style={styles.userContainer}>
            <Ionicons name="person-circle" size={30} color="black" />
            <Text style={styles.userName}>
              {userInfo && userInfo.length > 0
                ? `${userInfo[0].name} ${userInfo[0].surname}`
                : "User"}
            </Text>
            <Ionicons
              name={dropdownVisible ? "chevron-up" : "chevron-down"}
              size={20}
              color="black"
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.dropdownItem} onPress={handleSettings}>
            <Text style={styles.dropdownText}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dropdownItem} onPress={handleHelpCenter}>
            <Text style={styles.dropdownText}>Help Center</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dropdownItem} onPress={handleAppInfo}>
            <Text style={styles.dropdownText}>App Information</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dropdownItem} onPress={handleRateApp}>
            <Text style={styles.dropdownText}>Rate The App</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dropdownItem} onPress={handleLogout}>
            <Text style={styles.dropdownText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};
export default NavBar;

const styles = StyleSheet.create({
  NavTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 10,
    zIndex: 1000
  },
  cornerIcons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 170,
  },
  favIcon: {
    width: 50,
    height: 50,
    borderRadius: 99,
  },
  Icon: {
    justifyContent: "center",
    alignItems: "center",
    width: 50,
    height: 50,
    backgroundColor: "#D9D9D9",
    borderRadius: 99,
  },
  dropdownMenu: {
    position: "absolute",
    top: 70,
    right: 10,
    width: 300,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  dropdownText: {
    fontSize: 16,
  },
});
