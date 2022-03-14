import React, { useState } from "react";
import { Image, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import styles from "./styles";

import { Formik } from "formik";
import { registerValidationSchema } from "@/src/utils";
import { firebase } from "@/src/firebase/config";
import {
  Loader,
  InputBoxA as InputBox,
  ButtonA as Button,
} from "@/src/components";

export default function RegistrationScreen({ navigation }) {
  const [loading, setLoading] = useState(false);

  const onFooterLinkPress = () => {
    navigation.navigate("Login");
  };

  const handleRegisterValidation = async ({
    name,
    email,
    password,
    repassword,
  }) => {
    setLoading(true);
    if (password !== repassword) {
      alert("Passwords don't match.");
      return;
    }

    await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((response) => {
        const uid = response.user.uid;
        const data = {
          id: uid,
          email,
          fullName: name,
        };
        const usersRef = firebase.firestore().collection("users");
        usersRef
          .doc(uid)
          .set(data)
          .then(() => {
            navigation.navigate("Home", { user: data });
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
        <Formik
          initialValues={{ name: "", email: "", password: "", repassword: "" }}
          validationSchema={registerValidationSchema}
          onSubmit={(values) => handleRegisterValidation(values)}
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
                placeholder="Full Name"
                onChange={handleChange("name")}
                onBlur={handleBlur("name")}
                value={values.name}
              />
              <View style={styles.errorView}>
                {errors.name && touched.name && (
                  <Text style={styles.errorText}>{errors.name}</Text>
                )}
              </View>
              <InputBox
                placeholder="E-mail"
                onChange={handleChange("email")}
                onBlur={handleBlur("email")}
                value={values.email}
                keyboardType="email-address"
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
              />
              <View style={styles.errorView}>
                {errors.password && touched.password && (
                  <Text style={styles.errorText}>{errors.password}</Text>
                )}
              </View>
              <InputBox
                placeholder="Confirm Password"
                onChange={handleChange("repassword")}
                onBlur={handleBlur("repassword")}
                value={values.repassword}
                secureTextEntry={true}
              />
              <View style={styles.errorView}>
                {errors.repassword && touched.repassword && (
                  <Text style={styles.errorText}>{errors.repassword}</Text>
                )}
              </View>
              <Button text="Create account" onPress={handleSubmit} />
            </>
          )}
        </Formik>
        <View style={styles.footerView}>
          <Text style={styles.footerText}>
            Already got an account?{" "}
            <Text onPress={onFooterLinkPress} style={styles.footerLink}>
              Log in
            </Text>
          </Text>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}
