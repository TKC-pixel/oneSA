import { StyleSheet, Text, View } from "react-native";
import React from "react";
import SuccessRate from "../components/SuccessRate";

const SuccessRateScreen = ({ route }) => {
  const { dept, id, prov } = route.params || {};
  return (
    <View style={styles.safeArea}>
      <SuccessRate dept={dept} id={id} prov={prov}/>
    </View>
  );
};

export default SuccessRateScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 18,
  },
});
