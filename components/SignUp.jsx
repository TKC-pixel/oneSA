import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import LoginScreen from "../screens/Home";
import Signup from "../screens/Signup";
import * as Font from "expo-font";
import { useEffect, useState } from "react";

const { width } = Dimensions.get("window");

const LoginOrSignUp = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const Tab = createMaterialTopTabNavigator();

  // Load custom fonts
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
    setFontsLoaded(true);
  };

  useEffect(() => {
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#B7C42E" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.LoginOrSignUp}>
        <Image
          source={require("../assets/images/logo.jpg")}
          style={styles.logo}
        />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Welcome to OneSA</Text>
          <Text style={styles.headerSubtitle}>
            Sign up or log in now to make your voice heard and drive real
            change.
          </Text>
        </View>
      </View>
      <Tab.Navigator
        style={styles.tabNavigator}
        screenOptions={{
          tabBarIndicatorStyle: { backgroundColor: "#B7C42E" }, // Color of the indicator line
        }}
      >
        <Tab.Screen name="Log In" component={LoginScreen} />
        <Tab.Screen name="Sign Up" component={Signup} />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 20,
  },
  tabNavigator: {
    marginTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    height: 77,
    width: 232,
    alignSelf: "center",
    marginTop: 15,
  },
  header: {
    alignItems: "center",
    marginBottom: "5%",
  },
  headerTitle: {
    fontFamily: "Poppins-Regular",
    fontSize: 25,
    marginBottom: 10,
  },
  headerSubtitle: {
    fontFamily: "Poppins-Regular",
    width: 250,
    fontSize: 16,
    textAlign: "center",
    color: "#696969",
  },
  LoginOrSignUp: {
    height: 170,
  },
});

export default LoginOrSignUp;
