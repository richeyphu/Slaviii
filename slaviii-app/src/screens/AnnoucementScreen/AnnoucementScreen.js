import React, { useEffect, useState } from "react";
import { FlatList, Image } from "react-native";

import { Text, View } from "native-base";

import styles from "./styles";

import { firebase } from "@/src/firebase/config";
import { Feather } from "@expo/vector-icons";
import { FloatingAction } from "react-native-floating-action";

export default function HomeScreen() {
  // const [annoucementText, setAnnoucementText] = useState("");
  const [entities, setEntities] = useState([]);
  const [loading, setLoading] = useState(false);

  const annoucementInstance = firebase.firestore().collection("annoucements");

  const getEntities = () => {
    setLoading(true);

    // const annoucementQuery = query(annoucementInstance);
    // getDocs(annoucementQuery).then((entities) => {
    //   setEntities(
    // entities.docs.map((annoucement) => {
    //   return { ...annoucement.data() };
    // })
    //   );
    // });

    annoucementInstance.onSnapshot(
      (querySnapshot) => {
        const newEntities = [];
        querySnapshot.forEach((doc) => {
          const annoucement = doc.data();
          annoucement.id = doc.id;
          newEntities.push(annoucement);
        });
        // orderBy("createdAt", "desc")
        newEntities.sort((a, b) => {
          return b.createdAt - a.createdAt;
        });
        setEntities(newEntities);
      },
      (error) => {
        console.log(error);
      }
    );

    setLoading(false);
  };

  useEffect(() => {
    getEntities();
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

  const renderannoucement = ({ item, index }) => {
    return (
      <View style={styles.annoucementContainer}>
        <Text style={styles.annoucementText}>
          {index}. {item.text}
        </Text>
      </View>
    );
  };

  const _onRefresh = () => {
    getEntities();
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
      {entities && (
        <View style={styles.listContainer}>
          <FlatList
            data={entities}
            renderItem={renderannoucement}
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
