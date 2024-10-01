import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { CheckBox } from "@rneui/themed";
import { auth, db } from "../FirebaseConfig";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";

import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import * as Font from "expo-font";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

const { width } = Dimensions.get("window");

const SignUpForm = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [surname, setSurname] = useState("");
  const [cPassword, setCPassword] = useState("");
  const [checked, setChecked] = useState(false);
  const [seePassword, setSeePassword] = useState(false);
  const [secureText, setSecureText] = useState(true);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [ministerID, setMinisterID] = useState("");
  const [ministerChecked, setMinisterChecked] = useState(false);
  const [isMinister, setIsMinister] = useState(false);
  const [ministerError, setMinisterError] = useState("");
  const navigation = useNavigation();

  const toggleCheckbox = () => setChecked(!checked);
  const togglePassword = () => setSeePassword(!seePassword);
  const toggleMinister = () => setIsMinister(!isMinister);

  const passwordVisibility = () => {
    togglePassword();
    setSecureText(!secureText);
  };

  const validateMinisterID = async (id) => {
    const ministerDocRef = doc(db, "ministers", id);
    const ministerDoc = await getDoc(ministerDocRef);
    return ministerDoc.exists();
  };

  const handleAuthentication = async () => {
    // Validate the form inputs
    if (
      email &&
      name &&
      password &&
      cPassword &&
      phone &&
      surname &&
      password === cPassword
    ) {
      if (isMinister) {
        if (!ministerID) {
          setMinisterError("Minister ID is required for minister signups.");
          return;
        }

        // Check if the Minister ID exists in the Firestore database
        const ministerExists = await validateMinisterID(ministerID);
        if (!ministerExists) {
          setMinisterError("Invalid Minister ID.");
          return;
        }
      }

      try {
        await createUserWithEmailAndPassword(auth, email, password);
        await AsyncStorage.setItem("user", JSON.stringify({ email }));
        await addDoc(collection(db, "Users"), {
          name,
          surname,
          bio: null,
          profilePic: null,
          coverPic: null,
          email,
          phone,
          favorites: null,
          isVerified: false,
          reports: [
            {
              projectName: null,
              projectImage: null,
              projectStatus: null,
              description: null,
              location: null,
              additionalComments: null,
            },
          ],
        });

        alert("Registration successful");
        navigation.navigate("Home");
      } catch (error) {
        alert("Registration failed! Try again.");
      }
    } else {
      alert("Please fill all fields and make sure passwords match.");
    }
  };

  const loadFonts = async () => {
    await Font.loadAsync({
      "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
      "Poppins-BlackItalic": require("../assets/fonts/Poppins-BlackItalic.ttf"),
      "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
      "Poppins-BoldItalic": require("../assets/fonts/Poppins-BoldItalic.ttf"),
      "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
      "Poppins-ExtraBoldItalic": require("../assets/fonts/Poppins-ExtraBoldItalic.ttf"),
      "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
      "Raleway-Italic-VariableFont_wght": require("../assets/fonts/Raleway-Italic-VariableFont_wght.ttf"),
      "Raleway-VariableFont_wght": require("../assets/fonts/Raleway-VariableFont_wght.ttf"),
      "Raleway-ExtraBold": require("../assets/fonts/Raleway-ExtraBold.ttf"),
    });
  };

  useEffect(() => {
    loadFonts().then(() => setFontsLoaded(true));
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) navigation.navigate("Home");
    });
    return () => unsub();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.formContainer}>
        <TextInput
          placeholder="Enter name"
          style={styles.input}
          value={name}
          onChangeText={setName}
        />
        <TextInput
          placeholder="Enter surname"
          style={styles.input}
          value={surname}
          onChangeText={setSurname}
        />
        <TextInput
          placeholder="Enter phone"
          style={styles.input}
          value={phone}
          keyboardType="number-pad"
          onChangeText={setPhone}
        />
        {isMinister && (
          <TextInput
            placeholder="Enter Minister ID"
            style={styles.input}
            value={ministerID}
            onChangeText={(text) => {
              setMinisterID(text);
              setMinisterError("");
            }}
          />
        )}
        {ministerError ? (
          <Text style={styles.errorText}>{ministerError}</Text>
        ) : null}
        <TextInput
          placeholder="Enter email"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
        />
        <View style={styles.PasswordEntryBox}>
          <TextInput
            placeholder="Create password"
            secureTextEntry={secureText}
            style={styles.passwordInput}
            value={password}
            onChangeText={setPassword}
          />
          <Ionicons
            size={20}
            name={seePassword ? "eye-off-outline" : "eye-outline"}
            onPress={passwordVisibility}
          />
        </View>
        <View style={styles.PasswordEntryBox}>
          <TextInput
            placeholder="Confirm password"
            secureTextEntry={secureText}
            style={styles.passwordInput}
            value={cPassword}
            onChangeText={setCPassword}
          />
          <Ionicons
            size={20}
            name={seePassword ? "eye-off-outline" : "eye-outline"}
            onPress={passwordVisibility}
          />
        </View>
        <View style={styles.checkboxContainer}>
          <CheckBox
            checked={checked}
            onPress={toggleCheckbox}
            iconType="material-community"
            checkedIcon="checkbox-marked"
            uncheckedIcon="checkbox-blank-outline"
            checkedColor="#B7C42E"
          />
          <Text style={styles.checkboxText}>
            I agree to the Terms & Conditions and Privacy Policy.
          </Text>
        </View>
        <Pressable style={styles.loginButton} onPress={handleAuthentication}>
          <Text style={styles.loginText}>Sign Up</Text>
        </Pressable>
        <View style={styles.checkboxContainer}>
          <CheckBox
            checked={isMinister}
            onPress={toggleMinister}
            iconType="material-community"
            checkedIcon="checkbox-marked"
            uncheckedIcon="checkbox-blank-outline"
            checkedColor="#B7C42E"
          />
          <Text style={styles.checkboxText}>Are you a Minister?</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SignUpForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  formContainer: {
    alignItems: "center",
  },
  input: {
    width: width - 40,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    fontFamily: "Poppins-Regular",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: -50,
  },
  checkboxText: {
    fontFamily: "Poppins-Regular",
  },
  loginButton: {
    width: width - 40,
    backgroundColor: "#B7C42E",
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  loginText: {
    color: "white",
    fontSize: 16,
    // fontWeight: "bold",
    fontFamily: "Poppins-Bold",
  },
  PasswordEntryBox: {
    flexDirection: "row",
    alignItems: "center",
    width: width - 40,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
  },
  passwordInput: {
    flex: 1,
    paddingRight: 15,
    fontFamily: "Poppins-Regular",
  },
});
