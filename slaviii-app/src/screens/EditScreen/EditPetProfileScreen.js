import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
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

import { addPetProfileSchema } from "@/src/utils";
import { Loader } from "@/src/components";

const AddPetProfileScreen = ({ navigation, route }) => {
  const { petData } = route.params;

  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);

  const [date, setDate] = useState(null);
  const [show, setShow] = useState(false);

  const userID = firebase.auth().currentUser.uid;
  const userPetInstance = firebase
    .firestore()
    .collection("users/" + userID + "/pets")
    .doc(petData.id);

  const handleSavePetProfile = async (values) => {
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
        userPetInstance.set(
          {
            name: values.name,
            dob: values.dob,
            type: values.type,
            species: values.species,
            image: url,
          },
          { merge: true }
        );
      });
    } else {
      // When no image is selected
      userPetInstance.set(
        {
          name: values.name,
          dob: values.dob,
          type: values.type,
          species: values.species,
        },
        { merge: true }
      );
    }

    setUploading(false);
    setImage(null);

    Alert.alert(
      "Pet Profile Saved",
      "Your pet profile has been saved to cloud successfully!"
    );

    navigation.navigate("Profile");
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);
  };

  const showDatepicker = () => {
    setShow(true);
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

  const handleDelete = async () => {
    Alert.alert(
      "Delete Pet Profile",
      "Are you sure you want to delete this pet profile?",
      [
        {
          text: "Cancel",
          onPress: () => {
            /*Do nothing*/
          },
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            userPetInstance.delete();
            navigation.navigate("Profile");
          },
        },
      ]
    );
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
                  petData.image
                    ? { uri: petData.image }
                    : require("@/assets/adaptive-icon.png")
                }
              />
            )}
          </TouchableOpacity>
        </View>
        <Formik
          initialValues={{
            name: petData.name,
            dob: petData.dob.toDate(),
            type: petData.type,
            species: petData.species,
          }}
          validationSchema={addPetProfileSchema}
          // Run this when click 'Save'
          onSubmit={async (values, { setSubmitting }) => {
            setSubmitting(true);
            handleSavePetProfile(values);
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

              <Item fixedLabel error={errors.dob && touched.dob ? true : false}>
                <Label>Birthday</Label>
                <TouchableOpacity onPress={showDatepicker}>
                  <View pointerEvents="none">
                    <Input
                      disabled
                      onChangeText={handleChange("dob")}
                      onBlur={handleBlur("dob")}
                      placeholder={moment(petData.dob.toDate()).format(
                        "DD/MM/YYYY"
                      )}
                      value={
                        date
                          ? moment(date).format("DD/MM/YYYY")
                          : moment(values.dob).format("DD/MM/YYYY")
                      }
                    />
                  </View>
                </TouchableOpacity>
                {show && (
                  <DateTimePicker
                    value={new Date(new Date().setHours(0, 0, 0, 0))}
                    mode="date"
                    is24Hour={true}
                    display="default"
                    onChange={(event, selectedDate) => {
                      if (selectedDate) {
                        onChangeDate(event, selectedDate);
                        setFieldValue("dob", selectedDate);
                      } else {
                        setShow(false);
                      }
                    }}
                    maximumDate={new Date()}
                  />
                )}
                {errors.dob && touched.dob && <Icon name="close-circle" />}
              </Item>
              {errors.dob && touched.dob && (
                <Item>
                  <Label style={{ color: "red" }}>{errors.dob}</Label>
                </Item>
              )}

              <Item
                fixedLabel
                error={errors.type && touched.type ? true : false}
              >
                <Label>Type</Label>
                <Input
                  value={values.type}
                  onChangeText={handleChange("type")}
                  onBlur={handleBlur("type")}
                />
                {errors.type && touched.type && <Icon name="close-circle" />}
              </Item>
              {errors.type && touched.type && (
                <Item>
                  <Label style={{ color: "red" }}>{errors.type}</Label>
                </Item>
              )}

              <Item
                fixedLabel
                error={errors.species && touched.species ? true : false}
              >
                <Label>Species</Label>
                <Input
                  value={values.species}
                  onChangeText={handleChange("species")}
                  onBlur={handleBlur("species")}
                />
                {errors.species && touched.species && (
                  <Icon name="close-circle" />
                )}
              </Item>
              {errors.species && touched.species && (
                <Item>
                  <Label style={{ color: "red" }}>{errors.species}</Label>
                </Item>
              )}

              <Button
                block
                large
                style={{ marginTop: 30, backgroundColor: "salmon" }}
                onPress={() => {
                  handleSubmit();
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
              <Button
                block
                style={{ marginTop: 10, backgroundColor: "tomato" }}
                onPress={() => {
                  handleDelete();
                }}
                disabled={isSubmitting}
              >
                <Text
                  style={{ color: "white", fontSize: 20, fontWeight: "bold" }}
                >
                  Delete
                </Text>
              </Button>
            </Form>
          )}
        </Formik>
      </Content>
    </Container>
  );
};

export default AddPetProfileScreen;
