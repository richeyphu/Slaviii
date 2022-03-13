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
import { SwipeListView } from "react-native-swipe-list-view";
import { Feather } from "@expo/vector-icons";

import { userStoreContext } from "@/src/contexts/UserContext";
import { Loader } from "@/src/components";
import { profileActions } from "@/src/utils";

import * as Animatable from "react-native-animatable";
import * as Notifications from "expo-notifications";

export default function ProfileScreen({ navigation }) {
  const userStore = useContext(userStoreContext);

  const [fullname, setFullname] = useState([]);
  const [profilePic, setProfilePic] = useState(null);
  const [petList, setPetList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // const { userID } = route.params;
  const userID = firebase.auth().currentUser.uid;
  const userInstance = firebase.firestore().collection("users");
  const userPetInstance = firebase
    .firestore()
    .collection("users/" + userID + "/pets");

  const getUserProfile = () => {
    setLoading(true);

    userInstance.where("id", "==", userID).onSnapshot(
      (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const user = doc.data();
          // alert(user.fullName);
          setFullname(user.fullName);
          setProfilePic(user.image);
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
      getUserProfile();
      getPets();
      // alert('Refreshed');
    });
    return getNewProfile;
  }, [navigation]);

  const signOutUser = async () => {
    try {
      // Clear all notifications
      Notifications.cancelAllScheduledNotificationsAsync();

      // Clear user context
      userStore.updateProfile(null);

      // Sign out user
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

  // const handlePetPress = (petData) => {
  //   // alert(JSON.stringify(petData));
  //   navigation.navigate("EditPetProfile", { petData: petData });
  // };

  const handleDeletePet = (petID) => {
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
            const userPetInstance = firebase
              .firestore()
              .collection("users/" + userID + "/pets")
              .doc(petID);
            userPetInstance.delete();
            getPets();
          },
        },
      ]
    );
  };

  const renderPetListItem = ({ item }) => {
    return (
      <TouchableOpacity
        disabled
        // onPress={() => { handlePetPress(item) }}
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

  const OpenMenuIcon = () => {
    return (
      <Animatable.View
        animation="fadeIn"
        duration={500}
        easing="ease-in-out"
        useNativeDriver={true}
      >
        <Feather name="menu" size={24} color="white" />
      </Animatable.View>
    );
  };

  const CloseMenuIcon = () => {
    return (
      <Animatable.View
        animation="fadeIn"
        duration={500}
        easing="ease-in-out"
        useNativeDriver={true}
      >
        <Feather name="x" size={24} color="white" />
      </Animatable.View>
    );
  };

  return (
    <View style={styles.container}>
      <Loader loading={loading} />
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Animatable.Image
            style={styles.avatar}
            source={
              profilePic ? { uri: profilePic } : require("@/assets/icon.png")
            }
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
        {/* <FlatList
          extraData={petList}
          data={petList}
          keyExtractor={(item) => {
            return item.id;
          }}
          renderItem={renderPetListItem}
          refreshing={loading}
          onRefresh={getPets}
          contentContainerStyle={{ paddingBottom: 100 }}
        /> */}
        <SwipeListView
          data={petList}
          renderItem={renderPetListItem}
          renderHiddenItem={(data, rowMap) => (
            <Animatable.View
              style={{
                flexDirection: "row",
                height: "99.5%",
                marginTop: 10,
                marginLeft: 10,
                marginRight: 10,
              }}
              animation="fadeIn"
              delay={1500}
              duration={500}
              useNativeDriver={true}
            >
              <View
                style={{ backgroundColor: "gold", flex: 1, marginRight: 0 }}
              >
                <TouchableOpacity
                  style={{
                    height: "100%",
                    justifyContent: "center",
                    marginLeft: "13.5%",
                  }}
                  onPress={() => {
                    navigation.navigate("EditPetProfile", {
                      petData: data.item,
                    });
                  }}
                >
                  <Feather name="edit" size={24} color="black" />
                </TouchableOpacity>
              </View>
              <View
                style={{ backgroundColor: "tomato", flex: 1, marginLeft: 0 }}
              >
                <TouchableOpacity
                  style={{
                    height: "100%",
                    justifyContent: "center",
                    marginLeft: "72.5%",
                  }}
                  onPress={() => {
                    handleDeletePet(data.item.id);
                  }}
                >
                  <Feather name="trash" size={26} color="whitesmoke" />
                </TouchableOpacity>
              </View>
            </Animatable.View>
          )}
          refreshing={loading}
          onRefresh={getPets}
          leftOpenValue={75}
          rightOpenValue={-75}
          stopLeftSwipe={150}
          stopRightSwipe={-150}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      </View>
      <FloatingAction
        color="#C84132"
        actions={profileActions}
        onPressItem={(name) => {
          setIsMenuOpen(false);
          if (name === "bt_logout") {
            confirmSignOutAlert();
          } else if (name === "bt_editprofile") {
            // alert("Edit Profile");
            navigation.navigate("EditProfile", {
              fullname: fullname,
              profilePic: profilePic,
            });
          } else if (name === "bt_annoucement") {
            // alert("Announcement");
            navigation.navigate("Announcement");
          }
        }}
        onPressMain={() => {
          setIsMenuOpen(isMenuOpen ? false : true);
        }}
        onPressBackdrop={() => {
          setIsMenuOpen(isMenuOpen ? false : true);
        }}
        floatingIcon={isMenuOpen ? <CloseMenuIcon /> : <OpenMenuIcon />}
      />
    </View>
  );
}
