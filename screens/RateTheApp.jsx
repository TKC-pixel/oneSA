import React, { useContext, useState } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeContext } from "../context/ThemeContext";

const RateTheApp = () => {
  const { theme } = useContext(ThemeContext);
  const [rating, setRating] = useState("");
  const [feedback, setFeedback] = useState("");

  const handleSubmit = () => {
    // Handle the submission logic here (e.g., send to a server or save in the database)
    if (rating === "") {
      Alert.alert("Please select a rating before submitting.");
      return;
    }
    Alert.alert("Thank you for your feedback!", `Rating: ${rating}\nFeedback: ${feedback}`);
    // Reset the input fields
    setRating("");
    setFeedback("");
  };

  return (
    <SafeAreaView style={theme === "light" ? styles.container : darkModeStyles.container}>
      <Text style={theme === "light" ? styles.title : darkModeStyles.title}>Rate Our App</Text>

      <Text style={theme === "light" ? styles.label : darkModeStyles.label}>How would you rate us?</Text>
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => setRating(star.toString())}>
            <Text style={rating >= star ? styles.filledStar : styles.emptyStar}>★</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={theme === "light" ? styles.label : darkModeStyles.label}>Your Feedback:</Text>
      <TextInput
        style={styles.input}
        placeholder="Type your feedback here..."
        placeholderTextColor={theme === "light" ? "#aaa" : "#888"}
        value={feedback}
        onChangeText={setFeedback}
        multiline
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default RateTheApp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 32,
    fontFamily: "Poppins-Bold",
    color: "#333",
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontFamily: "Poppins-SemiBold",
    color: "#333",
    marginTop: 20,
  },
  ratingContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  filledStar: {
    fontSize: 40,
    color: "#FFD700", // Gold color for filled stars
  },
  emptyStar: {
    fontSize: 40,
    color: "#ccc", // Gray color for empty stars
  },
  input: {
    height: 100,
    borderColor: "#B7C42E",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
    color: "#333",
    fontFamily: "Poppins-Regular",
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#B7C42E",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Poppins-Bold",
  },
});

const darkModeStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#121212",
  },
  title: {
    fontSize: 32,
    fontFamily: "Poppins-Bold",
    color: "#fff",
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontFamily: "Poppins-SemiBold",
    color: "#ccc",
    marginTop: 20,
  },
  input: {
    height: 100,
    borderColor: "#B7C42E",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
    color: "#fff",
    fontFamily: "Poppins-Regular",
  },
});
