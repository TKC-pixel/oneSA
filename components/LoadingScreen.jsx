import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import LottieView from "lottie-react-native"; // Import the LottieView component
import * as Font from "expo-font";
import { ThemeContext } from "../context/ThemeContext";

const LoadingScreen = () => {
    const {theme} = useContext(ThemeContext)
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const loadFonts = async () => {
    await Font.loadAsync({
      "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
      "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    });
  };

  useEffect(() => {
    loadFonts().then(() => setFontsLoaded(true));
  }, []);

  return (
    <View style={theme === "light" ? styles.container : darkStyles.container}>
      <LottieView
        source={require("../assets/images/loading.json")} // Adjust the path to your animation file
        autoPlay
        loop
        style={styles.animation}
      />
      <Text style={theme === "light" ? styles.loadingText : darkStyles.loadingText} >Loading, please wait...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa", // Light background color
    width: "100%",
  },
  animation: {
    width: 150, // Adjust the width as needed
    height: 150, // Adjust the height as needed
  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    color: "#333", // Text color
    fontFamily: "Poppins-Bold"
  },
});

const darkStyles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#1c1c1e', // Dark background color
      width: "112%", //can be removed..... filling screen with loading screen
      marginLeft: '-6%'
      
    },
    animation: {
      width: 150, // Adjust the width as needed
      height: 150, // Adjust the height as needed
    },
    loadingText: {
      marginTop: 20,
      fontSize: 18,
      color: '#ffffff', // Light text color for dark mode
      fontFamily: 'Poppins-Bold',
    },
  });

export default LoadingScreen;
