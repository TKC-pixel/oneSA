import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert, Modal, FlatList, TextInput } from 'react-native';
import { ThemeContext } from '../context/ThemeContext'; 
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from '../FIrebaseConfig'; 
import { collection, getDocs } from "firebase/firestore";
import { getAuth, updatePassword, EmailAuthProvider } from "firebase/auth"; // Import updatePassword and EmailAuthProvider

const SecuritySettingsScreen = () => {
  const { theme } = useContext(ThemeContext); 
  const [twoFactorAuthEnabled, setTwoFactorAuthEnabled] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [loginHistory, setLoginHistory] = useState([]);
  const [accountCreationDate, setAccountCreationDate] = useState(null);
  
  // Change password modal state
  const [changePasswordModalVisible, setChangePasswordModalVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (user) {
      setAccountCreationDate(user.metadata.creationTime); // Get the creation date
    }
  }, []);

  const handleToggleTwoFactorAuth = () => {
    setTwoFactorAuthEnabled(previousState => !previousState);
  };

  const handleChangePassword = async () => {
    // Regex for password validation: 
    // At least 8 characters long, at least one uppercase letter, one lowercase letter, one number, and one special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (newPassword !== confirmPassword) {
        Alert.alert("Error", "New password and confirmation do not match.");
        return;
    }

    if (!passwordRegex.test(newPassword)) {
        Alert.alert("Error", "New password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character.");
        return;
    }

    const auth = getAuth();
    const user = auth.currentUser;

    try {
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        await user.reauthenticateWithCredential(credential); // Reauthenticate the user
        await updatePassword(user, newPassword); // Update the password
        Alert.alert("Success", "Password changed successfully.");
        setChangePasswordModalVisible(false);
        // Clear input fields
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
    } catch (error) {
        console.error("Error changing password: ", error);
        Alert.alert("Error", "Could not change password. Please check your current password.");
    }
};

  const handleViewLoginHistory = async () => {
    try {
      const historySnapshot = await getDocs(collection(db, "loginHistory"));
      const historyData = historySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setLoginHistory(historyData);
      setModalVisible(true);
    } catch (error) {
      console.error("Error fetching login history: ", error);
      Alert.alert("Error", "Could not fetch login history.");
    }
  };

  const handleSaveSettings = () => {
    Alert.alert("Settings Saved", "Your security preferences have been saved.");
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const closeChangePasswordModal = () => {
    setChangePasswordModalVisible(false);
    // Clear input fields
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const renderLoginHistoryItem = ({ item }) => {
    let formattedTimestamp;

    if (item.timestamp) {
      if (item.timestamp.toDate) {
        formattedTimestamp = item.timestamp.toDate().toLocaleString().replace(/,/, ''); // Remove comma
      } else if (typeof item.timestamp === 'string' || item.timestamp instanceof Date) {
        formattedTimestamp = new Date(item.timestamp).toLocaleString().replace(/,/, ''); // Remove comma
      } else {
        return null; // Skip rendering if timestamp is not valid
      }

      return (
        <View style={styles.historyItem}>
          <Text style={[styles.historyText, theme === 'dark' ? styles.darkText : styles.lightText]}>
            {formattedTimestamp}
          </Text>
        </View>
      );
    }
    
    return null; // Return null if the timestamp is not valid
  };

  return (
    <SafeAreaView style={[styles.container, theme === 'dark' ? styles.darkBackground : styles.lightBackground]}>
      <View style={{ padding: 15 }}>
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

        <TouchableOpacity style={[styles.button, { backgroundColor: theme === 'dark' ? '#B7C42E' : '#B7C42E' }]} onPress={() => setChangePasswordModalVisible(true)}>
          <Text style={[styles.buttonText, {textAlign: 'center'}]}>Change Password</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, { backgroundColor: theme === 'dark' ? '#B7C42E' : '#B7C42E' }]} onPress={handleViewLoginHistory}>
          <Text style={[styles.buttonText, {textAlign: 'center'}]}>View Login History</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, { backgroundColor: theme === 'dark' ? '#B7C42E' : '#B7C42E' }]} onPress={handleSaveSettings}>
          <Text style={[styles.buttonText, {textAlign: 'center'}]}>Save Settings</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for Change Password */}
      <Modal
        transparent={true}
        visible={changePasswordModalVisible}
        animationType="slide"
        onRequestClose={closeChangePasswordModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={[styles.modalTitle, theme === 'dark' ? styles.darkText : styles.lightText]}>Change Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Current Password"
              placeholderTextColor={theme === 'dark' ? '#888' : '#ccc'}
              secureTextEntry
              value={currentPassword}
              onChangeText={setCurrentPassword}
            />
            <TextInput
              style={styles.input}
              placeholder="New Password"
              placeholderTextColor={theme === 'dark' ? '#888' : '#ccc'}
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TextInput
              style={styles.input}
              placeholder="Confirm New Password"
              placeholderTextColor={theme === 'dark' ? '#888' : '#ccc'}
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity style={styles.save} onPress={handleChangePassword}>
              <Text style={[styles.buttonText, {textAlign: 'center'}]}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={closeChangePasswordModal}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal for Login History */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={[styles.modalTitle, theme === 'dark' ? styles.darkText : styles.lightText]}>History</Text>
            
            {/* Display Account Creation Date in the Modal */}
            {accountCreationDate && (
              <View style={styles.historyItem}>
                <Text style={[styles.historyText, theme === 'dark' ? styles.darkText : styles.lightText]}>
                  Account Created             {new Date(accountCreationDate).toLocaleString().replace(/,/, '')}
                </Text>
              </View>
            )}

            <Text style={[styles.label, theme === 'dark' ? styles.darkText : styles.lightText, { marginTop: 10 }]}>
              Recent Login History
            </Text>
            <FlatList
              data={loginHistory}
              renderItem={renderLoginHistoryItem}
              keyExtractor={item => item.id}
              style={styles.historyList}
            />
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  lightBackground: {
    backgroundColor: '#f8f9fa',
  },
  darkBackground: {
    backgroundColor: '#1c1c1e',
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
    backgroundColor: '#B7C42E',
  },
  save: {
    width: 270,
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    backgroundColor: '#B7C42E',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  darkText: {
    color: '#ffffff',
  },
  lightText: {
    color: '#000000',
    
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  historyList: {
    maxHeight: 300,
    width: '100%',
  },
  historyItem: { 
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  historyText: {
    textAlign: 'center',
    fontSize: 16,
  },
  input: {
    width: '100%',
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  closeButton: {
    width: 270,
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    backgroundColor: 'grey',

  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center'
  },
  buttonSave: {
    width: "100%",
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default SecuritySettingsScreen;
