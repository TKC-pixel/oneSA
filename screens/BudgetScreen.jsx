import React from "react";
import { StyleSheet, View } from "react-native";
import BudgetAllocation from "../components/BudgetAllocation";

const BudgetScreen = ({ route }) => {
  const { dept, id, prov } = route.params || {};

  return (
    <View style={styles.safeArea}>
      <BudgetAllocation dept={dept} id={id} prov={prov}/>
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
