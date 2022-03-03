import React, { useState } from "react";
import { StyleSheet, View, Text, TextInput, Button } from "react-native";

import { Formik } from "formik";
import { sendPasswordResetEmail } from "firebase/auth";

import { passwordResetSchema } from "@/src/utils";
import { firebase } from "@/src/firebase/config";

export default function ForgotPasswordScreen({ navigation }) {
  const [errorState, setErrorState] = useState("");

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
    const { email } = values;
    try {
      await sendPasswordResetEmail(firebase.auth(), email);
      alert("Success: Password Reset Email sent.");
      navigation.navigate("Login");
    } catch (error) {
			alert(error)
      setErrorState(error.message);
    }
  };

  return (
    <View isSafe style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.screenTitle}>Reset your password</Text>
      </View>
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
            <TextInput
              name="email"
              leftIconName="email"
              placeholder="Enter email"
              autoCapitalize="none"
              keyboardType="email-address"
              textContentType="emailAddress"
              value={values.email}
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
            />
            {/* Display Screen Error Mesages */}
            {errorState == "" ? (
              errors.email && touched.email && <Text>{errors.email}</Text>
            ) : (
              <Text>{errorState}</Text>
            )}
            {/* Password Reset Send Email button */}
            <Button
              style={styles.button}
              onPress={handleSubmit}
              title="Send Reset Email"
            />
          </>
        )}
      </Formik>
      {/* Button to navigate to Login screen */}
      <Button
        style={styles.borderlessButtonContainer}
        borderless
        title="Go back to Login"
        onPress={() => navigation.navigate("Login")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 12,
  },
  innercontainer: {
    alignItems: "center",
  },
  screenTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: "black",
    paddingTop: 20,
  },
  button: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    backgroundColor: "orange",
    padding: 10,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 20,
    color: "white",
    fontWeight: "700",
  },
  borderlessButtonContainer: {
    marginTop: 16,
    alignItems: "center",
    justifyContent: "center",
  },
});
