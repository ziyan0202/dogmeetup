import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./screens/LoginScreen";
import HomeScreen from "./screens/HomeScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          options={{ headerShown: false }}
          name="Login"
          component={LoginScreen}
        />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

// import { StatusBar } from "expo-status-bar";
// import React, { useState, useEffect } from "react";
// import { StyleSheet, Text, View, SafeAreaView } from "react-native";
// // import { getPosts } from "./firebase";
// import { NavigationContainer } from "@react-navigation/native";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import LoginScreen from "./screens/LoginScreen";
// import HomeScreen from "./screens/HomeScreen";
// // import auth from "@react-native-firebase/auth";

// const Stack = createNativeStackNavigator();

// export default function App() {
//   // const [posts, setPosts] = useState();
//   // const [initializing, setInitializing] = useState(true);
//   // const [user, setUser] = useState();
//   // function onAuthStateChanged(user) {
//   //   setUser(user);
//   //   if (initializing) setInitializing(false);
//   // }
//   // useEffect(() => {
//   //   const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
//   //   return subscriber;
//   // }, []);

//   // if (initializing) return null;
//   // if (!user) {
//   //   return (
//   //     <View>
//   //       <Text>login</Text>
//   //     </View>
//   //   );
//   // }
//   // const _getPosts = async () => {
//   //   const posts = await getPosts();
//   //   console.log("POSTS", posts);
//   //   setPosts(posts);
//   // };

//   // useEffect(() => {
//   //   _getPosts();
//   // }, []);

//   return (
//     // <View style={styles.container}>
//     //   {posts?.map((obj) => (
//     //     <View id={obj.id}>
//     //       <Text>{obj.Title}</Text>
//     //       <Text>{obj.Content}</Text>
//     //     </View>
//     //   ))}
//     //   <Text>This is our app!</Text>
//     //   <StatusBar style="auto" />
//     // </View>
//     <NavigationContainer>
//       <Stack.Navigator>
//         <Stack.Screen name="Login" component={LoginScreen} />
//         <Stack.Screen name="Home" component={HomeScreen} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     alignItems: "center",
//     justifyContent: "center",
//   },
// });
