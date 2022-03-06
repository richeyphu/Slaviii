import React from "react";
import { ActivityIndicator } from "react-native";
import styles from "./styles";

export default LoadScreen = () => {
  return (
    <ActivityIndicator
      size="large"
      color="salmon"
      style={styles.loadingIndicator}
    />
  );
};
