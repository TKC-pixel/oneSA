import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  Pressable,
} from "react-native";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "@firebase/auth";
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
const auth = getAuth(app);
const Signup = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [surname, setSurname] = useState("");
  const [cPassword, setCPassword] = useState("");
  const [user, setUser] = useState(null);
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsub();
  }, [auth]);

  const handleAuthentication = async () => {
    if (
      email &&
      name &&
      password &&
      cPassword &&
      phone &&
      password === cPassword
    ) {
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        alert("Registration successful");
      } catch (error) {
        alert("Registration failed! Try again.");
      }
    } else {
      alert("Please fill all fields and make sure passwords match.");
    }
  };
  return (
    <SafeAreaView>
      <View>
        <Text style={styles.title}>Sign up</Text>
        <View style={{ justifyContent: "space-between", marginBottom: "20%" }}>
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
            onChangeText={setPhone}
          />
          <TextInput
            placeholder="Enter email"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            placeholder="Create password"
            secureTextEntry={true}
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />
          <TextInput
            placeholder="Confirm password"
            secureTextEntry={true}
            style={styles.input}
            value={cPassword}
            onChangeText={setCPassword}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Pressable style={styles.loginButton} onPress={handleAuthentication}>
            <Text style={styles.loginText}>Sign Up</Text>
          </Pressable>
          <TouchableOpacity
            style={styles.signupButton}
            onPress={() => navigation.navigate("Home")}
          >
            <Text style={styles.signupText}>
              Already have an account? Sign in
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: width - 40,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
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
    fontWeight: "bold",
  },
  signupButton: {
    marginTop: 10,
  },
  signupText: {
    color: "#B7C42E",
    fontSize: 16,
  },
});

export default Signup;
