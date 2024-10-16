import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

const ReportFeed = ({ navigation }) => {
  const favicon = require("../assets/images/Favicon.png");
  const dummyData = [
    {
      profileImage: favicon,
      name: "Candice",
      reportTitle: "Public Hospital Renovations",
      reportDescription:
        "Lerato mentions that while renovations at the Soweto General Hospital have been exhausted.",
      image: require("../assets/images/rural.jpg"),
      department: "Department of Health and Science",
      progress: "In Progress",
      location: "Johannesburg General Hospital",
      comments:
        "Contractors have requested an extension due to bad weather conditions last month.",
    },
    {
      profileImage: favicon,
      name: "John",
      reportTitle: "Community Center Updates",
      reportDescription:
        "John reports that the new community center will open next month.",
      image: require("../assets/images/rural.jpg"),
      department: "Department of Health and Science",
      progress: "Not Started",
      location: "Johannesburg",
      comments:
        "Contractors have requested an extension due to bad weather conditions last month.",
    },
    {
      profileImage: favicon,
      name: "Sarah",
      reportTitle: "School Construction",
      reportDescription:
        "Sarah highlights the progress on the new school building in the area.",
      image: require("../assets/images/rural.jpg"),
      department: "Department of Health and Science",
      progress: "Complete",
      location: "Johannesburg",
      comments:
        "Contractors have requested an extension due to bad weather conditions last month.",
    },
  ];
  
  return (
    <View style={styles.safeArea}>
      <View style={styles.container}>
        {dummyData.map((data, index) => (
          <TouchableOpacity
            key={index}
           
            style={styles.card}
          >
            <View style={styles.profileContainer}>
              <Image source={data.profileImage} style={styles.profImage} />
              <Text style={styles.name}>{data.name}</Text>
            </View>
            <Image source={data.image} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.reportTitle}>{data.reportTitle}</Text>
              <Text style={styles.reportDescription}>{data.reportDescription}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity
  style={styles.editButton}
  onPress={() => navigation.navigate("CreateReport")}
  accessibilityLabel="Create New Report"
>
  <Ionicons size={30} name="add-outline" />
</TouchableOpacity>

    </View>
  );
};

export default ReportFeed;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    padding: 10,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 3,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  profImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
    resizeMode: "cover",
  },
  info: {
    padding: 10,
  },
  reportTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },
  reportDescription: {
    color: "#666",
  },
  editButton: {
    position: "absolute",
    right: 0,
    top: 750,
    justifyContent: "center",
    alignItems: "center",
    width: 50,
    height: 50,
    marginRight: 20,
    backgroundColor: "white",
    borderRadius: 10,
  },
});
