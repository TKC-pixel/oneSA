import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  ScrollView,
  TextInput,
} from "react-native";
import React, { useContext, useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { ThemeContext } from "../context/ThemeContext";
import { TouchableOpacity } from "react-native";
import { ProgressBar } from "react-native-paper";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { auth, db } from "../FIrebaseConfig";
import { UserContext } from "../context/UserContext";
import LoadingScreen from "../components/LoadingScreen";
import * as Font from "expo-font";

const MinisterDetail = ({ route, navigation }) => {
  const { minister } = route.params;
  const { theme } = useContext(ThemeContext);
  const { userData, setUserData } = useContext(UserContext);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [ratingCount, setRatingCount] = useState(1);
  const [newRating, setNewRating] = useState(minister.rating || 0);
  console.log(minister);
  // Load fonts asynchronously
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

  if (!fontsLoaded) {
    return <LoadingScreen />;
  }

  const handleLikeMinister = async () => {
    if (!userData) return;

    const isAlreadyLiked = userData.favorites?.some(
      (fav) => fav.ministerName === minister.ministerName
    );

    try {
      const userRef = doc(db, "Users", auth.currentUser.uid);
      if (isAlreadyLiked) {
        // Remove from favorites
        await updateDoc(userRef, {
          favorites: arrayRemove(minister),
        });
        setUserData((prev) => ({
          ...prev,
          favorites: prev.favorites.filter(
            (fav) => fav.ministerName !== minister.ministerName
          ),
        }));
      } else {
        // Add to favorites
        await updateDoc(userRef, {
          favorites: arrayUnion(minister),
        });
        setUserData((prev) => ({
          ...prev,
          favorites: [...(prev.favorites || []), minister],
        }));
      }
    } catch (error) {
      console.error("Error updating favorites: ", error);
    }
  };

  const handleAddComment = () => {
    // Add new comment logic
    console.log(newComment);
  };

  const handleRateMinister = async () => {
    if (!userData) return;

    const newTotalRating =
      (newRating * ratingCount + newRating) / (ratingCount + 3);
    setRatingCount((prev) => prev + 1);
    setNewRating(newTotalRating);

    try {
      const ministerRef = doc(db, "ministers", minister.ministerID); // Assuming ministerID is unique
      await updateDoc(ministerRef, {
        rating: newTotalRating,
      });
    } catch (error) {
      console.error("Error updating rating: ", error);
    }
  };

  return (
    <SafeAreaView
      style={theme === "light" ? styles.container : darkModeStyles.container}
    >
      <Image
        source={{ uri: minister.ministerProfileImage }}
        resizeMode="cover"
        style={styles.ministerImage}
      />
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
      <ScrollView style={styles.textContainer}>
        <Text
          style={
            theme === "light"
              ? styles.ministerName
              : darkModeStyles.ministerName
          }
        >
          {minister.ministerName}
        </Text>
        <Text
          style={
            theme === "light" ? styles.ministerBio : darkModeStyles.ministerBio
          }
        >
          {minister.bio}
        </Text>
        <Text
          style={
            theme === "light"
              ? styles.ministerDepartment
              : darkModeStyles.ministerDepartment
          }
        >
          {" "}
          Minister of {minister.ministerDepartment.name}
        </Text>

        {/* KPI Section */}
        <Text
          style={
            theme === "light" ? styles.kpiHeader : darkModeStyles.kpiHeader
          }
        >
          KPI Overview
        </Text>
        <Text
          style={theme === "light" ? styles.kpiText : darkModeStyles.kpiText}
        >
          Approval Rating: {minister.kpi.approvalRating}%
        </Text>
        <ProgressBar
          progress={minister.kpi.approvalRating / 100}
          color="#B7C42E"
        />
        <Text
          style={theme === "light" ? styles.kpiText : darkModeStyles.kpiText}
        >
          Budget Utilization: {minister.kpi.budgetUtilization}%
        </Text>
        <ProgressBar
          progress={minister.kpi.budgetUtilization / 100}
          color="#B7C42E"
        />
        <Text
          style={theme === "light" ? styles.kpiText : darkModeStyles.kpiText}
        >
          Projects Completed: {minister.kpi.completedProjects}/
          {minister.kpi.totalProjects}
        </Text>
        <ProgressBar
          progress={minister.kpi.completedProjects / minister.kpi.totalProjects}
          color="#B7C42E"
        />

        <Text
          style={
            theme === "light" ? styles.kpiHeader : darkModeStyles.kpiHeader
          }
        >
          Rate the Minister:
        </Text>
        <View style={styles.ratingContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity key={star} onPress={() => setUserRating(star)}>
              <Ionicons
                name={star <= userRating ? "star" : "star-outline"}
                size={30}
                color={star <= userRating ? "#FFD700" : "#ccc"}
              />
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity
          style={styles.submitRatingBtn}
          onPress={handleRateMinister}
        >
          <Text style={styles.buttonText}>Submit Rating</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MinisterDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  ministerImage: {
    width: "100%",
    height: 430,
    borderRadius: 54,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
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
  textContainer: {
    paddingHorizontal: 18,
  },
  ministerName: {
    fontSize: 24,
    fontFamily: "Poppins-Bold",
    marginBottom: 0,
  },
  ministerDepartment: {
    fontSize: 20,
    fontFamily: "Poppins-SemiBold",
    marginBottom: 10,
  },
  ministerBio: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    marginVertical: 10,
  },
  kpiHeader: {
    fontSize: 20,
    fontFamily: "Poppins-Bold",
    marginBottom: 10,
  },
  kpiText: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    marginBottom: 5,
  },
  commentHeader: {
    fontSize: 20,
    fontFamily: "Poppins-Bold",
    marginVertical: 10,
  },
  commentRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  commentImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  commentContent: {
    marginLeft: 20,
  },
  commentAuthor: {
    fontFamily: "Poppins-Bold",
  },
  commentText: {
    fontFamily: "Poppins-Regular",
  },
  commentInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  addCommentBtn: {
    backgroundColor: "#B7C42E",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  ratingHeader: {
    fontSize: 20,
    fontFamily: "Poppins-Bold",
    marginVertical: 10,
  },
  ratingContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 15,
  },
  submitRatingBtn: {
    backgroundColor: "#B7C42E",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontFamily: "Poppins-Bold",
  },
});

const darkModeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212", // Dark background color
  },
  ministerImage: {
    width: "100%",
    height: 430,
    borderRadius: 54,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 6,
  },
  heartBtn: {
    position: "absolute",
    width: 50,
    height: 50,
    backgroundColor: "#333", // Darker gray background for the button
    borderRadius: 25,
    top: 60,
    left: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    paddingHorizontal: 18,
  },
  ministerName: {
    fontSize: 24,
    fontFamily: "Poppins-Bold",
    color: "#ffffff", // White text
    marginBottom: 0,
  },
  ministerDepartment: {
    fontSize: 20,
    fontFamily: "Poppins-SemiBold",
    color: "#cccccc", // Light gray for subheadings
    marginBottom: 10,
  },
  ministerBio: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "#b0b0b0", // Muted gray for body text
    marginVertical: 10,
  },
  kpiHeader: {
    fontSize: 20,
    fontFamily: "Poppins-Bold",
    color: "#ffffff", // White text for headers
    marginBottom: 10,
  },
  kpiText: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "#cccccc", // Light gray for text
    marginBottom: 5,
  },
  commentHeader: {
    fontSize: 20,
    fontFamily: "Poppins-Bold",
    color: "#ffffff", // White text for comment headers
    marginVertical: 10,
  },
  commentRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  commentImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  commentContent: {
    marginLeft: 20,
  },
  commentAuthor: {
    fontFamily: "Poppins-Bold",
    color: "#ffffff", // White text for comment author
  },
  commentText: {
    fontFamily: "Poppins-Regular",
    color: "#cccccc", // Light gray for comment text
  },
  commentInput: {
    borderWidth: 1,
    borderColor: "#333", // Darker border for input
    backgroundColor: "#1e1e1e", // Dark input background
    color: "#ffffff", // White text for input
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  addCommentBtn: {
    backgroundColor: "#FFB800", // Bright accent color for button
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#000", // Dark text for the button
    fontFamily: "Poppins-Bold",
  },
});
