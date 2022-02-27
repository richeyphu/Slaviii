import React, { Component } from "react";
import { Text, View, Image, TouchableOpacity, Alert } from "react-native";
import styles from "./styles";
import { firebase } from "../../firebase/config";

export default function ProfileScreen({ navigation }) {
  const signOutUser = async () => {
    try {
      await firebase.auth().signOut();
      // navigation.navigate("Login");
    } catch (e) {
      console.log(e);
    }
  };

  const confirmSignOutAlert = () =>
    Alert.alert("Log out", "Are you sure you want to log out?", [
      {
        text: "Cancel",
        onPress: () => {
          /*Do nothing*/
        },
        style: "cancel",
      },
      { text: "OK", onPress: () => signOutUser() },
    ]);

  return (
    <View style={styles.container}>
      <View style={styles.header}></View>
      <Image
        style={styles.avatar}
        // source={{ uri: "https://bootdey.com/img/Content/avatar/avatar6.png" }}
        source={require("../../../assets/icon.png")}
      />
      <View style={styles.body}>
        <View style={styles.bodyContent}>
          <Text style={styles.name}>John Doe</Text>
          <Text style={styles.info}>UX Designer / Mobile developer</Text>
          <Text style={styles.description}>
            Lorem ipsum dolor sit amet, saepe sapientem eu nam. Qui ne assum
            electram expetendis, omittam deseruisse consequuntur ius an,
          </Text>

          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => {
              confirmSignOutAlert();
            }}
          >
            <Text>Sign out</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonContainer}>
            <Text>Opcion 2</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
