import React, { useContext, useEffect, useState } from "react";
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
import { ThemeContext } from "../context/ThemeContext";
const Nominatim_API_URL = "https://nominatim.openstreetmap.org/search";
const Photon_API_URL = "https://photon.komoot.io/api/";

const CreateReport = ({ navigation, route }) => {
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [status, setStatus] = useState("");
  const [additionalComments, setAdditionalComments] = useState("");
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState(null);
  const [location, setLocation] = useState({
    name: "",
    latitude: null,
    longitude: null,
  });

  const { theme } = useContext(ThemeContext);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const { item } = route.params || {};
  console.log(item);
  useEffect(() => {
    if (item) {
      setName(item.projectName || "");
      setDepartment(item.projectDepartment || "");
      setStatus(item.projectCompletionStatus || "");
      setDepartment(item.projectDepartment || "");
    }
  }, [item]);
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
        alert(
          "Your description contains inappropriate language. Please revise."
        );
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
        location: location.name, // Store the selected location name
        latitude: location.latitude, // Add latitude
        longitude: location.longitude, // Add longitude
        projectImage: imageUrl,
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
        `${Photon_API_URL}?q=${encodeURIComponent(
          query
        )}&limit=5&bbox=16.2817,-34.8333,32.8917,-22.1250`
      );
      const data = await response.json();
      setLocationSuggestions(data.features); // Photon returns features array
    } catch (error) {
      console.error("Error fetching location suggestions: ", error);
    }
  };

  const handleLocationSelect = (location) => {
    const { coordinates } = location.geometry; // Photon stores [lon, lat] in geometry.coordinates
    const longitude = coordinates[0]; // Extract longitude
    const latitude = coordinates[1]; // Extract latitude

    // Save the location name, longitude, and latitude
    setLocation({
      name: location.properties.name, // Set the location name in state
      longitude,
      latitude,
    });

    setLocationSuggestions([]); // Clear suggestions once a location is selected
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : null}
      keyboardVerticalOffset={100}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <SafeAreaView
          style={
            theme === "light" ? styles.container : darkModeStyles.container
          }
        >
          <Text style={theme === "light" ? styles.title : darkModeStyles.title}>
            File a Report
          </Text>

          <TouchableOpacity style={styles.uploadImage} onPress={pickImage}>
            <Image
              source={
                image
                  ? { uri: image }
                  : {
                      uri: "https://repository-images.githubusercontent.com/229240000/2b1bba00-eae1-11ea-8b31-ea57fe8a3f95",
                    }
              }
              style={styles.imageBackground}
            />
          </TouchableOpacity>

          <TextInput
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
            style={theme === "light" ? styles.input : darkModeStyles.input}
          />

          <TextInput
            placeholder="Name"
            value={name}
            onChangeText={setName}
            style={theme === "light" ? styles.input : darkModeStyles.input}
          />

          <TextInput
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            style={theme === "light" ? styles.input : darkModeStyles.input}
          />

          <Text style={theme === "light" ? styles.label : darkModeStyles.label}>
            Relevant Department
          </Text>
          <Picker
            selectedValue={department}
            onValueChange={(itemValue) => setDepartment(itemValue)}
            style={theme === "light" ? styles.picker : darkModeStyles.picker}
          >
            <Picker.Item label="Select a department" value="" />
            {departments.map((dept, index) => (
              <Picker.Item key={index} label={dept.label} value={dept.value} />
            ))}
          </Picker>

          <Text style={theme === "light" ? styles.label : darkModeStyles.label}>
            Project Status
          </Text>
          <Picker
            selectedValue={status}
            onValueChange={(itemValue) => setStatus(itemValue)}
            style={theme === "light" ? styles.picker : darkModeStyles.picker}
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
            value={location.name} // Display the selected location's name
            onChangeText={(text) => {
              setLocation({ ...location, name: text }); // Update the location name in state as user types
              fetchLocationSuggestions(text); // Fetch suggestions while typing
            }}
            style={theme === "light" ? styles.input : darkModeStyles.input}
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
                      style={
                        theme === "light" ? styles.icon : darkModeStyles.icon
                      }
                    />
                    <Text style={styles.suggestionText}>
                      {item.properties.name}, {item.properties.city},{" "}
                      {item.properties.country}
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
            style={theme === "light" ? styles.input : darkModeStyles.input}
            multiline
            numberOfLines={4}
          />

          <TouchableOpacity
            style={
              theme === "light"
                ? styles.buttonPublish
                : darkModeStyles.buttonPublish
            }
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

const darkModeStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: "#1e1e1e", // Dark background
  },
  title: {
    fontSize: 32,
    marginBottom: 20,
    fontFamily: "Poppins-Bold",
    color: "#fff", // White text for contrast
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
    color: "#fff", // White text
  },
  input: {
    height: 40,
    borderColor: "#555", // Darker border for input fields
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 5,
    paddingHorizontal: 10,
    fontFamily: "Poppins-Regular",
    backgroundColor: "#333", // Dark input background
    color: "#fff", // White text for input
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
    borderColor: "#555", // Darker border for picker
    borderRadius: 5,
    marginVertical: 5,
    backgroundColor: "#333", // Dark picker background
    color: "#fff", // White text for picker
  },
  buttonPublish: {
    width: 150,
    height: 40,
    backgroundColor: "#B7C42E", // Accent color for publish button
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
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#2a2a2a", // Dark background for suggestion items
    borderBottomWidth: 1,
    borderBottomColor: "#555", // Darker border for suggestion items
  },
  icon: {
    marginRight: 10,
    color: "#B7C42E", // Accent color for icons
  },
  suggestionText: {
    fontSize: 16,
    color: "#fff", // White text for suggestions
    fontFamily: "Poppins-Bold",
  },
});
