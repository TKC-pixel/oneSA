import React, { useContext } from "react";
import { StyleSheet, Text, View, Button, Image } from "react-native";

import { UserContext } from "../context/UserContext";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

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
    <SafeAreaView style={styles.container}>
      <Image
        source={{
          uri: userData.coverImageUrl
            ? userData.coverImageUrl
            : "https://iconerecife.com.br/wp-content/plugins/uix-page-builder/uixpb_templates/images/UixPageBuilderTmpl/default-cover-5.jpg",
        }}
        style={{ width: "100%", height: 160 }}
      />
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => navigation.navigate("EditProfile")}
      >
        <Ionicons name="pencil-outline" />
      </TouchableOpacity>
      <Image
        source={{
          uri: userData.profileImageUrl
            ? userData.profileImageUrl
            : "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg",
        }}
        style={styles.profileImage}
      />
      <Text style={styles.labelName}>
        {userData.name} {userData.surname}
      </Text>
      <Text style={styles.labelBio}>{userData.bio || "N/A"}</Text>
      <Text style={styles.label}>Email: {userData.email || "N/A"}</Text>
      <Text style={styles.label}>Phone: {userData.phone || "N/A"}</Text>
      <Text style={styles.label}>
        Verified: {userData.isVerified ? "Yes" : "No"}
      </Text>
      {console.log(userData)}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
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
  labelName: {
    fontSize: 25,
    marginVertical: 5,
    alignSelf: "center",
    marginTop: 100,
    fontWeight: "bold",
  },
  profileImage: {
    position: "absolute",
    top: 120,
    borderWidth: 10,
    borderColor: "white",
    borderRadius: 99,
    width: 150,
    height: 150,
    alignSelf: "center",
  },
  labelBio: {
    alignSelf: "center",
  },
  editButton: {
    position: "absolute",
    right: 0,
    top: 150,
    justifyContent: "center",
    alignItems: "center",
    width: 30,
    height: 30,
    marginRight: 20,
    backgroundColor: "white",
    borderRadius: 10,
  },
});

export default Profile;
