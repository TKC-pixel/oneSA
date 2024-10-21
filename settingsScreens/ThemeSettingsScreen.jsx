import React, { useContext } from "react";
import { View, Text, StyleSheet, Switch, Alert, SafeAreaView } from "react-native";
import { ThemeContext } from "../context/ThemeContext";
// Adjust the import path as needed

const ThemeSettingsScreen = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  const handleToggleTheme = () => {
    toggleTheme(); // Toggle between light and dark theme
    Alert.alert(
      "Theme Changed",
      `The theme has been changed to ${theme === "light" ? "Dark" : "Light"}.`
    );
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
          trackColor={{ false: "black", true: "#81b0ff" }}
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
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
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
  },
  darkText: {
    color: "#ffffff", // Light text color for dark mode
  },
  lightText: {
    color: "#000000", // Dark text color for light mode
  },
});

export default ThemeSettingsScreen;
