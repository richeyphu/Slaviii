import React, { Component } from "react";
import { Text, View, Image, TouchableOpacity } from "react-native";
import styles from "./styles";

export default function ProfileScreen() {
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

          <TouchableOpacity style={styles.buttonContainer}>
            <Text>Opcion 1</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonContainer}>
            <Text>Opcion 2</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
