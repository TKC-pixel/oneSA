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
} from "react-native";
import React, { useEffect, useState, useContext } from "react";
import NavBar from "./NavBar";
import Entypo from "@expo/vector-icons/Entypo";
import { SafeAreaView } from "react-native-safe-area-context";
import { TouchableOpacity } from "react-native";
import { Dimensions } from "react-native";
import { app, db } from "../FIrebaseConfig";
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
} from "firebase/firestore";
import CustomKeyboardView from "./Keyboard";
import { useNavigation } from "@react-navigation/native";
const { width, height } = Dimensions.get("window");

export default function DebateRooms() {
  const navigation = useNavigation();
  const [debates, setDebates] = useState([]);
  const [add, setAdd] = useState(false);
  const [debateName, setDebateName] = useState("");
  const [department, setDepartment] = useState("");
  const [groupID, setGroupID] = useState("");
  const { theme } = useContext(ThemeContext);
  const { userData } = useContext(UserContext);

  const handleAdd = () => {
    setAdd(true);
  };
  const handleClose = () => {
    setAdd(false);
  };

  const createDebate = async (name, departmentName) => {
    if (name && departmentName) {
      try {
        const groupChatRef = await addDoc(collection(db, "Groups"), {
          title: name,
          createdAt: serverTimestamp(),
          department: departmentName,
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
                key={i}
                style={
                  theme == "light"
                    ? styles.debateItem
                    : darkModeStyles.debateItem
                }
              >
                <Text
                  style={
                    theme == "light"
                      ? styles.debateTitle
                      : darkModeStyles.debateTitle
                  }
                >
                  {debate.title}
                </Text>
                <Text style={styles.debateDepartment}>{debate.department}</Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>
        <Pressable style={styles.floatingButton} onPress={handleAdd}>
          <Entypo name="plus" size={24} color="black" />
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
            <Entypo name="plus" size={24} color="black" />
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
    bottom: -170,
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
    fontFamily: "Poppins-SemiBold"
  },
  debateDepartment: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
      fontFamily: "Poppins-Regular"
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
    fontFamily: "Poppins-SemiBold"
  },
  debateDepartment: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
     fontFamily: "Poppins-Regular"
  },
});
