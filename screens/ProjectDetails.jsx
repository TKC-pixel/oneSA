import React, { useContext } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeContext } from "../context/ThemeContext";
const ProjectDetails = ({ route }) => {
  const { item } = route.params;
  const { theme } = useContext(ThemeContext);
  console.log(item);
  return (
    <SafeAreaView
      style={theme === "light" ? styles.container : darkModeStyles.container}
    >
      <Image
        style={styles.image}
        source={{
          uri:
            item.imageUrl ||
            "https://masterbuilders.site-ym.com/resource/resmgr/docs/2022/Cabinet_approves_National_In.jpg",
        }}
      />
      <View style={styles.textContainer}>
        <Text
          style={
            theme === "light" ? styles.projectName : darkModeStyles.projectName
          }
        >
          {item.projectName}
        </Text>
        <Text
          style={
            theme === "light"
              ? styles.projectDescription
              : darkModeStyles.projectDescription
          }
        >
          {item.projectDepartment}
        </Text>
        <Text
          style={
            theme === "light"
              ? styles.projectStatus
              : darkModeStyles.projectStatus
          }
        >
          Status: {item.projectCompletionStatus}
        </Text>
        <Text
          style={
            theme === "light"
              ? styles.projectStartDate
              : darkModeStyles.projectStartDate
          }
        >
          Start Date: {item.projectStartDate}
        </Text>
        <Text
          style={
            theme === "light"
              ? styles.projectBudget
              : darkModeStyles.projectBudget
          }
        >
          Budget Allocation: R{item.projectBudgetAllocation.toLocaleString()}
        </Text>
        <Text
          style={
            theme === "light"
              ? styles.projectTenderCompany
              : darkModeStyles.projectTenderCompany
          }
        >
          Tender Company: {item.projectTenderCompany}
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default ProjectDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  projectName: {
    fontSize: 24,
    fontFamily: "Poppins-Bold",
    color: "#333",
    marginBottom: 10,
  },
  image: {
    width: "100%",
    height: 430,
    borderRadius: 45,
    marginBottom: 21,
  },
  projectDescription: {
    fontSize: 18,
    fontFamily: "Poppins-Regular",
    color: "#555",
    marginBottom: 5,
  },
  projectStatus: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "#555",
    marginBottom: 5,
  },
  projectStartDate: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "#555",
    marginBottom: 5,
  },
  projectBudget: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "#555",
    marginBottom: 5,
  },
  projectTenderCompany: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "#555",
    marginBottom: 20,
  },
  backBtn: {
    position: "absolute",
    width: 50,
    height: 50,
    backgroundColor: "#D9D9D9",
    borderRadius: 25,
    top: 60,
    left: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    paddingHorizontal: 18,
  },
});

const darkModeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212", // Dark background
  },
  projectName: {
    fontSize: 24,
    fontFamily: "Poppins-Bold",
    color: "#fff", // White text for dark mode
    marginBottom: 10,
  },
  projectDescription: {
    fontSize: 18,
    fontFamily: "Poppins-Regular",
    color: "#ccc", // Light text for dark mode
    marginBottom: 5,
  },
  projectStatus: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "#ccc",
    marginBottom: 5,
  },
  projectStartDate: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "#ccc",
    marginBottom: 5,
  },
  projectBudget: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "#ccc",
    marginBottom: 5,
  },
  projectTenderCompany: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "#ccc",
    marginBottom: 20,
  },
  backBtn: {
    position: "absolute",
    width: 50,
    height: 50,
    backgroundColor: "#333",
    borderRadius: 25,
    top: 60,
    left: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
