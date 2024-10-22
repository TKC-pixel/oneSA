import React, { useContext, useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { UserContext } from "../context/UserContext";
import { doc, updateDoc } from "firebase/firestore";
import { db, auth, storage } from "../FIrebaseConfig";
import * as ImagePicker from "expo-image-picker";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import uuid from "react-native-uuid";
import * as Font from "expo-font";
import { TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeContext } from "../context/ThemeContext";

const EditProfile = () => {
  const { userData, setUserData, dataAccess } = useContext(UserContext);
  
  const { theme } = useContext(ThemeContext); 
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [formData, setFormData] = useState({
    name: userData?.name || "",
    surname: userData?.surname || "",
    phone: userData?.phone || "",
    bio: userData?.bio || "",
    profileImageUrl: userData?.profilePic || "",
    coverImageUrl: userData?.coverPic || "",
  });
  const [uploading, setUploading] = useState(false);
  const [image, setImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);

  const loadFonts = async () => {
    await Font.loadAsync({
      "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
      "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    });
    setFontsLoaded(true);
  };

  useEffect(() => {
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const uploadImageToStorage = async (uri, folder) => {
    try {
      setUploading(true);
      const response = await fetch(uri);
      const blob = await response.blob();
      const imageRef = ref(storage, `${folder}/${uuid.v4()}`);
      await uploadBytes(imageRef, blob);
      const downloadUrl = await getDownloadURL(imageRef);
      setUploading(false);
      return downloadUrl;
    } catch (error) {
      console.error("Error uploading image: ", error);
      setUploading(false);
      return null;
    }
  };

  const handleImagePick = async (setImageCallback, folder, fieldKey) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageCallback(result.assets[0].uri);
      const downloadUrl = await uploadImageToStorage(
        result.assets[0].uri,
        folder
      );
      if (downloadUrl) {
        handleInputChange(fieldKey, downloadUrl);
      }
    }
  };

  const handleInputChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value || "",
    }));
  };

  const handleSave = async () => {
    try {
      const userRef = doc(db, "Users", auth.currentUser.uid);
      const updatedData = {
        name: formData.name || null,
        surname: formData.surname || null,
        phone: formData.phone || null,
        bio: formData.bio || null,
        profileImageUrl: formData.profileImageUrl || null,
        coverImageUrl: formData.coverImageUrl || null,
      };

      await updateDoc(userRef, updatedData);
      setUserData({ ...formData });
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile: ", error);
      alert("Failed to update profile.");
    }
  };

  return (
    <SafeAreaView style={theme == 'light'? styles.safeArea: darkModeStyles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.coverContainer}>
          <TouchableOpacity
            onPress={() =>
            {if(dataAccess){
              handleImagePick(setCoverImage, "coverImages", "coverImageUrl")
            }
            else{
              alert("OneSA app does not have access to your devices data.\nCheck application privacy settings")
            }}
            }
          >
            <Text style={styles.buttonText}>Pick Cover Image</Text>
          </TouchableOpacity>
          {coverImage && (
            <Image source={{ uri: coverImage }} style={styles.coverImage} />
          )}
        </View>

        <View style={styles.profileContainer}>
          <TouchableOpacity
             onPress={() =>
              {if(dataAccess){
                handleImagePick(setImage, "profileImages", "profileImageUrl")
              }
              else{
                alert("OneSA app does not have access to your devices data.\nCheck application privacy settings")
              }}
              }
            >
            <Text style={styles.buttonText}>Pick Profile Image</Text>
          </TouchableOpacity>
          {image && <Image source={{ uri: image }} style={styles.image} />}
        </View>

        {uploading && <ActivityIndicator size="large" color="#0000ff" />}

        <TextInput
          placeholder="Name"
          value={formData.name}
          onChangeText={(text) => handleInputChange("name", text)}
          style={styles.input}
        />
        <TextInput
          placeholder="Surname"
          value={formData.surname}
          onChangeText={(text) => handleInputChange("surname", text)}
          style={styles.input}
        />
        <TextInput
          placeholder="Phone"
          value={formData.phone}
          onChangeText={(text) => handleInputChange("phone", text)}
          style={styles.input}
        />
        <TextInput
          placeholder="Bio"
          value={formData.bio}
          onChangeText={(text) => handleInputChange("bio", text)}
          style={[styles.input, styles.textArea]}
          multiline
          numberOfLines={4}
        />
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  container: {
    padding: 20,
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  coverContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  coverImage: {
    width: "100%",
    height: 200,
    marginTop: 10,
    borderRadius: 10,
    overflow: "hidden",
    borderColor: "#ddd",
    borderWidth: 1,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 10,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 15,
    borderRadius: 8,
    fontFamily: "Poppins-Regular",
    backgroundColor: "#fff",
  },
  buttonText: {
    fontFamily: "Poppins-Bold",
    color: "#B7C42E",
    textDecorationLine: "underline",
  },
  saveButton: {
    backgroundColor: "#B7C42E",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 20,
  },
  saveButtonText: {
    color: "#fff",
    fontFamily: "Poppins-Bold",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
const darkModeStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "black",
  },
});

