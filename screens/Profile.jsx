import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  FlatList,
  ActivityIndicator,
  Modal,
  Pressable,
} from "react-native";
import { UserContext } from "../context/UserContext";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Font from "expo-font";
import { ThemeContext } from "../context/ThemeContext"; // Import ThemeContext
import LoadingScreen from "../components/LoadingScreen";
import { db } from "../FIrebaseConfig";
import { getDoc, doc, collection } from "firebase/firestore";

const Profile = () => {
  const { userData } = useContext(UserContext);
  const { theme } = useContext(ThemeContext); // Get the current theme
  const navigation = useNavigation();
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [modalVisible, setModalVisible] = useState(false); // Modal visibility state
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userData.length > 0) {
      const ministerID = userData[0].ministerID; // Get ministerID from userData
      const fetchMinisterProjects = async () => {
        try {
          // Reference to the minister's document
          const ministerRef = doc(collection(db, "ministers"), ministerID);
          const ministerDoc = await getDoc(ministerRef); // Fetch the document using getDoc

          if (ministerDoc.exists()) {
            const ministerData = ministerDoc.data();

            // Check if the minister has any projects (or reports)
            if (ministerData?.ministerDepartment?.projects) {
              setProjects(ministerData.ministerDepartment.projects); // Set the fetched projects
            } else {
              setProjects([]); // If no projects are found, set an empty array
            }
          } else {
            console.log("No such minister document found!");
            setProjects([]); // If no document is found, set an empty array
          }
        } catch (err) {
          console.error("Error fetching minister's projects:", err);
          setError("Error loading projects."); // Set error state if there's an issue
        } finally {
          setLoading(false); // Ensure loading state is set to false after the fetch
        }
      };

      fetchMinisterProjects(); // Trigger the fetch when userData is available
    }
  }, [userData]);

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
    return <LoadingScreen />;
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
    navigation.navigate("UserReportDetails", { item });
  };
  const handleImagePress = (imageUrl) => {
    setSelectedImage(imageUrl);
    setModalVisible(true);
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme === "light" ? "white" : "#1e1e1e" },
      ]}
    >
      <TouchableOpacity
        onPress={() => handleImagePress(userData[0].coverImageUrl)}
      >
        <Image
          source={{
            uri: userData[0].coverImageUrl
              ? userData[0].coverImageUrl
              : "https://iconerecife.com.br/wp-content/plugins/uix-page-builder/uixpb_templates/images/UixPageBuilderTmpl/default-cover-5.jpg",
          }}
          style={{ width: "100%", height: 160 }}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.editButton}
        onPress={() => navigation.navigate("EditProfile")}
      >
        <Ionicons
          name="pencil-outline"
          color={theme === "light" ? "black" : "black"}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={{ marginBottom: 10 }}
        onPress={() => handleImagePress(userData[0].profileImageUrl)}
      >
        <Image
          source={{
            uri: userData[0].profileImageUrl
              ? userData[0].profileImageUrl
              : "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg",
          }}
          style={[
            styles.profileImage,
            {
              borderColor: theme === "light" ? "#fff" : "#1E1D1E",
            },
          ]}
        />
      </TouchableOpacity>
      <View style={styles.nameContainer}>
        <Text
          style={[
            styles.labelName,
            { color: theme === "light" ? "black" : "white" },
          ]}
        >
          {userData[0].name} {userData[0].surname}
        </Text>
        {userData && (
          <>
            {userData[0].isMinister ? (
              <Ionicons
                name="checkmark-circle"
                size={20}
                color="green"
                style={styles.verifiedIcon}
              />
            ) : userData[0].isVerified ? (
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

      <Text
        style={[
          styles.labelBio,
          { color: theme === "light" ? "black" : "white" },
        ]}
      >
        {userData[0].bio || "N/A"}
      </Text>
      {userData.length > 0 && userData[0].ministerID ? (
        <View>
          <Text
            style={[
              styles.label,
              {
                color: theme === "light" ? "black" : "white",
                paddingHorizontal: 18,
              },
            ]}
          >
            Ministerial Projects
          </Text>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={projects}
            keyExtractor={(item, index) =>
              item.id ? item.id.toString() : index.toString()
            }
            renderItem={({ item }) => (
              <View style={{ paddingHorizontal: 15, justifyContent: "center" }}>
                {console.log(item)}

                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("ProjectDetails", {
                      item,
                      isEditable: true,
                    })
                  }
                >
                  <Image
                    source={{
                      uri: item.imageUrl
                        ? item.imageUrl
                        : "https://img.freepik.com/premium-vector/flag-south-africa-all-country-flag_1177305-50.jpg?semt=ais_hybrid", // default image URL
                    }}
                    style={styles.reportImage}
                  />
                  <Text
                    style={{
                      color: theme === "light" ? "#000" : "#fff",
                      fontFamily: "Poppins-SemiBold",
                      width: 150,
                      textAlign: "center",
                    }}
                  >
                    {item.projectName}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            ListEmptyComponent={
              <Text
                style={{
                  color: theme === "light" ? "black" : "white",
                  fontFamily: "Poppins-Regular",
                }}
              >
                No reports available
              </Text>
            }
          />
        </View>
      ) : (
        <>
          <Text
            style={[
              styles.label,
              {
                color: theme === "light" ? "black" : "white",
                paddingHorizontal: 18,
              },
            ]}
          >
            Your Reports
          </Text>
          <FlatList
            horizontal
            data={userData.length > 0 ? userData[0].reports : []} // Ensure data is passed correctly
            keyExtractor={(item, index) =>
              item.id ? item.id.toString() : index.toString()
            }
            renderItem={({ item }) => (
              <View style={{ paddingHorizontal: 15 }}>
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
            ListEmptyComponent={
              <Text
                style={{
                  color: theme === "light" ? "black" : "white",
                  fontFamily: "Poppins-Regular",
                  marginLeft: 18,
                }}
              >
                No reports available
              </Text>
            }
          />
        </>
      )}

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
    fontFamily: "Poppins-Bold",
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
    textAlign: "center",
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
    // backgroundColor: "white",
    width: 150,
    height: 150,
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
    width: 150,
    height: 150,
    marginVertical: 5,
    borderRadius: 10,
    // iOS shadow properties
    shadowColor: "#000", // Shadow color
    shadowOffset: {
      width: 0, // Horizontal offset
      height: 2, // Vertical offset
    },
    shadowOpacity: 0.3, // Opacity of the shadow
    shadowRadius: 4, // Blur radius of the shadow
    // Android elevation
    elevation: 5, // Elevation level
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
