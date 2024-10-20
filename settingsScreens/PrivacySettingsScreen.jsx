import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert, Linking } from 'react-native';
import { ThemeContext } from '../context/ThemeContext'; // Adjust the import path as needed

const PrivacySettingsScreen = () => {
  const { theme } = useContext(ThemeContext); // Get the current theme from context
  const [locationSharingEnabled, setLocationSharingEnabled] = useState(true);
  const [dataAccessEnabled, setDataAccessEnabled] = useState(true);

  const handleToggleLocationSharing = () => {
    setLocationSharingEnabled(previousState => !previousState);
  };

  const handleToggleDataAccess = () => {
    setDataAccessEnabled(previousState => !previousState);
  };

  const handlePrivacyPolicyPress = () => {
    Linking.openURL('https://your-privacy-policy-url.com'); // Replace with your actual privacy policy URL
  };

  const handleSaveSettings = () => {
    // Logic to save settings goes here
    Alert.alert("Settings Saved", "Your privacy preferences have been saved.");
  };

  return (
    <View style={[styles.container, theme === 'dark' ? styles.darkBackground : styles.lightBackground]}>
      <Text style={[styles.title, theme === 'dark' ? styles.darkText : styles.lightText]}>
        Privacy Settings
      </Text>

      <View style={styles.settingItem}>
        <Text style={[styles.label, theme === 'dark' ? styles.darkText : styles.lightText]}>
          Enable Location Sharing:
        </Text>
        <Switch
          value={locationSharingEnabled}
          onValueChange={handleToggleLocationSharing}
        />
      </View>

      <View style={styles.settingItem}>
        <Text style={[styles.label, theme === 'dark' ? styles.darkText : styles.lightText]}>
          Allow Data Access:
        </Text>
        <Switch
          value={dataAccessEnabled}
          onValueChange={handleToggleDataAccess}
        />
      </View>

      <TouchableOpacity style={[styles.button, { backgroundColor: theme === 'dark' ? '#0056b3' : '#007bff' }]} onPress={handlePrivacyPolicyPress}>
        <Text style={styles.buttonText}>View Privacy Policy</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, { backgroundColor: theme === 'dark' ? '#0056b3' : '#007bff' }]} onPress={handleSaveSettings}>
        <Text style={styles.buttonText}>Save Settings</Text>
      </TouchableOpacity>
    </View>
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

export default PrivacySettingsScreen;
