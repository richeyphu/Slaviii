import React, { useState } from "react";
import { Text } from "react-native";
import { View, Button, Input, Item, Label, Icon } from "native-base";
import { Formik } from "formik";
import { sendPasswordResetEmail } from "firebase/auth";

import { passwordResetSchema } from "@/src/utils";
import { firebase } from "@/src/firebase/config";

import styles from "./styles";
import { Loader } from "@/src/components";

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
    <View isSafe style={styles.container}>
      <Loader loading={loading} />
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

            <Item
              stackedLabel
              error={errors.email && touched.email ? true : false}
            >
              <Label>Email</Label>
              <Input
                name="email"
                placeholder="Enter email"
                keyboardType="email-address"
                textContentType="emailAddress"
                autoCapitalize="none"
                leftIconName="email"
                value={values.email}
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
              />
            </Item>
            {/* Display Screen Error Mesages */}
            {errorState == "" ? (
              errors.email &&
              touched.email && (
                <Item underline={false}>
                  <Label style={{ color: "red" }}>{errors.email}</Label>
                </Item>
              )
            ) : (
              <Item underline={false}>
                <Label style={{ color: "red" }}>{errorState}</Label>
              </Item>
            )}
            {/* Password Reset Send Email button */}
            <Button
              style={styles.button}
              onPress={handleSubmit}
              backgroundColor="salmon"
            >
              <Text
                style={{ color: "white", fontSize: 20, fontWeight: "bold" }}
              >
                Send Reset Email
              </Text>
            </Button>
          </>
        )}
      </Formik>
      {/* Button to navigate to Login screen */}
      <Button
        style={styles.button}
        onPress={() => navigation.navigate("Login")}
        backgroundColor="salmon"
      >
        <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
          Go back to Login
        </Text>
      </Button>
    </View>
  );
}
