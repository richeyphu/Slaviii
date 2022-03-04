import React, { useEffect, useState, useLayoutEffect } from "react";
import { FlatList, Image, TouchableOpacity, Alert } from "react-native";

import { Text, View } from "native-base";

import styles from "./styles";

import { firebase } from "@/src/firebase/config";
import { Feather } from "@expo/vector-icons";
import Constants from "expo-constants";

export default function AnnoucementScreen({ navigation }) {
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

    // const annoucementQuery = query(annoucementInstance);
    // getDocs(annoucementQuery).then((annoucements) => {
    //   setAnnoucements(
    // annoucements.docs.map((annoucement) => {
    //   return { ...annoucement.data() };
    // })
    //   );
    // });

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

  //   const onAddButtonPress = () => {
  //     if (annoucementText && annoucementText.length > 0) {
  //       const timestamp = firebase.firestore.FieldValue.serverTimestamp();
  //       const data = {
  //         text: annoucementText,
  //         createdAt: timestamp,
  //       };
  //       annoucementInstance
  //         .add(data)
  //         .then((_doc) => {
  //           setAnnoucementText("");
  //           Keyboard.dismiss();
  //         })
  //         .catch((error) => {
  //           alert(error);
  //         });
  //     }
  //   };

  const renderAnnoucement = ({ item, index }) => {
    return (
      <View style={styles.annoucementContainer}>
        <Text style={styles.annoucementText}>
          {index}. {item.text}
        </Text>
      </View>
    );
  };

  const _onRefresh = () => {
    getAnnoucements();
  };

  return (
    <View style={styles.container}>
      {/* 
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add new annoucement"
          placeholderTextColor="#aaaaaa"
          onChangeText={(text) => setAnnoucementText(text)}
          value={annoucementText}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <TouchableOpacity style={styles.button} onPress={onAddButtonPress}>
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
      </View> 
      */}

      <View style={styles.headerContent}>
        <Image style={styles.logo} source={require("@/assets/icon.png")} />
        <Text style={styles.title}>Welcome to Slaviii</Text>
      </View>
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
    </View>
  );
}
