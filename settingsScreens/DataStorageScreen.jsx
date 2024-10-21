import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { ThemeContext } from '../context/ThemeContext'; // Adjust the import path as needed

const DataStorageScreen = () => {
  const { theme } = useContext(ThemeContext); // Get the current theme from context

  const handleClearData = () => {
    Alert.alert(
      "Clear Data",
      "Are you sure you want to clear all app data?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "OK", onPress: () => console.log("Data cleared") } // Implement data clearing logic here
      ]
    );
  };

  return (
    <SafeAreaView 
      style={[styles.container, theme === 'dark' ? styles.darkBackground : styles.lightBackground]}
    >
      <View style={{padding: 15}}>
      <Text style={[styles.title, theme === 'dark' ? styles.darkText : styles.lightText]}>
        Data and Storage Management
      </Text>

      <Text style={[styles.label, theme === 'dark' ? styles.darkText : styles.lightText]}>
        Current Data Usage:
      </Text>
      <Text style={[styles.info, theme === 'dark' ? styles.darkText : styles.lightText]}>
        Approximately 150 MB
      </Text>

      <Text style={[styles.label, theme === 'dark' ? styles.darkText : styles.lightText]}>
        Storage Options:
      </Text>
      <Text style={[styles.info, theme === 'dark' ? styles.darkText : styles.lightText]}>
        - Manage data storage by clearing cache and unused data. {'\n'}
        - Review and delete stored preferences and temporary files.
      </Text>

      <TouchableOpacity style={[styles.button, theme === 'dark' ? styles.darkButton : styles.lightButton]} onPress={handleClearData}>
        <Text style={styles.buttonText}>Clear App Data</Text>
      </TouchableOpacity>

      <Text style={[styles.footer, theme === 'dark' ? styles.darkText : styles.lightText]}>
        Please manage your data responsibly to ensure optimal app performance.
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
  label: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 15,
  },
  info: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 10,
  },
  button: {
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  lightButton: {
    backgroundColor: '#ff4d4d', // Red background for light mode
  },
  darkButton: {
    backgroundColor: '#ff5c5c', // Lighter red background for dark mode
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

export default DataStorageScreen;
