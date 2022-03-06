import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Modal,
  ActivityIndicator,
  Image,
  Animated,
  Easing,
} from "react-native";

const Loader = (props) => {
  const { loading, ...attributes } = props;

  spinValue = new Animated.Value(0);

  // First set up animation
  Animated.loop(
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 3000,
      easing: Easing.linear, // Easing is an additional import from react-native
      useNativeDriver: true, // To make use of native driver for performance
    })
  ).start();

  // Next, interpolate beginning and end values (in this case 0 and 1)
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <Modal
      transparent={true}
      animationType={"none"}
      visible={loading}
      onRequestClose={() => {
        console.log("close modal");
      }}
    >
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
          {/* <ActivityIndicator color="salmon" size="large" animating={loading} /> */}
          <Animated.Image
            style={{
              width: 80,
              height: 80,
              tintColor: "salmon",
              transform: [{ rotate: spin }],
            }}
            source={require("@/assets/adaptive-icon.png")}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "space-around",
    backgroundColor: "#00000040",
  },
  activityIndicatorWrapper: {
    backgroundColor: "#FFFFFF",
    height: 100,
    width: 100,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
  },
});

export default Loader;
