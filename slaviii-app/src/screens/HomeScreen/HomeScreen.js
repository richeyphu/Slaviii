import React, { useEffect, useState, useLayoutEffect, useContext } from "react";
import {
  TouchableOpacity,
  View,
  Image,
  Switch,
  FlatList,
  RefreshControl,
} from "react-native";

import { Container, Content, Card, CardItem, Text, Body } from "native-base";

import styles from "./styles";
import { firebase } from "@/src/firebase/config";
import { Feather } from "@expo/vector-icons";
import { FloatingAction } from "react-native-floating-action";
import moment from "moment";

import { userStoreContext } from "@/src/contexts/UserContext";

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

  const homeActions = [
    {
      text: "Add Pet Profile",
      icon: <Feather name="user-plus" size={24} color="white" />,
      name: "bt_pet",
      position: 1,
      color: "#C84132",
    },
    {
      text: "Add Alarm",
      icon: <Feather name="bell" size={24} color="white" />,
      name: "bt_alarm",
      position: 2,
      color: "#C84132",
    },
  ];

  const [loading, setLoading] = useState(false);
  const [alarms, setAlarms] = useState([]);

  const userID = firebase.auth().currentUser.uid;
  const userAlarmInstance = firebase
    .firestore()
    .collection("users/" + userID + "/alarms");

  const getAlarms = () => {
    setLoading(true);

    userAlarmInstance.get().then(async (querySnapshot) => {
      setAlarms(
        await querySnapshot.docs
          .map((doc) => {
            return { ...doc.data(), id: doc.id };
          })
          .sort((a, b) => {
            return a.time - b.time;
          })
      );
      // alert(JSON.stringify(alarms));
    });

    setLoading(false);
  };

  useEffect(() => {
    getAlarms();
  }, [alarms]);

  const renderAlarm = ({ item, index }) => {
    return (
      // <View style={styles.entityContainer}>
      //   <Text style={styles.entityText}>
      //     {index}. {item.name}
      //   </Text>
      // </View>
      <Card>
        <CardItem
          header
          style={{ flexDirection: "row", backgroundColor: "lightsalmon" }}
        >
          <Text style={{ flex: 1, fontWeight: "bold", fontSize: 30 }}>
            {item.name}
          </Text>
          <Text
            style={{
              flex: 1,
              textAlign: "right",
              fontWeight: "bold",
              fontSize: 40,
            }}
          >
            {moment(item.time.toDate()).format("HH:mm")}
          </Text>
        </CardItem>
        <CardItem style={{ backgroundColor: "lightsalmon" }}>
          <Body>
            <Text style={{}}>{item.pet}</Text>
            <Text style={{}}>{item.food}</Text>
          </Body>
          <Switch
            style={{ transform: [{ scaleX: 1.8 }, { scaleY: 1.8 }], marginRight: 15 }}
            onValueChange={() => {}}
            value={item.active}
          />
        </CardItem>
        {/* <CardItem footer bordered>
          <Text>Slaviii</Text>
        </CardItem> */}
      </Card>
    );
  };

  const _onRefresh = () => {
    getAlarms();
  };

  return (
    <Container>
      <Content padder>
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
