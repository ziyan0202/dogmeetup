import {ImageBackground,Container,View, Text,StyleSheet,ScrollView,SafeAreaView,Button,Image,FlatList} from 'react-native';
import React, { useEffect, useState,useCallback } from "react";
import * as firebase from "firebase";
import "firebase/firestore";

const Following = (props) => {
  const [followlist,SetFollowlist] =useState([]);

  const profile_id=props.route.params.id
  const db = firebase.firestore();

  useEffect(() => {
    const list = db.collection('following').doc(profile_id).collection('userFollowing').onSnapshot((snapshot) =>{
      SetFollowlist(snapshot.docs.map(doc =>({
        following_id:doc.id,
      })))

    })
   return  ()=>list();
  }, []);
  
  const img = { uri: "https://reactjs.org/logo-og.png" };
  return (
    
      followlist.map (({following_id})=>(  
        
        <SafeAreaView style={styles.container}>  
       
        <View style = {styles.ImgWrapper}>
          
          <Image
          style={styles.userImg}
          source={require("../../images/Avatar.png")}
          /></View>
        <Text  style={styles.text} onPress={() =>
        props.navigation.navigate("Profile", {
          uid: following_id,
        })}>{following_id}</Text>
       
          </SafeAreaView>      
    ))   
  );
};

const styles = StyleSheet.create({
  container:{
    marginBottom:20,
    display:"flex",
    flexDirection:'row',
    alignItems: 'center',
  },
  ImgWrapper: {
    paddingTop: 15,
    paddingBottom:10,
   },
   userImg:{ 
      width: 50,
      height:50,
      borderRadius:25,  
      marginLeft:10,
   },
   text:{
     marginLeft:10,
   }
 
});


export default Following;