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
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "@firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from "react-native-safe-area-context";

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
const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsub();
  }, [auth]);

  const handleAuthentication = async () => {
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        alert("Login successful");
        navigation.navigate("Welcome");
      }
    } catch (error) {
      alert("Authentication failed");
    }
  };
  return (
    <SafeAreaView style={{backgroundColor: 'white', flex: 1}}>
        <Image source={require('../assets/images/logo.jpg')} style={styles.logo}/>
        <View style={{alignItems: 'center', marginBottom: '5%', marginTop: '5%'}}>
          <Text style={{fontWeight: 'bold', fontSize: '25%'}}>Welcome to OneSA</Text>
          <Text style={{width: '80%', fontSize: '20%', textAlign: 'center'}}>Sign up or log in now to make your voice heard and drive real change.</Text>
        </View>
        <View style={styles.container}> 
          <Text style={styles.title}>Login</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Pressable>
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
        </View>
  </SafeAreaView>
    
  );
};

const styles = StyleSheet.create({
  container: {
    padding: '5%',
    alignItems: 'center',
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
    marginTop: 20
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
  logo:{
    height: '20%',
    width: '100%',
    alignSelf: 'center'
  },
  forgotPassword:{
    marginRight: '60%',
    marginBottom: '5%',
    textDecorationLine: 'underline',
  }
});

export default LoginScreen;
