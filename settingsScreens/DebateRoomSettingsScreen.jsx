import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity, Alert } from 'react-native';
import { ThemeContext } from '../context/ThemeContext'; // Adjust the import path as needed
import { SafeAreaView } from 'react-native-safe-area-context';

const DebateRoomSettingsScreen = () => {
  const { theme } = useContext(ThemeContext); // Get the current theme from context
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = React.useState(false);

  const handleToggleNotifications = () => {
    setNotificationsEnabled(previousState => !previousState);
  };

  const handleToggleDarkMode = () => {
    setDarkModeEnabled(previousState => !previousState);
  };

  const handleSaveSettings = () => {
    // Logic to save settings goes here
    Alert.alert("Settings Saved", "Your changes have been saved successfully!");
  };

  return (
    <SafeAreaView 
      style={[styles.container, theme === 'dark' ? styles.darkBackground : styles.lightBackground]}
    >
      <View style={{padding: 15}}>
      <Text style={[styles.title, theme === 'dark' ? styles.darkText : styles.lightText]}>
        Debate Room Settings
      </Text>

      <View style={styles.settingItem}>
        <Text style={[styles.label, theme === 'dark' ? styles.darkText : styles.lightText]}>
          Enable Notifications:
        </Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={handleToggleNotifications}
        />
      </View>

      <View style={styles.settingItem}>
        <Text style={[styles.label, theme === 'dark' ? styles.darkText : styles.lightText]}>
          Dark Mode:
        </Text>
        <Switch
          value={darkModeEnabled}
          onValueChange={handleToggleDarkMode}
        />
      </View>

      <TouchableOpacity style={[styles.button, theme === 'dark' ? styles.darkButton : styles.lightButton]} onPress={handleSaveSettings}>
        <Text style={styles.buttonText}>Save Settings</Text>
      </TouchableOpacity>

      <Text style={[styles.footer, theme === 'dark' ? styles.darkText : styles.lightText]}>
        Adjust your settings for a better debate experience.
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
    backgroundColor: '#f8f9fa', // Light background color
  },
  darkBackground: {
    backgroundColor: '#1c1c1e', // Dark background color
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
  },
  button: {
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  lightButton: {
    backgroundColor: '#B7C42E', // Primary button color for light mode
  },
  darkButton: {
    backgroundColor: '#0056b3', // Darker primary button color for dark mode
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  footer: {
    fontSize: 14,
    marginTop: 20,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  darkText: {
    color: '#ffffff', // Light text color for dark mode
  },
  lightText: {
    color: '#000000', // Dark text color for light mode
  },
});

export default DebateRoomSettingsScreen;
