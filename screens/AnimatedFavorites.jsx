import React, { useContext } from "react";
import {
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
  Image,
  ImageBackground,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { UserContext } from "../context/UserContext";
import { useNavigation } from "@react-navigation/native";

const AnimatedListItem = ({ imageUrl, projectName, onPress }) => {
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);

  React.useEffect(() => {
    scale.value = withTiming(1, { duration: 400 });
    opacity.value = withTiming(1, { duration: 400 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <TouchableOpacity onPress={onPress}>
      <Animated.View style={[styles.animatedView, animatedStyle]}>
        <ImageBackground
          borderRadius={10}
          source={{ uri: imageUrl }}
          style={styles.imageBackground}
          blurRadius={5}
        >
          <Text style={styles.projectName}>{projectName}</Text>
        </ImageBackground>
      </Animated.View>
    </TouchableOpacity>
  );
};

const AnimatedFlatList = () => {
  const { userData } = useContext(UserContext);
  const { favorites } = userData || {}; // Handle case where userData is undefined
  const navigation = useNavigation();
  console.log(favorites);
  const renderItem = ({ item }) => {
    const onPress = () => {
      navigation.navigate("FavoriteDetails", { item });
    };
    return (
      <AnimatedListItem
        imageUrl={
          item.imageUrl ||
          "https://masterbuilders.site-ym.com/resource/resmgr/docs/2022/Cabinet_approves_National_In.jpg"
        }
        projectName={item.projectName}
        onPress={onPress}
      />
    );
  };

  if (!favorites || favorites.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text
          style={[
            styles.emptyText,
            { fontFamily: "Poppins-Bold", marginTop: 10 },
          ]}
        >
          No favorites available
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      style={{ height: 110 }}
      data={favorites}
      renderItem={renderItem}
      keyExtractor={(item) =>
        item.id ? item.id.toString() : `key-${Math.random()}`
      }
      showsVerticalScrollIndicator={false}
      snapToInterval={100} // Match this with the item height
      snapToAlignment="start" // Ensures snapping to the start of the item
      decelerationRate="fast" // Adjusts the deceleration speed
    />
  );
};

const styles = StyleSheet.create({
  animatedView: {
    height: 100, // Ensure this matches your snapToInterval
    // backgroundColor: "lightblue",
    marginVertical: 5,
    borderRadius: 10,
    justifyContent: "center",
    paddingHorizontal: 15,
  },
  projectName: {
    fontSize: 34,
    // fontWeight: "bold",
    color: "#333",
    fontFamily: "Poppins-Bold",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    color: "#888",
  },
  imageBackground: {
    height: 100,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default AnimatedFlatList;
