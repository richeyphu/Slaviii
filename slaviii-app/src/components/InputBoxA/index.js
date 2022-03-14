import { useState } from 'react';
import { View,TextInput,TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

import styles from "./styles";

const InputBoxA = (props) => {
  const [showPassword, setShowPassword] = useState(props.secureTextEntry)
  return (
    <View style={styles.container}>
      <View style={styles.inputBox}>
      <TextInput
        style={styles.inputField}
        placeholder={props.placeholder}
        placeholderTextColor="#aaaaaa"
        onChangeText={props.onChange}
        value={props.value}
        underlineColorAndroid="transparent"
        autoCapitalize="none"
        secureTextEntry={showPassword}
        onBlur={props.onBlur}
        keyboardType={props.keyboardType}
        textContentType={props.textContentType}
      />
      {props.secureTextEntry && (
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
        >
          <Feather name={showPassword ? "eye" : "eye-off"} size={24} color="dimgrey" />
        </TouchableOpacity>
      )}
      </View>
    </View>
  );
};

export default InputBoxA;
