import React, { useContext, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
  TouchableHighlight,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { auth, db, storage } from "../FIrebaseConfig"; // Firebase setup
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  doc,
  updateDoc,
  arrayUnion,
  collection,
  addDoc,
} from "firebase/firestore";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import analyzeSentiment from "../components/sentimentUtil";
import containsProfanity from "../components/profanityFilter";
const Nominatim_API_URL = "https://nominatim.openstreetmap.org/search";

const CreateReport = ({ navigation }) => {
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [status, setStatus] = useState("");
  const [additionalComments, setAdditionalComments] = useState("");
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState(null);
  const [location, setLocation] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState([]);

  const departments = [
    { label: "Department of Health", value: "health" },
    { label: "Department of Education", value: "education" },
    { label: "Department of Transport", value: "transport" },
  ];

  const statuses = [
    { label: "Not Started", value: "not_started" },
    { label: "In Progress", value: "in_progress" },
    { label: "Complete", value: "complete" },
  ];

  const userId = auth.currentUser.uid;

  const uploadImage = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const storageRef = ref(storage, `reports/${Date.now()}`);
    const snapshot = await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  };

  const handleCreateReport = async () => {
    try {
      // Check for profanity in the description
      if (containsProfanity(description)) {
        alert("Your description contains inappropriate language. Please revise.");
        return; // Exit the function if profanity is found
      }

      let imageUrl = "";
      if (image) {
        imageUrl = await uploadImage(image);
      }

      // Analyze the sentiment of the description
      const sentimentResult = analyzeSentiment(description);
      console.log("Sentiment:", sentimentResult); // Log the sentiment

      const reportData = {
        title,
        name,
        description,
        department,
        status,
        additionalComments,
        location,
        projectImage: imageUrl,
        userId, // Add the userId for reference
        timestamp: new Date(), // Add a timestamp
        sentiment: sentimentResult, // Add the sentiment result to report data
      };

      // Update the user's document with the report
      const userDocRef = doc(db, "Users", userId);
      await updateDoc(userDocRef, {
        reports: arrayUnion(reportData),
      });

      // Add the report to the reports collection
      const reportsCollectionRef = collection(db, "reports");
      await addDoc(reportsCollectionRef, reportData);

      navigation.goBack();
    } catch (error) {
      console.error("Error submitting report: ", error);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const fetchLocationSuggestions = async (query) => {
    if (query.length < 3) {
      setLocationSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `${Nominatim_API_URL}?q=${encodeURIComponent(
          query
        )}&format=json&addressdetails=1&limit=5&countrycodes=ZA`
      );
      const data = await response.json();
      setLocationSuggestions(data);
    } catch (error) {
      console.error("Error fetching location suggestions: ", error);
    }
  };

  const handleLocationSelect = (location) => {
    setLocation(location.display_name);
    setLocationSuggestions([]);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : null}
      keyboardVerticalOffset={100} 
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <SafeAreaView style={styles.container}>
          <Text style={styles.title}>File a Report</Text>

          <TouchableOpacity style={styles.uploadImage} onPress={pickImage}>
            <Image
              source={
                image
                  ? { uri: image }
                  : {
                      uri: "https://w7.pngwing.com/pngs/230/819/png-transparent-cloud-upload-uploading-upload-arrow-upload-cloud-cloud-data-3d-icon-thumbnail.png",
                    }
              }
              style={styles.imageBackground}
            />
          </TouchableOpacity>

          <TextInput
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
          />

          <TextInput
            placeholder="Name"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />

          <TextInput
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            style={styles.input}
          />

          <Text style={styles.label}>Relevant Department</Text>
          <Picker
            selectedValue={department}
            onValueChange={(itemValue) => setDepartment(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select a department" value="" />
            {departments.map((dept, index) => (
              <Picker.Item key={index} label={dept.label} value={dept.value} />
            ))}
          </Picker>

          <Text style={styles.label}>Project Status</Text>
          <Picker
            selectedValue={status}
            onValueChange={(itemValue) => setStatus(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select a status" value="" />
            {statuses.map((statusItem, index) => (
              <Picker.Item
                key={index}
                label={statusItem.label}
                value={statusItem.value}
              />
            ))}
          </Picker>

          <TextInput
            placeholder="Location"
            value={location}
            onChangeText={(text) => {
              setLocation(text);
              fetchLocationSuggestions(text);
            }}
            style={styles.input}
          />

          {locationSuggestions.length > 0 && (
            <FlatList
              data={locationSuggestions}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableHighlight
                  onPress={() => handleLocationSelect(item)}
                  underlayColor="#ddd"
                >
                  <View style={styles.suggestionItem}>
                    {/* Ionicons Location Icon */}
                    <Ionicons
                      name="location-outline"
                      size={20}
                      color="#333"
                      style={styles.icon}
                    />
                    <Text style={styles.suggestionText}>
                      {item.display_name}
                    </Text>
                  </View>
                </TouchableHighlight>
              )}
            />
          )}

          <TextInput
            placeholder="Additional Comments"
            value={additionalComments}
            onChangeText={setAdditionalComments}
            style={styles.input}
            multiline
            numberOfLines={4}
          />

          <TouchableOpacity
            style={styles.buttonPublish}
            onPress={handleCreateReport}
          >
            <Text style={styles.buttonText}>Submit Report</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CreateReport;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: "white",
  },
  title: {
    fontSize: 32,
    marginBottom: 20,
    fontFamily: "Poppins-Bold",
  },
  uploadImage: {
    width: 280,
    height: 280,
    borderRadius: 25,
    alignSelf: "center",
    marginBottom: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
  imageBackground: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    fontFamily: "Poppins-Regular",
    fontSize: 16,
    marginBottom: 2,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 5,
    paddingHorizontal: 10,
    fontFamily: "Poppins-Regular",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  picker: {
    height: 50,
    width: "100%",
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    marginVertical: 5,
  },
  buttonPublish: {
    width: 150,
    height: 40,
    backgroundColor: "#B7C42E",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
    fontFamily: "Poppins-Bold",
  },
  suggestionItem: {
    flexDirection: "row", // Align icon and text in a row
    alignItems: "center",
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  icon: {
    marginRight: 10, // Space between icon and text
  },
  suggestionText: {
    fontSize: 16,
    color: "#333",
    fontFamily: "Poppins-Bold",
  },
});
