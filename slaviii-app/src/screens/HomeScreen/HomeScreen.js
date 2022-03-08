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
import { homeActions } from "@/src/utils";

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
            return a.time.toDate() - b.time.toDate();
          })
      );
      // alert(JSON.stringify(alarms));
    });

    setLoading(false);
  };

  useEffect(() => {
    const getNewAlarm = navigation.addListener('focus', () => {
      getAlarms();
      // alert('Refreshed');
    });
    return getNewAlarm;
  }, [navigation]);

  const renderAlarm = ({ item, index }) => {
    return (
      <Card style={styles.cardBody}>
        <CardItem header style={styles.cardHeader}>
          <Text style={styles.cardHeaderText}>{item.name}</Text>
          <Text style={styles.cardHeaderTime}>
            {moment(item.time.toDate()).format("HH:mm")}
          </Text>
        </CardItem>
        <CardItem style={styles.cardBody}>
          <Body>
            <Text style={styles.cardBodyText}>{item.pet}</Text>
            <Text style={styles.cardBodyText}>{item.food}</Text>
          </Body>
          <Switch
            style={styles.cardBodySwitch}
            onValueChange={() => {}}
            value={item.active}
          />
        </CardItem>
      </Card>
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
