import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ImageBackground,
  TextInput,
  ScrollView,
  Alert,
  Image,
  LogBox,
} from "react-native";
import React, { useEffect, useState, useContext } from "react";
import NavBar from "./NavBar";
import Entypo from "@expo/vector-icons/Entypo";
import { SafeAreaView } from "react-native-safe-area-context";
import { TouchableOpacity } from "react-native";
import { Dimensions } from "react-native";
import { app, db, auth, storage } from "../FIrebaseConfig";
import { ThemeContext } from "../context/ThemeContext";
import { UserContext } from "../context/UserContext";
import {
  collection,
  addDoc,
  doc,
  serverTimestamp,
  getDocs,
  onSnapshot,
  query,
  writeBatch,
  deleteDoc,
  where,
} from "firebase/firestore";
import CustomKeyboardView from "./Keyboard";
import { useNavigation } from "@react-navigation/native";
const { width, height } = Dimensions.get("window");
import { Icon } from "react-native-elements";
import { ref, listAll, deleteObject, getDownloadURL } from "firebase/storage";
import { Ionicons } from "@expo/vector-icons";

export default function DebateRooms() {
  const navigation = useNavigation();
  const [debates, setDebates] = useState([]);
  const [add, setAdd] = useState(false);
  const [debateName, setDebateName] = useState("");
  const [department, setDepartment] = useState("");
  const [groupID, setGroupID] = useState("");
  const { theme } = useContext(ThemeContext);
  const { userData } = useContext(UserContext);

  const userID = auth.currentUser ? auth.currentUser.uid : null;
  
LogBox.ignoreAllLogs(true);
  const handleAdd = () => {
    setAdd(true);
  };
  const handleClose = () => {
    setAdd(false);
  };

  const deleteMessages = async (id) => {
    const q = query(collection(db, "messages"), where("groupID", "==", id));

    //creating a batch to delete docs in small sizes to make the performance better
    let batch = writeBatch(db);
    let batchSize = 500;
    let count = 0;

    const querySnapshot = await getDocs(q);

    for (const doc of querySnapshot.docs) {
      batch.delete(doc.ref);
      count++;

      if (count === batchSize) {
        await batch.commit();
        batch = writeBatch(db);
        count = 0;
      }
    }

    if (count > 0) {
      await batch.commit();
    }
    console.log("messages are deleted for group", id);
  };

  const listRefItems = async (id) => {
    try {
      if (!id || typeof id !== "string" || id.trim() === "") {
        console.error("Invalid group ID for image deletion");
        return { success: false, error: "Invalid group ID" };
      }

      const mediaRef = ref(storage, `messageImages/${id}`);
      console.log("Media ref:", mediaRef);

      const listResponse = await listAll(mediaRef);
      listResponse.items.forEach((itemRef) => {
        console.log("item ref: ", itemRef);
      });

      return listResponse;
    } catch (err) {
      console.log("list ref function error:", err); // Log the entire error object
      return { success: false, error: err.message || "Unknown error" };
    }
  };

  const deleteImages = async (id) => {
    // Define mediaRef before the try block
    const mediaRef = ref(storage, `messageImages/${id}`);

    try {
      console.log("Starting deletion for group:", id);

      if (!id || typeof id !== "string" || id.trim() === "") {
        console.error("Invalid group ID for image deletion");
        return { success: false, error: "Invalid group ID" };
      }

      console.log("Full storage path:", mediaRef.fullPath);

      const listResponse = await listAll(mediaRef);
      console.log("List response:", listResponse);

      if (listResponse.items.length === 0) {
        console.log("No files found to delete");
        return { success: true, message: "No files to delete" };
      }

      // Deletion logic
      const deletePromises = listResponse.items.map((itemRef) =>
        deleteObject(itemRef)
      );
      await Promise.all(deletePromises);

      console.log("All files deleted successfully");
      return { success: true, message: "All files deleted successfully" };
    } catch (listError) {
      console.log("Detailed list/delete error:", {
        code: listError.code,
        message: listError.message,
        fullPath: mediaRef ? mediaRef.fullPath : "undefined",
      });
      return {
        success: false,
        error: listError.message || "Unknown error",
      };
    }
  };

  const handleDelete = async (id, user_id) => {
    console.log(id);
    if (userID === user_id) {
      try {
        const imagesDeletionResult = await deleteImages(id);

        if (!imagesDeletionResult.success) {
          console.log(
            "Image deletion encountered an issue:",
            imagesDeletionResult
          );
        }

        // Continue with other deletion steps even if image deletion partially fails
        await listRefItems(id);
        await deleteMessages(id);
        await deleteDoc(doc(db, "Groups", `${id}`));

        // Optional: Show a success message
        Alert.alert(
          "Success",
          "Group and associated files deleted successfully"
        );
      } catch (err) {
        console.error("Deletion Error:", err);
      }
    } else {
      Alert.alert(
        "Permission Denied",
        "Only the creator of the group can delete the group",
        [{ text: "OK", style: "cancel" }]
      );
    }
  };

  const createDebate = async (name, departmentName) => {
    if (name && departmentName) {
      try {
        const groupChatRef = await addDoc(collection(db, "Groups"), {
          title: name,
          createdAt: serverTimestamp(),
          department: departmentName,
          creatorID: userID,
        });
        console.log("Group chat created with ID:", groupChatRef.id);
        setGroupID(groupChatRef.id);
        setAdd(false);
        setDepartment("");
        setDebateName("");
      } catch (err) {
        console.log("group creation error", err);
      }
    } else {
      Alert.alert("please fill all fields");
    }
  };

  const DebateDetails = () => {
    const [localDebateName, setLocalDebateName] = useState(debateName);
    const [localDepartment, setLocalDepartment] = useState(department);

    const handleStartDebate = () => {
      setDebateName(localDebateName);
      setDepartment(localDepartment);
      createDebate(localDebateName, localDepartment);
    };

    return (
      <View style={[styles.debateDetails, { display: add ? "flex" : "none" }]}>
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <Entypo name="cross" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.cardContent}>
          <Text style={styles.label}>Debate Name</Text>
          <TextInput
            placeholder="Debate Name"
            style={styles.input}
            value={localDebateName}
            onChangeText={setLocalDebateName}
          />
          <Text style={styles.label}>Department Concerned</Text>
          <TextInput
            placeholder="Department Concerned"
            style={styles.input}
            value={localDepartment}
            onChangeText={setLocalDepartment}
          />
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleStartDebate}
          >
            <Text style={styles.buttonText}>Start Debate</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const FilledDebatesRoom = () => {
    return (
      <View
        style={theme == "light" ? styles.container : darkModeStyles.container}
      >
        <NavBar userInfo={userData} />
        <ScrollView
          style={theme == "light" ? styles.content : darkModeStyles.content}
        >
          {debates.map((debate, i) => (
            <Pressable
              onPress={() =>
                navigation.navigate("Chat", {
                  groupID: debate.groupID,
                  debatename: debate.title,
                })
              }
              key={i}
            >
              <View
                style={
                  theme == "light"
                    ? styles.debateItem
                    : darkModeStyles.debateItem
                }
              >
                <View style={styles.debateItemContent}>
                  <View style={styles.debateTextContainer}>
                    <Text
                      style={
                        theme == "light"
                          ? styles.debateTitle
                          : darkModeStyles.debateTitle
                      }
                    >
                      {debate.title}
                    </Text>
                    <Text style={styles.debateDepartment}>
                      {debate.department}
                    </Text>
                  </View>
                  {userID === debate.creatorID && (
                    <Pressable
                      style={styles.deleteButton}
                      onPress={(event) => {
                        event.stopPropagation();
                        handleDelete(debate.groupID, debate.creatorID);
                      }}
                    >
                      <Icon
                        type="font-awesome"
                        name="trash"
                        size={25}
                        color="white"
                      />
                    </Pressable>
                  )}
                </View>
              </View>
            </Pressable>
          ))}
        </ScrollView>
        <Pressable style={styles.floatingButton} onPress={handleAdd}>
          <Ionicons name="add-outline" size={25} style={{fontWeight: "bold"}}/>
        </Pressable>
        <DebateDetails />
      </View>
    );
  };

  const EmptyDebatesRoom = () => {
    return (
      <View>
        <NavBar />
        <View style={styles.backgroundContainer}>
          <Image
            source={require("../assets/images/debate.png")}
            style={styles.backgroundImage}
            resizeMode="contain"
          />
          <DebateDetails />
          <Pressable style={styles.floatingButton} onPress={handleAdd}>
          <Ionicons name="add-outline" size={25} style={{fontWeight: "bold"}}/>
          </Pressable>
        </View>
      </View>
    );
  };

  const fetchGroups = () => {
    const q = query(collection(db, "Groups"));
    const unSubscribe = onSnapshot(q, (querySnapshot) => {
      const groups = [];
      querySnapshot.forEach((doc) => {
        groups.push({
          title: doc.data().title,
          department: doc.data().department,
          groupID: doc.id,
          creatorID: doc.data().creatorID,
        });
      });
      setDebates(groups);
    });
    return unSubscribe;
  };

  useEffect(() => {
    const unSubscribe = fetchGroups();

    return () => unSubscribe();
  }, []);

  return (
    <View style={theme == "light" ? styles.safeArea : darkModeStyles.safeArea}>
      <CustomKeyboardView>
        {debates.length !== 0 ? <FilledDebatesRoom /> : <EmptyDebatesRoom />}
        {/* <EmptyDebatesRoom /> */}
      </CustomKeyboardView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingHorizontal: 18,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  floatingButton: {
    position: "absolute",
    right: 5,
    bottom: 100,
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  debateItem: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    marginHorizontal: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  debateTitle: {
    fontSize: 18,
    // fontWeight: "bold",
    color: "#333",
    fontFamily: "Poppins-SemiBold",
  },
  debateDepartment: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
    fontFamily: "Poppins-Regular",
  },
  deleteButton: {
    backgroundColor: "#ff4d4d",
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginTop: 10,
    alignSelf: "flex-end",
  },
  deleteButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  backgroundContainer: {
    position: "relative",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backgroundImage: {
    justifyContent: "center",
    width: 300,
    height: 400,
    marginTop: 140,
    backgroundColor: "transparent",
    alignSelf: "center",
  },
  input: {
    width: width - 40,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    fontFamily: "Poppins-Regular",
  },
  loginButton: {
    width: width - 40,
    backgroundColor: "#B7C42E",
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  debateDetails: {
    position: "absolute",
    width: "100%",
    height: height / 2,
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    bottom: 40,
    zIndex: 10000,
  },
  cardContent: {
    width: "100%",
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  closeButton: {
    position: "absolute",
    top: 15,
    right: 15,
    zIndex: 1,
  },
});
const darkModeStyles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: "#121212",
  },
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 18,
    backgroundColor: "#121212",
  },
  debateItem: {
    backgroundColor: "#333",
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    marginHorizontal: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  debateTitle: {
    fontSize: 18,
    // fontWeight: "bold",
    color: "white",
    fontFamily: "Poppins-SemiBold",
  },
  debateDepartment: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
    fontFamily: "Poppins-Regular",
  },
});
