import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { ThemeContext } from "../context/ThemeContext";
import { UserContext } from "../context/UserContext";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../FIrebaseConfig";
import { SafeAreaView } from "react-native-safe-area-context";

const EditProject = ({ route, navigation }) => {
  const { item } = route.params;
  const { theme } = useContext(ThemeContext);
  const { userData } = useContext(UserContext);
  const [projectName, setProjectName] = useState(item.projectName);
  const [projectDepartment, setProjectDepartment] = useState(
    item.projectDepartment
  );
  const [projectCompletionStatus, setProjectCompletionStatus] = useState(
    item.projectCompletionStatus
  );
  const [projectStartDate, setProjectStartDate] = useState(
    item.projectStartDate
  );
  const [projectBudgetAllocation, setProjectBudgetAllocation] = useState(
    item.projectBudgetAllocation
  );
  const [projectTenderCompany, setProjectTenderCompany] = useState(
    item.projectTenderCompany
  );

  const handleUpdate = async () => {
    const projectRef = doc(db, "Projects", item.id); // Assuming you have a project ID in your item

    try {
      await updateDoc(projectRef, {
        projectName,
        projectDepartment,
        projectCompletionStatus,
        projectStartDate,
        projectBudgetAllocation: Number(projectBudgetAllocation), // Ensure it's a number
        projectTenderCompany,
      });
      Alert.alert("Success", "Project details updated successfully!");
      navigation.goBack(); // Go back to the previous screen after update
    } catch (error) {
      console.error("Error updating project: ", error);
      Alert.alert(
        "Error",
        "Could not update project details. Please try again."
      );
    }
  };

  return (
    <SafeAreaView
      style={theme === "light" ? styles.container : darkModeStyles.container}
    >
      <Text
        style={
          theme === "light" ? styles.headerText : darkModeStyles.headerText
        }
      >
        Edit Project
      </Text>

      <TextInput
        placeholder="Project Name"
        value={projectName}
        onChangeText={setProjectName}
        style={styles.input}
      />
      <TextInput
        placeholder="Department"
        value={projectDepartment}
        onChangeText={setProjectDepartment}
        style={styles.input}
      />
      <TextInput
        placeholder="Status"
        value={projectCompletionStatus}
        onChangeText={setProjectCompletionStatus}
        style={styles.input}
      />
      <TextInput
        placeholder="Start Date"
        value={projectStartDate}
        onChangeText={setProjectStartDate}
        style={styles.input}
      />
      <TextInput
        placeholder="Budget Allocation"
        value={projectBudgetAllocation.toString()} // Convert to string for input
        keyboardType="numeric"
        onChangeText={setProjectBudgetAllocation}
        style={styles.input}
      />
      <TextInput
        placeholder="Tender Company"
        value={projectTenderCompany}
        onChangeText={setProjectTenderCompany}
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Update Project</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default EditProject;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  headerText: {
    fontSize: 24,
    fontFamily: "Poppins-Bold",
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#B7C42E",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontFamily: "Poppins-Bold",
  },
});

// Dark Mode Styles
const darkModeStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#121212",
  },
  headerText: {
    fontSize: 24,
    fontFamily: "Poppins-Bold",
    color: "#fff",
    marginBottom: 20,
  },
});
