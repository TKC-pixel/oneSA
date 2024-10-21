import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { ThemeContext } from '../context/ThemeContext'; // Adjust the import path as needed

const AppInfoScreen = () => {
  const { theme } = useContext(ThemeContext); // Get the current theme from context

  return (
    <SafeAreaView 
      style={[styles.container, theme === 'dark' ? styles.darkBackground : styles.lightBackground]}
    >
      <View style={{padding: 15}}>
      <Text style={[styles.title, theme === 'dark' ? styles.darkText : styles.lightText]}>
        App Information
      </Text>

      <Text style={[styles.label, theme === 'dark' ? styles.darkText : styles.lightText]}>
        Version:
      </Text>
      <Text style={[styles.info, theme === 'dark' ? styles.darkText : styles.lightText]}>
        1.0.0
      </Text>

      <Text style={[styles.label, theme === 'dark' ? styles.darkText : styles.lightText]}>
        Update Notes:
      </Text>
      <Text style={[styles.info, theme === 'dark' ? styles.darkText : styles.lightText]}>
        - Initial release of the OneSA app {'\n'}
        - Features include tracking government spending and citizen engagement {'\n'}
        - Enhanced user experience with dark mode support
      </Text>

      <Text style={[styles.label, theme === 'dark' ? styles.darkText : styles.lightText]}>
        About Us:
      </Text>
      <Text style={[styles.info, theme === 'dark' ? styles.darkText : styles.lightText]}>
        OneSA is committed to promoting transparency and accountability in government spending. 
        We strive to empower citizens with the information they need to make informed decisions.
      </Text>

      <Text style={[styles.footer, theme === 'dark' ? styles.darkText : styles.lightText]}>
        Thank you for using OneSA!
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

export default AppInfoScreen;
