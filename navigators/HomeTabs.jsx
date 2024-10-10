import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Welcome from "../screens/Welcome";
import BudgetScreen from "../screens/BudgetScreen";
import ReportFeed from "../screens/ReportFeed";
import Profile from "../screens/Profile";
import DebateRoom from "../screens/DebateRoom";
import { Ionicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

const HomeTabs = () => {
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
            case "Debate":
              iconName = focused ? "chatbubbles" : "chatbubbles-outline";
              break;
            case "Profile":
              iconName = focused ? "person" : "person-outline";
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
        // tabBarInactiveBackgroundColor: "#0007",
      })}
    >
      <Tab.Screen
        name="Home"
        component={Welcome}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Reports"
        component={ReportFeed}
        options={{ headerShown: false }}
      />
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
    // backgroundColor: "#fffffff",
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
