import * as firebase from "firebase";
import "firebase/firestore";
import {View, Image,Text,StyleSheet,TouchableOpacity,FlatList} from 'react-native';
import React, { useEffect, useState } from "react";
import { Card } from 'react-native-paper';
import { SyntheticPlatformEmitter } from 'expo-modules-core';
import Messagepost from './Messagepost';
import { set } from "react-native-reanimated";
import { ScrollView } from "react-native-gesture-handler";

const Message = (props) => {
    //const { navigation } = props;
    const[message,SetMessage] = useState([]);
    const[users,SetUsers] = useState([]);
    const[currentname, SetCurrentname] = useState();
    
    const db =firebase.firestore()
    // const { currentUser} = props;
    // SetUsers(currentUser)
  
  useEffect(() => {
    const sub =db.collection('users').doc( firebase.auth().currentUser.uid).onSnapshot((snapshot) => {
      SetCurrentname(snapshot.data().name)
    })
    const subscribe =db.collection('Chat').orderBy('createdAt','desc').onSnapshot((snapshot) => {
      var userArray =[];
      var messageArray=[];
      
      snapshot.docs.forEach(doc =>{
        console.log(doc.data());
        var othername;
        if(doc.data().user.name == currentname){
          othername = doc.data().user.fromname
        }else{
          othername = doc.data().user.name
        }

        if(userArray.indexOf(othername) == -1) {
          messageArray.push({
               id:doc.id,
               messagepost:doc.data()
          })
          userArray.push(othername);
          SetUsers(userArray);
          console.log(userArray)
        }

      });
      SetMessage(messageArray);
    })
     
    return ()=>subscribe();
  }, []);

 console.log(message)

  return (
    <ScrollView scrollEnabled>
    <View style = {styles.container}>
    {  
      message.map(({id,messagepost})=>(
        <Messagepost  
            text={messagepost.text} 
            user={messagepost.user.name}
            fromid={messagepost.user.from}
            fromname={messagepost.user.fromname}
            namelist={users}
            to={messagepost.user._id}
            id={id}
            img={messagepost.user.avatar}
            prop={props}
            // time={messagepost.createdAt.toDate()}
         />
      ))
      } 
    </View>
    </ScrollView>
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

