import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeContext } from "../context/ThemeContext";
// Adjust the import path as necessary

const Settings = () => {
  const navigation = useNavigation();
  const { theme } = useContext(ThemeContext); // Get current theme

  const settingsOptions = [
    { title: "Privacy Settings", screen: "PrivacySettingsScreen" },
    { title: "Notifications", screen: "NotificationSettingsScreen" },
    { title: "Theme", screen: "ThemeSettingsScreen" },
    { title: "App Security", screen: "SecuritySettingsScreen" },
    { title: "Account Management", screen: "AccountManagementScreen" },
    { title: "Feedback and Support", screen: "FeedbackSupportScreen" },
    { title: "Debate Room Settings", screen: "DebateRoomSettingsScreen" },
    { title: "Data and Storage", screen: "DataStorageScreen" },
    { title: "App Info & Updates", screen: "AppInfoScreen" },
    { title: "About OneSA", screen: "AboutScreen" },
    { title: "Log Out", screen: "LogoutConfirmationScreen" },
  ];

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.option,
        {
          backgroundColor: theme === 'dark' ? '#333' : '#fff',
          borderBottomColor: theme === 'dark' ? '#444' : '#e0e0e0',
        }
      ]}
      onPress={() => navigation.navigate(item.screen)}
    >
      <Text style={[
        styles.optionText,
        { color: theme === 'dark' ? '#fff' : '#333' }
      ]}>
        {item.title}
      </Text>
      <Ionicons name="chevron-forward-outline" size={18} color={theme === 'dark' ? '#fff' : '#333'} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[
      styles.container,
      { backgroundColor: theme === 'dark' ? '#121212' : '#fff' }
    ]}>
      <Text style={[
        styles.headingTitle,
        { color: theme === 'dark' ? '#fff' : '#333' }
      ]}>
        Settings
      </Text>
      <FlatList
        data={settingsOptions}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 18,
  },
  headingTitle: {
    fontSize: 40,
    fontFamily: "Poppins-Bold",
    marginBottom: 3,
  },
  option: {
    padding: 15,
    borderBottomWidth: 1,
    flexDirection: "row",
    marginBottom: 10,
    marginHorizontal: 3,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "space-between",
    // iOS shadow
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    // Android shadow
    elevation: 5,
  },
  optionText: {
    fontSize: 18,
    fontFamily: "Poppins-Bold"
  },
});
