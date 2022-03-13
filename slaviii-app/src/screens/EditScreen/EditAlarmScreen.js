import React, { useEffect, useState } from "react";
import { StyleSheet, Text, Image, TouchableOpacity, Alert } from "react-native";

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
  Picker,
} from "native-base";
import { Formik } from "formik";

import { firebase } from "@/src/firebase/config";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";

import { addAlarmSchema } from "@/src/utils";
import { Loader } from "@/src/components";

const AddAlarmScreen = ({ navigation, route }) => {
  const { alarmData } = route.params;

  const [time, setTime] = useState(null);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [petList, setPetList] = useState([]);

  const userID = firebase.auth().currentUser.uid;
  const userAlarmInstance = firebase
    .firestore()
    .collection("users/" + userID + "/alarms")
    .doc(alarmData.id);
  const userPetInstance = firebase
    .firestore()
    .collection("users/" + userID + "/pets");

  useEffect(() => {
    setLoading(true);
    getPetList();
    setLoading(false);
  }, []);

  const onChangeTime = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    setShow(false);
    setTime(currentTime);
  };

  const showTimePicker = () => {
    setShow(true);
  };

  const getPetList = () => {
    setLoading(true);

    userPetInstance.onSnapshot(
      async (querySnapshot) => {
        setPetList(
          await querySnapshot.docs
            .map((doc) => {
              return { ...doc.data(), id: doc.id };
            })
            .sort((a, b) => {
              return a.name.localeCompare(b.name);
            })
        );
      },
      (error) => {
        console.log(error);
      }
    );

    setLoading(false);
  };

  const handleSaveAlarm = async (values) => {
    setLoading(true);

    try {
      await userAlarmInstance.set(
        {
          time: values.time,
          name: values.name,
          food: values.food,
          pet: JSON.parse(values.pet),
        },
        { merge: true }
      );

      Alert.alert(
        "New Alarm Added",
        "Your alarm has been saved to cloud successfully!"
      );

      navigation.navigate("Home");
    } catch (error) {
      alert(error);
    }

    setLoading(false);
  };

  const handleDelete = async () => {
    Alert.alert("Delete Alarm", "Are you sure you want to delete this alarm?", [
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
          userAlarmInstance.delete();
          navigation.navigate("Home");
        },
      },
    ]);
  };

  return (
    <Container>
      <Loader loading={loading} />
      <Content padder>
        <Formik
          initialValues={{
            time: alarmData.time.toDate(),
            name: alarmData.name,
            food: alarmData.food,
            pet: JSON.stringify(alarmData.pet),
          }}
          validationSchema={addAlarmSchema}
          onSubmit={async (values, { setSubmitting }) => {
            setSubmitting(true);
            handleSaveAlarm(values);
            setSubmitting(false);
          }}
        >
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
              <View style={styles.headerContent}>
                <TouchableOpacity onPress={showTimePicker}>
                  <Text style={styles.timeLabel}>
                    {time
                      ? moment(time).format("HH:mm")
                      : moment(values.time).format("HH:mm")}
                  </Text>
                  {show && (
                    <DateTimePicker
                      value={
                        new Date(
                          2022,
                          0,
                          0,
                          values.time.getHours(),
                          values.time.getMinutes(),
                          0
                        )
                      }
                      mode="time"
                      is24Hour={true}
                      display="default"
                      onChange={(event, selectedTime) => {
                        if (selectedTime) {
                          onChangeTime(event, selectedTime);
                          setFieldValue("time", selectedTime);
                        } else {
                          setShow(false);
                        }
                      }}
                    />
                  )}
                </TouchableOpacity>
                {errors.time && touched.time && (
                  <Item>
                    <Label style={{ color: "red" }}>{errors.time}</Label>
                  </Item>
                )}
              </View>

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

              <Item
                fixedLabel
                error={errors.food && touched.food ? true : false}
              >
                <Label>Food</Label>
                <Input
                  value={values.food}
                  onChangeText={handleChange("food")}
                  onBlur={handleBlur("food")}
                />
                {errors.food && touched.food && <Icon name="close-circle" />}
              </Item>
              {errors.food && touched.food && (
                <Item>
                  <Label style={{ color: "red" }}>{errors.food}</Label>
                </Item>
              )}

              <Item fixedLabel error={errors.pet && touched.pet ? true : false}>
                <Label>Pet</Label>
                <Picker
                  style={{ width: 135 }}
                  mode="dropdown"
                  selectedValue={values.pet}
                  onValueChange={(itemValue, itemIndex) => {
                    console.log(itemValue, itemIndex);
                    setFieldValue("pet", itemValue);
                  }}
                >
                  <Picker.Item label="Select Pet" value="" />
                  {petList.map((pet) => (
                    <Picker.Item
                      label={pet.name}
                      value={JSON.stringify({
                        id: pet.id,
                        name: pet.name,
                        image: pet.image,
                      })}
                      key={pet.id}
                    />
                  ))}
                </Picker>
                {errors.pet && touched.food && <Icon name="close-circle" />}
              </Item>
              {errors.pet && touched.pet && (
                <Item>
                  <Label style={{ color: "red" }}>{errors.pet}</Label>
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

export default AddAlarmScreen;
