import * as firebase from "firebase";
import "firebase/firestore";
import {View, Image,Text,StyleSheet,TouchableOpacity,FlatList} from 'react-native';
import React, { useEffect, useState } from "react";
import { Card } from 'react-native-paper';
import { SyntheticPlatformEmitter } from 'expo-modules-core';


let Receive=new Set();
const Message = (props) => {
    const { navigation } = props;
    

  const db =firebase.firestore()
  let Messages = firestore().where("userID","array-contains",firebase.auth().currentUser.uid).get().then(docRefs =>{
    let Messages = [];
    docRefs.forEach(doc =>{
      let newMessage = doc.collection('Messages').orderby("createdAt","desc").get().then(messages =>{
        return messages[0];
      });
      Messages.append(newMessage);
    })
    return Messages;
  })
  /*let Messages =[
    {
    id:1,
    userid:2,
    userName: 'test',
    userImg: require("../../images/defaultUserImg.png"),
    messageText:'',
    // 'Hey there, this is Tom. Welcom to our dog meetup app in react native',
    messageTime: '2 days ago',
    },
    {
    id:2,
    userName: 'Lucy',
    userImg: require("../../images/defaultUserImg.png"),
    messageText:
    'Hey there, this is Lucy. Welcom to our dog meetup app in react native',
    messageTime: '4 days ago',
    }
    
  ];*/
  //console.log("!!!"+Messages[0].userName );
  //from where
  let announce =null;
  useEffect(() => {
  let num=0;
  let m_id=1;
  

    const subscribe =db.collection('Chat').onSnapshot((snapshot) => {
      
      
      snapshot.docChanges().forEach((change) => {
        
        if(change.type =="added" ){
          let data = change.doc.data();
          data.createdAt =data.createdAt.toDate();
          if(data.user._id === firebase.auth().currentUser.uid){
            //console.log("!!ss!"+Messages[0].userName );
             announce=data.user.from;

             //console.log(data.text+Messages[0].userName);
             //console.log(Messages[0].userName);
             Messages[0].userName ='yyy';
             
            // let message_info = {
            //  userid :data.user.from,
            //  id : m_id,
            //  userName : "wow/",
            //  messageText : data.text,
            //  userImg: require("../../images/defaultUserImg.png"),
            //  messageTime : data.createdAt
            // };
            // Messages.push(message_info);
            // num +=1;
            // m_id +=1;
           
          }
        
        }
      })
console.log("-----"+Messages[0].userName);
    })
     
    return ()=>subscribe();
    
  }, []);


  
  return (
    <View style = {styles.container}>

      
        <FlatList
         data ={Messages}
         keyExtractor={item =>item.id}
         renderItem = {({item}) => (
          <TouchableOpacity onPress={() => props.navigation.navigate('ChatScreen',{userName: item.userName, id:announce,current:firebase.auth().currentUser.uid})}>
            
             <View style={styles.card} >
            {/* current:firebase.auth().currentUser.uid */}
            <View style={styles.UserInfo}>
            <View style = {styles.ImgWrapper}>
               <Image
          style={styles.userImg}
          source={item.userImg}
            /></View>
            <View style = {styles.Textsection}>
            <View style = {styles.UserInfoText}>
            <Text style = {styles.UserName}>{item.userName}</Text>
            <Text style = {styles.PostTime}>{item.messageTime}</Text>
             </View> 
             <Text style = {styles.MessageText}>{item.messageText}</Text>   

            </View>

            </View>
            </View>
          </TouchableOpacity>
         
          
         )
         }
        />
       
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
      
   },
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
   },
   PostTime: {
     fontSize: 12,
     paddingRight:18,

   },
   MessageText: {
    fontSize: 12,
   }
   
  });
export default Message;


