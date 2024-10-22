import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeContext } from "../context/ThemeContext";
import { ProgressBar, Colors } from "react-native-paper";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { UserContext } from "../context/UserContext";
import { Ionicons } from "@expo/vector-icons";
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { auth, db } from '../FIrebaseConfig';

// Reusable Row Component for Label & Info
const InfoRow = ({ label, info, labelStyle, infoStyle }) => {
  return (
    <View style={styles.infoRow}>
      <Text style={labelStyle}>{label}</Text>
      <Text style={infoStyle}>{info}</Text>
    </View>
  );
};

const ProjectDetails = ({ route }) => {
  const { item } = route.params;
  const { theme } = useContext(ThemeContext);
  const navigation = useNavigation();
  const { userData, setUserData } = useContext(UserContext); 
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const imageStyle = StyleSheet.create({
    image: {
      width: "100%",
      height: 430,
      borderRadius: 54,
      marginBottom: 21,
      shadowColor: "#000",
      shadowOpacity: theme === "dark" ? 0.4 : 0.2,
      shadowRadius: theme === "dark" ? 10 : 6,
      elevation: theme === "dark" ? 8 : 5,
    },
  });

  const handleLikeProject = async () => {
    if (!userData) return;

    const isAlreadyLiked = userData.favorites?.some(fav => fav.projectName === item.projectName);

    try {
      const userRef = doc(db, 'Users', auth.currentUser.uid);
      if (isAlreadyLiked) {
        // Remove project from favorites
        await updateDoc(userRef, {
          favorites: arrayRemove(item)
        });
        setUserData(prev => ({
          ...prev,
          favorites: prev.favorites.filter(fav => fav.projectName !== item.projectName)
        }));
        console.log('Project removed from favorites');
      } else {
        // Add project to favorites
        await updateDoc(userRef, {
          favorites: arrayUnion(item)
        });
        setUserData(prev => ({
          ...prev,
          favorites: [...(prev.favorites || []), item]
        }));
        console.log('Project added to favorites');
      }
    } catch (error) {
      console.error('Error updating favorites: ', error);
    }
  };

  const handleAddComment = async () => {
    console.log(newComment);
  };

  return (
    <SafeAreaView
      style={theme === "light" ? styles.container : darkModeStyles.container}
    >
      <Image
        style={imageStyle.image}
        source={{
          uri:
            item.imageUrl ||
            "https://masterbuilders.site-ym.com/resource/resmgr/docs/2022/Cabinet_approves_National_In.jpg",
        }}
      />
      <TouchableOpacity
        style={theme === "light" ? styles.backBtn : darkModeStyles.backBtn}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back-outline" size={30} color={theme === "light" ? "#000" : "#fff"} />
      </TouchableOpacity>
      <TouchableOpacity
        style={theme === "light" ? styles.heartBtn : darkModeStyles.heartBtn}
        onPress={handleLikeProject} // Call the handleLikeProject function when the heart is pressed
      >
        <Ionicons
          name={userData.favorites?.some(fav => fav.projectName === item.projectName) ? 'heart' : 'heart-outline'}
          size={30}
          color="red"
        />
      </TouchableOpacity>
      <ScrollView style={styles.textContainer}>
        <Text
          style={
            theme === "light" ? styles.projectName : darkModeStyles.projectName
          }
        >
          {item.projectName}
        </Text>

        {/* Reusing the InfoRow Component */}
        <InfoRow
          label="Department:"
          info={item.projectDepartment}
          labelStyle={theme === "light" ? styles.label : darkModeStyles.label}
          infoStyle={theme === "light" ? styles.info : darkModeStyles.info}
        />
        <InfoRow
          label="Status:"
          info={item.projectCompletionStatus}
          labelStyle={theme === "light" ? styles.label : darkModeStyles.label}
          infoStyle={theme === "light" ? styles.info : darkModeStyles.info}
        />
        <InfoRow
          label="Start Date:"
          info={item.projectStartDate}
          labelStyle={theme === "light" ? styles.label : darkModeStyles.label}
          infoStyle={theme === "light" ? styles.info : darkModeStyles.info}
        />
        <InfoRow
          label="Budget Allocation:"
          info={`R ${item.projectBudgetAllocation.toLocaleString()}`}
          labelStyle={theme === "light" ? styles.label : darkModeStyles.label}
          infoStyle={theme === "light" ? styles.info : darkModeStyles.info}
        />
        <InfoRow
          label="Tender Company:"
          info={item.projectTenderCompany}
          labelStyle={theme === "light" ? styles.label : darkModeStyles.label}
          infoStyle={theme === "light" ? styles.info : darkModeStyles.info}
        />

        <Text
          style={
            theme === "light" ? styles.projectName : darkModeStyles.projectName
          }
        >
          Current Progress
        </Text>
        <ProgressBar progress={0.5} color="#B7C42E" />

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("CreateReport", { item })}>
          <Text
            style={styles.buttonText}
            
          >
            File a report
          </Text>
        </TouchableOpacity>
        <View style={{height: 30}}></View>

        {/* Comments Section */}
        {/* <Text
          style={
            theme === "light" ? styles.projectName : darkModeStyles.projectName
          }
        >
          Comments
        </Text>

        {comments.map((comment, index) => (
          <View
            key={index}
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <Image
              style={styles.profileComments}
              source={{ uri: comment.profileImageUrl }}
            />
            <View style={{ marginLeft: 20 }}>
              <Text>{comment.username}</Text>
              <Text>{comment.text}</Text>
            </View>
          </View>
        ))}

        <TextInput
          placeholder="Type your comment"
          value={newComment}
          onChangeText={setNewComment}
          style={styles.commentInput} // Add some styling here
        />
        <TouchableOpacity style={styles.button} onPress={handleAddComment}>
          <Text style={styles.buttonText}>Add Comment</Text>
        </TouchableOpacity> */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProjectDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  profileComments: {
    borderRadius: 99,
    height: 50,
    width: 50,
  },
  backBtn: {
    position: "absolute",
    width: 50,
    height: 50,
    backgroundColor: "#D3D3D3", // 0.7 for 70% opacity
    borderRadius: 25,
    top: 60,
    left: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  
  heartBtn: {
    position: "absolute",
    width: 50,
    height: 50,
    backgroundColor: "#D3D3D3",
    borderRadius: 25,
    top: 60,
    right: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
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
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
    fontFamily: "Poppins-Bold",
  },
  projectName: {
    fontSize: 24,
    fontFamily: "Poppins-Bold",
    color: "#333",
    marginBottom: 5,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    color: "#333",
  },
  info: {
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
    color: "#555",
  },
  textContainer: {
    paddingHorizontal: 18,
  },
});

const darkModeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  heartBtn: {
    position: "absolute",
    width: 50,
    height: 50,
    backgroundColor: "#000",
    borderRadius: 25,
    top: 60,
    right: 20,
    justifyContent: "center",
    alignItems: "center",
  },
    
  backBtn: {
    position: "absolute",
    width: 50,
    height: 50,
    backgroundColor: "#000",
    borderRadius: 25,
    top: 60,
    left: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  projectName: {
    fontSize: 24,
    fontFamily: "Poppins-Bold",
    color: "#fff",
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    color: "#fff",
  },
  info: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "#ccc",
  },
});
