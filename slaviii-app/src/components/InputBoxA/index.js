import { TextInput } from "react-native";

import styles from "./styles";

const InputBoxA = (props) => {
  return (
    <TextInput
      style={styles.input}
      placeholder={props.placeholder}
      placeholderTextColor="#aaaaaa"
      onChangeText={props.onChange}
      value={props.value}
      underlineColorAndroid="transparent"
      autoCapitalize="none"
      secureTextEntry={props.secureTextEntry}
      onBlur={props.onBlur}
      keyboardType={props.keyboardType}
      textContentType={props.textContentType}
    />
  );
};

export default InputBoxA;
