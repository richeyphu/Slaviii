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

  // const [announcementText, setAnnouncementText] = useState("");
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);

  const announcementInstance = firebase.firestore().collection("announcements");

  const getAnnouncements = () => {
    setLoading(true);

    announcementInstance.onSnapshot(
      (querySnapshot) => {
        const newAnnouncements = [];
        querySnapshot.forEach((doc) => {
          const announcement = doc.data();
          announcement.id = doc.id;
          newAnnouncements.push(announcement);
        });
        // orderBy("createdAt", "desc")
        newAnnouncements.sort((a, b) => {
          return b.createdAt - a.createdAt;
        });
        setAnnouncements(newAnnouncements);
      },
      (error) => {
        console.log(error);
      }
    );

    setLoading(false);
  };

  useEffect(() => {
    const getNewAnnouncement = navigation.addListener('focus', () => {
      getAnnouncements();
      // alert('Refreshed');
    });
    return getNewAnnouncement;
  }, [navigation]);

  const renderAnnouncement = ({ item, index }) => {
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
    getAnnouncements();
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
        {announcements && (
          <View style={styles.listContainer}>
            <FlatList
              data={announcements}
              renderItem={renderAnnouncement}
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
