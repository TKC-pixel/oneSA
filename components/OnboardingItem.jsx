import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  useWindowDimensions,
  ActivityIndicator,
} from "react-native";
import * as Font from "expo-font";

const OnboardingItem = ({ item }) => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const loadFonts = async () => {
    await Font.loadAsync({
      "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
      "Poppins-BlackItalic": require("../assets/fonts/Poppins-BlackItalic.ttf"),
      "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
      "Poppins-BoldItalic": require("../assets/fonts/Poppins-BoldItalic.ttf"),
      "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
      "Poppins-ExtraBoldItalic": require("../assets/fonts/Poppins-ExtraBoldItalic.ttf"),
      "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
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

  return (
    <View style={[styles.container, { width }]}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{item.title}</Text>

        <Text style={styles.keyword}>{item.keyword}</Text>
      </View>
      <Image
        source={item.image}
        style={[styles.image, { width, resizeMode: "contain" }]}
      />
      <View style={styles.descriptionContainer}>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  );
};

export default OnboardingItem;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingTop: 92,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  titleContainer: {
    flex: 0.3,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    flex: 0.5,
    justifyContent: "center",
  },
  descriptionContainer: {
    flex: 0.2,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    color: "#000000",
    textAlign: "center",
    fontFamily: "Poppins-ExtraBold",
  },
  description: {
    fontWeight: "300",
    color: "black",
    textAlign: "center",
    fontSize: 20,
    fontFamily: "Poppins-Regular",
  },
  keyword: {
    fontSize: 40,
    color: "#B7C42E",
    textAlign: "center",
    fontFamily: "Raleway-ExtraBold",
  },
});
