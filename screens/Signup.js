import { StyleSheet, Text, View } from "react-native";
import React from "react";
import SignUpForm from "../components/SignUpForm";

const Signup = () => {
  return (
    <View style={styles.container}>
      <SignUpForm />
    </View>
  );
};

export default Signup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
