import { ActivityIndicator, StyleSheet, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./screens/Home";
import Onboarding from "./screens/Onboarding";
import Signup from "./screens/Signup";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import SignUp from "./components/SignUp";
import Welcome from "./screens/Welcome";
import ReportScreen from "./screens/ReportScreen";
import ReportInfo from "./screens/ReportInfo";
import Forgot from "./screens/Forgot";
import MinisterScreen from "./screens/MinisterScreen";
import BudgetScreen from "./screens/BudgetScreen";
import SuccessRateScreen from "./screens/SuccessRateScreen";
import ProjectsPages from "./screens/ProjectsPages";
import MinisterDetail from "./screens/MinisterDetails";
import HomeTabs from "./navigators/HomeTabs";
import Settings from "./screens/Settings";
import HelpCentre from "./screens/HelpCentre";
import AppInfo from "./screens/AppInfo";
import RateTheApp from "./screens/RateTheApp";

const Stack = createNativeStackNavigator();

const Loading = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
    </View>
  );
};

export default function App() {
  const [loading, setLoading] = useState(true);
  const [viewedOnboarding, setViewedOnboarding] = useState(false);

  const checkOnboarding = async () => {
    try {
      const value = await AsyncStorage.getItem("@viewedOnboarding");
      if (value !== null) {
        setViewedOnboarding(true);
      }
    } catch (err) {
      console.log("Error @checkOnboarding: ", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkOnboarding();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={viewedOnboarding ? "SignUp" : "Onboarding"}
      >
        <Stack.Screen
          name="Onboarding"
          component={Onboarding}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUp}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Dashboard"
          component={HomeTabs}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Home"
          options={{ headerShown: false }}
          component={Home}
        />
        <Stack.Screen
          name="Signup"
          options={{ headerShown: false }}
          component={Signup}
        />
        <Stack.Screen
          name="Welcome"
          options={{ headerShown: false }}
          component={Welcome}
        />
        <Stack.Screen
          name="Report"
          options={{ headerShown: false }}
          component={ReportScreen}
        />
        <Stack.Screen
          name="ReportInfo"
          options={{ headerShown: false }}
          component={ReportInfo}
        />
        <Stack.Screen
          name="Forgot"
          options={{ headerShown: false }}
          component={Forgot}
        />
        <Stack.Screen
          name="MinisterScreen"
          options={{ headerShown: false }}
          component={MinisterScreen}
        />
        <Stack.Screen
          name="Projects"
          options={{ headerShown: false }}
          component={ProjectsPages}
        />
        <Stack.Screen
          name="Budget"
          options={{ headerShown: false }}
          component={BudgetScreen}
        />
        <Stack.Screen
          name="SuccessRate"
          options={{ headerShown: false }}
          component={SuccessRateScreen}
        />
        <Stack.Screen
          name="Settings"
          options={{ headerShown: false }}
          component={Settings}
        />
        <Stack.Screen
          name="HelpCenter"
          options={{ headerShown: false }}
          component={HelpCentre}
        />
        <Stack.Screen
          name="MinisterDetails"
          options={{ headerShown: false }}
          component={MinisterDetail}
        />
        <Stack.Screen
          name="AppInfo"
          options={{ headerShown: false }}
          component={AppInfo}
        />
        <Stack.Screen
          name="RateTheApp"
          options={{ headerShown: false }}
          component={RateTheApp}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
