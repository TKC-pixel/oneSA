import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert } from 'react-native';
import { ThemeContext } from '../context/ThemeContext'; // Adjust the import path as needed
import { SafeAreaView } from 'react-native-safe-area-context';

const SecuritySettingsScreen = () => {
  const { theme } = useContext(ThemeContext); // Get the current theme from context
  const [twoFactorAuthEnabled, setTwoFactorAuthEnabled] = useState(false);

  const handleToggleTwoFactorAuth = () => {
    setTwoFactorAuthEnabled(previousState => !previousState);
  };

  const handleChangePassword = () => {
    // Logic for changing the password goes here
    Alert.alert("Change Password", "This feature is not implemented yet.");
  };

  const handleViewLoginHistory = () => {
    // Logic for viewing login history goes here
    Alert.alert("Login History", "This feature is not implemented yet.");
  };

  const handleSaveSettings = () => {
    // Logic to save settings goes here
    Alert.alert("Settings Saved", "Your security preferences have been saved.");
  };

  return (
    <SafeAreaView style={[styles.container, theme === 'dark' ? styles.darkBackground : styles.lightBackground]}>
      <View style={{padding : 15}}>
      <Text style={[styles.title, theme === 'dark' ? styles.darkText : styles.lightText]}>
        Security Settings
      </Text>

      <View style={styles.settingItem}>
        <Text style={[styles.label, theme === 'dark' ? styles.darkText : styles.lightText]}>
          Enable Two-Factor Authentication:
        </Text>
        <Switch
          value={twoFactorAuthEnabled}
          onValueChange={handleToggleTwoFactorAuth}
        />
      </View>

      <TouchableOpacity style={[styles.button, { backgroundColor: theme === 'dark' ? '#0056b3' : '#007bff' }]} onPress={handleChangePassword}>
        <Text style={styles.buttonText}>Change Password</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, { backgroundColor: theme === 'dark' ? '#0056b3' : '#007bff' }]} onPress={handleViewLoginHistory}>
        <Text style={styles.buttonText}>View Login History</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, { backgroundColor: theme === 'dark' ? '#0056b3' : '#007bff' }]} onPress={handleSaveSettings}>
        <Text style={styles.buttonText}>Save Settings</Text>
      </TouchableOpacity>
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
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  darkText: {
    color: '#ffffff', // Light text color for dark mode
  },
  lightText: {
    color: '#000000', // Dark text color for light mode
  },
});

export default SecuritySettingsScreen;
