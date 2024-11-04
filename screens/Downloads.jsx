import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  Linking,
  Platform,
} from "react-native";
import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";

// Sample array of Google Drive shareable links
const files = [
    {
      name: "Annual Report 2023",
      url: "https://drive.google.com/file/d/1yKXgD_WsVQJTjS-adZAVZr163nzfX1Em/view?usp=sharing", // Replace with your actual file ID
    },
    {
      name: "Annual Report 2022",
      url: "https://drive.google.com/file/d/1uudDrqoAD-pSTX8vJOW8JoPx4EQtzwOZ/view?usp=sharing", // Replace with your actual file ID
    },
    {
      name: "Annual Report 2021",
      url: "https://drive.google.com/file/d/1jwk974Eg-DnxK8WPEMRk9nkO_xEerxjG/view?usp=sharing", // Replace with your actual file ID
    },
    {
      name: "Annual Report 2020",
      url: "https://drive.google.com/file/d/1lLkhuF2ynv3gv-Pui5ukSRzfQZxUo3wH/view?usp=sharing", // Replace with your actual file ID
    },
    {
      name: "Annual Report 2019",
      url: "https://drive.google.com/file/d/1cwsg7aH3_wJFJ8_qIqzRDb5UBveJIBwp/view?usp=sharing", // Replace with your actual file ID
    },
    {
      name: "Annual Report 2018",
      url: "https://drive.google.com/file/d/1VBerwB0NKW8vWr_fGAbq-iTcxcTJ22G2/view?usp=sharing", // Replace with your actual file ID
    },
    {
      name: "Annual Report 2017",
      url: "https://drive.google.com/file/d/1II8FkR91G5MTJfPaPTk7mAkMDdszmFYz/view?usp=sharing", // Replace with your actual file ID
    },
    {
      name: "Annual Report 2016",
      url: "https://drive.google.com/file/d/1SBVP8UIJe1sF73kJ3FLjd7kEkw259nQS/view?usp=sharing", // Replace with your actual file ID
    },
    {
      name: "Annual Report 2015",
      url: "https://drive.google.com/file/d/1iFlFYDE-JaN2QWZEYXfmTwxE2G0cRLJg/view?usp=sharing", // Replace with your actual file ID
    },
    {
      name: "Annual Report 2014",
      url: "https://drive.google.com/file/d/1cfBwwCv8NUFvdJuTwl3Vi3R6Dko8jLbB/view?usp=sharing", // Replace with your actual file ID
    },
    {
      name: "Annual Report 2013",
      url: "https://drive.google.com/file/d/1bkLLZZE6pmxZQhdQi36A-Umxl_mPbZwc/view?usp=sharing", // Replace with your actual file ID
    },
    {
      name: "Annual Report 2012",
      url: "https://drive.google.com/file/d/11W5W-9QrGYFKhErzLv8902MgqE699rlz/view?usp=sharing", // Replace with your actual file ID
    },
    // Add more files as needed
  ];
  

const Downloads = () => {
  const handleDownload = (url) => {
    Linking.openURL(url).catch((err) =>
      Alert.alert("Error", "Failed to open the link.")
    );
  };

  const { theme } = useContext(ThemeContext);

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme === "light" ? "#ffffff" : "#1e1e1e" },
      ]}
    >
      <Text
        style={[
          styles.title,
          { color: theme === "light" ? "#000000" : "#ffffff" },
        ]}
      >
        Downloads
      </Text>
      {files.length === 0 ? (
        <Text style={{ color: theme === "light" ? "#000000" : "#ffffff" }}>
          No files found.
        </Text>
      ) : (
        <FlatList
          data={files}
          keyExtractor={(item) => item.name}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View
              style={[
                styles.fileItem,
                { borderColor: theme === "light" ? "#e0e0e0" : "#444444" , backgroundColor: theme === "light" ? "#fff" : "#1e1e1e"},
              ]}
            >
              <Text
                style={[
                  styles.fileName,
                  { color: theme === "light" ? "#000000" : "#ffffff" },
                ]}
              >
                {item.name}
              </Text>
              <TouchableOpacity
                style={[
                  styles.downloadButton,
                  {
                    backgroundColor: theme === "light" ? "#B7C42E" : "#B7C42E",
                  },
                ]}
                onPress={() => handleDownload(item.url)}
              >
                <Text style={styles.downloadButtonText}>Download</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
};

export default Downloads;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
    },
    title: {
      fontSize: 24,
      marginBottom: 16,
      fontFamily: "Poppins-Bold",
    },
    fileItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 15,
      borderBottomWidth: 1,
      borderColor: "#e0e0e0", // This can be adjusted based on theme
      backgroundColor: "#f9f9f9", // Light background for file items
      borderRadius: 8, // Rounded corners
      marginBottom: 12, // Space between file items
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.2,
          shadowRadius: 1.41,
        },
        android: {
          elevation: 3,
        },
      }),
    },
    fileName: {
      fontFamily: "Poppins-SemiBold",
      fontSize: 16,
      color: "#333", // Slightly darker for better contrast
    },
    downloadButton: {
      width: 100,
      borderRadius: 10,
      height: 40, // Increased height for better touch area
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#B7C42E",
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.3,
          shadowRadius: 2,
        },
        android: {
          elevation: 5,
        },
      }),
    },
    downloadButtonText: {
      fontFamily: "Poppins-SemiBold",
      color: "#ffffff",
    },
  });
