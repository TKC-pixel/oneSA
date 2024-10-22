import React, { useContext } from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeContext } from "../context/ThemeContext";

const HelpCentre = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <SafeAreaView style={theme === "light" ? styles.container : darkModeStyles.container}>
      <ScrollView style={styles.scrollContainer}>
        <Text style={theme === "light" ? styles.title : darkModeStyles.title}>
          Help Centre
        </Text>

        <Text style={theme === "light" ? styles.subtitle : darkModeStyles.subtitle}>
          Frequently Asked Questions
        </Text>

        <View style={styles.faqContainer}>
          <TouchableOpacity style={styles.faqItem}>
            <Text style={theme === "light" ? styles.faqQuestion : darkModeStyles.faqQuestion}>
              What is OneSA?
            </Text>
            <Text style={theme === "light" ? styles.faqAnswer : darkModeStyles.faqAnswer}>
              OneSA is an app designed to promote transparency and curb corruption by tracking government fund usage in South Africa.
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.faqItem}>
            <Text style={theme === "light" ? styles.faqQuestion : darkModeStyles.faqQuestion}>
              How do I report an issue?
            </Text>
            <Text style={theme === "light" ? styles.faqAnswer : darkModeStyles.faqAnswer}>
              You can file a report by navigating to the project details and clicking on 'File a report'.
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.faqItem}>
            <Text style={theme === "light" ? styles.faqQuestion : darkModeStyles.faqQuestion}>
              How can I contact support?
            </Text>
            <Text style={theme === "light" ? styles.faqAnswer : darkModeStyles.faqAnswer}>
              You can reach out to our support team at support@onesaapp.com.
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={theme === "light" ? styles.subtitle : darkModeStyles.subtitle}>
          Additional Resources
        </Text>
        <Text style={theme === "light" ? styles.resource : darkModeStyles.resource}>
          - User Guide
        </Text>
        <Text style={theme === "light" ? styles.resource : darkModeStyles.resource}>
          - Terms of Service
        </Text>
        <Text style={theme === "light" ? styles.resource : darkModeStyles.resource}>
          - Privacy Policy
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HelpCentre;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontFamily: "Poppins-Bold",
    color: "#333",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 24,
    fontFamily: "Poppins-Bold",
    color: "#555",
    marginTop: 20,
    marginBottom: 10,
  },
  faqContainer: {
    marginBottom: 20,
  },
  faqItem: {
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#B7C42E",
    borderRadius: 8,
  },
  faqQuestion: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    color: "#333",
  },
  faqAnswer: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "#555",
    marginTop: 5,
  },
  resource: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "#555",
    marginBottom: 5,
  },
});

const darkModeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  title: {
    fontSize: 32,
    fontFamily: "Poppins-Bold",
    color: "#fff",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 24,
    fontFamily: "Poppins-Bold",
    color: "#ccc",
    marginTop: 20,
    marginBottom: 10,
  },
  faqQuestion: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    color: "#fff",
  },
  faqAnswer: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "#ccc",
    marginTop: 5,
  },
  resource: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "#ccc",
    marginBottom: 5,
  },
});
