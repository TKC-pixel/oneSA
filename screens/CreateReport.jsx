import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
const CreateReport = ({ navigation }) => {
  const [description, setDescription] = useState("");
  const [department, setDepartment] = useState("");
  const [status, setStatus] = useState("");
  const [additionalComments, setAdditionalComments] = useState("");

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

  const handleCreateReport = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>File a Report</Text>

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
});
