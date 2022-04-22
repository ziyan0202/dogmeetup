import {View, Text,StyleSheet,TouchableOpacity,TextInput,Button} from 'react-native';
import React, { useEffect, useState,useCallback } from "react";
import * as firebase from "firebase";
import "firebase/firestore";

const Follower = (props) => {
  const [followlist,SetFollowlist] =useState([]);

  const profile_id=props.route.params.id
  const db = firebase.firestore();

  useEffect(() => {
    const list = db.collection('follower').doc(profile_id).collection('userFollower').onSnapshot((snapshot) =>{
      SetFollowlist(snapshot.docs.map(doc =>({
        follower_id:doc.id,
        name:doc.data().name,
      })))

    })
   return  ()=>list();
  }, []);

 
  return (
    followlist.map (({follower_id,name})=>(
      <View style={styles.text} >
        <Text onPress={() =>
        props.navigation.navigate("Profile", {
           uid: follower_id,
        })
        
      }>{name}</Text>
      </View>
      
    ))
  );
};

const styles = StyleSheet.create({
  text:{
    paddingBottom:10
  }
 
});


export default Follower;