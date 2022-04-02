import React, { useEffect, useState } from "react";
import {getPosts,getUserName} from "../../App.js";
import { View, Text, Image, StyleSheet } from "react-native";
import {ScrollView} from "react-native-gesture-handler"
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";

export default function Feed(props) {
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
    console.log(obj.userID)
    return(
      <View style={styles.post}>
        <Text style={styles.postUser} onPress={() =>
          props.navigation.navigate("Profile", {
            uid:obj.userID
          })
        }>{obj.userName}</Text>
        
        <Text>{obj.caption}</Text>
        <Image style={styles.image} source={{uri: obj.contentURL}} />
      </View>
    );
  });

  return (
    <View style={{flex:1}}>
      <ScrollView contentContainerStyle= {{flexGrow:1}} scrollEnabled>
        <View style={{overflow:"scroll"}}>
          {postList}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  outerPostContainer: {
    flexGrow: 1,
  },
  postContainer: {
    flex:1
  },
  post: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 5,
    height: 200,
    width: "95%",
    alignSelf: "center",
    marginBottom: 10,
  },
  postUser: {
    fontWeight: "bold",
    fontSize: 24,
  },
  image: {
    resizeMode: "contain",
    flex: 1,
  }
});