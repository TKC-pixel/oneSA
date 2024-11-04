import React, { useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeContext } from "../context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

const NewsDetails = ({ route, navigation }) => {
  const { article } = route.params;
  const { theme } = useContext(ThemeContext);

  return (
    <SafeAreaView
      style={[styles.container, theme === "dark" && darkModeStyles.container]}
    >
      {article.urlToImage && (
        <Image source={{ uri: article.urlToImage }} style={styles.fullImage} />
      )}

      <TouchableOpacity
        style={theme === "light" ? styles.heartBtn : darkModeStyles.heartBtn}
        onPress={() => navigation.goBack()}
      >
        <Ionicons
          name="arrow-back-outline"
          size={30}
          color={theme === "light" ? "black" : "white"}
        />
      </TouchableOpacity>

      <ScrollView style={[styles.textContainer, { paddingHorizontal: 20 }]}>
        <Text style={[styles.title, theme === "dark" && darkModeStyles.title]}>
          {article.title}
        </Text>
        <Text style={[styles.date, theme === "dark" && darkModeStyles.date]}>
          {new Date(article.publishedAt).toLocaleDateString()}
        </Text>
        <Text
          style={[styles.content, theme === "dark" && darkModeStyles.content]}
        >
          {article.content || "No content available."}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default NewsDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  heartBtn: {
    position: "absolute",
    width: 50,
    height: 50,
    backgroundColor: "#D3D3D3",
    borderRadius: 25,
    top: 60,
    left: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  fullImage: {
    width: "100%",
    height: 430,
    borderRadius: 54,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontFamily: "Poppins-Bold",
    marginBottom: 10,
    color: "#333",
  },
  date: {
    fontSize: 14,
    color: "#999",
    marginBottom: 15,
    fontFamily: "Poppins-SemiBold",
  },
  content: {
    fontSize: 16,
    color: "#555",
    fontFamily: "Poppins-SemiBold",
  },
});

const darkModeStyles = StyleSheet.create({
  container: {
    backgroundColor: "#1e1e1e",
  },
  heartBtn: {
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
  title: {
    color: "#f5f5f5",
  },
  date: {
    color: "#ccc",
  },
  content: {
    color: "#ddd",
  },
});
