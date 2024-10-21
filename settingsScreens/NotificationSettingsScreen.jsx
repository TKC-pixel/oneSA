import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { ThemeContext } from '../context/ThemeContext'; // Adjust the import path as needed

const NotificationSettingsScreen = () => {
  const { theme } = useContext(ThemeContext); // Get the current theme from context
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [messageNotifications, setMessageNotifications] = useState(true);
  const [eventNotifications, setEventNotifications] = useState(true);

  const handleToggleNotifications = () => {
    setNotificationsEnabled(previousState => !previousState);
  };

  const handleToggleMessageNotifications = () => {
    setMessageNotifications(previousState => !previousState);
  };

  const handleToggleEventNotifications = () => {
    setEventNotifications(previousState => !previousState);
  };

  const handleSaveSettings = () => {
    // Logic to save settings goes here
    Alert.alert("Settings Saved", "Your notification preferences have been saved.");
  };

  return (
    <SafeAreaView style={[styles.container, theme === 'dark' ? styles.darkBackground : styles.lightBackground]}>
      <View style={{padding: 10}}>
      <Text style={[styles.title, theme === 'dark' ? styles.darkText : styles.lightText]}>
        Notification Settings
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
          Message Notifications:
        </Text>
        <Switch
          value={messageNotifications}
          onValueChange={handleToggleMessageNotifications}
          disabled={!notificationsEnabled} // Disable if notifications are turned off
        />
      </View>

      <View style={styles.settingItem}>
        <Text style={[styles.label, theme === 'dark' ? styles.darkText : styles.lightText]}>
          Event Notifications:
        </Text>
        <Switch
          value={eventNotifications}
          onValueChange={handleToggleEventNotifications}
          disabled={!notificationsEnabled} // Disable if notifications are turned off
        />
      </View>

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
    padding: '40px',
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

export default NotificationSettingsScreen;
