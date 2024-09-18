import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Pressable,
  Image,
  ScrollView,
} from "react-native";
import { CheckBox } from "@rneui/themed";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "@firebase/auth";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
const auth = getAuth(app);

const Signup = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [surname, setSurname] = useState("");
  const [cPassword, setCPassword] = useState("");
  const [user, setUser] = useState(null);
  const [checked, setChecked] = useState(false);
  const navigation = useNavigation();
  const [seePassword, setSeePassword] = useState(false);
  const [secureText, setSecureText] = useState(true);

  const toggleCheckbox = () => setChecked(!checked);
  const togglePassword = () => setSeePassword(!seePassword);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsub();
  }, []);

  const passwordVisibility = () => {
    togglePassword();
    setSecureText(!secureText);
  };

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
        await AsyncStorage.setItem("user", JSON.stringify({ email }));
        alert("Registration successful");
        navigation.navigate("Home");
      } catch (error) {
        alert("Registration failed! Try again.");
      }
    } else {
      alert("Please fill all fields and make sure passwords match.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Sign up</Text>
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 20,
  },
  logo: {
    height: "20%",
    width: "100%",
    alignSelf: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: "5%",
    marginTop: "5%",
  },
  headerTitle: {
    fontWeight: "bold",
    fontSize: 25,
  },
  headerSubtitle: {
    width: "80%",
    fontSize: 20,
    textAlign: "center",
  },
  formContainer: {
    alignItems: "center",
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
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  checkboxText: {
    width: "60%",
    marginTop: 3,
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

export default Signup;
