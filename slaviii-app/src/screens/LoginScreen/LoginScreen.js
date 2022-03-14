import React, { useState, useEffect, useContext } from "react";
import { Image, Text, View, LogBox } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import styles from "./styles";

import { Formik } from "formik";
import { loginValidationSchema } from "@/src/utils";
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
  const [loading, setLoading] = useState(false);
  const [key, setKey] = useState(0);

  const onSignupPress = () => {
    navigation.navigate("Registration");
  };

  const onForgotPasswordPress = () => {
    navigation.navigate("ForgotPassword");
  };

  const handleLoginValidation = async ({ email, password }) => {
    setLoading(true);
    await firebase
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

  useEffect(() => {
    const reloadScreen = navigation.addListener("focus", () => {
      // Force reload screen when back to this screen
      setKey(Math.random());
    });
    return reloadScreen;
  }, [navigation]);

  return (
    <View style={styles.container} key={key}>
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
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={loginValidationSchema}
          onSubmit={(values) => handleLoginValidation(values)}
        >
          {({
            values,
            touched,
            errors,
            handleChange,
            handleSubmit,
            handleBlur,
          }) => (
            <>
              <InputBox
                placeholder="E-mail"
                onChange={handleChange("email")}
                onBlur={handleBlur("email")}
                value={values.email}
                keyboardType="email-address"
                errors={errors.email && touched.email}
              />
              <View style={styles.errorView}>
                {errors.email && touched.email && (
                  <Text style={styles.errorText}>{errors.email}</Text>
                )}
              </View>
              <InputBox
                placeholder="Password"
                onChange={handleChange("password")}
                onBlur={handleBlur("password")}
                value={values.password}
                secureTextEntry={true}
                errors={errors.password && touched.password}
              />
              <View style={styles.errorView}>
                {errors.password && touched.password && (
                  <Text style={styles.errorText}>{errors.password}</Text>
                )}
              </View>
              <Button text="Log in" onPress={handleSubmit} />
            </>
          )}
        </Formik>
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
