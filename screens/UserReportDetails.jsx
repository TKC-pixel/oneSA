import React, { useContext, useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  ActivityIndicator,
  Linking,
} from "react-native";
import * as Font from "expo-font";
import { SafeAreaView } from "react-native-safe-area-context";
import LoadingScreen from "../components/LoadingScreen";
import { Ionicons } from "@expo/vector-icons";
import { ThemeContext } from "../context/ThemeContext";
import MapView, { Marker } from "react-native-maps";
import { TouchableOpacity } from "react-native";

const UserReportDetails = ({ route, navigation }) => {
  const { item } = route.params; // Access the passed item data
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const { theme } = useContext(ThemeContext);
  console.log(item);

  const loadFonts = async () => {
    await Font.loadAsync({
      "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
      "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    });
  };

  const openMap = () => {
    const latitude = item.latitude ? item.latitude : -30.5595;
    const longitude = item.longitude ? item.longitude : 22.9375;

    // Construct the URL for the map app
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

    // Open the URL in the default map app
    Linking.openURL(url).catch((err) =>
      console.error("An error occurred", err)
    );
  };

  const renderStatus = (status) => {
    switch (status) {
      case "not_started":
        return (
          <Text style={[styles.statusText, styles.notStarted]}>
            Not Started
          </Text>
        );
      case "in_progress":
        return (
          <Text style={[styles.statusText, styles.inProgress]}>
            In Progress
          </Text>
        );
      case "completed":
        return (
          <Text style={[styles.statusText, styles.completed]}>Completed</Text>
        );
      default:
        return <Text style={styles.statusText}>Unknown Status</Text>;
    }
  };

  const imageStyle = StyleSheet.create({
    image: {
      width: "100%",
      height: 430,
      borderRadius: 54,
      marginBottom: 21,
      shadowColor: "#000",
      shadowOpacity: theme === "dark" ? 0.4 : 0.2,
      shadowRadius: theme === "dark" ? 10 : 6,
      elevation: theme === "dark" ? 8 : 5,
    },
  });

  useEffect(() => {
    loadFonts().then(() => setFontsLoaded(true));
  }, []);

  if (!fontsLoaded) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme === "light" ? "#fff" : "#1e1e1e" },
      ]}
    >
      {item.projectImage && (
        <Image source={{ uri: item.projectImage }} style={imageStyle.image} />
      )}
      <TouchableOpacity
        style={theme === "light" ? styles.backBtn : darkModeStyles.backBtn}
        onPress={() => navigation.goBack()}
      >
        <Ionicons
          name="arrow-back-outline"
          size={30}
          color={theme === "light" ? "#000" : "#fff"}
        />
      </TouchableOpacity>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text
          style={[
            styles.title,
            { color: theme === "light" ? "#343a40" : "#ffffff" },
          ]}
        >
          {item.title}
        </Text>

        <Text
          style={[
            styles.info,
            { color: theme === "light" ? "#6c757d" : "#adb5bd" },
          ]}
        >
          {item.description}
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <Ionicons
            name="location-outline"
            size={25}
            color={theme === "light" ? "#B7C42E" : "#B7C42E"}
          />
          <Text
            style={[
              styles.infoLocation,
              {
                color: theme === "light" ? "#B7C42E" : "#B7C42E",
                marginLeft: 5,
              }, // Added margin for spacing between icon and text
            ]}
          >
            {item.location.split(",")[0]}{" "}
            {/* Extract name before first comma */}
          </Text>
        </View>

        <TouchableOpacity style={styles.mapContainer} onPress={openMap}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: item.latitude ? item.latitude : -30.5595,
              longitude: item.longitude ? item.longitude : 22.9375,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            {item.latitude && item.longitude ? (
              <Marker
                coordinate={{
                  latitude: item.latitude,
                  longitude: item.longitude,
                }}
                title={item.title}
                description={item.location}
              />
            ) : null}
          </MapView>
        </TouchableOpacity>
        <Text
          style={[
            styles.description,
            { color: theme === "light" ? "#495057" : "#e9ecef" },
          ]}
        >
          Status:
        </Text>
        {renderStatus(item.status)}

        <Text
          style={[
            styles.description,
            { color: theme === "light" ? "#495057" : "#e9ecef" },
          ]}
        >
          Additional Comments:
        </Text>
        <Text
          style={[
            styles.info,
            { color: theme === "light" ? "#6c757d" : "#adb5bd" },
          ]}
        >
          {item.additionalComments || "N/A"}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default UserReportDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    marginHorizontal: 18,
  },
  title: {
    fontSize: 24,
    fontFamily: "Poppins-Bold",
    marginBottom: 20,
  },
  reportImage: {
    width: "100%",
    height: 390,
    borderRadius: 45,
    marginBottom: 21,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
    resizeMode: "cover",
  },
  backBtn: {
    position: "absolute",
    width: 50,
    height: 50,
    backgroundColor: "#D3D3D3", // 0.7 for 70% opacity
    borderRadius: 25,
    top: 60,
    left: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  description: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    marginVertical: 10,
  },
  info: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    marginBottom: 15,
    lineHeight: 24,
  },
  infoLocation: {
    fontSize: 15,
    fontFamily: "Poppins-Regular",
    // marginBottom: 15,
    lineHeight: 24,
  },
  statusText: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    marginBottom: 15,
    lineHeight: 24,
  },
  notStarted: {
    color: "#dc3545",
  },
  inProgress: {
    color: "#ffc107",
  },
  completed: {
    color: "#28a745",
  },
  mapContainer: {
    width: 300,
    height: 300,
    borderRadius: 20,
    overflow: "hidden",
    alignSelf: "center",

    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    // Shadow for Android
    elevation: 5,
  },
  map: {
    ...StyleSheet.absoluteFillObject, // Fill the parent container
  },
});

const darkModeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  heartBtn: {
    position: "absolute",
    width: 50,
    height: 50,
    backgroundColor: "#000",
    borderRadius: 25,
    top: 60,
    right: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  backBtn: {
    position: "absolute",
    width: 50,
    height: 50,
    backgroundColor: "#000",
    borderRadius: 25,
    top: 60,
    left: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  projectName: {
    fontSize: 24,
    fontFamily: "Poppins-Bold",
    color: "#fff",
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    color: "#fff",
  },
  info: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "#ccc",
  },
});
