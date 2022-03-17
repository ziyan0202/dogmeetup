import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { auth, getPosts } from "../firebase";
import { NavigationContainer } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/core";
import { StatusBar } from "expo-status-bar";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Explore from "./Explore";
import Saved from "./Saved";
import Icon from "react-native-vector-icons/Ionicons";

const HomeScreen = () => {
  const navigation = useNavigation();
  const [posts, setPosts] = useState([]);
  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace("Login");
      })
      .catch((error) => alert(error.message));
  };
  const Tab = createBottomTabNavigator();
  function MyTabs() {
    return (
      <Tab.Navigator>
        <Tab.Screen name="EXPLORE" component={EXPLORE} />
        <Tab.Screen name="SAVED" component={SAVED} />
      </Tab.Navigator>
    );
  }
  const _getPosts = async () => {
    const posts = await getPosts();
    console.log("POSTS", posts);
    setPosts(posts);
  };
  useEffect(() => {
    _getPosts();
    console.log(posts);
  }, []);
  return (
    <View style={styles.container}>
      <Text>Email : {auth.currentUser?.email}</Text>
      <TouchableOpacity onPress={handleSignOut} style={styles.button}>
        <Text style={styles.buttonText}>Sign out</Text>
      </TouchableOpacity>
      {posts?.map((obj) => (
        <View id={obj.id}>
          <Text>{obj.Title}</Text>
          <Text>{obj.Content}</Text>
        </View>
      ))}
      <StatusBar style="auto" />
    </View>
  );
};
// const createBottomTabNavigator({
//   Explore: {
//     screen: Explore,
//     navigationOption: {
//       tabBarLabel: "EXPLORE",
//       tabBarIcon: ({ tintColor }) => (
//         <Icon name="ios-search-outline" color={tintColor} size={24} />
//       ),
//     },
//   },
//   Saved: {
//     screen: Saved,
//     navigationOption: {
//       tabBarLabel: "EXPLORE",
//       tabBarIcon: ({ tintColor }) => (
//         <Icon name="ios-heart-outline" color={tintColor} size={24} />
//       ),
//     },
//   },
// });
export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#0782F9",
    width: "60%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 40,
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
});
