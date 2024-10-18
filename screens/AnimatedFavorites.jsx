import React, { useRef, useState, useContext } from "react";
import { FlatList, Text, TouchableOpacity, StyleSheet, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { UserContext } from "../context/UserContext";
import { useNavigation } from "@react-navigation/native";

const AnimatedListItem = ({ projectName, isFocused, onPress }) => {
    
  const scale = useSharedValue(isFocused ? 1 : 0.8);

  React.useEffect(() => {
    scale.value = withTiming(isFocused ? 1 : 0.5, { duration: 300 });
  }, [isFocused]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <TouchableOpacity onPress={onPress}>
      <Animated.View style={[styles.animatedView, animatedStyle]}>
        <Text style={styles.projectName}>{projectName}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

const AnimatedFlatList = () => {
  const { userData } = useContext(UserContext);
  const { favorites } = userData || {}; // Handle case where userData is undefined
  const navigation = useNavigation();
  const [focusedItems, setFocusedItems] = useState([]);

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    const viewableItemIds = viewableItems.map((item) => item.item.id);
    setFocusedItems(viewableItemIds);
  }).current;

  const renderItem = ({ item }) => {
    const isFocused = focusedItems.includes(item.id);
    const onPress = () => {
      navigation.navigate("FavoriteDetails", { item });
    };
    return (
      <AnimatedListItem
        projectName={item.projectName}
        isFocused={isFocused}
        onPress={onPress}
      />
    );
  };

  if (!favorites || favorites.length === 0) {
    // Display a fallback message or empty view if there are no favorites
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No favorites available</Text>
      </View>
    );
  }

  return (
    <FlatList
      style={{ height: 110 }}
      data={favorites}
      renderItem={renderItem}
      keyExtractor={(item) => item.id ? item.id.toString() : `key-${Math.random()}`}

      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={viewabilityConfig}
      snapToInterval={110}
      decelerationRate="fast"
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  animatedView: {
    height: 100,
    backgroundColor: "lightblue",
    marginVertical: 5,
    borderRadius: 10,
    justifyContent: "center",
    paddingHorizontal: 15,
  },
  projectName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
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
});

export default AnimatedFlatList;
