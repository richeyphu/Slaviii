import React, { useEffect, useState, useLayoutEffect, useContext } from "react";
import {
  TouchableOpacity,
  View,
  Image,
  Switch,
  FlatList,
  RefreshControl,
  Platform,
  Alert,
} from "react-native";

import { Container, Content, Card, CardItem, Text, Body } from "native-base";

import styles from "./styles";
import { firebase } from "@/src/firebase/config";
import { FloatingAction } from "react-native-floating-action";
import { SwipeListView } from "react-native-swipe-list-view";
import { Feather } from "@expo/vector-icons";
import moment from "moment";
import * as Animatable from "react-native-animatable";
import * as Notifications from "expo-notifications";
import AppLoading from "expo-app-loading";
// import AsyncStorage from "@react-native-async-storage/async-storage";

import { userStoreContext } from "@/src/contexts/UserContext";
import { homeActions } from "@/src/utils";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function HomeScreen({ navigation }) {
  const userStore = useContext(userStoreContext);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Profile");
          }}
        >
          <Image
            style={{ width: 35, height: 35, marginRight: 10 }}
            source={require("@/assets/adaptive-icon.png")}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const [loading, setLoading] = useState(false);
  const [alarms, setAlarms] = useState(null);
  const [petName, setPetName] = useState([]);

  const userID = firebase.auth().currentUser.uid;
  const userAlarmInstance = firebase
    .firestore()
    .collection("users/" + userID + "/alarms");
  const userPetInstance = firebase
    .firestore()
    .collection("users/" + userID + "/pets");

  const getAlarms = async () => {
    setLoading(true);

    userAlarmInstance.get().then(async (querySnapshot) => {
      const _alarms = await querySnapshot.docs
        .map((doc) => {
          const alarmDoc = doc.data();
          // console.log(JSON.stringify(alarmDoc));

          // const petID = alarmDoc.pet;
          // userPetInstance.doc(petID).onSnapshot(
          //   (snapshot) => {
          //     const _petName = snapshot.data().name;
          //     alarmDoc.pet = _petName;
          //     console.log(JSON.stringify(alarmDoc));
          //   },
          //   (error) => {
          //     console.log(error);
          //   }
          // );
          const _alarmDoc = { ...alarmDoc, id: doc.id };

          return _alarmDoc;
        })
        .sort((a, b) => {
          return a.time.toDate() - b.time.toDate();
        });

      // await AsyncStorage.setItem("@alarms", JSON.stringify(_alarms));
      setAlarms(_alarms);
      // alert(JSON.stringify(alarms));
    });

    setLoading(false);
  };

  const handleSwitchChange = async (value, item) => {
    Notifications.cancelAllScheduledNotificationsAsync();

    const alarmID = item.id;
    const alarmRef = userAlarmInstance.doc(alarmID);
    alarmRef.set(
      {
        active: value,
      },
      { merge: true }
    );
    getAlarms();
    // setUpAlarms();
  };

  const handleDeleteAlarm = (alarmID) => {
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
          const userAlarmInstance = firebase
            .firestore()
            .collection("users/" + userID + "/alarms")
            .doc(alarmID);
          userAlarmInstance.delete();
          Notifications.cancelAllScheduledNotificationsAsync();
          getAlarms();
        },
      },
    ]);
  };

  useEffect(() => {
    const getNewAlarm = navigation.addListener("focus", () => {
      Notifications.cancelAllScheduledNotificationsAsync();
      getAlarms();
      // setUpAlarms();
      // alert('Refreshed');
    });
    return getNewAlarm;
  }, [navigation]);

  const renderAlarm = ({ item, index }) => {
    const setUpAlarm = async () => {
      const alarm = item;
      if (alarm.active) {
        const alarmName = alarm.pet.name;
        const alarmFood = alarm.food;
        const alarmTime = alarm.time.toDate();
        const hour = alarmTime.getHours();
        const minute = alarmTime.getMinutes();

        // console.log(alarmName, alarmFood, hour, minute, alarm.active);

        Notifications.scheduleNotificationAsync({
          content: {
            title: "Wake up slave!! It's time to feed " + alarmName + "!",
            body: "I'm hungry!! Where's my " + alarmFood + "!?",
            // sound: Platform.OS === "android" ? null : "default",
            // sound: "alarm.wav",
          },
          trigger: {
            hour: hour,
            minute: minute,
            repeats: true,
          },
        });
      }
    };
    setUpAlarm();

    return (
      <Animatable.View
        animation="fadeInUp"
        easing="ease-out"
        duration={1500}
        useNativeDriver={true}
      >
        <Card style={styles.cardBody}>
          <CardItem header style={styles.cardHeader}>
            <Text style={styles.cardHeaderText}>{item.name}</Text>
            <Text style={styles.cardHeaderTime}>
              {moment(item.time.toDate()).format("HH:mm")}
            </Text>
          </CardItem>
          <CardItem style={styles.cardBody}>
            <Image
              style={styles.cardPic}
              source={
                item.pet.image
                  ? { uri: item.pet.image }
                  : require("@/assets/icon.png")
              }
            />
            <Body>
              <Text style={styles.cardBodyText1}>{item.pet.name}</Text>
              <Text style={styles.cardBodyText2}>{item.food}</Text>
            </Body>
            <Switch
              style={styles.cardBodySwitch}
              onValueChange={(value) => {
                handleSwitchChange(value, item);
              }}
              value={item.active}
            />
          </CardItem>
        </Card>
      </Animatable.View>
    );
  };

  const renderAlarmOptions = (data, rowMap) => {
    return (
      <Animatable.View
        style={{ flexDirection: "row", height: "99.5%" }}
        animation="fadeIn"
        delay={1500}
        duration={500}
        useNativeDriver={true}
      >
        <Card style={{ backgroundColor: "gold", flex: 1, marginRight: 0 }}>
          <TouchableOpacity
            style={{
              height: "100%",
              justifyContent: "center",
              marginLeft: "13%",
            }}
            onPress={() => {
              navigation.navigate("EditAlarm", {
                alarmData: data.item,
              });
            }}
          >
            <Feather name="edit" size={30} color="black" />
          </TouchableOpacity>
        </Card>
        <Card style={{ backgroundColor: "tomato", flex: 1, marginLeft: 0 }}>
          <TouchableOpacity
            style={{
              height: "100%",
              justifyContent: "center",
              marginLeft: "71%",
            }}
            onPress={() => {
              handleDeleteAlarm(data.item.id);
            }}
          >
            <Feather name="trash" size={30} color="whitesmoke" />
          </TouchableOpacity>
        </Card>
      </Animatable.View>
    );
  };

  const _onRefresh = () => {
    getAlarms();
  };

  if (alarms === null) {
    return <AppLoading />;
  }

  return (
    <Container>
      {alarms.length > 0 ? (
        <Content
          padder
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={_onRefresh} />
          }
        >
          <View style={{}}>
            {/* <FlatList
              data={alarms}
              renderItem={renderAlarm}
              keyExtractor={(item) => item.id}
              onRefresh={_onRefresh}
              refreshing={loading}
              contentContainerStyle={{ paddingBottom: 80 }}
            /> */}
            <SwipeListView
              data={alarms}
              renderItem={renderAlarm}
              renderHiddenItem={renderAlarmOptions}
              leftOpenValue={75}
              rightOpenValue={-75}
              stopLeftSwipe={150}
              stopRightSwipe={-150}
              contentContainerStyle={{ paddingBottom: 80 }}
            />
          </View>
        </Content>
      ) : (
        <View style={styles.welcomeContainer}>
          <Animatable.Image
            style={styles.logo}
            source={require("@/assets/icon.png")}
            animation="pulse"
            duration={3000}
            useNativeDriver={true}
          />
          <Animatable.Text
            style={styles.welcomeText1}
            animation="fadeIn"
            duration={3000}
            useNativeDriver={true}
          >
            Welcome to Slaviii
          </Animatable.Text>
          <Animatable.Text
            style={styles.welcomeText2}
            animation="fadeInUp"
            delay={3500}
            useNativeDriver={true}
          >
            Press + to start using
          </Animatable.Text>
          <Animatable.Image
            style={styles.arrow}
            source={require("@/assets/arrow.png")}
            animation="pulse"
            delay={5000}
            iterationCount="infinite"
            useNativeDriver={true}
          />
        </View>
      )}
      <FloatingAction
        color="#C84132"
        actions={homeActions}
        onPressItem={(name) => {
          // console.log(`selected button: ${name}`);
          if (name === "bt_pet") {
            navigation.navigate("AddPetProfile");
          } else if (name === "bt_alarm") {
            navigation.navigate("AddAlarm");
          }
        }}
      />
    </Container>
  );
}
