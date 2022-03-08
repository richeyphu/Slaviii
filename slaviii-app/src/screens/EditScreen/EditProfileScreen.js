import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";

import styles from "./styles";

import {
  Container,
  Content,
  Form,
  Item,
  Input,
  Button,
  Icon,
  Label,
  View,
} from "native-base";
import { Formik } from "formik";

import * as ImagePicker from "expo-image-picker";
import { firebase } from "@/src/firebase/config";
// import * as Progress from "react-native-progress";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";

import { editProfileSchema } from "@/src/utils";
import { Loader } from "@/src/components";

const EditProfileScreen = ({ navigation, route }) => {
  const { fullname, profilePic } = route.params;

  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  //   const [fullname, setFullname] = useState("");

  const userID = firebase.auth().currentUser.uid;
  const userInstance = firebase.firestore().collection("users").doc(userID);

  //   useEffect(() => {
  //     getProfile();
  //   }, []);

  //   const getProfile = async () => {
  //     await userInstance.get().then(
  //       (snapshot) => {
  //         const user = snapshot.data();
  //         setFullname(user.fullName);
  //       },
  //       (error) => {
  //         console.log(error);
  //       }
  //     );
  //   };

  const handleEditProfile = async (values) => {
    setUploading(true);

    if (image) {
      const { uri } = image;
      const filename = uri.substring(uri.lastIndexOf("/") + 1);
      const uploadUri =
        Platform.OS === "ios" ? uri.replace("file://", "") : uri;

      setTransferred(0);

      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          resolve(xhr.response);
        };
        xhr.onerror = function (e) {
          console.log(e);
          reject(new TypeError("Network request failed"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", uploadUri, true);
        xhr.send(null);
      });

      const uploadRef = firebase.storage().ref(filename);
      const uploadTask = uploadRef.put(blob);

      // set progress state
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 10000
          );
          setTransferred(progress);
        },
        (error) => {
          console.log(error);
        }
      );

      try {
        await uploadTask;
      } catch (e) {
        console.error(e);
      }

      await uploadRef.getDownloadURL().then((url) => {
        userInstance.set(
          {
            fullName: values.name,
            image: url,
          },
          { merge: true }
        );
      });
    } else {
      // When no image is selected
      userInstance.set(
        {
          fullName: values.name,
        },
        { merge: true }
      );
    }

    setUploading(false);
    setImage(null);

    Alert.alert(
      "Profile Saved",
      "Your profile has been saved to cloud successfully!"
    );

    navigation.navigate("Profile");
  };

  const selectImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result);
    }
  };

  return (
    <Container>
      {/* {uploading && (
        <ActivityIndicator
          size="large"
          color="salmon"
          style={styles.loadingIndicator}
        />
      )} */}
      <Loader loading={uploading} />
      <Content padder>
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => {
              // alert("Select an image");
              selectImage();
            }}
          >
            {image ? (
              <Image style={styles.avatar} source={{ uri: image.uri }} />
            ) : (
              <Image
                style={styles.avatar}
                source={
                  profilePic
                    ? { uri: profilePic }
                    : require("@/assets/adaptive-icon.png")
                }
              />
            )}
          </TouchableOpacity>
        </View>
        <Formik
          initialValues={{
            name: fullname,
          }}
          validationSchema={editProfileSchema}
          // Run this when click 'Save'
          onSubmit={async (values, { setSubmitting }) => {
            setSubmitting(true);
            handleEditProfile(values);
            setSubmitting(false);
          }}
        >
          {/* errors ใช้สำหรับตรวจสอบ state (ถ้าผู้ใช้ไม่กรอกข้อมูล จะให้ error อะไรเกิดขึ้น) */}
          {/* touched เมื่อผู้ใช้ไปกดที่ name และเลื่อนเมาส์ออกไปด้านนอกช่อง input โดยไม่กรอกข้อมูล */}
          {({
            errors,
            touched,
            values,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            setSubmitting,
            setFieldValue,
          }) => (
            <Form>
              {/* กำหนดให้มีเส้นสีแดงถ้าผู้ใช้ไม่กรอกข้อมูลชื่อ */}
              <Item
                fixedLabel
                error={errors.name && touched.name ? true : false}
              >
                <Label>Name</Label>
                <Input
                  value={values.name}
                  onChangeText={handleChange("name")}
                  onBlur={handleBlur("name")}
                />
                {errors.name && touched.name && <Icon name="close-circle" />}
              </Item>
              {errors.name && touched.name && (
                <Item>
                  <Label style={{ color: "red" }}>{errors.name}</Label>
                </Item>
              )}

              <Button
                block
                large
                style={{ marginTop: 30, backgroundColor: "salmon" }}
                onPress={() => {
                  handleSubmit();
                  // setSubmitting(false);
                }}
                // If submitted, disable button
                disabled={isSubmitting}
              >
                <Text
                  style={{ color: "white", fontSize: 20, fontWeight: "bold" }}
                >
                  Save
                </Text>
              </Button>
            </Form>
          )}
        </Formik>
      </Content>
    </Container>
  );
};

export default EditProfileScreen;
