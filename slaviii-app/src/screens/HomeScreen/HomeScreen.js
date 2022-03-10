import React, { useEffect, useState, useLayoutEffect, useContext } from "react";
import {
  TouchableOpacity,
  View,
  Image,
  Switch,
  FlatList,
  RefreshControl,
  Platform,
} from "react-native";

import { Container, Content, Card, CardItem, Text, Body } from "native-base";

import styles from "./styles";
import { firebase } from "@/src/firebase/config";
import { FloatingAction } from "react-native-floating-action";
import moment from "moment";
import * as Animatable from "react-native-animatable";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  const [alarms, setAlarms] = useState([]);
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

  /*
  const getPetName = (petID) => {
    const petName = userPetInstance
      .doc(petID)
      .get()
      .then(
        (snapshot) => {
          const petName = snapshot.data().name;
          return petName;
        },
        (error) => {
          console.log(error);
        }
      );
  };
  */

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

  /*
  const setUpAlarms = async () => {
    Notifications.cancelAllScheduledNotificationsAsync();
    // const alarms = await AsyncStorage.getItem("@alarms");
    alarms.forEach((alarm) => {
      if (alarm.active) {
        const alarmName = alarm.name;
        const alarmFood = alarm.food;
        const alarmTime = alarm.time.toDate();
        const hour = alarmTime.getHours();
        const minute = alarmTime.getMinutes();

        console.log(alarmName, alarmFood, hour, minute, alarm.active);

        Notifications.scheduleNotificationAsync({
          content: {
            title: "Wake up slave!! It's time to feed " + alarmName + "!",
            body: "I'm hungry!! Where's my " + alarmFood + "!?",
            // sound: Platform.OS === "android" ? null : "default",
          },
          trigger: {
            hour: hour,
            minute: minute,
            repeats: true,
          },
        });
      }
    });
  };
  */

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
        const alarmName = alarm.name;
        const alarmFood = alarm.food;
        const alarmTime = alarm.time.toDate();
        const hour = alarmTime.getHours();
        const minute = alarmTime.getMinutes();

        console.log(alarmName, alarmFood, hour, minute, alarm.active);

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
            <Body>
              <Text style={styles.cardBodyText}>
                {item.pet}
                {/* {getPetName(item.pet)} */}
              </Text>
              <Text style={styles.cardBodyText}>{item.food}</Text>
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

  const _onRefresh = () => {
    getAlarms();
  };

  return (
    <Container>
      <Content
        padder
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={_onRefresh} />
        }
      >
        {alarms && (
          <View style={{}}>
            <FlatList
              data={alarms}
              renderItem={renderAlarm}
              keyExtractor={(item) => item.id}
              onRefresh={_onRefresh}
              refreshing={loading}
              contentContainerStyle={{ paddingBottom: 80 }}
            />
          </View>
        )}
      </Content>
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
