import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, Image, Button } from "react-native";
import firebase from "firebase";
import { NavigationContainer } from "@react-navigation/native";
import { createEvent, getUserName } from "../../App";
import DateTimePicker from '@react-native-community/datetimepicker';
import { TouchableOpacity } from "react-native-gesture-handler";
require("firebase/firestore");
require("firebase/firebase-storage");

export default function Save(props) {
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [details, setDetails] = useState("");
  const [date,setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [display,setDisplay] = useState("default");

  //Pulled from React Native Time Picker Example: https://reactnativeguides.com/react-native-date-and-time-picker/ 
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    setDisplay('default');
    showMode('date');
  };

  const showTimepicker = () => {
    setDisplay('spinner');
    showMode('time');
  };
  //End Citation

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

    var eventTime = firebase.firestore.Timestamp.fromDate(date);
    

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

      <View style={styles.pickerContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.dateTimePreview}>{date.toLocaleDateString()}</Text> 
        </View>
        <TouchableOpacity style={styles.pickerBtn} onPress={showDatepicker}>
          <Text style={styles.pickerBtnTxt}>Set Date</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.pickerContainer}>
      <View style={styles.textContainer}>
          <Text style={styles.dateTimePreview}>{date.toLocaleTimeString()}</Text> 
        </View>
        <TouchableOpacity style={styles.pickerBtn} onPress={showTimepicker}>
          <Text style={styles.pickerBtnTxt}>Set Time</Text>
        </TouchableOpacity>
      </View>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          is24Hour={true}
          display = {display}
          onChange={onChange}
        />
      )}

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
  pickerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    height: 40,
    marginTop: 10,
    marginBottom: 5,
  },
  pickerBtn: {
    borderColor: "#2e64e5",
    borderWidth: 2,
    borderRadius: 3,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 5,
    width:300,
  },
  pickerBtnTxt: {
    color: "#2e64e5",
    alignItems: "center",
  },
  textContainer: {
    width:100,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    flex:1
  },
  dateTimePreview: {
    fontSize: 20
  }
});
