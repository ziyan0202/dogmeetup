import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, Image, Button } from "react-native";
import firebase from "firebase";
import { NavigationContainer } from "@react-navigation/native";
import { createEvent, getUserName } from "../../App";
require("firebase/firestore");
require("firebase/firebase-storage");

export default function Save(props) {
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [details, setDetails] = useState("");
  const [date,setDate] = useState(new Date(1651239000000));

  //Upload process
  const uploadImage = async () => {
    const uri = props.route.params.image;
    const response = await fetch(uri);
    const blob = await response.blob();
    const task = firebase
      .storage()
      .ref()
      .child(
        `posts/${firebase.auth().currentUser.uid}/${Math.random().toString(36)}`
      )
      .put(blob); //create random number with 36 character
    const taskProgress = (snapshot) => {
      console.log(`transferred: ${snapshot.bytesTransferred}`);
    }; //how much has uploaded
    const taskCompleted = () => {
      //URL accessible for everyone
      task.snapshot.ref.getDownloadURL().then((snapshot) => {
        savePostData(snapshot);
        console.log(snapshot);
      });
    };
    const taskError = (snapshot) => {
      console.log(snapshot); //to see the error
    };
    task.on("state_changed", taskProgress, taskError, taskCompleted);
  };
  const savePostData = async (downloadURL) => {
    console.log("starting save function");
    const uid = firebase.auth().currentUser.uid
    const userName = await getUserName(uid);

    ///TEMP: set date automatically until date-timePicker works
    var time = new Date(1651239000000);
    setDate(time);
    var eventTime = firebase.firestore.Timestamp(date);
    ///END TEMP
    

    const eventData = {
      description:details,
      eventName:caption,
      eventLocation: location,
      eventTime,
      image: downloadURL,
      userID: uid,
      userName,
    }

    createEvent(eventData)
    .then(function () {
      //will go to beginning route of navigator, return to main page
      props.navigation.popToTop();
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <Image source={{ uri: props.route.params.image }} />
      <TextInput
        style={styles.input}
        placeholder="Event title"
        onChangeText={(caption) => setCaption(caption)}
      />
      <TextInput
        style={styles.input}
        placeholder="Event location"
        onChangeText={(location) => setLocation(location)}
      />
      <TextInput
        style={styles.input}
        placeholder="Event details"
        onChangeText={(details) => setDetails(details)}
      />

      {/*
        THIS IS WHERE A DATE TIME PICKER WILL GO
      */}

      <Button title="Save" onPress={() => uploadImage()} />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
  },
});
