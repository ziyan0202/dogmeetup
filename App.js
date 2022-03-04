import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { getPosts } from "./firebase";

export default function App() {
  const [posts, setPosts] = useState();

  const _getPosts = async () => {
    const posts = await getPosts();
    console.log("POSTS", posts);
    setPosts(posts);
  };

  useEffect(() => {
    _getPosts();
  }, []);

  return (
    <View style={styles.container}>
      {posts?.map((obj) => (
        <View id={obj.id}>
          <Text>{obj.Title}</Text>
          <Text>{obj.Content}</Text>
        </View>
      ))}
      <Text>This is our app!</Text>
      <StatusBar style="auto" />
    </View>
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
