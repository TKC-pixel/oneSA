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
    <SafeAreaView style={{ backgroundColor: "white", flex: 1 }}>
      <Image
        source={require("../assets/images/logo.jpg")}
        style={styles.logo}
      />
      <View
        style={{ alignItems: "center", marginBottom: "5%", marginTop: "5%" }}
      >
        <Text style={{ fontWeight: "bold", fontSize: 25 }}>
          Welcome to OneSA
        </Text>
        <Text style={{ width: "80%", fontSize: 20, textAlign: "center" }}>
          Sign up or log in now to make your voice heard and drive real change.
        </Text>
      </View>
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
            autoComplete={false}
            autoCorrect={false}
          />
          <Ionicons
            size={20}
            name={seePassword ? "eye-off-outline" : "eye-outline"}
            onPress={passwordVisibility}
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
        <View style={{marginTop: '5%'}}>
          <Pressable style={{marginBottom: '5%'}}>
            <Text style={styles.signupText}>
              Continue with Apple
            </Text>
          </Pressable>
          <Pressable style={{marginBottom: '5%'}}>
            <Text style={styles.signupText}>
              Continue with Google
            </Text>
          </Pressable>
          <Pressable>
            <Text style={styles.signupText}>
              Continue with Phone
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: "5%",
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
  logo: {
    height: "20%",
    width: "100%",
    alignSelf: "center",
  },
  forgotPassword: {
    marginRight: "60%",
    marginBottom: "5%",
    textDecorationLine: "underline",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  PasswordEntryBox: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
  },
  eyeIcon: {
    marginLeft: 10,
  },
  passwordInput: {
    flex: 1,
    paddingRight: 15,
  },
});

export default LoginScreen;
