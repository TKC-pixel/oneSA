import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  FlatList,
  Platform,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import * as Font from "expo-font";
import { UserContext } from "../context/UserContext";
import { arrayUnion, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db } from "../FIrebaseConfig";
import { ThemeContext } from "../context/ThemeContext";
import { TouchableHighlight } from "react-native";
const Nominatim_API_URL = "https://nominatim.openstreetmap.org/search";
import { Ionicons } from "@expo/vector-icons";
const CreateProject = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [image, setImage] = useState(null);
  const [projectName, setProjectName] = useState("");
  const [department, setDepartment] = useState("");
  const [budget, setBudget] = useState("");
  const [tenderCompany, setTenderCompany] = useState("");
  const [startDate, setStartDate] = useState("");
  const { userData } = useContext(UserContext);
  const { theme } = useContext(ThemeContext);
  const [location, setLocation] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  console.log(userData.ministerID);
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

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

  const handlePublishProject = async () => {
    const projectData = {
      projectBudgetAllocation: parseFloat(budget), // Ensure budget is a number
      projectCompletionStatus: "Ongoing", // Adjust as necessary
      projectDepartment: department,
      projectName,
      projectStartDate: startDate,
      projectTenderCompany: tenderCompany,
      location: {
        latitude: latitude,
        longitude: longitude,
      },
    };

    // Get the minister ID from context
    const ministerID = userData.isMinister ? userData.ministerID : null;

    if (!ministerID) {
      console.error("User is not a minister or minister ID is not available");
      return;
    }

    try {
      // Upload image to Firebase Storage
      const storage = getStorage(); // Initialize Firebase Storage
      const imageName = `${ministerID}/${Date.now()}`; // Create a unique name for the image
      const storageRef = ref(storage, `projectImages/${imageName}`); // Create a reference in Storage

      // Upload the image
      const response = await fetch(image);
      const blob = await response.blob(); // Convert image URI to a Blob
      await uploadBytes(storageRef, blob); // Upload the Blob

      // Get the download URL
      const imageUrl = await getDownloadURL(storageRef);

      // Add image URL to the project data
      projectData.imageUrl = imageUrl;

      // Get the current minister's document data
      const ministerRef = doc(db, "ministers", ministerID);
      const ministerSnap = await getDoc(ministerRef);

      if (!ministerSnap.exists()) {
        console.error("Minister document does not exist");
        return;
      }

      // Update the minister's document by directly pushing the new project to the existing projects array
      await updateDoc(ministerRef, {
        "ministerDepartment.projects": arrayUnion(projectData), // Use arrayUnion to add the new project
      });

      console.log("Project successfully added!");
    } catch (error) {
      console.error("Error adding project: ", error);
    }
  };

  if (!fontsLoaded) {
    return null; // or a loading spinner
  }

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
    setLatitude(location.lat); // Set the latitude
    setLongitude(location.lon); // Set the longitude
  };

  return (
    <KeyboardAvoidingView
    behavior={Platform.OS === "ios" ? "padding" : "height"} 
      style={{
        backgroundColor: theme === "light" ? "#fff" : "#1e1e1e",
        flex: 1,
        
      }}
    >
      {/* <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"} // Adjusts the view when the keyboard is active
        style={{ flex: 1 }}
      > */}
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Text
          style={[styles.title, { color: theme === "light" ? "#000" : "#fff" }]}
        >
          Create a Project
        </Text>
        <View style={styles.container}>
          <TouchableOpacity style={styles.uploadImage} onPress={pickImage}>
            <ImageBackground
              borderRadius={25}
              style={
                theme === "light"
                  ? styles.imageBackground
                  : darkmodeStyles.imageBackground
              }
              source={{
                uri: image
                  ? image
                  : "https://repository-images.githubusercontent.com/229240000/2b1bba00-eae1-11ea-8b31-ea57fe8a3f95",
              }}
            />
          </TouchableOpacity>
          <View>
            <Text
              style={theme === "light" ? styles.label : darkmodeStyles.label}
            >
              Project Name
            </Text>
            <TextInput
              style={theme === "light" ? styles.input : darkmodeStyles.input}
              placeholder="Enter project name"
              placeholderTextColor={theme === "light" ? "#000" : "#fff"}
              value={projectName}
              onChangeText={setProjectName}
            />
            <Text
              style={theme === "light" ? styles.label : darkmodeStyles.label}
            >
              Department Responsible
            </Text>
            <TextInput
              style={theme === "light" ? styles.input : darkmodeStyles.input}
              placeholder="Enter department"
              placeholderTextColor={theme === "light" ? "#000" : "#fff"}
              value={department}
              onChangeText={setDepartment}
            />
            <Text
              style={theme === "light" ? styles.label : darkmodeStyles.label}
            >
              Budget Allocation
            </Text>
            <TextInput
              style={theme === "light" ? styles.input : darkmodeStyles.input}
              placeholder="Enter budget"
              placeholderTextColor={theme === "light" ? "#000" : "#fff"}
              value={budget}
              onChangeText={setBudget}
            />
            <Text
              style={theme === "light" ? styles.label : darkmodeStyles.label}
            >
              Tender Company
            </Text>
            <TextInput
              style={theme === "light" ? styles.input : darkmodeStyles.input}
              placeholder="Enter tender company"
              placeholderTextColor={theme === "light" ? "#000" : "#fff"}
              value={tenderCompany}
              onChangeText={setTenderCompany}
            />
            <Text
              style={theme === "light" ? styles.label : darkmodeStyles.label}
            >
              Start Date
            </Text>
            <TextInput
              style={theme === "light" ? styles.input : darkmodeStyles.input}
              placeholder="Enter start date"
              placeholderTextColor={theme === "light" ? "#000" : "#fff"}
              value={startDate}
              onChangeText={setStartDate}
            />
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
            <TouchableOpacity
              style={styles.buttonPublish}
              onPress={handlePublishProject}
            >
              <Text style={styles.buttonText}>Publish Project</Text>
            </TouchableOpacity>
          </View>
        </View>
        </ScrollView>
      {/* </KeyboardAvoidingView> */}
    </KeyboardAvoidingView>
  );
};

export default CreateProject;

const styles = StyleSheet.create({
  title: {
    fontSize: 32,
    marginVertical: 20,
    marginLeft: 18,
    fontFamily: "Poppins-Bold",
  },
  container: {
    paddingHorizontal: 16,
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
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 3,
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
    marginBottom: 100
  },
  buttonText: {
    color: "#fff",
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

const darkmodeStyles = StyleSheet.create({
  title: {
    fontSize: 32,
    marginVertical: 20,
    marginLeft: 18,
    fontFamily: "Poppins-Bold",
    color: "#fff", // Lighter text for dark mode
  },
  container: {
    paddingHorizontal: 16,
    backgroundColor: "#121212", // Dark background
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
    color: "#e0e0e0", // Light gray for labels
  },
  input: {
    height: 40,
    borderColor: "#3A3A3A", // Darker border for input
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 5,
    paddingHorizontal: 10,
    fontFamily: "Poppins-Regular",
    backgroundColor: "#1E1E1E", // Dark background for input
    color: "#e0e0e0", // Light text for input
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 3,
  },
  buttonPublish: {
    width: 150,
    height: 40,
    backgroundColor: "#5A8F2E", // Darker shade of green
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
  },
  buttonText: {
    color: "#fff", // Keep white text
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
