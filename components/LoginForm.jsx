import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  useWindowDimensions,
  Pressable,
} from "react-native";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Font from "expo-font";
import { useNavigation } from "@react-navigation/native";
import { db, auth } from "../FIrebaseConfig"; // Ensure the path is correct
import { collection, addDoc, doc, setDoc, getDoc } from "firebase/firestore"; // Import Firestore functions

const { width } = Dimensions.get("window");

const LoginForm = () => {
  const navigation = useNavigation();
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [seePassword, setSeePassword] = useState(false);
  const [secureText, setSecureText] = useState(true);
  const { width } = useWindowDimensions();

  const togglePassword = () => setSeePassword(!seePassword);
  const passwordVisibility = () => {
    togglePassword();
    setSecureText(!secureText);
  };

  const loadFonts = async () => {
    await Font.loadAsync({
      "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
      "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    });
    setFontsLoaded(true);
  };

  useEffect(() => {
    loadFonts();
  }, []);

  const clearOnboarding = async () => {
    try {
      await AsyncStorage.removeItem("@viewedOnboarding");
    } catch (error) {
      console.log("Error @Onboarding: ", error);
    }
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigation.navigate("Dashboard");
      }
    });
    return () => unsub();
  }, [auth, navigation]);

  const logLoginEvent = async (userId) => {
    try {
      const userRef = doc(db, "Users", userId);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        // Add user to "Users" collection if they don't exist
        await setDoc(userRef, {
          uid: userId,
          email: email, // you can add more user fields here if needed
        });
      }

      // Log the login event
      await addDoc(collection(db, "loginHistory"), {
        userId: userId,
        timestamp: new Date().toISOString(), // Log the time of login
      });
    } catch (error) {
      console.error("Error logging login event: ", error);
    }
  };

  const handleAuthentication = async () => {
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Log the login event and store user UID if new
      await logLoginEvent(user.uid);

      await AsyncStorage.setItem("isLoggedIn", "true");
      setError("");
      navigation.navigate("Dashboard");
    } catch (error) {
      switch (error.code) {
        case "auth/invalid-email":
          setError("Invalid email address.");
          break;
        case "auth/user-not-found":
          setError("No user found with this email.");
          break;
        case "auth/wrong-password":
          setError("Incorrect password.");
          break;
        default:
          setError("Authentication failed. Please try again.");
      }
    }
  };

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <View style={styles.PasswordEntryBox}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={secureText}
            autoCapitalize="none"
          />
          <Ionicons
            size={20}
            name={seePassword ? "eye-off-outline" : "eye-outline"}
            onPress={passwordVisibility}
            style={styles.eyeIcon}
          />
        </View>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleAuthentication}
        >
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>
        <Pressable onPress={() => navigation.navigate("Forgot")}>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </Pressable>
      </View>
      <TouchableOpacity
        style={styles.clearOnboarding}
        onPress={clearOnboarding}
      >
        <Text style={styles.loginText}>Clear Onboarding</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "white",
    flex: 1,
    paddingTop: 30,
  },
  container: {
    alignItems: "center",
    backgroundColor: "white",
  },
  input: {
    width: width - 40,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    fontFamily: "Poppins-Regular", // Apply font to TextInput
  },
  loginButton: {
    width: width - 40,
    backgroundColor: "#B7C42E",
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
    marginTop: 20,
  },
  loginText: {
    fontFamily: "Poppins-Bold",
    color: "white",
    fontSize: 16,
  },
  forgotPassword: {
    marginRight: width - 220,
    marginBottom: 20,
    textDecorationLine: "underline",
    fontFamily: "Poppins-Regular",
    marginLeft: -80,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    fontFamily: "Poppins-Regular",
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
  eyeIcon: {
    marginLeft: 10,
  },
  clearOnboarding: {
    backgroundColor: "#B7C42E",
    justifyContent: "center",
    alignItems: "center",
    width: 150,
    height: 50,
    borderRadius: 10,
    alignSelf: "center",
  },
});

export default LoginForm;
