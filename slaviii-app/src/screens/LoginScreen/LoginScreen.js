import React, { useState, useContext } from "react";
import { Image, Text, View, LogBox } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import styles from "./styles";
import { firebase } from "@/src/firebase/config";

import { userStoreContext } from "@/src/contexts/UserContext";
import {
  Loader,
  InputBoxA as InputBox,
  ButtonA as Button,
} from "@/src/components";

LogBox.ignoreLogs([
  "Setting a timer",
  "Unhandled promise rejection",
  "VirtualizedLists should never be nested",
  "Can't perform a React state update",
]);

export default function LoginScreen({ navigation }) {
  const userStore = useContext(userStoreContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSignupPress = () => {
    navigation.navigate("Registration");
  };

  const onForgotPasswordPress = () => {
    navigation.navigate("ForgotPassword");
  };

  const onLoginPress = () => {
    setLoading(true);

    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((response) => {
        const uid = response.user.uid;
        const usersRef = firebase.firestore().collection("users");
        usersRef
          .doc(uid)
          .get()
          .then(async (firestoreDocument) => {
            if (!firestoreDocument.exists) {
              alert("User does not exist anymore.");
              return;
            }
            const user = firestoreDocument.data();

            // update profile by context (Global State)
            userStore.updateProfile(user);

            navigation.navigate("Home", { user: user });
          })
          .catch((error) => {
            alert(error);
          });
      })
      .catch((error) => {
        alert(error);
      });

    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Loader loading={loading} />
      <KeyboardAwareScrollView
        style={{ flex: 1, width: "100%" }}
        keyboardShouldPersistTaps="always"
      >
        <Image
          style={styles.logo}
          source={require("@/assets/adaptive-icon.png")}
        />
        <Text style={styles.title}>Slaviii</Text>
        <InputBox
          placeholder="E-mail"
          onChange={(text) => setEmail(text)}
          value={email}
          keyboardType="email-address"
        />
        <InputBox
          placeholder="Password"
          onChange={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
        />
        <Button text="Log in" onPress={() => onLoginPress()} />
        <View style={styles.footerView}>
          <Text style={styles.footerText}>
            Don't have an account?{" "}
            <Text onPress={onSignupPress} style={styles.footerLink}>
              Sign up
            </Text>
          </Text>
          <Text style={styles.footerText}>
            {"\n"}Forgot Password?{" "}
            <Text onPress={onForgotPasswordPress} style={styles.footerLink}>
              Reset
            </Text>
          </Text>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}
