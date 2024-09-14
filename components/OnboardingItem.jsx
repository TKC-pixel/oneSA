import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
  useWindowDimensions,
} from "react-native";
import React from "react";

const OnboardingItem = ({ item }) => {
  const { width } = useWindowDimensions();
  return (
    <View style={[styles.container, { width }]}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.keyword}>{item.keyword}</Text>
      </View>
      <Image
        source={item.image}
        style={[styles.image, { width, resizeMode: "contain" }]}
      />
      <View style={styles.descriptionContainer}>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  );
};

export default OnboardingItem;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  titleContainer: {
    flex: 0.3,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    flex: 0.5,
    justifyContent: "center",
  },
  descriptionContainer: {
    flex: 0.2,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontWeight: "800",
    fontSize: 24,
    marginBottom: 10,
    color: "#000000",
    textAlign: "center",
  },
  description: {
    fontWeight: "300",
    color: "#62656b",
    textAlign: "center",
    fontSize: 16,
  },
  keyword: {
    fontWeight: "900",
    fontSize: 24,
    marginBottom: 10,
    color: "#B7C42E",
    textAlign: "center",
  },
});
