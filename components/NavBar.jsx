import {
  Text,
  View,
  ScrollView,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  useWindowDimensions,
  Pressable,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
const favicon = require("../assets/images/Favicon.png");
import * as Font from "expo-font";

const NavBar = () => {
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
    <SafeAreaView style={styles.NavTop}>
      <Image style={styles.favIcon} source={favicon} />
      <View style={styles.cornerIcons}>
        <TouchableOpacity style={styles.Icon}>
          <Ionicons name="notifications-outline" size={32} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.Icon}>
          <Ionicons name="sunny-outline" size={32} color="black" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image
            style={styles.favIcon}
            source={{
              uri: "https://img.freepik.com/free-photo/portrait-fair-haired-woman-with-warm-blue-eyes-dry-lips-healthy-skin-looking-directly-alluring-girl-with-beautiful-appearance-dressed-casually-posing_273609-7635.jpg",
            }}
          />
        </TouchableOpacity>
      </View>
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
});
