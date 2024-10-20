import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { ThemeContext } from '../context/ThemeContext'; // Adjust the import path as needed

const LogoutConfirmationScreen = ({ navigation }) => {
  const { theme } = useContext(ThemeContext); // Get the current theme from context

  const handleLogout = () => {
    // Logic to log out the user goes here
    Alert.alert("Logged Out", "You have successfully logged out.");
    navigation.navigate('Login'); // Navigate to login or home screen after logging out
  };

  const handleCancel = () => {
    navigation.goBack(); // Go back to the previous screen
  };

  return (
    <View style={[styles.container, theme === 'dark' ? styles.darkBackground : styles.lightBackground]}>
      <Text style={[styles.title, theme === 'dark' ? styles.darkText : styles.lightText]}>
        Log Out Confirmation
      </Text>
      <Text style={[styles.message, theme === 'dark' ? styles.darkText : styles.lightText]}>
        Are you sure you want to log out? You will need to log in again to access your account.
      </Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
          <Text style={styles.buttonText}>Log Out</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  message: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  logoutButton: {
    backgroundColor: '#ff4d4d', // Red for log out button
  },
  cancelButton: {
    backgroundColor: '#007bff', // Blue for cancel button
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

export default LogoutConfirmationScreen;
