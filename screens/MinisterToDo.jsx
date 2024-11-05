import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { db } from "../FIrebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { UserContext } from "../context/UserContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { ThemeContext } from "../context/ThemeContext";

const MinisterToDo = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const { userData } = useContext(UserContext);
  const { theme } = useContext(ThemeContext);
  const ministerID = userData.ministerID;

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const ministerRef = doc(db, "ministers", ministerID);
      const ministerDoc = await getDoc(ministerRef);

      if (ministerDoc.exists()) {
        const ministerData = ministerDoc.data();
        setTodos(ministerData.actionsToDo || []);
      } else {
        console.log("No such minister document found!");
        setTodos([]);
      }
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  const saveTodo = async () => {
    if (newTodo.trim() !== "") {
      const updatedTodos = [...todos, newTodo];
      setTodos(updatedTodos);
      setNewTodo("");

      try {
        const ministerRef = doc(db, "ministers", ministerID);
        await setDoc(ministerRef, { actionsToDo: updatedTodos }, { merge: true });
        console.log("Todo added successfully!");
      } catch (error) {
        console.error("Error saving todo:", error);
      }
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme === "light" ? "#f9f9f9" : "#121212" }]}>
      <Text style={[styles.title, { color: theme === "light" ? "#333" : "#fff" }]}>Minister's To-Do List</Text>
      <FlatList
        data={todos}
        renderItem={({ item }) => (
          <View style={[styles.todoItem, { backgroundColor: theme === "light" ? "#fff" : "#1e1e1e" }]}>
            <Ionicons name="checkbox-outline" size={24} color="#B7C42E" />
            <Text style={[styles.todoText, { color: theme === "light" ? "#333" : "#fff" }]}>{item}</Text>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, { borderColor: theme === "light" ? "#ddd" : "#555" }]}
          placeholder="Add a new item"
          placeholderTextColor={theme === "light" ? "#aaa" : "#888"}
          value={newTodo}
          onChangeText={setNewTodo}
        />
        <TouchableOpacity style={styles.addButton} onPress={saveTodo}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default MinisterToDo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    // fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    fontFamily: "Poppins-Bold",
  },
  todoItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  todoText: {
    fontSize: 18,
    marginLeft: 10,
    fontFamily: "Poppins-SemiBold",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    
  },
  input: {
    flex: 1,
    height: 45,
    borderWidth: 1,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: "#fff",
    marginRight: 10,
    fontFamily: "Poppins-Regular"
  },
  addButton: {
    backgroundColor: "#B7C42E",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    width: 80,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    // fontWeight: "bold",
    fontFamily: "Poppins-Bold",
  },
});
