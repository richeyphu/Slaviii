import React, { useEffect, useState } from "react";
import { StyleSheet, Text, Image, TouchableOpacity } from "react-native";

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
import * as Yup from "yup";

import * as ImagePicker from "expo-image-picker";
import storage from "firebase/storage";
import * as Progress from "react-native-progress";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";

const ValidateSchema = Yup.object().shape({
  name: Yup.string().required("Please input name"),
  dob: Yup.string().required("Please input birthday"),
  type: Yup.string().required("Please input type"),
  species: Yup.string().required("Please input species"),
});

const AddPetProfileScreen = () => {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);

  const [date, setDate] = useState(null);
  const [show, setShow] = useState(false);

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
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
      setImage(result.uri);
    }
  };

  return (
    <Container>
      <Content padder>
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => {
              // alert("Select an image");
              selectImage();
            }}
          >
            {image ? (
              <Image style={styles.avatar} source={{ uri: image }} />
            ) : (
              <Image
                style={styles.avatar}
                source={require("../../../assets/adaptive-icon.png")}
              />
            )}
          </TouchableOpacity>
        </View>
        <Formik
          // ค่าเริ่มต้นของข้อมูล โดยกำหนดให้ตรงกับกับ backend
          initialValues={{
            name: "",
            dob: "",
            type: "",
            species: "",
          }}
          validationSchema={ValidateSchema}
          // เมื่อคลิกปุ่ม Register ให้ทำงานส่วนนี้
          onSubmit={async (values, { setSubmitting }) => {
            alert(JSON.stringify(values));
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
                      placeholder="Select a date"
                      value={
                        date ? moment(date).format("DD/MM/YYYY") : values.dob
                      }
                    />
                  </View>
                </TouchableOpacity>
                {show && (
                  <DateTimePicker
                    value={new Date()}
                    mode="date"
                    is24Hour={true}
                    display="default"
                    onChange={(event, selectedDate) => {
                      onChangeDate(event, selectedDate);
                      setFieldValue("dob", selectedDate);
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

export default AddPetProfileScreen;
