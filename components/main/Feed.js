import React, { useEffect, useState } from "react";
import { getEvents, getCreatedEvents, deleteEvent, getFollowedEvents, followEvent, unfollowEvent } from "../../App.js";
import {
  View,
  Text,
  Image,
  Button,
  StyleSheet,
  TextInput,
  Pressable,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import Event from "./Event.js";
import { ScrollView } from "react-native-gesture-handler";
import firebase from "firebase";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { MaskedViewComponent } from "@react-native-community/masked-view";
import { backgroundColor } from "react-native/Libraries/Components/View/ReactNativeStyleAttributes";
import AntDesign from "react-native-vector-icons/AntDesign";
export default function Feed(props) {
  const [posts, setPosts] = useState([]);
  //const [comments, setComments] = useState("");
  //const [like, setLike] = useState([]);

  const _getPosts = async () => {
    if (props.targetUser !== undefined) {
      // console.log(props.targetUser);
      const posts = await getCreatedEvents(props.targetUser);
      console.log("POSTS(c)", posts);
      setPosts(posts);
    } else {
      const posts = await getEvents();
      console.log("POSTS(g)", posts);
      setPosts(posts);
    }
  };

  useEffect(() => {
    _getPosts();
    //console.log(posts);
  }, []);

  //Haven't figured out how to use this yet. Pull-to-refresh is complicated.
  //We could use a button, but
  const onReload = async () => {
    _getPosts();
  };

  

  /* Deprecated? We need to decide if we'll do this or not
  const postcomment = (e) => {
    // db.collection('posts').doc(postId).collection('comments').add({
    //   text: comment,
    //   username: currentuser.displayName,
    //   timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    // })
    // setComment('')
    console.log("sss");
  };
  const photo = () => {
    console.log("come on");
  };

    //click likes num
    const funclike = (e) => {
      const p =firebase
        .firestore()
        .collection("posts")
        .doc(e);
        if(like){
           p.get()
        .then(()=>{
             p.update({like:firebase.firestore.FieldValue.increment(-1),heart:false})
            //  p.update({})
        })
        }else{
          p.get()
        .then(()=>{
             p.update({like:firebase.firestore.FieldValue.increment(1),heart:true})
        })
        }
       
        setLike(!like)
    };
  */

  const postList = posts?.map((obj) => {
    //console.log(obj.userID);
    if(props.targetUser == firebase.auth().currentUser.uid){
      obj.canDelete = true;
    }
    else{
      obj.canDelete = false;
    }
    return(<Event data={obj} navigation={props.navigation}></Event>);
  });

  return (
    <View style={{ width:"100%" }}>
      <ScrollView scrollEnabled>
        <View style={{ overflow: "scroll"}}>{postList}</View>
      </ScrollView>
    </View>
  );
}


