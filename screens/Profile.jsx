import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, View, Button, Image, FlatList, ActivityIndicator } from "react-native";
import { UserContext } from "../context/UserContext";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Font from "expo-font";

const Profile = () => {
  const { userData } = useContext(UserContext);
  const navigation = useNavigation();
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const loadFonts = async () => {
    await Font.loadAsync({
      "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
      "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    });
  };

  useEffect(() => {
    loadFonts().then(() => setFontsLoaded(true));
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

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
  const handlePress = (item) => {
    navigation.navigate('UserReportDetails', { item });
  };
  

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
     <View style={styles.nameContainer}>
  <Text style={styles.labelName}>
    {userData.name} {userData.surname}
  </Text>
  {userData && (
    <>
      {userData.isMinister ? (
        <Ionicons
          name="checkmark-circle"
          size={20}
          color="green"
          style={styles.verifiedIcon}
        />
      ) : userData.isVerified ? (
        <Ionicons
          name="checkmark-circle"
          size={20}
          color="#1D9BF0"
          style={styles.verifiedIcon}
        />
      ) : null}
    </>
  )}
</View>

      <Text style={styles.labelBio}>{userData.bio || "N/A"}</Text>
      <Text style={styles.label}>Your Reports</Text>
      <FlatList
  data={userData.reports}
  keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}  // Use `id` if it exists, otherwise use the index
  renderItem={({ item }) => (
    <View style={styles.reportContainer}>
      {item.projectImage ? (
        <TouchableOpacity onPress={() => handlePress(item)}>
          <Image
            source={{ uri: item.projectImage }}
            style={styles.reportImage}
          />
        </TouchableOpacity>
      ) : (
        <Text>No Image Available</Text>
      )}
    </View>
  )}
  ListEmptyComponent={<Text>No reports available</Text>}
/>



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
    fontFamily: "Poppins-Regular"
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  labelName: {
    fontSize: 25,
    marginVertical: 5,
    fontFamily: "Poppins-Bold",
    marginTop: 80,
  },
  verifiedIcon: {
    marginLeft: 5,
    marginTop: 71,
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
    fontFamily: "Poppins-Regular"
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
  reportContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 3,
  },
  reportDescription: {
    fontWeight: "bold",
  },
  reportLocation: {
    color: "gray",
  },
  reportStatus: {
    color: "blue",
  },
  reportImage: {
    width: "100%",
    height: 100,
    marginVertical: 5,
  },
  additionalComments: {
    color: "gray",
  },
});

export default Profile;
