import React, { useContext, useState } from "react";
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

const EditProfile = () => {
  const { userData, setUserData } = useContext(UserContext);

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
    <ScrollView style={styles.container}>
      <View style={styles.coverContainer}>
        <Button
          title="Pick Cover Image"
          onPress={() =>
            handleImagePick(setCoverImage, "coverImages", "coverImageUrl")
          }
        />
        {coverImage && (
          <Image source={{ uri: coverImage }} style={styles.image} />
        )}
      </View>

      <View style={styles.profileContainer}>
        <Button
          title="Pick Profile Image"
          onPress={() =>
            handleImagePick(setImage, "profileImages", "profileImageUrl")
          }
        />
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

      <Button title="Save" onPress={handleSave} />
    </ScrollView>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  coverContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  textArea: {
    height: 100,
  },
});
