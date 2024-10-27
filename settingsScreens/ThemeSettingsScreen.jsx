import React, { useContext } from "react";
import { View, Text, StyleSheet, Switch, Alert } from "react-native";
import { ThemeContext } from "../context/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";

// Adjust the import path as needed

const ThemeSettingsScreen = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  const handleToggleTheme = () => {
    toggleTheme(); // Toggle between light and dark theme
   
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        theme === "dark" ? styles.darkBackground : styles.lightBackground,
      ]}
    >
      <View style={{padding : 15}}>
      <Text
        style={[
          styles.title,
          theme === "dark" ? styles.darkText : styles.lightText,
        ]}
      >
        Theme Settings
      </Text>

      <View style={styles.settingItem}>
        <Text
          style={[
            styles.label,
            theme === "dark" ? styles.darkText : styles.lightText,
          ]}
        >
          Enable Dark Mode:
        </Text>
        <Switch
          value={theme === "dark"}
          onValueChange={handleToggleTheme}
          
          thumbColor={theme === "dark" ? "#f4f3f4" : "#f4f3f4"}
        />
      </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  lightBackground: {
    backgroundColor: "#ffffff", // Light background color
  },
  darkBackground: {
    backgroundColor: "#1c1c1e", // Dark background color
  },
  title: {
    fontSize: 24,
    // fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    fontFamily: "Poppins-Bold"
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  label: {
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "Poppins-SemiBold"
  },
  darkText: {
    color: "#ffffff", // Light text color for dark mode
  },
  lightText: {
    color: "#000000", // Dark text color for light mode
  },
});

export default ThemeSettingsScreen;
