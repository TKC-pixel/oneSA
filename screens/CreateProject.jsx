import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import * as Font from "expo-font";
import { UserContext } from "../context/UserContext";
import { arrayUnion, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db } from "../FIrebaseConfig";

const CreateProject = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [image, setImage] = useState(null);
  const [projectName, setProjectName] = useState("");
  const [department, setDepartment] = useState("");
  const [budget, setBudget] = useState("");
  const [tenderCompany, setTenderCompany] = useState("");
  const [startDate, setStartDate] = useState("");
  const { userData } = useContext(UserContext);
  console.log(userData.ministerID)
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
      projectStartDate : startDate,
      projectTenderCompany: tenderCompany,
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

  return (
    <SafeAreaView>
      <Text style={styles.title}>Create a Project</Text>
      <View style={styles.container}>
        <TouchableOpacity style={styles.uploadImage} onPress={pickImage}>
          <ImageBackground
            borderRadius={25}
            style={styles.imageBackground}
            source={{
              uri: image
                ? image
                : "https://w7.pngwing.com/pngs/230/819/png-transparent-cloud-upload-uploading-upload-arrow-upload-cloud-cloud-data-3d-icon-thumbnail.png",
            }}
          />
        </TouchableOpacity>
        <View>
          <Text style={styles.label}>Project Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter project name"
            value={projectName}
            onChangeText={setProjectName}
          />
          <Text style={styles.label}>Department Responsible</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter department"
            value={department}
            onChangeText={setDepartment}
          />
          <Text style={styles.label}>Budget Allocation</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter budget"
            value={budget}
            onChangeText={setBudget}
          />
          <Text style={styles.label}>Tender Company</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter tender company"
            value={tenderCompany}
            onChangeText={setTenderCompany}
          />
          <Text style={styles.label}>Start Date</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter start date"
            value={startDate}
            onChangeText={setStartDate}
          />
          <TouchableOpacity
            style={styles.buttonPublish}
            onPress={handlePublishProject}
          >
            <Text style={styles.buttonText}>Publish Project</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
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
  },
  buttonText: {
    color: "#fff",
    fontFamily: "Poppins-Bold",
  },
});
