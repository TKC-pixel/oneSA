import { StyleSheet, Text, View } from "react-native";
import React from "react";
import BudgetAllocation from "../components/BudgetAllocation";

const BudgetScreen = () => {
  return (
    <View style={styles.safeArea}>
      <BudgetAllocation />
    </View>
  );
};

export default BudgetScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 18,
  },
});
