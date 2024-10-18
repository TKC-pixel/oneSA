import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const FavoriteDetails = ({ route, navigation }) => {
  const { item } = route.params; // Get the item data passed from the previous screen

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.projectName}>{item.projectName}</Text>
      <Text style={styles.projectDescription}>{item.projectDepartment}</Text>
      <Text style={styles.projectStatus}>
        Status: {item.projectCompletionStatus}
      </Text>
      <Text style={styles.projectStartDate}>
        Start Date: {item.projectStartDate}
      </Text>
      <Text style={styles.projectBudget}>
        Budget Allocation: R{item.projectBudgetAllocation.toLocaleString()}
      </Text>
      <Text style={styles.projectTenderCompany}>
        Tender Company: {item.projectTenderCompany}
      </Text>

      {/* Add more details as necessary */}

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Go Back</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f8f8",
  },
  projectName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  projectDescription: {
    fontSize: 18,
    fontWeight: "600",
    color: "#555",
    marginBottom: 5,
  },
  projectStatus: {
    fontSize: 16,
    color: "#555",
    marginBottom: 5,
  },
  projectStartDate: {
    fontSize: 16,
    color: "#555",
    marginBottom: 5,
  },
  projectBudget: {
    fontSize: 16,
    color: "#555",
    marginBottom: 5,
  },
  projectTenderCompany: {
    fontSize: 16,
    color: "#555",
    marginBottom: 20,
  },
  backButton: {
    marginTop: 20,
    paddingVertical: 15,
    backgroundColor: "#007BFF",
    borderRadius: 5,
  },
  backButtonText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 18,
  },
});

export default FavoriteDetails;
