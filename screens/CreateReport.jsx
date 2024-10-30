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
  Modal,
  Pressable,
} from "react-native";
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
import analyzeSentiment from "../components/sentimentUtil";
import containsProfanity from "../components/profanityFilter";
import { ThemeContext } from "../context/ThemeContext";
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
  const [showDepartmentModal, setShowDepartmentModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  
  const { item } = route.params || {};
  
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
          <TouchableOpacity
            style={styles.picker}
            onPress={() => setShowDepartmentModal(true)}
          >
            <Text style={styles.pickerText}>
              {department ? departments.find((d) => d.value === department)?.label : "Select a department"}
            </Text>
          </TouchableOpacity>

          <Text style={theme === "light" ? styles.label : darkModeStyles.label}>
            Project Status
          </Text>
          <TouchableOpacity
            style={styles.picker}
            onPress={() => setShowStatusModal(true)}
          >
            <Text style={styles.pickerText}>
              {status ? statuses.find((s) => s.value === status)?.label : "Select a status"}
            </Text>
          </TouchableOpacity>

          <TextInput
            placeholder="Location"
            value={location.name} // Display the selected location's name
            onChangeText={(text) => {
              setLocation({ name: text, latitude: null, longitude: null });
              fetchLocationSuggestions(text);
            }}
            style={theme === "light" ? styles.input : darkModeStyles.input}
          />

          {locationSuggestions.length > 0 && (
            <FlatList
              data={locationSuggestions}
              renderItem={({ item }) => (
                <TouchableHighlight
                  onPress={() => handleLocationSelect(item)}
                >
                  <Text style={styles.suggestionText}>
                    {item.properties.name}
                  </Text>
                </TouchableHighlight>
              )}
              keyExtractor={(item) => item.properties.id} // Assuming each item has a unique id
              style={styles.suggestionList}
            />
          )}

          <TextInput
            placeholder="Additional Comments"
            value={additionalComments}
            onChangeText={setAdditionalComments}
            style={theme === "light" ? styles.input : darkModeStyles.input}
          />

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleCreateReport}
          >
            <Text style={styles.submitButtonText}>Submit Report</Text>
          </TouchableOpacity>

          {/* Modal for Department Selection */}
          <Modal
            transparent={true}
            animationType="slide"
            visible={showDepartmentModal}
            onRequestClose={() => setShowDepartmentModal(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Select Department</Text>
                <FlatList
                  data={departments}
                  renderItem={({ item }) => (
                    <Pressable
                      onPress={() => {
                        setDepartment(item.value);
                        setShowDepartmentModal(false);
                      }}
                    >
                      <Text style={styles.modalItem}>{item.label}</Text>
                    </Pressable>
                  )}
                  keyExtractor={(item) => item.value}
                />
                <TouchableOpacity
                  style={styles.modalCloseButton}
                  onPress={() => setShowDepartmentModal(false)}
                >
                  <Text style={styles.modalCloseText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {/* Modal for Status Selection */}
          <Modal
            transparent={true}
            animationType="slide"
            visible={showStatusModal}
            onRequestClose={() => setShowStatusModal(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Select Status</Text>
                <FlatList
                  data={statuses}
                  renderItem={({ item }) => (
                    <Pressable
                      onPress={() => {
                        setStatus(item.value);
                        setShowStatusModal(false);
                      }}
                    >
                      <Text style={styles.modalItem}>{item.label}</Text>
                    </Pressable>
                  )}
                  keyExtractor={(item) => item.value}
                />
                <TouchableOpacity
                  style={styles.modalCloseButton}
                  onPress={() => setShowStatusModal(false)}
                >
                  <Text style={styles.modalCloseText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </SafeAreaView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginVertical: 5,
  },
  uploadImage: {
    alignItems: "center",
    marginVertical: 10,
  },
  imageBackground: {
    width: 300,
    height: 300,
    borderRadius: 10,
  },
  label: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "600",
  },
  picker: {
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 5,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  pickerText: {
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 20,
  },
  submitButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  suggestionList: {
    position: "absolute",
    top: 170, // Adjust based on your layout
    left: 16,
    right: 16,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    zIndex: 10, // Ensure suggestions are above other elements
  },
  suggestionText: {
    padding: 10,
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
  },
  modalCloseButton: {
    marginTop: 10,
    backgroundColor: "#007BFF",
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
  },
  modalCloseText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
});

const darkModeStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#222222",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#ffffff",
  },
  input: {
    height: 50,
    borderColor: "#ffffff",
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginVertical: 5,
    backgroundColor: "#333333",
    color: "#ffffff",
  },
  label: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
  picker: {
    height: 50,
    borderColor: "#ffffff",
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 5,
    backgroundColor: "#333333",
    color: "#ffffff",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  submitButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 20,
  },
  submitButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
  
  },
});

export default CreateReport;
