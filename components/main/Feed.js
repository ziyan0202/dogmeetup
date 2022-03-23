import React, { useEffect, useState } from "react";
import {getPosts} from "../../App.js";
import { View, Text, StyleSheet } from "react-native";

export default function Feed() {
  const [posts, setPosts] = useState([]);

  const _getPosts = async () => {
    const posts = await getPosts();
    console.log("POSTS", posts);
    setPosts(posts);
  };

  useEffect(() => {
    _getPosts();
    console.log(posts);
  }, []);

  const postList = posts?.map((obj) =>{
    return(
      <View id={obj.id} style={styles.post}>
        <Text style={styles.postTitle}>{obj.Title}</Text>
        <Text>{obj.Content}</Text>
      </View>
    );
  });

  return (
    <View>
      {postList}
    </View>
  );
}

const styles = StyleSheet.create({
  post: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 5,
    height: 100,
  },
  postTitle: {
    fontWeight: "bold",
    fontSize: 24,
  }
});