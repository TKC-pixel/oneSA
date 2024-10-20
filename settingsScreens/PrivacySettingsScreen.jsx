import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert, Linking } from 'react-native';
import { ThemeContext } from '../context/ThemeContext'; 
import { SafeAreaView } from 'react-native-safe-area-context';
import { UserContext } from "../context/UserContext";
import AsyncStorage from '@react-native-async-storage/async-storage';

const PrivacySettingsScreen = () => {
  const { locationPermissions, updateLocationPermission, toggleLocation } = useContext(UserContext);
  const { theme } = useContext(ThemeContext); 
  console.log('privacy', locationPermissions)
  const [location, setLocation] = useState(false);
  
  // Combine both useEffect hooks into one to track locationPermissions
  useEffect(() => {
    setLocation(locationPermissions === 'yes');
  }, [locationPermissions]);
  
  const [dataAccessEnabled, setDataAccessEnabled] = useState(true);
  
  const handleToggleLocationSharing = (newValue) => {
    setLocation(newValue);
    const newPermission = newValue ? 'yes' : 'no';
    updateLocationPermission(newPermission);
    Alert.alert("Location permission Changed", `Location sharing is now ${newPermission === 'yes' ? 'enabled' : 'disabled'}`);
  };

  const handleToggleTheme = () => {
    toggleTheme(); 
    Alert.alert(
      "Theme Changed",
      `The theme has been changed to ${theme === "light" ? "Dark" : "Light"}.`
    );
  };
  
  const handleToggleDataAccess = () => {
    setDataAccessEnabled(previousState => !previousState);
  };

  const handlePrivacyPolicyPress = () => {
    Linking.openURL('https://your-privacy-policy-url.com'); // Replace with your actual privacy policy URL
  };

  const handleSaveSettings = () => {
    Alert.alert("Settings Saved", "Your privacy preferences have been saved.");
  };

  return (
    <SafeAreaView style={[styles.container, theme === 'dark' ? styles.darkBackground : styles.lightBackground]}>
      <View>
        <Text style={[styles.title, theme === 'dark' ? styles.darkText : styles.lightText]}>
          Privacy Settings
        </Text>

        <View style={styles.settingItem}>
          <Text style={[styles.label, theme === 'dark' ? styles.darkText : styles.lightText]}>
            Enable Location Sharing:
          </Text>
          <Switch
            value={location}
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

export default PrivacySettingsScreen;
