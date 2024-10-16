import React, { useContext, useState } from "react";
import {
  StyleSheet,
  Text,
  Button,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
  TouchableHighlight,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { auth, db, storage } from "../FIrebaseConfig"; // Firebase setup
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, updateDoc, arrayUnion, collection, addDoc } from "firebase/firestore";

const Nominatim_API_URL = "https://nominatim.openstreetmap.org/search";

const CreateReport = ({ navigation }) => {
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [status, setStatus] = useState("");
  const [additionalComments, setAdditionalComments] = useState("");
  const [image, setImage] = useState(null);
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
      let imageUrl = "";
      if (image) {
        imageUrl = await uploadImage(image);
      }
  
      const reportData = {
        name,
        description,
        department,
        status,
        additionalComments,
        location,
        projectImage: imageUrl,
        userId, // Add the userId for reference
        timestamp: new Date(), // Add a timestamp
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

  // Fetch location suggestions from Nominatim API
  const fetchLocationSuggestions = async (query) => {
    if (query.length < 3) {
      setLocationSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `${Nominatim_API_URL}?q=${encodeURIComponent(
          query
        )}&format=json&addressdetails=1&limit=5`
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
    <View style={styles.container}>
      <Text style={styles.title}>File a Report</Text>

      <View style={styles.imageContainer}>
        {image && <Image source={{ uri: image }} style={styles.image} />}
        <Button title="Pick an image from camera roll" onPress={pickImage} />
      </View>

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

      {/* Render Location Suggestions */}
      {locationSuggestions.length > 0 && (
        <FlatList
          data={locationSuggestions}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableHighlight
              onPress={() => handleLocationSelect(item)}
              underlayColor="#ddd"
            >
              <Text style={styles.suggestionItem}>
                {item.display_name}
              </Text>
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


      <TouchableOpacity style={styles.button} onPress={handleCreateReport}>
        <Text style={styles.buttonText}>Submit Report</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CreateReport;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "white",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  picker: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  image: {
    alignSelf: "center",
    width: 200,
    height: 200,
  },
});
