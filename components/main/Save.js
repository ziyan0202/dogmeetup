import React, { useState } from "react";
import { StyleSheet, View, TextInput, Image, Button } from "react-native";
import firebase from "firebase";
import { NavigationContainer } from "@react-navigation/native";
import { getUserName } from "../../App";
require("firebase/firestore");
require("firebase/firebase-storage");

export default function Save(props) {
  const [caption, setCaption] = useState("");

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
    const userName = await getUserName(firebase.auth().currentUser.uid);
    firebase
      .firestore()
      .collection("posts")
      .add({
        contentURL: downloadURL, //
        caption,
        contentType: "image", //This is generalized so we can support "Location" for events
        timePosted: firebase.firestore.FieldValue.serverTimestamp(),
        userID: firebase.auth().currentUser.uid,
        userName,
      })
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
        placeholder="Write a Caption..."
        onChangeText={(caption) => setCaption(caption)}
      />
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
