import React, { useContext, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { UserContext } from "../context/UserContext";
import LoadingScreen from "../components/LoadingScreen";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import cardValidator from "card-validator";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../FIrebaseConfig";
import { ThemeContext } from "../context/ThemeContext";

const MembershipPage = () => {
  const { theme } = useContext(ThemeContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardType, setCardType] = useState("");
  const { userData } = useContext(UserContext);

  const validateInputs = () => {
    const cardNumberPattern = /^[0-9]{16}$/;
    const expiryDatePattern = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;
    const cvvPattern = /^[0-9]{3}$/;

    if (!cardNumberPattern.test(cardNumber.replace(/\s/g, ""))) {
      Alert.alert("Error", "Invalid card number");
      return false;
    }
    if (!expiryDatePattern.test(expiryDate)) {
      Alert.alert("Error", "Invalid expiry date");
      return false;
    }
    if (!cvvPattern.test(cvv)) {
      Alert.alert("Error", "Invalid CVV");
      return false;
    }
    return true;
  };

  const handlePayment = async () => {
    if (!validateInputs()) return;

    setIsProcessing(true);
    try {
      const response = await fetch("http://192.168.0.179:5000/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cardNumber: cardNumber.replace(/\s/g, ""),
          expiryDate,
          cvv,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        const userRef = doc(db, "Users", auth.currentUser.uid);
        await updateDoc(userRef, { isVerified: true });
        Alert.alert("Success", data.message);
        setModalVisible(false);
      } else {
        Alert.alert("Failure", data.error || "Payment processing failed.");
      }
    } catch (error) {
      Alert.alert("Error", "Network error. Please try again later.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCardNumberChange = (text) => {
    const formatted = text.replace(/\s+/g, "").replace(/(\d{4})(?=\d)/g, "$1 ");
    setCardNumber(formatted);
    const cardValidation = cardValidator.number(formatted);
    setCardType(cardValidation.card ? cardValidation.card.type : "");
  };

  const handleExpiryDateChange = (text) => {
    const formatted = text.replace(/\D/g, "").replace(/(\d{2})(\d)/, "$1/$2");
    setExpiryDate(formatted);
  };

  return (
    <SafeAreaView style={theme === "light" ? styles.container : darkModeStyles.container}>
      <Text style={theme === "light" ? styles.title : darkModeStyles.title}>
        Current Membership: {userData.isVerified ? "Ultimate Citizen" : "Free Tier"}
      </Text>

      <View style={theme === "light" ? styles.featuresContainer : darkModeStyles.featuresContainer}>
  <Text style={theme === "light" ? styles.featuresTitle : darkModeStyles.featuresTitle}>Features:</Text>
  <Text style={theme === "light" ? styles.feature : darkModeStyles.feature}>- Normal Citizen Status</Text>
  <Text style={theme === "light" ? styles.feature : darkModeStyles.feature}>- Read Only Debate Rooms</Text>
  <Text style={theme === "light" ? styles.feature : darkModeStyles.feature}>- No Verified Badge</Text>
  <Text style={theme === "light" ? styles.feature : darkModeStyles.feature}>- Manually search for information</Text>
</View>


      <View style={styles.divider} />

      <Text style={theme === "light" ? styles.title : darkModeStyles.title}>Upgrade to the Ultimate citizen status</Text>
<View style={theme === "light" ? styles.featuresContainer : darkModeStyles.featuresContainer}>
  <Text style={theme === "light" ? styles.featuresTitle : darkModeStyles.featuresTitle}>Features:</Text>
  <Text style={theme === "light" ? styles.feature : darkModeStyles.feature}>- Ultimate Citizen Status</Text>
  <Text style={theme === "light" ? styles.feature : darkModeStyles.feature}>- First Access To News</Text>
  <Text style={theme === "light" ? styles.feature : darkModeStyles.feature}>- Ability to create, host, and contribute to debate rooms</Text>
  <Text style={theme === "light" ? styles.feature : darkModeStyles.feature}>- Verified Badge within our app</Text>
  <Text style={theme === "light" ? styles.price : darkModeStyles.price}>Price: R99 / month</Text>
</View>


      <TouchableOpacity
        style={styles.button}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.buttonText}>Upgrade</Text>
      </TouchableOpacity>

      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={theme === "light" ? styles.modalView : darkModeStyles.modalView}>
          <Text style={theme === "light" ? styles.modalTitle : darkModeStyles.modalTitle}>Payment Details</Text>

          {cardType && (
            <Image
              source={{ uri: `../assets/images/${cardType}.png` }}
              style={styles.cardImage}
            />
          )}
          <TextInput
            style={theme === "light" ? styles.input : darkModeStyles.input}
            placeholder="Card Number"
            keyboardType="numeric"
            value={cardNumber}
            onChangeText={handleCardNumberChange}
            editable={!isProcessing}
          />

          <TextInput
            style={theme === "light" ? styles.input : darkModeStyles.input}
            placeholder="Expiry Date (MM/YY)"
            value={expiryDate}
            onChangeText={handleExpiryDateChange}
            editable={!isProcessing}
          />

          <TextInput
            style={theme === "light" ? styles.input : darkModeStyles.input}
            placeholder="CVV"
            keyboardType="numeric"
            secureTextEntry
            value={cvv}
            onChangeText={setCvv}
            editable={!isProcessing}
          />

          {isProcessing ? (
            <LoadingScreen />
          ) : (
            <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
              <Text style={styles.payButtonText}>Pay Now</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
            disabled={isProcessing}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default MembershipPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    marginBottom: 15,
    fontFamily: "Poppins-Bold",
    color: "#333",
  },
  featuresContainer: {
    marginVertical: 10,
    padding: 15,
    backgroundColor: "#f8f9fa",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  price: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    color: "#28a745", // Light green color for price
    marginTop: 10,
  },
  featuresTitle: {
    fontSize: 22,
    fontFamily: "Poppins-SemiBold",
    color: "#B7C42E",
    marginBottom: 5,
  },
  feature: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "#555",
  },
  divider: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 15,
  },
  button: {
    backgroundColor: "#B7C42E",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    // fontWeight: "bold",
    fontSize: 18,
    fontFamily: "Poppins-Bold",
  },
  modalView: {
    margin: 20,
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    marginBottom: 20,
    // fontWeight: "bold",
    fontFamily: "Poppins-Bold",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    width: "100%",
    backgroundColor: "#f1f3f5",
    fontFamily: "Poppins-Regular",
  },
  payButton: {
    backgroundColor: "#B7C42E",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
    width: "100%",
  },
  payButtonText: {
    color: "#fff",
    // fontWeight: "bold",
    fontSize: 18,
    fontFamily: "Poppins-Bold",
  },
  closeButton: {
    backgroundColor: "#dc3545",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
    width: "100%",

  },
  closeButtonText: {
    color: "#fff",
    // fontWeight: "bold",
    fontSize: 18,
    fontFamily: "Poppins-Bold",
  },
});

const darkModeStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#181818",
  },
  price: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    color: "#a2d81c", // Light green color for price in dark mode
    marginTop: 10,
  },
  title: {
    fontSize: 28,
    marginBottom: 15,
    fontFamily: "Poppins-Bold",
    color: "#f1f1f1",
  },
  featuresContainer: {
    marginVertical: 10,
    padding: 15,
    backgroundColor: "#252525",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featuresTitle: {
    fontSize: 22,
    fontFamily: "Poppins-SemiBold",
    color: "#B7C42E",
    marginBottom: 5,
  },
  feature: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "#bbbbbb",
  },
  modalView: {
    margin: 20,
    backgroundColor: "#303030",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    marginBottom: 20,
    // fontWeight: "bold",
    fontFamily: "Poppins-Bold",
    color: "#f1f1f1",
  },
  input: {
    height: 50,
    borderColor: "#444",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    width: "100%",
    backgroundColor: "#3b3b3b",
    fontFamily: "Poppins-Regular",
    color: "#e1e1e1",
  },
});
