import React, { useEffect, useState, useLayoutEffect, useContext } from "react";
import {
  FlatList,
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import styles from "./styles_test";
import { firebase } from "@/src/firebase/config";
// import { getDocs, query, where, orderBy } from "firebase/firestore";
import { Feather } from "@expo/vector-icons";
import { FloatingAction } from "react-native-floating-action";

import { userStoreContext } from "@/src/contexts/UserContext";

export default function HomeScreen(props) {
  const { navigation } = props;
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

  const [entityText, setEntityText] = useState("");
  const [entities, setEntities] = useState([]);
  const [loading, setLoading] = useState(false);
  // const [userID, setUserID] = useState(null);

  const entityInstance = firebase.firestore().collection("entities");

  const userID = firebase.auth().currentUser.uid;
  // const userID = props.extraData.id;
  // const userData = userStore.profile;
  // alert(JSON.stringify(userData));

  const getEntities = () => {
    setLoading(true);

    // const entityQuery = query(entityInstance);
    // getDocs(entityQuery).then((entities) => {
    //   setEntities(
    // entities.docs.map((entity) => {
    //   return { ...entity.data() };
    // })
    //   );
    // });

    entityInstance
      .where("authorID", "==", userID)
      // .orderBy("createdAt", "desc")
      .onSnapshot(
        (querySnapshot) => {
          const newEntities = [];
          querySnapshot.forEach((doc) => {
            const entity = doc.data();
            entity.id = doc.id;
            newEntities.push(entity);
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
    // if (userData) {
    //   setUserID(userData.id);
    // }

    getEntities();
  }, [, /*userData*/ userID]);

  const onAddButtonPress = () => {
    if (entityText && entityText.length > 0) {
      const timestamp = firebase.firestore.FieldValue.serverTimestamp();
      const data = {
        text: entityText,
        authorID: userID,
        createdAt: timestamp,
      };
      entityInstance
        .add(data)
        .then((_doc) => {
          setEntityText("");
          Keyboard.dismiss();
        })
        .catch((error) => {
          alert(error);
        });
    }
  };

  const renderEntity = ({ item, index }) => {
    return (
      <View style={styles.entityContainer}>
        <Text style={styles.entityText}>
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
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add new entity"
          placeholderTextColor="#aaaaaa"
          onChangeText={(text) => setEntityText(text)}
          value={entityText}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <TouchableOpacity style={styles.button} onPress={onAddButtonPress}>
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
      </View>
      {entities && (
        <View style={styles.listContainer}>
          <FlatList
            data={entities}
            renderItem={renderEntity}
            keyExtractor={(item) => item.id}
            removeClippedSubviews={true}
            onRefresh={() => {
              _onRefresh();
            }}
            refreshing={loading}
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
    </View>
  );
}
