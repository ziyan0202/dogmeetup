import React, { useEffect, useContext, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  TextInput,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import FormButton from "./FormButton";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";
import { Platform } from "react-native-web";
import BottomSheet from "reanimated-bottom-sheet";
import Animated from "react-native-reanimated";
import firebase from "firebase";
require("firebase/firestore");

const EditProfileScreen = (props) => {
  const handleUpdate = () => {};
  const db = firebase.firestore();

  const [user, setUser] = useState(null);
  const [currentname, SetCurrentname] = useState();
  const [currentDesc,SetCurrentDes] = useState();
  const [namechange, SetNamechange] = useState();
  const [deschange, SetDeschange] = useState();
  useEffect(() => {
    const sub = db
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .onSnapshot((snapshot) => {
        SetCurrentname(snapshot.data().name);
      });
    return () => sub();
  }, [firebase.auth().currentUser.uid]);

  db.collection("users")
    .doc(firebase.auth().currentUser.uid)
    .onSnapshot((snapshot) => {
      SetCurrentname(snapshot.data().name);
      if(snapshot.data().userAbout !== undefined){
        SetCurrentDes(snapshot.data().userAbout);
      }
    });

  const sheetRef = React.createRef();
  const fall = new Animated.Value(1);
  const renderInner = () => (
    <View style={styles.panel}>
      <View style={{ alignItems: "center" }}>
        <Text style={styles.panelTitle}>Upload Photo</Text>
        <Text style={styles.panelSubtitle}>Choose Your Profile Picture</Text>
      </View>
      <TouchableOpacity style={styles.panelButton}>
        <Text style={styles.panelButtonTitle}>Take Photo</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.panelButton}>
        <Text style={styles.panelButtonTitle}>Choose From Library</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.panelButton}
        onPress={() => sheetRef.current.snapTo(1)}
        // onpress={() =>text()}
      >
        <Text style={styles.panelButtonTitle}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.panelHeader}>
        <View style={styles.panelHandle}></View>
      </View>
    </View>
  );
  const { navigation } = props;
  const Changename =(e)=>{
    SetNamechange(e)
  }

  const ChangeDesciption =(e)=>{
    SetDeschange(e)
  }

//submit the change to firebase 
const submitchange =()=>{

  const newData = {};
  if(namechange !== undefined){
    newData.name = namechange;
  }
  if(deschange !== undefined){
    newData.userAbout = deschange;
  }

  if(Object.keys(newData).length > 0){
    db.collection("users")
    .doc(firebase.auth().currentUser.uid)
    .update(newData);

    //Update all events to use the new name
    db.collection("Events")
      .where("userID","==",firebase.auth().currentUser.uid)
      .get()
      .then(snapshot =>{
        snapshot.forEach(doc =>{
          doc.ref.update(newData);
        })
      })
  }
  
  page();
}
const page=()=>{
  console.log('here')
  // navigation.navigate("Profile", {
  // })
}

  return (
    <View style={styles.container}>
      <BottomSheet
        ref={sheetRef}
        snapPoints={[350, 0]}
        renderContent={renderInner}
        renderHeader={renderHeader}
        initialSnap={1}
        callbackNode={fall}
        enabledGestureInteraction={true}
      />
      <Animated.View
        View
        style={{
          margin: 20,
          opacity: Animated.add(0.1, Animated.multiply(fall, 1.0)),
        }}
      >
        <View style={{ alignItems: "center" }}>
          <TouchableOpacity
            style={styles.panelButtonTitle}
            onPress={() => sheetRef.current.snapTo(0)}
          >
            <View
              style={{
                height: 100,
                width: 100,
                borderRadius: 15,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ImageBackground
                source={{
                  uri: "https://eugeneweekly.com/wp-content/uploads/2020/08/20200820pets-1-lede-1300x844.jpg",
                }}
                style={{ height: 100, width: 100 }}
                imageStyle={{ borderRadius: 15 }}
              >
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Icon
                    name="camera"
                    size={35}
                    color="#fff"
                    style={{
                      opacity: 0.7,
                      alignItems: "center",
                      justifyContent: "center",
                      borderWidth: 1,
                      borderColor: "#fff",
                      borderRadius: 10,
                    }}
                  />
                </View>
              </ImageBackground>
            </View>
          </TouchableOpacity>
          <Text style={{ marginTop: 10, fontSize: 18, fontWeight: "bold" }}>
            {currentname}
          </Text>
          <View style={styles.action}>
            <FontAwesome name="user-o" size={20} />
            <TextInput
              placeholder={currentname}
              placeholderTextColor="#666666"
              autoCorrect={false}
              style={styles.textInput}
              onChangeText={(text) => Changename(text)}
            />
          </View>
          <View style={styles.action}>
            <FontAwesome name="user-o" size={20} />
            <TextInput
              placeholder={currentDesc!==undefined?currentDesc:"About Me"}
              placeholderTextColor="#666666"
              autoCorrect={false}
              style={styles.textInput}
              onChangeText={(des) => ChangeDesciption(des)}
            />
          </View>
          <FormButton buttonTitle="Update" onPress={() => {submitchange()}} />
        </View>
      </Animated.View>
    </View>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  commandButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#FF6347",
    alignItems: "center",
    marginTop: 10,
  },
  panel: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    paddingTop: 20,
  },
  header: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#333333",
    shadowOffset: { width: -1, height: -3 },
    shadowRadius: 2,
    shadowOpacity: 0.4,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelHeader: {
    alignItems: "center",
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#00000040",
    marginBottom: 10,
  },
  panelTitle: {
    fontSize: 27,
    height: 35,
  },
  panelSubtitle: {
    fontSize: 14,
    color: "gray",
    height: 30,
    marginBottom: 10,
  },
  panelButton: {
    padding: 13,
    borderRadius: 10,
    backgroundColor: "#FF6347",
    alignItems: "center",
    marginVertical: 7,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "white",
  },
  action: {
    flexDirection: "row",
    marginTop: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
    paddingBottom: 5,
  },
  actionError: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#FF0000",
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    paddingLeft: 10,
    color: "#05375a",
  },
});
