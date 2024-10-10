import React, { useContext } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import { UserContext } from "../context/UserContext";
import { useNavigation } from "@react-navigation/native";

const Profile = () => {
  const { userData } = useContext(UserContext);
  const navigation = useNavigation();

  if (!userData) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>No user data available</Text>
        <Button
          title="Go to Home"
          onPress={() => navigation.navigate("Home")}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.label}>Name: {userData.name || "N/A"}</Text>
      <Text style={styles.label}>Surname: {userData.surname || "N/A"}</Text>
      <Text style={styles.label}>Email: {userData.email || "N/A"}</Text>
      <Text style={styles.label}>Phone: {userData.phone || "N/A"}</Text>
      <Text style={styles.label}>Bio: {userData.bio || "N/A"}</Text>
      <Text style={styles.label}>
        Verified: {userData.isVerified ? "Yes" : "No"}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "white",
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginVertical: 5,
  },
});

export default Profile;
