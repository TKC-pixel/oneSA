import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import MinisterDetail from "../screens/MinisterDetails";
import MinisterScreen from "../screens/MinisterScreen";
import Profile from "../screens/Profile";
import ReportFeed from "../screens/ReportFeed";

const Drawer = createDrawerNavigator();

const DrawerNav = () => {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Feed" component={Profile} />
      <Drawer.Screen name="Article" component={ReportFeed} />
    </Drawer.Navigator>
  );
};

export default DrawerNav;

const styles = StyleSheet.create({});
