import React, { useContext, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Alert } from "react-native";
import { ThemeContext } from "../context/ThemeContext"; 
import { SafeAreaView } from "react-native-safe-area-context";
import { auth, db } from "../FIrebaseConfig"; // Ensure db is your Firestore instance
import { signOut, updatePassword, deleteUser, signInWithEmailAndPassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { UserContext } from "../context/UserContext"; 
import {deleteDoc,doc,updateDoc,collection,query,where,getDocs,} from "firebase/firestore";
import Ionicons from "@expo/vector-icons/Ionicons";
import { CommonActions } from '@react-navigation/native';

const AccountManagementScreen = ({ navigation }) => {
  const { theme } = useContext(ThemeContext);
  const { userData, setUserData } = useContext(UserContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentOption, setCurrentOption] = useState(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleOptionPress = (option) => {
    setCurrentOption(option);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
  };

  const handleChangePassword = async () => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Error", "User not found. Please sign in again.");
      handleCloseModal();
      return;
    }

    if (newPassword === currentPassword) {
      Alert.alert("Error", "New password must be different from the current password.");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{6,}$/;
    if (!passwordRegex.test(newPassword)) {
      Alert.alert("Error", "Password must contain at least 6 characters, including uppercase, lowercase letters, and a number.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, user.email, currentPassword);
      await updatePassword(user, newPassword);
      Alert.alert("Success", "Password updated successfully");
      handleCloseModal();
    } catch (err) {
      if (err.code === 'auth/wrong-password') {
        Alert.alert("Error", "Current password is incorrect. Please try again.");
      } else {
        setError(err.message);
      }
    }
  };

  const handleSignOut = async () => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Error", "No user is currently logged in.");
      return;
    }

    try {
      await signOut(auth); 
      Alert.alert("Logged Out", "You have successfully logged out.");
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        })
      );
      handleCloseModal();
    } catch (error) {
      console.error('Error logging out:', error);
      Alert.alert("Logout Error", "An error occurred while logging out. Please try again.");
    }
  };

  const handleDeleteAccount = async () => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Error", "User not found. Please sign in again.");
      handleCloseModal();
      return;
    }
  
    const promptForPassword = () => {
      return new Promise((resolve) => {
        Alert.prompt(
          "Password",
          "Please enter your password to confirm account deletion.",
          [
            {
              text: "Cancel",
              onPress: () => resolve(null),
              style: "cancel",
            },
            {
              text: "OK",
              onPress: (input) => resolve(input),
            },
          ]
        );
      });
    };
  
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        { text: "Cancel", onPress: () => console.log("Delete cancelled"), style: "cancel" },
        {
          text: "Delete", onPress: async () => {
            try {
              const password = await promptForPassword();
              if (password === null) {
                console.log("Account deletion cancelled by user.");
                return;
              }
  
              const credential = EmailAuthProvider.credential(user.email, password);
              await reauthenticateWithCredential(user, credential);
  
              // Delete user login history
              const loginHistoryRef = collection(db, "loginHistory");
              const q = query(loginHistoryRef, where("userId", "==", user.uid)); 
              const querySnapshot = await getDocs(q);
  
              // Check if any documents found
              if (querySnapshot.empty) {
                console.log("No login history found for user.");
              } else {
                querySnapshot.forEach(async (doc) => {
                  try {
                    await deleteDoc(doc.ref);
                  } catch (error) {
                    console.error("Error deleting login history document:", error);
                    Alert.alert("Error", "Failed to delete login history. Please try again.");
                  }
                });
              }
  
              // Delete user data from Firestore
              const userDocRef = doc(db, "Users", user.uid);
              await deleteDoc(userDocRef);
  
              // Delete user account
              await deleteUser(user);
              handleCloseModal();
              Alert.alert("Account Deleted", "Your account and data have been deleted.");
              navigation.navigate('SignUp');
            } catch (error) {
              console.error("Error during account deletion:", error);
              if (error.code === 'auth/wrong-password') {
                Alert.alert("Error", "Incorrect password. Please try again.");
              } else if (error.message.includes("402")) {
                Alert.alert("Payment Error", "There was an issue with your account. Please check your payment method.");
              } else {
                Alert.alert("Error", "Failed to delete account. Please try again.");
              }
            }
          }
        }
      ]
    );
  };
  
  const handleSaveDetails = async () => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Error", "User not found. Please sign in again.");
      handleCloseModal();
      return;
    }
  
    const userDocRef = doc(db, "Users", user.uid);
    try {
      // Update user data in the Users collection
      await updateDoc(userDocRef, {
        name: userData.name,
        surname: userData.surname,
        phone: userData.phone,
      });
  
      // Update local state in UserContext
      setUserData((prevData) => ({
        ...prevData,
        name: userData.name,
        surname: userData.surname,
        phone: userData.phone,
      }));
  
      Alert.alert("Success", "Account details updated successfully.");
      handleCloseModal();
    } catch (error) {
      console.error("Error updating account details:", error);
      if (error.message.includes("402")) {
        Alert.alert("Payment Error", "There was an issue with your account. Please check your payment method.");
      } else {
        Alert.alert("Error", "Failed to update account details. Please try again.");
      }
    }
  };
  

  
  const renderModalContent = () => {
    switch (currentOption) {
      case "ChangeCredentials":
        return (
          <View style={styles.modalContent}>
            <Text style={[styles.modalTitle, theme === "dark" ? styles.darkText : styles.lightText]}>Change Password</Text>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <TextInput
              placeholder="Current Password"
              secureTextEntry
              value={currentPassword}
              onChangeText={setCurrentPassword}
              style={[styles.input, theme === "dark" ? styles.darkInput : styles.lightInput]}
              placeholderTextColor={theme === "light" ? "#B0B0B0" : "#7A7A7A"}
            />
            <TextInput
              placeholder="New Password"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
              style={[styles.input, theme === "dark" ? styles.darkInput : styles.lightInput]}
              placeholderTextColor={theme === "light" ? "#B0B0B0" : "#7A7A7A"}
            />
            <TextInput
              placeholder="Confirm New Password"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              style={[styles.input, theme === "dark" ? styles.darkInput : styles.lightInput]}
              placeholderTextColor={theme === "light" ? "#B0B0B0" : "#7A7A7A"}
            />
            <TouchableOpacity onPress={handleChangePassword} style={[styles.button, {backgroundColor: '#B7C42E'}]}>
              <Text style={styles.buttonText}>Update Password</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCloseModal} style={[styles.button, {backgroundColor: 'grey'}]}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        );
        case "ViewAccountDetails":
  return (
    <View style={styles.modalContent}>
      <Text style={[styles.modalTitle, theme === "dark" ? styles.darkText : styles.lightText]}>Account Details</Text>
      <TextInput
        placeholder="Email"
        value={userData.email || "No email found"}
        editable={false} // Make the email field read-only
        style={[styles.input, theme === "dark" ? styles.darkInput : styles.lightInput]}
      />
      <TextInput
        placeholder="Name"
        value={userData.name || ""}
        onChangeText={(text) => setUserData((prevData) => ({ ...prevData, name: text }))} // Update userData on change
        style={[styles.input, theme === "dark" ? styles.darkInput : styles.lightInput]}
      />
      <TextInput
        placeholder="Surname"
        value={userData.surname || ""}
        onChangeText={(text) => setUserData((prevData) => ({ ...prevData, surname: text }))} // Update userData on change
        style={[styles.input, theme === "dark" ? styles.darkInput : styles.lightInput]}
      />
      <TextInput
        placeholder="Phone"
        value={userData.phone || ""}
        onChangeText={(text) => setUserData((prevData) => ({ ...prevData, phone: text }))} // Update userData on change
        style={[styles.input, theme === "dark" ? styles.darkInput : styles.lightInput]}
      />
      <TouchableOpacity onPress={handleSaveDetails} style={[styles.button, {backgroundColor: '#B7C42E'}]}>
        <Text style={styles.buttonText}>Save Changes</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleCloseModal} style={[styles.button, {backgroundColor: 'grey'}]}>
        <Text style={styles.buttonText}>Close</Text>
      </TouchableOpacity>
    </View>
  );
        case "SignOut":
        return (
          <View style={styles.modalContent}>
            <Text style={[styles.modalTitle, theme === "dark" ? styles.darkText : styles.lightText]}>Sign Out</Text>
            <Text style={theme === "dark" ? styles.darkText : styles.lightText}>Are you sure you want to sign out?</Text>
            <TouchableOpacity onPress={handleSignOut} style={[styles.button, {backgroundColor: '#B7C42E'}]}>
              <Text style={styles.buttonText}>Sign Out</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCloseModal} style={[styles.button, {backgroundColor: 'grey'}]}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        );
      case "DeleteAccount":
        return (
          <View style={styles.modalContent}>
            <Text style={[styles.modalTitle,  theme === "dark" ? styles.darkText : styles.lightText]}>Delete Account</Text>
            <View style={styles.warningContainer}>
              
              <Text style={styles.warningText}>You are about to delete your account</Text>
              <Ionicons name="warning" size={30} color="red" />
            </View>
            <TouchableOpacity onPress={handleDeleteAccount} style={[styles.button, {backgroundColor: 'red'}]}>
              <Text style={styles.buttonText}>Delete Account</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCloseModal} style={[styles.button, {backgroundColor: 'grey'}]}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={[styles.container, theme === "dark" ? styles.darkBackground : styles.lightBackground]}>
      <Text style={[styles.title, theme === "dark" ? styles.darkText : styles.lightText]}>Account Management</Text>
      <TouchableOpacity onPress={() => handleOptionPress("ChangeCredentials")} style={[styles.button, {backgroundColor: '#B7C42E'}]}>
        <Text style={styles.buttonText}>Change Password</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleOptionPress("ViewAccountDetails")} style={[styles.button, {backgroundColor: '#B7C42E'}]}>
        <Text style={styles.buttonText}>View Account Details</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleOptionPress("SignOut")} style={[styles.button, {backgroundColor: '#B7C42E'}]}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleOptionPress("DeleteAccount")} style={[styles.button, {backgroundColor: '#B7C42E'}]}>
        <Text style={styles.buttonText}>Delete Account</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, theme === "dark" ? styles.darkModal : styles.lightModal]}>
            {renderModalContent()}
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
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  button: {
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
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    margin: 20,
    padding: 20,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: "100%",
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    marginVertical: 10,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
  warningContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  warningText: {
    color: "red",
    marginLeft: 10,
  },
  darkBackground: {
    backgroundColor: "#222222",
  },
  lightBackground: {
    backgroundColor: "#ffffff",
  },
  darkInput: {
    color: "#ffffff",
    backgroundColor: "#333333",
  },
  lightInput: {
    color: "#000000",
    backgroundColor: "#ffffff",
  },
  darkModal: {
    backgroundColor: "#333333",
  },
  lightModal: {
    backgroundColor: "#ffffff",
  },
  darkText: {
    color: '#ffffff',
  },
  lightText: {
    color: '#000000',
  },
});

export default AccountManagementScreen;

