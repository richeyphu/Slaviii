import React, { useState } from "react";
import { View, Text, Image } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { Formik } from "formik";
import { sendPasswordResetEmail } from "firebase/auth";

import { passwordResetSchema } from "@/src/utils";
import { firebase } from "@/src/firebase/config";

import styles from "./styles";

import {
  Loader,
  InputBoxA as InputBox,
  ButtonA as Button,
} from "@/src/components";

export default function ForgotPasswordScreen({ navigation }) {
  const [errorState, setErrorState] = useState("");
  const [loading, setLoading] = useState(false);

  //   const handleSendPasswordResetEmail = (values) => {
  //     const { email } = values;

  //     sendPasswordResetEmail(firebase, email)
  //       .then(() => {
  //         // console.log("Success: Password Reset Email sent.");
  //         alert("Success: Password Reset Email sent.");
  //         navigation.navigate("Login");
  //       })
  //       .catch((error) => setErrorState(error.message));
  //   };

  const handleSendPasswordResetEmail = async (values) => {
    setLoading(true);
    setErrorState("");
    const { email } = values;
    try {
      await sendPasswordResetEmail(firebase.auth(), email);
      alert("Success: Password Reset Email sent.");
      navigation.navigate("Login");
    } catch (error) {
      alert(error);
      setErrorState(error.message);
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        style={{ flex: 1, width: "100%" }}
        keyboardShouldPersistTaps="always"
      >
        <Loader loading={loading} />
        <Image
          style={styles.logo}
          source={require("@/assets/adaptive-icon.png")}
        />
        <Formik
          initialValues={{ email: "" }}
          validationSchema={passwordResetSchema}
          onSubmit={(values) => handleSendPasswordResetEmail(values)}
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
              {/* Email input field */}
              <InputBox
                placeholder="Enter email"
                value={values.email}
                onChange={handleChange("email")}
                onBlur={handleBlur("email")}
                textContentType="emailAddress"
              />
              {/* Display Screen Error Mesages */}
              <View style={styles.errorView}>
                {errorState == "" ? (
                  errors.email &&
                  touched.email && (
                    <Text style={styles.errorText}>{errors.email}</Text>
                  )
                ) : (
                  <Text style={styles.errorText}>{errorState}</Text>
                )}
              </View>
              {/* Password Reset Send Email button */}
              <Button text="Send Reset Email" onPress={handleSubmit} />
            </>
          )}
        </Formik>
      </KeyboardAwareScrollView>
    </View>
  );
}
