import React, { useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { ThemeContext } from "../context/ThemeContext"; // Adjust the import path as needed
import { SafeAreaView } from "react-native-safe-area-context";

const AccountManagementScreen = () => {
  const { theme } = useContext(ThemeContext); // Get the current theme from context

  const handleNavigation = (screen) => {
    // Implement navigation to the respective screen here
    console.log(`Navigate to ${screen}`);
  };

  return (
    <SafeAreaView style={[styles.container, theme === 'dark' ? styles.darkBackground : styles.lightBackground]}>
      <View style={styles.content}>
        <Text style={[styles.title, theme === 'dark' ? styles.darkText : styles.lightText]}>
          Account Management
        </Text>

        <TouchableOpacity
          style={[styles.option, theme === 'dark' ? styles.darkOption : styles.lightOption]}
          onPress={() => handleNavigation("ChangeCredentialsScreen")}
        >
          <Text style={[styles.optionText, theme === 'dark' ? styles.darkText : styles.lightText]}>
            Change Login Credentials
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.option, theme === 'dark' ? styles.darkOption : styles.lightOption]}
          onPress={() => handleNavigation("ViewAccountDetailsScreen")}
        >
          <Text style={[styles.optionText, theme === 'dark' ? styles.darkText : styles.lightText]}>
            View Account Details
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.option, theme === 'dark' ? styles.darkOption : styles.lightOption]}
          onPress={() => handleNavigation("ManageMultipleAccountsScreen")}
        >
          <Text style={[styles.optionText, theme === 'dark' ? styles.darkText : styles.lightText]}>
            Manage Multiple Accounts
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.option, theme === 'dark' ? styles.darkOption : styles.lightOption]}
          onPress={() => handleNavigation("DeleteAccountScreen")}
        >
          <Text style={[styles.optionText, theme === 'dark' ? styles.darkText : styles.lightText]}>
            Delete Account
          </Text>
        </TouchableOpacity>

        <Text style={[styles.footer, theme === 'dark' ? styles.darkText : styles.lightText]}>
          Please choose an option above to manage your account settings.
        </Text>
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
    backgroundColor: "#f9f9f9", // Light background color
  },
  darkBackground: {
    backgroundColor: "#121212", // Dark background color
  },
  content: {
    padding: 15,
    flexGrow: 1,
    justifyContent: "center", // Center content vertically
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
    fontFamily: "Poppins-Bold", // Use Poppins Bold for title
    color: '#B7C42E', // Green color for title
  },
  option: {
    padding: 15,
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 10,
    elevation: 3, // Shadow effect for Android
    shadowColor: "#000", // Shadow color for iOS
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  lightOption: {
    borderColor: "#ccc",
    backgroundColor: "#fff",
  },
  darkOption: {
    borderColor: "#444",
    backgroundColor: "#333", // Dark background for options
  },
  optionText: {
    fontSize: 18,
    textAlign: "center",
    fontFamily: "Poppins-Regular", // Use Poppins Regular for option text
    color: '#0A3D62', // Default option text color
  },
  footer: {
    fontSize: 14,
    marginTop: 20,
    textAlign: "center",
    fontStyle: "italic",
    fontFamily: "Poppins-Regular", // Use Poppins Regular for footer
    color: '#B7C42E', // Green color for footer text
  },
  darkText: {
    color: "#ffffff", // Light text color for dark mode
  },
  lightText: {
    color: "#333333", // Dark text color for light mode
  },
});

export default AccountManagementScreen;
