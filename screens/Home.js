import { StyleSheet, Text, View } from "react-native";
import React from "react";
import LoginForm from "../components/LoginForm";

const Home = () => {
  return (
    <View style={styles.container}>
      <LoginForm />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
