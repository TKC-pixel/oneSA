import React, { useContext } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeContext } from "../context/ThemeContext";

const Guides = ({ navigation }) => {
  const { theme } = useContext(ThemeContext);
  const isLightTheme = theme === "light";

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isLightTheme ? "#F9F9F9" : "#121212" },
      ]}
    >
      <ScrollView contentContainerStyle={styles.guidesList}>
        <View
          style={[
            styles.rulesSection,
            { backgroundColor: isLightTheme ? "#E1F5FE" : "#2E3A59" },
          ]}
        >
          <Text
            style={[
              styles.rulesHeader,
              { color: isLightTheme ? "#01579B" : "#BBDEFB" },
            ]}
          >
            Rules for Using the OneSA App
          </Text>
          <Text
            style={[
              styles.ruleText,
              { color: isLightTheme ? "#333" : "#E0E0E0" },
            ]}
          >
            1. Respect all members and their opinions.
          </Text>
          <Text
            style={[
              styles.ruleText,
              { color: isLightTheme ? "#333" : "#E0E0E0" },
            ]}
          >
            2. Avoid spreading false or misleading information.
          </Text>
          <Text
            style={[
              styles.ruleText,
              { color: isLightTheme ? "#333" : "#E0E0E0" },
            ]}
          >
            3. No hate speech, bullying, or harassment.
          </Text>
          <Text
            style={[
              styles.ruleText,
              { color: isLightTheme ? "#333" : "#E0E0E0" },
            ]}
          >
            4. Share only relevant information within each section.
          </Text>
          <Text
            style={[
              styles.ruleText,
              { color: isLightTheme ? "#333" : "#E0E0E0" },
            ]}
          >
            5. Avoid spam or self-promotion without prior consent.
          </Text>
          <Text
            style={[
              styles.ruleText,
              { color: isLightTheme ? "#333" : "#E0E0E0" },
            ]}
          >
            6. Report any inappropriate content or misuse promptly.
          </Text>

          <Text
            style={[
              styles.failureText,
              { color: isLightTheme ? "#B71C1C" : "#FFCDD2" },
            ]}
          >
            Failure to follow these rules may result in temporary or permanent
            suspension of your account.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Guides;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 16,
    alignSelf: "center",
    fontFamily: "Poppins-SemiBold",
  },
  guidesList: {
    paddingBottom: 20,
  },
  rulesSection: {
    marginTop: 24,
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
  },
  rulesHeader: {
    fontSize: 22,
    // fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    fontFamily: "Poppins-Bold",
  },
  ruleText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 8,
    fontFamily: "Poppins-Regular",
  },
  failureText: {
    fontSize: 16,
    // fontWeight: "bold",
    marginTop: 16,
    textAlign: "center",
    fontFamily: "Poppins-Bold",
  },
});
