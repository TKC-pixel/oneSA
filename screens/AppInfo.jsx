import React, { useContext } from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { ThemeContext } from "../context/ThemeContext";

const AppInfo = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <ScrollView style={theme === "light" ? styles.container : darkModeStyles.container}>
      <Text style={theme === "light" ? styles.title : darkModeStyles.title}>About OneSA</Text>
      <Text style={theme === "light" ? styles.description : darkModeStyles.description}>
        OneSA is a mobile application designed to promote transparency and accountability in government 
        fund usage. Our goal is to empower citizens by providing them with the tools to track and report 
        on various government projects.
      </Text>

      <Text style={theme === "light" ? styles.subtitle : darkModeStyles.subtitle}>Features</Text>
      <View style={styles.bulletContainer}>
        <Text style={theme === "light" ? styles.bullet : darkModeStyles.bullet}>• Track government projects and funding allocations</Text>
        <Text style={theme === "light" ? styles.bullet : darkModeStyles.bullet}>• Report discrepancies and issues directly through the app</Text>
        <Text style={theme === "light" ? styles.bullet : darkModeStyles.bullet}>• Access detailed project information and updates</Text>
        <Text style={theme === "light" ? styles.bullet : darkModeStyles.bullet}>• Engage with other users through comments and discussions</Text>
      </View>

      <Text style={theme === "light" ? styles.subtitle : darkModeStyles.subtitle}>Version</Text>
      <Text style={theme === "light" ? styles.version : darkModeStyles.version}>
        Version: 1.0.0
      </Text>

      <Text style={theme === "light" ? styles.subtitle : darkModeStyles.subtitle}>Privacy Policy</Text>
      <Text style={theme === "light" ? styles.description : darkModeStyles.description}>
        Your privacy is important to us. We do not collect personal data without your consent. 
        Please review our full privacy policy at [link to privacy policy].
      </Text>

      <Text style={theme === "light" ? styles.subtitle : darkModeStyles.subtitle}>Contributors</Text>
      <View style={styles.bulletContainer}>
        <Text style={theme === "light" ? styles.bullet : darkModeStyles.bullet}>• Donnell Naidoo</Text>
        <Text style={theme === "light" ? styles.bullet : darkModeStyles.bullet}>• Kgahlisho Tladi</Text>
        <Text style={theme === "light" ? styles.bullet : darkModeStyles.bullet}>• James Masaga</Text>
        <Text style={theme === "light" ? styles.bullet : darkModeStyles.bullet}>• Angelo Moses</Text>
        <Text style={theme === "light" ? styles.bullet : darkModeStyles.bullet}>• Trinity Chauke</Text>
        <Text style={theme === "light" ? styles.bullet : darkModeStyles.bullet}>• Mfumo Mthimkulu</Text>
      </View>

      <Text style={theme === "light" ? styles.subtitle : darkModeStyles.subtitle}>Contact Us</Text>
      <Text style={theme === "light" ? styles.contact : darkModeStyles.contact}>
        For support, contact us at: <Text style={styles.contactEmail}>support@onesa.app</Text>
      </Text>
    </ScrollView>
  );
};

export default AppInfo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontFamily: "Poppins-Bold",
    color: "#333",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    fontFamily: "Poppins-Bold",
    color: "#333",
    marginTop: 20,
    marginBottom: 5,
  },
  description: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "#555",
    marginBottom: 20,
  },
  bulletContainer: {
    marginLeft: 10,
    marginBottom: 20,
  },
  bullet: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "#555", // Default bullet color
    marginBottom: 5,
  },
  version: {
    fontSize: 14,
    fontFamily: "Poppins-SemiBold",
    color: "#333",
  },
  contact: {
    fontSize: 14,
    fontFamily: "Poppins-SemiBold",
    color: "#B7C42E", // Green color for contact text
    marginBottom: 30
  },
  contactEmail: {
    color: "#B7C42E", // Green color for email
    textDecorationLine: "underline", // Underline email for emphasis
  },
});

const darkModeStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#121212",
  },
  title: {
    fontSize: 24,
    fontFamily: "Poppins-Bold",
    color: "#fff",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    fontFamily: "Poppins-Bold",
    color: "#fff",
    marginTop: 20,
    marginBottom: 5,
  },
  description: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "#ccc",
    marginBottom: 20,
  },
  bulletContainer: {
    marginLeft: 10,
    marginBottom: 20,
  },
  bullet: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "#ccc", // Default bullet color
    marginBottom: 5,
  },
  version: {
    fontSize: 14,
    fontFamily: "Poppins-SemiBold",
    color: "#fff",
  },
  contact: {
    fontSize: 14,
    fontFamily: "Poppins-SemiBold",
    color: "#B7C42E",
    marginBottom: 30 // Green color for contact text
  },
  contactEmail: {
    color: "#B7C42E", // Green color for email
    textDecorationLine: "underline", // Underline email for emphasis
  },
});
