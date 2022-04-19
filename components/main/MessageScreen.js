import * as firebase from "firebase";
import "firebase/firestore";
import {View, Image,Text,StyleSheet,TouchableOpacity,FlatList} from 'react-native';
import React, { useEffect, useState } from "react";
import { Card } from 'react-native-paper';
import { SyntheticPlatformEmitter } from 'expo-modules-core';
import Messagepost from './Messagepost';
import { set } from "react-native-reanimated";


const Message = (props) => {
    //const { navigation } = props;
    const[message,SetMessage] = useState([]);
    
    const db =firebase.firestore()
  
  
  useEffect(() => {
    const subscribe =db.collection('Chat').onSnapshot((snapshot) => {

      SetMessage(snapshot.docs.map(doc =>({
        id:doc.id,
        messagepost:doc.data()
      })))
    })
     
    return ()=>subscribe();
  }, []);

  return (
    <View style = {styles.container}>
      {
      message.map(({id,messagepost})=>(

        <Messagepost  
            text={messagepost.text} 
            user={messagepost.user.name}
            fromid={messagepost.user.from}
            to={messagepost.user._id}
            id={id}
            img={messagepost.user.avatar}
            prop={props}
            // time={messagepost.createdAt.toDate()}
         />
      ))
      } 
    </View>
  );
};

const styles = StyleSheet.create({
   container: {
       flex:1,
       backgroundColor: "#fff",
       alignItems: 'center',
       paddingLeft:20,
       paddingRight:20,    
   }
  });
export default Message;

