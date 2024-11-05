import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  useWindowDimensions,
  FlatList,
  Platform,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState, useEffect, useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
const favicon = require("../assets/images/Favicon.png");
import * as Font from "expo-font";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../FIrebaseConfig";
import { signOut } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../FIrebaseConfig"; // Correct import
import * as Location from "expo-location";
import { ThemeContext } from "../context/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

import * as Notifications from "expo-notifications";
import { UserContext } from "../context/UserContext";
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};
const NavBar = ({ userInfo }) => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [notificationVisible, setNotificationVisible] = useState(false);
  const navigation = useNavigation();
  const [projects, setProjects] = useState([]);
  const [nearbyProjects, setNearbyProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentLocation, setCurrentLocation] = useState(null);
<<<<<<< HEAD
  const { userData } = useContext(UserContext);
  const [count, setCount] = useState(0);
=======
  const { userData } = useContext(UserContext) || {};
  const [count, setCount] = useState(0)

>>>>>>> b3d7e7b4b1b9b5a4caf01baa3599f8dcc1169467
  const userArray = Array.isArray(userInfo) ? userInfo : [userInfo || {}];
  // console.log("NavBar User Data: ", userData)
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "ministers"));
        const projectsData = querySnapshot.docs.flatMap(
<<<<<<< HEAD
          (doc) =>
            (doc.data().ministerDepartment &&
              doc.data().ministerDepartment.projects) ||
            []
=======
          (doc) => doc.data().ministerDepartment && doc.data().ministerDepartment.projects || []
>>>>>>> b3d7e7b4b1b9b5a4caf01baa3599f8dcc1169467
        );
        setProjects(projectsData);

        // console.log("Fetched projects: ", projectsData);
      } catch (error) {
        console.error("Error fetching projects: ", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      const { coords } = await Location.getCurrentPositionAsync({});
      setCurrentLocation(coords);
      // console.log("Current Location: ", coords);
    };

    fetchProjects();
    fetchLocation();
  }, []);
  const requestNotificationPermission = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== "granted") {
      const { status: newStatus } =
        await Notifications.requestPermissionsAsync();
      return newStatus === "granted";
    }
    return true;
  };
  useEffect(() => {
    const checkPermissions = async () => {
      await requestNotificationPermission();
    };
    checkPermissions();
  }, []);

  useEffect(() => {
    const sendNotifications = async (nearbyProjects) => {
      for (const project of nearbyProjects) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Nearby Project Alert!",
            body: `You're near the project: ${project.projectName}`,
            data: { projectId: project.id }, // Additional data
          },
          trigger: null, // Sends immediately
        });
      }
    };

    if (currentLocation && projects.length > 0) {
      const { latitude, longitude } = currentLocation;

      const nearby = projects.filter((project) => {
        if (project.location) {
          // Ensure location exists
          const distance = calculateDistance(
            latitude,
            longitude,
            parseFloat(project.location.latitude),
            parseFloat(project.location.longitude)
          );

          // console.log(
          //   `Checking project: ${project.projectName}, Distance: ${distance} km`
          // );

          return distance <= 5; // Adjust distance threshold
        }
        return false; // Ignore projects without location
      });

      if (nearby.length > 0) {
        setNearbyProjects(nearby); // Update nearby projects
        sendNotifications(nearby); // Send notifications for nearby projects
      }
<<<<<<< HEAD
      setCount(nearby.length);
=======
      setCount(nearby.length)
>>>>>>> b3d7e7b4b1b9b5a4caf01baa3599f8dcc1169467
    }
  }, [currentLocation, projects]);

  const { theme, toggleTheme } = useContext(ThemeContext);

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

  const toggleNavigation = () => {
    setNotificationVisible(!notificationVisible);
  };

  const handleProfile = () => {
    toggleDropdown();
    navigation.navigate("Profile");
  };

  const handleSettings = () => {
    toggleDropdown();
    navigation.navigate("Settings");
  };

  const handleHelpCenter = () => {
    toggleDropdown();
    navigation.navigate("HelpCenter");
  };

  const handleAppInfo = () => {
    toggleDropdown();
    navigation.navigate("AppInfo");
  };

  const handleRateApp = () => {
    toggleDropdown();
    navigation.navigate("RateTheApp");
  };

  const handleSignOut = async () => {
    try {
      console.log("Attempting to sign out...");

      // Sign out the user
      await signOut(auth);
      console.log("User signed out!");

      // Update AsyncStorage to reflect the logged-out state
      await AsyncStorage.setItem("isLoggedIn", "false");

      // Reset the navigation to the SignUp screen
      navigation.reset({
        index: 0,
        routes: [{ name: "SignUp" }],
      });

      // Close the dropdown or any other UI element
      setDropdownVisible(false);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <SafeAreaView style={[styles.NavTop, { position: "relative" }]}>
      <Image style={styles.favIcon} source={favicon} />
      <View style={styles.cornerIcons}>
        <TouchableOpacity onPress={toggleNavigation} style={styles.Icon}>
          <Ionicons name="notifications-outline" size={32} color="black" />
          {count > 0 ? (
<<<<<<< HEAD
            <Text
              style={{
                overflow: "hidden",
                borderRadius: Platform.OS === "ios" ? 10 : 99,
                position: "absolute",
                right: 0,
                top: 0,
                backgroundColor: "#E35146",
                width: 20,
                height: 20,
                textAlign: "center",
                fontFamily: "Poppins-SemiBold",
                color: "white",
                lineHeight: 20, // Center text vertically
              }}
            >
              {count}
            </Text>
          ) : null}
=======
          <Text
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
              backgroundColor: "#E35146",
              borderRadius: 99,
              width: 20,
              height: 20,
              textAlign: 'center',
              fontFamily: 'Poppins-SemiBold',
              color: 'white',
              lineHeight: 20, // Center text vertically
            }}
          >
            {count}
          </Text> ) : null}
>>>>>>> b3d7e7b4b1b9b5a4caf01baa3599f8dcc1169467
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleTheme} style={styles.Icon}>
          <Ionicons
            name={theme === "light" ? "sunny-outline" : "moon-outline"}
            size={32}
            color="black"
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleDropdown}>
          <Image
            style={styles.favIcon}
            source={{
              uri: userData.profileImageUrl
                ? userData.profileImageUrl
                : "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg",
            }}
          />
        </TouchableOpacity>
      </View>

      {dropdownVisible && (
        <View
          style={
            theme == "light" ? styles.dropdownMenu : darkModeStyles.dropdownMenu
          }
        >
          <TouchableOpacity
            onPress={handleProfile}
            style={
              theme == "light"
                ? styles.userContainer
                : darkModeStyles.userContainer
            }
          >
            <Image
              style={styles.favIcon}
              source={{
                uri: userData.profileImageUrl
                  ? userData.profileImageUrl
                  : "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg",
              }}
            />

            <Text
              style={[
                theme == "light" ? styles.userName : darkModeStyles.userName,
                { fontFamily: "Poppins-Bold" },
              ]}
            >
              {userData.name} {userData.surname}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={
              theme == "light"
                ? styles.dropdownItem
                : darkModeStyles.dropdownItem
            }
            onPress={handleSettings}
          >
            <Ionicons
              name="settings-outline"
              color={theme == "light" ? "black" : "white"}
            />
            <Text
              style={[
                theme == "light"
                  ? styles.dropdownText
                  : darkModeStyles.dropdownText,
                { fontFamily: "Poppins-Regular" },
              ]}
            >
              Settings
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={
              theme == "light"
                ? styles.dropdownItem
                : darkModeStyles.dropdownItem
            }
            onPress={handleHelpCenter}
          >
            <Ionicons
              name="help-circle-outline"
              color={theme == "light" ? "black" : "white"}
            />
            <Text
              style={[
                theme == "light"
                  ? styles.dropdownText
                  : darkModeStyles.dropdownText,
                { fontFamily: "Poppins-Regular" },
              ]}
            >
              Help Center
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={
              theme == "light"
                ? styles.dropdownItem
                : darkModeStyles.dropdownItem
            }
            onPress={handleAppInfo}
          >
            <Ionicons
              name="information-circle-outline"
              color={theme == "light" ? "black" : "white"}
            />
            <Text
              style={[
                theme == "light"
                  ? styles.dropdownText
                  : darkModeStyles.dropdownText,
                { fontFamily: "Poppins-Regular" },
              ]}
            >
              App Information
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={
              theme == "light"
                ? styles.dropdownItem
                : darkModeStyles.dropdownItem
            }
            onPress={handleRateApp}
          >
            <Ionicons
              name="star-half-outline"
              color={theme == "light" ? "black" : "white"}
            />
            <Text
              style={[
                theme == "light"
                  ? styles.dropdownText
                  : darkModeStyles.dropdownText,
                { fontFamily: "Poppins-Regular" },
              ]}
            >
              Rate The App
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={
              theme == "light"
                ? styles.dropdownItem
                : darkModeStyles.dropdownItem
            }
            onPress={() => navigation.navigate("UpgradeMembership")}
          >
            <Ionicons
              name="card-outline"
              color={theme == "light" ? "black" : "white"}
            />
            <Text
              style={[
                theme == "light"
                  ? styles.dropdownText
                  : darkModeStyles.dropdownText,
                { fontFamily: "Poppins-Regular" },
              ]}
            >
              Upgrade Your Membership
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={
              theme == "light"
                ? styles.dropdownItem
                : darkModeStyles.dropdownItem
            }
            onPress={handleSignOut}
          >
            <Ionicons
              name="log-out-outline"
              color={theme == "light" ? "black" : "white"}
            />
            <Text
              style={[
                theme == "light"
                  ? styles.dropdownText
                  : darkModeStyles.dropdownText,
                { fontFamily: "Poppins-Regular" },
              ]}
            >
              Log Out
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {notificationVisible && (
        <View
          style={
            theme == "light" ? styles.dropdownMenu : darkModeStyles.dropdownMenu
          }
        >
          {nearbyProjects.length > 0 ? (
            <FlatList
              data={nearbyProjects}
              keyExtractor={(item) =>
                item.id ? item.id : Math.random().toString(36).substr(2, 9)
              }
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={
                    theme == "light"
                      ? styles.dropdownItem
                      : darkModeStyles.dropdownItem
                  }
                  onPress={() => navigation.navigate("CreateReport", { item })}
                >
                  <Ionicons
                    name="notifications-outline"
                    size={24}
                    color={theme === "light" ? "black" : "white"}
                    style={{ marginRight: 10 }}
                  />
                  <View style={{ width: 250 }}>
                    <Text
                      style={{
                        color: theme === "light" ? "black" : "white",
                        fontFamily: "Poppins-Bold",
                      }}
                    >
                      You're near the project site:
                    </Text>
                    <Text
                      style={{
                        color: "#B7C42E",
                        fontFamily: "Poppins-Bold",
                      }}
                    >
                      {item.projectName}
                    </Text>

                    <Text
                      style={{
                        color: theme === "light" ? "black" : "white",
                        fontFamily: "Poppins-SemiBold",
                      }}
                    >
                      Do you want to file a report?
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          ) : (
            <Text style={{ color: theme === "light" ? "black" : "white" }}>
              No nearby projects found.
            </Text>
          )}
        </View>
      )}
    </SafeAreaView>
  );
};
export default NavBar;
const darkModeStyles = StyleSheet.create({
  dropdownMenu: {
    marginTop: 40,
    position: "absolute",
    top: 70,
    padding: 18,
    right: 10,
    width: 300,
    backgroundColor: "#121212",
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
  userName: {
    fontSize: 16,
    marginLeft: 10,
    fontFamily: "Poppins-Bold",
    color: "white",
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "black",
    padding: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
    marginBottom: 15,
  },
  dropdownItem: {
    padding: 10,
    marginBottom: 5,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "black",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.5,
    elevation: 2,
  },
  dropdownText: {
    fontSize: 16,
    marginLeft: 10,
    color: "white",
  },
});
const styles = StyleSheet.create({
  NavTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 10,
    zIndex: 1000,
    ...(Platform.OS === "ios" && { top: -15, marginBottom: -50 }),
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
    marginTop: 30,
    position: "absolute",
    top: 70,
    padding: 18,
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
    marginBottom: 5,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.5,
    elevation: 2,
  },
  dropdownText: {
    fontSize: 16,
    marginLeft: 10,
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
    marginBottom: 15,
  },
  userName: {
    fontSize: 16,
    marginLeft: 10,
    fontFamily: "Poppins-Bold",
  },
});
