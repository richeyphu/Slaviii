import React from "react";
import { Image, StyleSheet } from "react-native";

export const Logo = ({ uri }) => {
  return <Image source={uri} style={styles.image} />;
};

const styles = StyleSheet.create({
  image: {
    width: 150,
    height: 150,
  },
});
