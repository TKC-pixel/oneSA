import { StyleSheet, Text, View, Platform } from "react-native";
import React, { useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Welcome from "../screens/Welcome";
import ReportFeed from "../screens/ReportFeed";
import CreateProject from "../screens/CreateProject";
import Profile from "../screens/Profile";
import DebateRoom from "../screens/DebateRoom";
import { Ionicons } from "@expo/vector-icons";
import { UserContext, UserProvider } from "../context/UserContext";
import { ThemeContext } from "../context/ThemeContext"; // Import ThemeContext

const Tab = createBottomTabNavigator();

const HomeTabs = () => {
  const { userData } = useContext(UserContext);
  const { theme } = useContext(ThemeContext); // Access theme from ThemeContext

  const isMinister = userData?.isMinister;

  // Define theme-specific styles
  const themedStyles = theme === "dark" ? styles.dark : styles.light;

  return (
    <UserProvider>
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size, focused }) => {
          let iconName;
          switch (route.name) {
            case "Home":
              iconName = focused ? "home" : "home-outline";
              break;
            case "Reports":
              iconName = focused ? "document-text" : "document-text-outline";
              break;
            case "Create Project":
              iconName = focused ? "add-circle" : "add-circle-outline";
              break;
            case "Debate":
              iconName = focused ? "chatbubbles" : "chatbubbles-outline";
              break;
            case "Profile":
              iconName = focused ? "person" : "person-outline";
              break;
            default:
              iconName = "alert-circle";
              break;
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarLabel: ({ children, color, focused }) => (
          <Text
            style={{
              fontSize: 10,
              color,
              fontWeight: focused ? "bold" : "normal",
            }}
          >
            {children}
          </Text>
        ),
        tabBarStyle: [styles.tabBarStyle, themedStyles.tabBarStyle],
        tabBarItemStyle: styles.tabBarItemStyle,
        tabBarActiveBackgroundColor: themedStyles.tabBarActiveBackgroundColor,
        tabBarActiveTintColor: themedStyles.tabBarActiveTintColor,
        tabBarInactiveTintColor: themedStyles.tabBarInactiveTintColor,
      })}
    >
      <Tab.Screen
        name="Home"
        component={Welcome}
        options={{ headerShown: false }}
      />

      {isMinister === true ? (
        <Tab.Screen
          name="Create Project"
          component={CreateProject}
          options={{ headerShown: false }}
        />
      ) : isMinister === false ? (
        <Tab.Screen
          name="Reports"
          component={ReportFeed}
          options={{ headerShown: false }}
        />
      ) : (
        <Tab.Screen
          name="Login"
          component={Welcome}
          options={{ headerShown: false }}
        />
      )}

      <Tab.Screen
        name="Debate"
        component={DebateRoom}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
    </UserProvider>
  );
};

export default HomeTabs;

const styles = StyleSheet.create({
  tabBarStyle: {
    height: 80,
    position: "absolute",
    bottom: 10,
    left: 20,
    right: 20,
    borderRadius: 23,
    borderTopWidth: 0,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
  },
  tabBarItemStyle: {
    paddingVertical: Platform.OS === 'ios'? 0 : 10,
    margin: 10,
    borderRadius: 23,
  },
  light: {
    tabBarStyle: {
      backgroundColor: "#FFFFFF", // Light background
    },
    tabBarActiveBackgroundColor: "#E0E0E0", // Light active background
    tabBarActiveTintColor: "#000000", // Active tab icon color
    tabBarInactiveTintColor: "#7A7A7A", // Inactive tab icon color
  },
  dark: {
    tabBarStyle: {
      backgroundColor: "#000000", // Dark background
    },
    tabBarActiveBackgroundColor: "#333333", // Dark active background
    tabBarActiveTintColor: "#B7C42E", // Active tab icon color in dark mode
    tabBarInactiveTintColor: "#FFFFFF", // Inactive tab icon color
  },
});
