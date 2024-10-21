import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView
} from "react-native";
import { ThemeContext } from "../context/ThemeContext"; // Adjust the import path as needed

const AccountManagementScreen = () => {
  const { theme } = useContext(ThemeContext); // Get the current theme from context

  const handleNavigation = (screen) => {
    // Implement navigation to the respective screen here
    console.log(`Navigate to ${screen}`);
  };

  return (
    <SafeAreaView style={[styles.container, theme === 'dark' ? styles.darkBackground : styles.lightBackground]}>
      <View style={{padding: 15}}>
      
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
    flexGrow: 1,
    padding: 20,
  },
  lightBackground: {
    backgroundColor: "#f8f9fa", // Light background color
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
  option: {
    padding: 15,
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 10,
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
  },
  footer: {
    fontSize: 14,
    marginTop: 20,
    textAlign: "center",
    fontStyle: "italic",
  },
  darkText: {
    color: "#ffffff", // Light text color for dark mode
  },
  lightText: {
    color: "#000000", // Dark text color for light mode
  },
});

export default AccountManagementScreen;
