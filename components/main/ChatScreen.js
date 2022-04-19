import {View, Text,StyleSheet,TouchableOpacity,TextInput,Button} from 'react-native';
import React, { useEffect, useState,useCallback } from "react";
import * as firebase from "firebase";
import "firebase/firestore";
import {GiftedChat, Send} from 'react-native-gifted-chat'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'



const Message = (props) => {

    
  const [user,setUser] = useState(null)
  const [name,setName] = useState('')
  const db = firebase.firestore();
 
  const [messages, setMessages] = useState([])
 
  useEffect(() => {

    const subscribe =db.collection('Chat').onSnapshot((snapshot) => {
      

      snapshot.docChanges().forEach((change) => {
        if(change.type =="added" ){
          let data = change.doc.data();
          data.createdAt =data.createdAt.toDate();
          // if(data.user.from === props.route.params.id || data.user.from === props.route.params.current && props.route.params.id === data.user._id
          //   ){
          if(data.user.from === props.route.params.current && data.user._id === props.route.params.id){
            
            setMessages((prevMessages) =>
            GiftedChat.append(prevMessages,data));
          }else if(data.user._id === props.route.params.current && data.user.from === props.route.params.id){
            setMessages((prevMessages) =>
            GiftedChat.append(prevMessages,data));
          } 
        }
      })

    })
    return ()=>subscribe();
  }, []);
  

  const onSend = useCallback((messages =[]) => {
    
    firebase
       .firestore()
       .collection('Chat')
       .doc(Date.now().toString())
       .set(messages[0])
       
  },[messages])
  
  const renderSend = (props) => {
    return (
      <Send {...props}>
        <View>
          <Icon name='send-circle'  style ={{marginBottom:5, marginRight:5}} 
          size={32} color='#2e64e5'/>

        </View>

      </Send>

    );
  }

  return (
    // <View style = {styles.container}>
        // <GiftedChat  messages ={messages} user={props.route.params.userName}/>

   <GiftedChat  
   messages ={messages} 
   onSend={(messages)=> onSend(messages)}
   showAvatarForEveryMessage={true}
   user={
     {
       //id is the person you want to talk to
        _id:props.route.params.id,
        from:props.route.params.current,
        name: props.route.params.userName,
        avatar:'https://placeimg.com/140/140/any'
        
     }}
     alwaysShowSend
     renderSend ={renderSend}
     scrollToBottom
   />
   
        
  );
};

const styles = StyleSheet.create({
   container: {
       flex:1,
       backgroundColor: "#fff",
       alignItems: 'center',
       justifyContent: 'center',
       padding: 30
   },
   input: {
     height: 50,
     width: "100%",
     borderWidth: 1,
     padding: 15,
     marginBottom: 20,
     borderColor: 'gray'
   }
  });
export default Message;