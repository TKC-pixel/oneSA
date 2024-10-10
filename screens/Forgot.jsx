import {
  View,
  Text,
  SafeAreaView,
  Image,
  StyleSheet,
  TextInput,
  Pressable,
  Alert,
} from "react-native";
import { initializeApp } from "firebase/app";
import { getAuth, sendPasswordResetEmail } from "@firebase/auth";
import { useState } from "react";

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

export default function Forgot() {
  const [email, setEmail] = useState("");

  const handleEmailChange = (text) => {
    setEmail(text);
  };

  const ForgotPass = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        Alert.alert("Success", "Password reset email sent successfully");
      })
      .catch((error) => {
        Alert.alert(
          "Error",
          "Error sending password reset email: " + error.message
        );
      });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <Image
          source={require("../assets/images/logo.jpg")}
          style={styles.logo}
        />
        <Text style={styles.headerText}>Forgot Password</Text>
        <Image
          source={{
            uri: "https://as1.ftcdn.net/v2/jpg/04/92/75/18/1000_F_492751838_Ybun2zwpQC8AZv11AwZLdXJk4cUrTt5z.jpg",
          }}
          style={styles.bannerImage}
        />
        <TextInput
          placeholder="Enter your email"
          placeholderTextColor={"#666"}
          style={styles.input}
          onChangeText={handleEmailChange}
          value={email}
          keyboardType="email-address"
        />
        <Pressable
          style={styles.loginButton}
          onPress={() => {
            if (email.trim() !== "") {
              ForgotPass();
            } else {
              Alert.alert("Error", "Please enter a valid email address");
            }
          }}
        >
          <Text style={styles.loginButtonText}>Send Reset Link</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  logo: {
    height: 100,
    width: 100,
    alignSelf: "center",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
  },
  bannerImage: {
    height: 200,
    width: "100%",
    marginTop: 40,
    marginBottom: 40,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    width: "80%",
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: "#B7C42E",
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
    width: "80%",
  },
  loginButtonText: {
    color: "white",
    fontSize: 16,
  },
});
