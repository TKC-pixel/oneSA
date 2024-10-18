import { StyleSheet, Text, View } from "react-native";
import React, { useContext } from "react"; // Import useContext
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Welcome from "../screens/Welcome";
import ReportFeed from "../screens/ReportFeed"; // This will be the Reports component
import CreateProject from "../screens/CreateProject"; // Import CreateProject component
import Profile from "../screens/Profile";
import DebateRoom from "../screens/DebateRoom";
import { Ionicons } from "@expo/vector-icons";
import { UserContext } from "../context/UserContext"; // Import UserContext

const Tab = createBottomTabNavigator();

const HomeTabs = () => {
  const { userData } = useContext(UserContext); // Access userData from context

  // Safely access isMinister, defaulting to null if userData is not available
  const isMinister = userData?.isMinister;

  return (
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
              iconName = focused ? "add-circle" : "add-circle-outline"; // Change icon for Create Project
              break;
            case "Debate":
              iconName = focused ? "chatbubbles" : "chatbubbles-outline";
              break;
            case "Profile":
              iconName = focused ? "person" : "person-outline";
              break;
            default:
              iconName = "alert-circle"; // Fallback icon for unknown routes
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
        tabBarStyle: styles.tabBarStyle,
        tabBarItemStyle: styles.tabBarItemStyle,
        tabBarActiveBackgroundColor: "#696969",
        tabBarActiveTintColor: "#B7C42E",
      })}
    >
      <Tab.Screen
        name="Home"
        component={Welcome}
        options={{ headerShown: false }}
      />

      {isMinister === true ? (
        // If the user is a minister, show Create Project instead of Reports
        <Tab.Screen
          name="Create Project"
          component={CreateProject} // The component for creating projects
          options={{ headerShown: false }}
        />
      ) : isMinister === false ? (
        // If the user is not a minister, show the Reports tab
        <Tab.Screen
          name="Reports"
          component={ReportFeed} // The existing Reports component
          options={{ headerShown: false }}
        />
      ) : (
        // If isMinister is null (e.g., user logged out), show a fallback
        <Tab.Screen
          name="Login" // Redirect to a Login or another appropriate component
          component={Welcome} // Replace with your Login component
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
    paddingVertical: 10,
    margin: 10,
    borderRadius: 23,
  },
});
