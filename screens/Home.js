import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  Pressable,
} from "react-native";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "@firebase/auth";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Constants from 'expo-constants';
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [seePassword, setSeePassword] = useState(false);
  const [secureText, setSecureText] = useState(true);
  const togglePassword = () => setSeePassword(!seePassword);
  const passwordVisibility = () => {
    togglePassword();
    setSecureText(!secureText);
  };

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
        navigation.navigate("Welcome");
      }
    });
    return () => unsub();
  }, [auth, navigation]);

  const handleAuthentication = async () => {
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.navigate("Welcome");
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <View style={styles.PasswordEntryBox}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={secureText}
            autoCapitalize="none"
            autoComplete="off"
            autoCorrect={false}
          />
          <Ionicons
            size={20}
            name={seePassword ? "eye-off-outline" : "eye-outline"}
            onPress={passwordVisibility}
            style={styles.eyeIcon}
          />
        </View>
        <Pressable onPress={() => navigation.navigate("Forgot")}>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </Pressable>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleAuthentication}
        >
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.signupButton}
          onPress={() => navigation.navigate("Signup")}
        >
          <Text style={styles.signupText}>Don't have an account? Sign up</Text>
        </TouchableOpacity>
        <View style={styles.socialButtonsContainer}>
          <Pressable style={styles.socialButton}>
            <Text style={styles.socialButtonText}>Continue with Apple</Text>
          </Pressable>
          <Pressable style={styles.socialButton}>
            <Text style={styles.socialButtonText}>Continue with Google</Text>
          </Pressable>
          <Pressable style={styles.socialButton}>
            <Text style={styles.socialButtonText}>Continue with Phone</Text>
          </Pressable>
        </View>
      </View>
      <TouchableOpacity onPress={clearOnboarding}>
      <Text style={styles.buttonText}>Clear Onboarding</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "white",
    flex: 1,
  },
  logo: {
    height: 120,
    width: "100%",
    alignSelf: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 20, 
    marginTop: 20, 
  },
  headerTitle: {
    fontWeight: "bold",
    fontSize: 25,
  },
  headerSubtitle: {
    width: width - 40,
    fontSize: 20,
    textAlign: "center",
  },
  container: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "white",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 40,
    textAlign: "center",
  },
  input: {
    width: width - 40,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 35,
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
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  signupButton: {
    marginTop: 10,
  },
  signupText: {
    color: "#B7C42E",
    fontSize: 16,
  },
  forgotPassword: {
    marginRight: width - 220, 
    marginBottom: 20,
    textDecorationLine: "underline",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
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
  },
  eyeIcon: {
    marginLeft: 10,
  },
  socialButtonsContainer: {
    marginTop: 20, // Adjusted from 5%
  },
  socialButton: {
    marginBottom: 15, // Adjusted from 5%
  },
  socialButtonText: {
    color: "#B7C42E",
    fontSize: 16,
  },
});

export default LoginScreen;
