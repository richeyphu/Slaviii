import "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import { firebase } from "./src/firebase/config";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
// import { NativeBaseProvider } from "native-base";
import {
  LoginScreen,
  RegistrationScreen,
  ForgotPasswordScreen,
  HomeScreen,
  ProfileScreen,
  AddAlarmScreen,
  AddPetProfileScreen,
  AnnouncementScreen,
  EditProfileScreen,
} from "./src/screens";
import { decode, encode } from "base-64";
import AppLoading from "expo-app-loading";
import {
  useFonts,
  Kanit_400Regular as Kanit,
  Kanit_600SemiBold as KanitBold,
} from "@expo-google-fonts/kanit";

import UserStoreProvider from "./src/contexts/UserContext";

if (!global.btoa) {
  global.btoa = encode;
}
if (!global.atob) {
  global.atob = decode;
}

const Stack = createStackNavigator();

export default function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  let [fontsLoaded] = useFonts({
    Kanit,
    KanitBold,
  });

  useEffect(() => {
    const usersInstance = firebase.firestore().collection("users");
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        usersInstance
          .doc(user.uid)
          .get()
          .then((document) => {
            const userData = document.data();
            setLoading(false);
            setUser(userData);
            // alert("User logged in");
          })
          .catch((error) => {
            setLoading(false);
          });
      } else {
        setLoading(false);
        setUser(null);
        // alert("User logged out");
      }
    });
  }, []);

  if (loading || !fontsLoaded) {
    return <AppLoading />;
  }

  const AuthStack = () => {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Registration" component={RegistrationScreen} />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPasswordScreen}
          options={{ title: "Reset Password" }}
        />
      </Stack.Navigator>
    );
  };

  const AppStack = () => {
    return (
      <Stack.Navigator>
        {/* <Stack.Screen name="Home">
          {(props) => <HomeScreen {...props} extraData={user} />}
        </Stack.Screen> */}
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen
          name="AddAlarm"
          component={AddAlarmScreen}
          options={{ title: "Add Alarm" }}
        />
        <Stack.Screen
          name="AddPetProfile"
          component={AddPetProfileScreen}
          options={{ title: "Add Pet Profile" }}
        />
        <Stack.Screen
          name="EditProfile"
          component={EditProfileScreen}
          options={{ title: "Edit Your Profile" }}
        />
        <Stack.Screen name="Announcement" component={AnnouncementScreen} />
      </Stack.Navigator>
    );
  };

  return (
    // <NativeBaseProvider>
    <UserStoreProvider>
      <NavigationContainer>
        {user ? <AppStack /> : <AuthStack />}
      </NavigationContainer>
    </UserStoreProvider>
    // </NativeBaseProvider>
  );
}
