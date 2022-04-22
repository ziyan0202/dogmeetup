import * as firebase from "firebase";
import "firebase/firestore";
import {View, Image,Text,StyleSheet,TouchableOpacity,FlatList} from 'react-native';
import React, { useEffect, useState } from "react";
import { Card } from 'react-native-paper';
import { SyntheticPlatformEmitter } from 'expo-modules-core';
// import {db} from './MessageScreen'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {getUserName} from "../../App.js"




const Postmessage = ({text,id,user,fromid,to,time,img,prop,fromname}) => {

 const db =firebase.firestore()
   
  
     useEffect(() => {
       
        
      },[]);


    const currentemail =firebase.auth().currentUser.email;

    //const nn =firebase.auth().currentUser.displayName;
    const name = getUserName(firebase.auth().currentUser.uid)
    //console.log()


    return (         
        <View style = {styles.container}>

            { (firebase.auth().currentUser.uid == to) &&
            
            <View style={styles.card} >
                <View style={styles.UserInfo}>
                <View style = {styles.ImgWrapper}>
                <Image
                 style={styles.userImg}
                 source={require("../../images/defaultUserImg.png")}
                /></View>
                <View style = {styles.Textsection}>
                <View style = {styles.UserInfoText}>
                <Text style = {styles.UserName}>{fromname}:</Text>
                {/* <Text style = {styles.PostTime}>{time}</Text> */}

                </View> 
                <Text style = {styles.MessageText} 
                onPress={() =>
                    prop.navigation.navigate("ChatScreen", {
                        userName: currentemail,
                        id:fromid,
                        current:firebase.auth().currentUser.uid
                    })
                  }
                >{text}</Text>            
                 </View> 
                 </View>
                 </View>                
            }     
          </View>
         
        );     
}
const styles = StyleSheet.create({
    userImg: {
     width: 50,
     height:50,
     borderRadius:25,
 
    },
    card:{
      width :'100%'
    },
    UserInfo: {
      flexDirection: "row",
      justifyContent:"space-between",
 
    },
    ImgWrapper: {
     paddingTop: 15,
     paddingBottom:15,
    },
    Textsection: {
      flexDirection :"column",
      justifyContent: "center",
      padding: 15,
      paddingLeft: 0,
      marginLeft: 10,
      width: 300,
      borderBottomWidth: 1,
    },
    UserInfoText: {
      flexDirection:"row",
      justifyContent:"space-between",
      marginBottom:5,
    },
    UserName:{
      fontSize: 12,
      fontWeight:"bold",
      display:"flex",
      marginBottom:10
    },
    PostTime: {
      fontSize: 12,
      paddingRight:18,
 
    },
    MessageText: {
     marginTop:10,
     fontSize: 12,

    }
    
   });

export default Postmessage;