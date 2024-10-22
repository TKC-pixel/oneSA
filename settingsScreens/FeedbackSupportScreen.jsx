import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Linking } from 'react-native';
import { ThemeContext } from '../context/ThemeContext'; // Adjust the import path as needed
import { SafeAreaView } from 'react-native-safe-area-context';

const FeedbackSupportScreen = () => {
  const { theme } = useContext(ThemeContext); // Get the current theme from context

  const handleFeedbackPress = () => {
    Alert.alert("Feedback", "Thank you for your interest in providing feedback!");
  };

  const handleSupportPress = () => {
    Linking.openURL('mailto:support@onesaapp.com'); // Replace with actual support email
  };

  const handleFAQPress = () => {
    Alert.alert("FAQ", "Visit our website for frequently asked questions."); // Replace with actual FAQ URL
  };

  return (
    <SafeAreaView 
      style={[styles.container, theme === 'dark' ? styles.darkBackground : styles.lightBackground]}
    >
      <View style={{padding: 15}}>
      <Text style={[styles.title, theme === 'dark' ? styles.darkText : styles.lightText]}>
        Feedback and Support
      </Text>

      <TouchableOpacity 
        style={[styles.button, theme === 'dark' ? styles.darkButton : styles.lightButton]} 
        onPress={handleFeedbackPress}
      >
        <Text style={styles.buttonText}>Provide Feedback</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, theme === 'dark' ? styles.darkButton : styles.lightButton]} 
        onPress={handleSupportPress}
      >
        <Text style={styles.buttonText}>Contact Support</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, theme === 'dark' ? styles.darkButton : styles.lightButton]} 
        onPress={handleFAQPress}
      >
        <Text style={styles.buttonText}>View FAQs</Text>
      </TouchableOpacity>

      <Text style={[styles.footer, theme === 'dark' ? styles.darkText : styles.lightText]}>
        We appreciate your input and are here to help!
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
  button: {
    padding: 15,
    borderRadius: 5,
    marginVertical: 10,
  },
  lightButton: {
    backgroundColor: '#007bff', // Primary button color for light mode
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

export default FeedbackSupportScreen;
