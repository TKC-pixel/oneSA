// CustomSpinner.js
import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

const CustomSpinner = () => {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const spinAnimation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    );
    spinAnimation.start();

    return () => spinAnimation.stop(); 
  }, [spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View style={{ transform: [{ rotate: spin }] }}>
      <View style={styles.spinner} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  spinner: {
    width: 60,
    height: 60,
    borderWidth: 8,
    borderColor: '#3498db', 
    borderTopColor: 'transparent',
    borderRadius: 30,
  },
});

export default CustomSpinner;
