import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Linking, Modal, TextInput } from 'react-native';
import { ThemeContext } from '../context/ThemeContext'; // Adjust the import path as needed
import { SafeAreaView } from 'react-native-safe-area-context';

const FeedbackSupportScreen = () => {
  const { theme } = useContext(ThemeContext); // Get the current theme from context
  const [modalVisible, setModalVisible] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');

  const handleFeedbackPress = () => {
    setModalVisible(true);
  };

  const handleSupportPress = () => {
    Linking.openURL('mailto:support@onesaapp.com'); // Replace with actual support email
  };

  const handleFAQPress = () => {
    Alert.alert("FAQ", "Visit our website for frequently asked questions."); // Replace with actual FAQ URL
  };

  const handleSubmitFeedback = () => {
    // You can add your feedback submission logic here (e.g., send to API)
    Alert.alert("Feedback Submitted", "Thank you for your feedback!");
    setFeedbackText(''); // Clear feedback text
    setModalVisible(false); // Close modal
  };

  return (
    <SafeAreaView 
      style={[styles.container, theme === 'dark' ? styles.darkBackground : styles.lightBackground]}
    >
      <View style={{ padding: 15 }}>
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

      {/* Feedback Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, theme === 'dark' ? styles.darkBackground : styles.lightBackground]}>
            <Text style={[styles.modalTitle, theme === 'dark' ? styles.darkText : styles.lightText]}>
              Provide Feedback
            </Text>
            <TextInput
              style={[styles.textInput, theme === 'dark' ? styles.darkInput : styles.lightInput]}
              placeholder="Type your feedback here..."
              placeholderTextColor={theme === 'dark' ? '#a9a9a9' : '#555'}
              multiline
              numberOfLines={4}
              value={feedbackText}
              onChangeText={setFeedbackText}
            />
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity 
                style={styles.submitButton} 
                onPress={handleSubmitFeedback}
              >
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.cancelButton} 
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    backgroundColor: '#B7C42E', // Primary button color for light mode
  },
  darkButton: {
    backgroundColor: '#B7C42E', // Darker primary button color for dark mode
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    width: '80%',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  textInput: {
    height: 100,
    borderColor: '#cccccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  submitButton: {
    backgroundColor: '#B7C42E',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
  },
  cancelButton: {
    backgroundColor: 'grey', // Red for cancel button
    padding: 10,
    borderRadius: 5,
    flex: 1,
  },
  lightInput: {
    borderColor: '#cccccc',
  },
  darkInput: {
    borderColor: '#666666',
  },
});

export default FeedbackSupportScreen;
