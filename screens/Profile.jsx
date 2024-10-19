import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, View, Button, Image, FlatList, ActivityIndicator, Modal, Pressable } from "react-native";
import { UserContext } from "../context/UserContext";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Font from "expo-font";
import { ThemeContext } from "../context/ThemeContext"; // Import ThemeContext
import LoadingScreen from "../components/LoadingScreen";

const Profile = () => {
  const { userData } = useContext(UserContext);
  const { theme } = useContext(ThemeContext); // Get the current theme
  const navigation = useNavigation();
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [modalVisible, setModalVisible] = useState(false); // Modal visibility state
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadFonts = async () => {
    await Font.loadAsync({
      "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
      "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    });
  };

  useEffect(() => {
    loadFonts().then(() => setFontsLoaded(true));

    setTimeout(() => setLoading(false), 2000);
  }, []);

  if (!fontsLoaded) {
    return (
      <LoadingScreen/>
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
  const handleImagePress = (imageUrl) => {
    setSelectedImage(imageUrl);
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme === "light" ? "white" : "#1e1e1e" }]}>
     <TouchableOpacity onPress={() => handleImagePress(userData.coverImageUrl)}>
        <Image
          source={{
            uri: userData.coverImageUrl
              ? userData.coverImageUrl
              : "https://iconerecife.com.br/wp-content/plugins/uix-page-builder/uixpb_templates/images/UixPageBuilderTmpl/default-cover-5.jpg",
          }}
          style={{ width: "100%", height: 160 }}
        />
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => navigation.navigate("EditProfile")}
      >
        <Ionicons name="pencil-outline" color={theme === "light" ? "black" : "black"} />
      </TouchableOpacity>
      
      <TouchableOpacity style={{marginBottom: 10}} onPress={() => handleImagePress(userData.profileImageUrl)}>
        <Image
          source={{
            uri: userData.profileImageUrl
              ? userData.profileImageUrl
              : "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg",
          }}
          style={[
            styles.profileImage,
            {
              borderColor: theme === "light" ? '#fff' : '#1E1D1E'  
            }
          ]}
        />
      </TouchableOpacity>
      <View style={styles.nameContainer}>
        <Text style={[styles.labelName, { color: theme === "light" ? "black" : "white" }]}>
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

      <Text style={[styles.labelBio, { color: theme === "light" ? "black" : "white" }]}>
        {userData.bio || "N/A"}
      </Text>
      <Text style={[styles.label, { color: theme === "light" ? "black" : "white" }]}>Your Reports</Text>
      <FlatList
        data={userData.reports}
        keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}  
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
        ListEmptyComponent={<Text style={{ color: theme === "light" ? "black" : "white" }}>No reports available</Text>}
      />

      {console.log(userData)}
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <Ionicons name="close" size={30} color="white" />
          </TouchableOpacity>
          <Image
            source={{ uri: selectedImage }}
            style={styles.fullImage}
            resizeMode="contain"
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
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
    fontFamily: "Poppins-Regular",
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
    top: -60,
    borderWidth: 10,
    borderRadius: 99,
    // marginBottom: 15,
    width: 150,
    height: 150,
    alignSelf: "center",
  },
  labelBio: {
    alignSelf: "center",
    fontFamily: "Poppins-Regular",
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
    backgroundColor: "white",
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
  reportImage: {
    width: "100%",
    height: 100,
    marginVertical: 5,
  },
  backBtn: {
    position: "absolute",
    width: 50,
    height: 50,
    backgroundColor: "#D9D9D9",
    borderRadius: 25,
    top: 60,
    left: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
  },
  fullImage: {
    width: "100%",
    height: "80%",
  },
});

export default Profile;
