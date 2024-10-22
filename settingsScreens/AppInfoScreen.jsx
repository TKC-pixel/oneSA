import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ThemeContext } from '../context/ThemeContext'; // Adjust the import path as needed
import { SafeAreaView } from 'react-native-safe-area-context';

const AppInfoScreen = () => {
  const { theme } = useContext(ThemeContext); // Get the current theme from context

  return (
    <SafeAreaView 
      style={[styles.container, theme === 'dark' ? styles.darkBackground : styles.lightBackground]}
    >
      <View style={styles.innerContainer}>
        <Text style={[styles.title, theme === 'dark' ? styles.darkText : styles.lightText]}>
          App Information
        </Text>

        <View style={styles.infoSection}>
          <Text style={[styles.label, theme === 'dark' ? styles.darkText : styles.lightText]}>
            Version:
          </Text>
          <Text style={[styles.info, theme === 'dark' ? styles.darkText : styles.lightText]}>
            1.0.0
          </Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={[styles.label, theme === 'dark' ? styles.darkText : styles.lightText]}>
            Update Notes:
          </Text>
          <Text style={[styles.info, theme === 'dark' ? styles.darkText : styles.lightText]}>
            - Initial release of the OneSA app {'\n'}
            - Features include tracking government spending and citizen engagement {'\n'}
            - Enhanced user experience with dark mode support
          </Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={[styles.label, theme === 'dark' ? styles.darkText : styles.lightText]}>
            About Us:
          </Text>
          <Text style={[styles.info, theme === 'dark' ? styles.darkText : styles.lightText]}>
            OneSA is committed to promoting transparency and accountability in government spending. 
            We strive to empower citizens with the information they need to make informed decisions.
          </Text>
        </View>

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
  innerContainer: {
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  lightBackground: {
    backgroundColor: '#f8f9fa', // Light background color
  },
  darkBackground: {
    backgroundColor: '#1c1c1e', // Dark background color
  },
  title: {
    fontSize: 30, // Slightly larger font size for title
    // fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'Poppins-Bold', // Use Poppins Bold
  },
  infoSection: {
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  label: {
    fontSize: 22, // Larger font size for labels
    fontWeight: '600',
    marginTop: 10,
    fontFamily: 'Poppins-Regular', // Use Poppins Regular
  },
  info: {
    fontSize: 18,
    lineHeight: 28, // Increased line height for better readability
    marginBottom: 5,
    fontFamily: 'Poppins-Regular', // Use Poppins Regular
    color: 'rgba(0, 0, 0, 0.7)', // Semi-transparent text for light mode
  },
  footer: {
    fontSize: 18,
    marginTop: 20,
    textAlign: 'center',
    // fontStyle: 'italic',
    fontFamily: 'Poppins-Regular', // Use Poppins Regular
  },
  darkText: {
    color: '#ffffff', // Light text color for dark mode
  },
  lightText: {
    color: '#333333', // Darker text color for light mode for better readability
  },
});

export default AppInfoScreen;
