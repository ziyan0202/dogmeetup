import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  StyleSheet,
  StatusBar,
  ImageBackground,
  View,
} from "react-native";
import firebase from "firebase";
import {followEvent, getEvent, unfollowEvent} from "../../App.js";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";


const EventDetailsScreen = (props) => {

  const [title,setTitle] = useState("");
  const [location,setLocation] = useState("");
  const [description,setDescription] = useState("");
  const [uid,setUID] = useState("");
  const [userName,setUserName] = useState("");
  const [image,setImage] = useState("");
  const [followers,setFollowers] = useState([]);

  const  follow = async () => {
    await followEvent(firebase.auth().currentUser.uid,props.route.params.eid);
    _getEvent();
  }

  const unfollow = async () => {
    await unfollowEvent(firebase.auth().currentUser.uid,props.route.params.eid);
    _getEvent();
  }
  
  const _getEvent = async () =>{
    const data = await getEvent(props.route.params.eid);
    console.log(props.route.params.eid);
    console.log(data);
    setTitle(data.eventName);
    setDescription(data.eventDetails);
    setLocation(data.eventLocation);
    setUID(data.userID);
    setUserName(data.userName);
    setImage(data.image);
    setFollowers(data.followers);
  }
  
  useEffect(()=>{
    _getEvent();
  },[]);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        backgroundColor: "white",
        paddingBottom: 20,
      }}
    >
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="rgba(0,0,0,0)"
      />
      <ImageBackground
        style={style.headerImage}
        source={{uri: image}}
      ></ImageBackground>
      <View>
        {/* view foricon */}
        <View style={{ marginTop: 20, paddingHorizontal: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>{title}</Text>
          <Text
            style={{
              fontSize: 12,
              fontWeight: "400",
              color: "grey",
              marginTop: 5,
            }}
          >
            {location}
          </Text>
          <View
            style={{
              marginTop: 10,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ fontSize: 13, color: "grey" }}>{followers.length} attending</Text>
          </View>
          <View
            style={{
              marginTop: 20,
            }}
          >
            <Text style={{ lineHeight: 20, color: "grey" }}>{description}</Text>
          </View>
        </View>
        {followers.indexOf(firebase.auth().currentUser.uid) != -1?
          <View style={style.btnGreen} onPress={() => unfollow()}>
            <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }} >
              Attending
            </Text>
          </View>
        :
          <View style={style.btn} onPress={() => follow()}>
            <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>
              Attend
            </Text>
          </View>
        }
      </View>
    </ScrollView>
  );
};

export default EventDetailsScreen;

const style = StyleSheet.create({
  headerImage: {
    height: 400,
    borderBottomRightRadius: 40,
    borderBottomRightRadius: 40,
    overflow: "hidden",
  },
  btn: {
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
    backgroundColor: "blue",
    marginHorizontal: 20,
    borderRadius: 10,
  },
  btnGreen: {
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
    backgroundColor: "green",
    marginHorizontal: 20,
    borderRadius: 10,
  }
});
