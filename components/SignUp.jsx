import { View, Text, StyleSheet, Dimensions, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import LoginScreen from "../screens/Home";
import Signup from "../screens/Signup";

const { width } = Dimensions.get("window");

const LoginOrSignUp = () => {
  const Tab = createMaterialTopTabNavigator();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.LoginOrSignUp}>
        <Image
          source={require("../assets/images/logo.jpg")}
          style={styles.logo}
        />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Welcome to OneSA</Text>
          <Text style={styles.headerSubtitle}>
            Sign up or log in now to make your voice heard and drive real
            change.
          </Text>
        </View>
      </View>
      <Tab.Navigator
        screenOptions={{
          tabBarIndicatorStyle: { backgroundColor: "#B7C42E" }, // Color of the indicator line
        }}
      >
        <Tab.Screen name="Log In" component={LoginScreen} />
        <Tab.Screen name="Sign Up" component={Signup} />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 20,
  },
  logo: {
    height: 77,
    width: 232,
    alignSelf: "center",
    padding: 15,
  },
  header: {
    alignItems: "center",
    marginBottom: "5%",
  },
  headerTitle: {
    fontWeight: "bold",
    fontSize: 25,
    marginBottom: 15
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
  LoginOrSignUp: {
    height: 170,
  },
});

export default LoginOrSignUp;

// <TouchableOpacity
// onPress={() => navigation.navigate("Home")}
// style={styles.button}
// >
// <Text style={styles.buttonText}>Log In</Text>
// </TouchableOpacity>
// <TouchableOpacity
// onPress={() => navigation.navigate("Signup")}
// style={styles.button}
// >
// <Text style={styles.buttonText}>Sign Up</Text>
// </TouchableOpacity>
// <TouchableOpacity onPress={() => navigation.navigate("Onboarding")} style={styles.button}>
// <Text style={styles.buttonText}>Clear Onboarding</Text>
// </TouchableOpacity>

// //////////////////
const clearOnboarding = async () => {
  try {
    await AsyncStorage.removeItem("@viewedOnboarding");
  } catch (error) {
    console.log("Error @Onboarding: ", error);
  }
};
