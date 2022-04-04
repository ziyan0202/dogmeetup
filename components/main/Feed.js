import React, { useEffect, useState } from "react";
import {getPosts,deletePost, getUserName} from "../../App.js";
import { View, Text, Image, Button, StyleSheet } from "react-native";
import {ScrollView} from "react-native-gesture-handler";
import firebase from "firebase";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";

export default function Feed(props) {
  const [posts, setPosts] = useState([]);

  
  const _getPosts = async () => {
    if(props.targetUser !== undefined){
      console.log(props.targetUser);
      const posts = await getPosts(props.targetUser);
      console.log("POSTS", posts);
      setPosts(posts);
    }
    else{
      const posts = await getPosts();
      console.log("POSTS", posts);
      setPosts(posts);
    }
  };

  useEffect(() => {
    _getPosts();
    console.log(posts);
  }, []);

  //Haven't figured out how to use this yet. Pull-to-refresh is complicated.
  //We could use a button, but 
  const onReload = async () =>{
    _getPosts();
  }

  const onDelete = async (docID) =>{
    /*If we want a confirmation of delete, it goes here, then delete post can be in an onConfirmation event*/
    await deletePost(docID);
    const posts = await getPosts(props.targetUser);
    setPosts(posts);
  }

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
        {props.targetUser == firebase.auth().currentUser.uid ? (
          <Button style={styles.deleteButton} title="Delete" onPress={() => onDelete(obj.id)}/>
        ):(
          <></>
        )}
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