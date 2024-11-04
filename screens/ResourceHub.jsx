import { StyleSheet, Text, TouchableOpacity, View, ImageBackground } from "react-native";
import React, { useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeContext } from "../context/ThemeContext";

const ResourceHub = ({ navigation }) => {
  const { theme } = useContext(ThemeContext);

  return (
    <SafeAreaView
      style={[styles.container, theme === "dark" && darkModeStyles.container]}
    >
      <TouchableOpacity
        style={[
          styles.Navigators,
          theme === "dark" && darkModeStyles.Navigators,
        ]}
        onPress={() => navigation.navigate("NewsPage")}
      >
        <ImageBackground
          source={{ uri: "https://groups.google.com/group/digital-services-2024/attach/25a9aa043ccfb/6.jpg?part=0.1&view=1" }}
          style={styles.backgroundImage}
          imageStyle={{ borderRadius: 10 }}
        >
          <View style={styles.overlay}>
            <Text
              style={[
                styles.TextStyle,
                theme === "dark" && darkModeStyles.TextStyle,
              ]}
            >
              News
            </Text>
            <Text style={styles.description}>Stay updated with the latest news.</Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.Navigators,
          theme === "dark" && darkModeStyles.Navigators,
        ]}
        onPress={() => navigation.navigate("Downloads")}
      >
        <ImageBackground
          source={{ uri: "https://positiveresults.com/wp-content/uploads/2024/05/Title-image-How-Downloadable-Resources-can-support-your-training.jpg" }}
          style={styles.backgroundImage}
          imageStyle={{ borderRadius: 10 }}
        >
          <View style={styles.overlay}>
            <Text
              style={[
                styles.TextStyle,
                theme === "dark" && darkModeStyles.TextStyle,
              ]}
            >
              Downloadable Resources
            </Text>
            <Text style={styles.description}>Access resources you can download and keep.</Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.Navigators,
          theme === "dark" && darkModeStyles.Navigators,
        ]}
        onPress={() => navigation.navigate("Guides")}
      >
        <ImageBackground
          source={{ uri: "https://t4.ftcdn.net/jpg/08/11/39/23/360_F_811392386_ADpjiwz8EBAjghf6IDNlq3ix140tjRPj.jpg" }}
          style={styles.backgroundImage}
          imageStyle={{ borderRadius: 10 }}
        >
          <View style={styles.overlay}>
            <Text
              style={[
                styles.TextStyle,
                theme === "dark" && darkModeStyles.TextStyle,
              ]}
            >
              Guides
            </Text>
            <Text style={styles.description}>Helpful guides to navigate different topics.</Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ResourceHub;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 18,
    backgroundColor: "#fff",
  },
  Navigators: {
    borderRadius: 10,
    width: "100%",
    height: 150,
    borderWidth: 3,
    borderColor: "#333",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
    overflow: "hidden",
  },
  backgroundImage: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  TextStyle: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 22,
    color: "#fff",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 5,
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  description: {
    fontSize: 14,
    color: "#e0e0e0",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginTop: 5,
    borderRadius: 5,
    textAlign: "center",
    fontFamily: "Poppins-Regular",
  },
});

const darkModeStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 18,
    backgroundColor: "#1e1e1e",
  },
  Navigators: {
    borderColor: "#ccc",
    backgroundColor: "#333",
  },
  TextStyle: {
    color: "#f5f5f5",
  },
});
