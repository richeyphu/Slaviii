import React from "react";
import { TouchableOpacity, Text } from "react-native";

import styles from "./styles";

const ButtonA = (props) => {
  return (
    <TouchableOpacity style={styles.button} onPress={props.onPress}>
      <Text style={styles.buttonTitle}>{props.text}</Text>
    </TouchableOpacity>
  );
};

export default ButtonA;
