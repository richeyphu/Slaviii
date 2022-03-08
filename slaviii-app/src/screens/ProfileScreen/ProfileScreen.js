import React, { Component, useEffect, useState, useContext } from "react";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
  FlatList,
} from "react-native";
import styles from "./styles";
import { firebase } from "@/src/firebase/config";
import { FloatingAction } from "react-native-floating-action";

import { userStoreContext } from "@/src/contexts/UserContext";
import { Loader } from "@/src/components";
import { profileActions } from "@/src/utils";
import * as Animatable from "react-native-animatable";

export default function ProfileScreen({ navigation }) {
  const userStore = useContext(userStoreContext);

  const [fullname, setFullname] = useState([]);
  const [petList, setPetList] = useState([]);
  const [loading, setLoading] = useState(false);

  // const { userID } = route.params;
  const userID = firebase.auth().currentUser.uid;
  const userInstance = firebase.firestore().collection("users");
  const userPetInstance = firebase
    .firestore()
    .collection("users/" + userID + "/pets");

  const getName = () => {
    setLoading(true);

    userInstance.where("id", "==", userID).onSnapshot(
      (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const user = doc.data();
          // alert(user.fullName);
          setFullname(user.fullName);
        });
      },
      (error) => {
        console.log(error);
      }
    );

    setLoading(false);
  };

  const getPets = () => {
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
        // alert(JSON.stringify(petList));
      },
      (error) => {
        console.log(error);
      }
    );

    setLoading(false);
  };

  useEffect(() => {
    const getNewProfile = navigation.addListener("focus", () => {
      getName();
      getPets();
      // alert('Refreshed');
    });
    return getNewProfile;
  }, [navigation]);

  const signOutUser = async () => {
    try {
      userStore.updateProfile(null);
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

  const renderPetListItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          alert(JSON.stringify(item));
        }}
        style={{ marginTop: 10, marginLeft: 10, marginRight: 10 }}
      >
        <Animatable.View
          style={styles.row}
          animation="fadeInUp"
          easing="ease-out"
          duration={1000}
          useNativeDriver={true}
        >
          <Image
            source={
              item.image
                ? { uri: item.image }
                : require("@/assets/adaptive-icon.png")
            }
            style={styles.pic}
          />
          <View>
            <View style={styles.nameContainer}>
              <Text
                style={styles.nameTxt}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {item.name}
              </Text>
              <Text style={styles.mblTxt}>{item.type}</Text>
            </View>
            <View style={styles.msgContainer}>
              <Text style={styles.msgTxt}>{item.species}</Text>
            </View>
          </View>
        </Animatable.View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Loader loading={loading} />
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Animatable.Image
            style={styles.avatar}
            source={require("@/assets/icon.png")}
            animation="pulse"
            delay={1500}
            useNativeDriver={true}
          />
          <Animatable.Text
            style={styles.name}
            animation="pulse"
            delay={1500}
            useNativeDriver={true}
          >
            {fullname}
          </Animatable.Text>
        </View>
      </View>
      <View style={{ flex: 2 }}>
        <FlatList
          extraData={petList}
          data={petList}
          keyExtractor={(item) => {
            return item.id;
          }}
          renderItem={renderPetListItem}
          refreshing={loading}
          onRefresh={getPets}
          contentContainerStyle={{ paddingBottom: 10 }}
        />
      </View>
      <FloatingAction
        color="#C84132"
        actions={profileActions}
        onPressItem={(name) => {
          // console.log(`selected button: ${name}`);
          if (name === "bt_logout") {
            confirmSignOutAlert();
          } else if (name === "bt_editprofile") {
            alert("Edit Profile");
            // navigation.navigate("EditProfile");
          } else if (name === "bt_annoucement") {
            // alert("Announcement");
            navigation.navigate("Announcement");
          }
        }}
      />
      {/* <View style={styles.body}>
        <View style={styles.bodyContent}>
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
      </View> */}
    </View>
  );
}
