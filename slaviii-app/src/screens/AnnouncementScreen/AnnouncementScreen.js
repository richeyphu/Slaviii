import React, { useEffect, useState, useLayoutEffect } from "react";
import {
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  View,
  RefreshControl,
} from "react-native";

import { Container, Content, Card, CardItem, Text, Body } from "native-base";

import styles from "./styles";

import { firebase } from "@/src/firebase/config";
import { Feather } from "@expo/vector-icons";
import Constants from "expo-constants";
import moment from "moment";

export default function AnnouncementScreen({ navigation }) {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={{ marginRight: 12 }}
          onPress={() => {
            Alert.alert(
              "Slaviii Info",
              "Version: " +
                Constants.manifest.version +
                "\n\nMade with ❤️ by PUM Team"
            );
          }}
        >
          <Feather name="info" size={24} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  // const [annoucementText, setAnnoucementText] = useState("");
  const [annoucements, setAnnoucements] = useState([]);
  const [loading, setLoading] = useState(false);

  const annoucementInstance = firebase.firestore().collection("annoucements");

  const getAnnoucements = () => {
    setLoading(true);

    annoucementInstance.onSnapshot(
      (querySnapshot) => {
        const newAnnoucements = [];
        querySnapshot.forEach((doc) => {
          const annoucement = doc.data();
          annoucement.id = doc.id;
          newAnnoucements.push(annoucement);
        });
        // orderBy("createdAt", "desc")
        newAnnoucements.sort((a, b) => {
          return b.createdAt - a.createdAt;
        });
        setAnnoucements(newAnnoucements);
      },
      (error) => {
        console.log(error);
      }
    );

    setLoading(false);
  };

  useEffect(() => {
    getAnnoucements();
  }, []);

  const renderAnnoucement = ({ item, index }) => {
    return (
      <Card>
        <CardItem header style={styles.cardHeader}>
          <Text style={styles.cardHeaderText}>{item.title}</Text>
        </CardItem>
        <CardItem style={styles.cardBody} bordered>
          <Body>
            <Text style={styles.cardBodyText}>{item.body}</Text>
          </Body>
        </CardItem>
        <CardItem footer bordered>
          <Text>{item.author}</Text>
          <Text style={styles.cardFooterTime}>
            {moment(item.createdAt.toDate()).fromNow()}
          </Text>
        </CardItem>
      </Card>
    );
  };

  const _onRefresh = () => {
    getAnnoucements();
  };

  return (
    <Container>
      <View style={styles.headerContent}>
        <Image style={styles.logo} source={require("@/assets/icon.png")} />
        <Text style={styles.title}>Welcome to Slaviii</Text>
      </View>
      <Content
        padder
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={_onRefresh} />
        }
      >
        {annoucements && (
          <View style={styles.listContainer}>
            <FlatList
              data={annoucements}
              renderItem={renderAnnoucement}
              keyExtractor={(item) => item.id}
              removeClippedSubviews={true}
              onRefresh={() => {
                _onRefresh();
              }}
              refreshing={loading}
            />
          </View>
        )}
      </Content>
    </Container>
  );
}
