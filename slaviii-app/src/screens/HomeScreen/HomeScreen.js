import React, { useEffect, useState } from "react";
import {
  FlatList,
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import styles from "./styles";
import { firebase } from "../../firebase/config";
import { getDocs, query, where, orderBy } from "firebase/firestore";

export default function HomeScreen(props) {
  const [entityText, setEntityText] = useState("");
  const [entities, setEntities] = useState([]);
  const [loading, setLoading] = useState(false);

  const entityInstance = firebase.firestore().collection("entities");
  const userID = props.extraData.id;

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
    .orderBy("createdAt", "desc")
    .onSnapshot(
      (querySnapshot) => {
        alert(querySnapshot.size);
        const newEntities = [];
        querySnapshot.forEach((doc) => {
          const entity = doc.data();
          entity.id = doc.id;
          newEntities.push(entity);
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
    getEntities();
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
    </View>
  );
}
