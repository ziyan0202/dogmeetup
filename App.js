import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image } from "react-native";
import React, { Component } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LandingScreen from "./components/auth/Landing";
import * as firebase from "firebase";
import "firebase/firestore";
import RegisterScreen from "./components/auth/Register";
import LoginScreen from "./components/auth/Login";
//import redux
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import rootReducer from "./redux/reducers";
//use fetch function
import thunk from "redux-thunk";

import MainScreen from "./components/Main";
import AddScreen from "./components/main/Add";
import SaveScreen from "./components/main/Save";
import EditProfileScreen from "./components/main/EditProfileScreen";
import ChatScreen from "./components/main/ChatScreen";

const store = createStore(rootReducer, applyMiddleware(thunk));

const firebaseConfig = {
  apiKey: "AIzaSyBlOR4s_0iGskGF0acN-hfi8sWCMqwfyvE",
  authDomain: "dog-meetup.firebaseapp.com",
  projectId: "dog-meetup",
  storageBucket: "dog-meetup.appspot.com",
  messagingSenderId: "38714583083",
  appId: "1:38714583083:web:e5892008ffa66435a8226e",
};

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

const Stack = createStackNavigator();

const logo = require("./images/logo.png");

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
    };
  }
  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        this.setState({
          loggedIn: false,
          loaded: true,
        });
      } else {
        this.setState({
          loggedIn: true,
          loaded: true,
        });
      }
    });
  }
  render() {
    const { loggedIn, loaded } = this.state;
    if (!loaded) {
      return <Image style={styles.splash} source={logo} />;
    }
    if (!loggedIn) {
      return (
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Landing">
            <Stack.Screen
              name="Landing"
              component={LandingScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      );
    }
    //user has already logged in
    return (
      //StackNavigator must inside navigationcontainer otherwise it won't work
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Main">
            <Stack.Screen
              name="Main"
              component={MainScreen}
              options={{ title: "Dog Meetup" }}
            />
            <Stack.Screen
              name="Add"
              component={AddScreen}
              navigation={this.props.navigation}
            />
            <Stack.Screen
              name="Save"
              component={SaveScreen}
              navigation={this.props.navigation}
            />
            <Stack.Screen
              name="EditProfile"
              component={EditProfileScreen}
              options={{
                headerTitle: "Edit Profile",
                headerBackTitleVisible: false,
                headerTitleAlign: "center",
                headerStyle: {
                  backgroundColor: "#fff",
                  shadowColor: "#fff",
                  elevation: 0,
                },
              }}
            />
            <Stack.Screen
              name="ChatScreen"
              component={ChatScreen}
              options={({route}) => ({
                headerTitle: route.params.userName,
                headerBackTitleVisible: false,
                
              })}
            />

          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    );
  }
}

export async function getPosts(uid) {
  var query = db.collection("posts").orderBy("timePosted", "desc").limit(30);
  if (uid !== undefined) {
    query = query.where("userID", "==", uid);
  }
  return query.get().then((snapshot) => {
    var posts = [];
    snapshot.forEach((doc) => {
      //console.log(doc.data());
      posts.push(doc.data());
      posts[posts.length - 1].id = doc.id;
    });

    return posts;
  });
}

export async function deletePost(docID) {
  //double check that the current user is authorized to delete the post
  const postdata = await db.collection("posts").doc(docID).get();
  if(postdata.data().userID == firebase.auth().currentUser.uid){
    await db.collection("posts").doc(docID).delete();
  }
  return;
  
}

export async function getUserName(uid) {
  return db
    .collection("users")
    .doc(uid)
    .get()
    .then((snapshot) => {
      return snapshot.data().name;
    });
}

export async function followEvent(uid,eventID){
  await db.collection("EventsFollowing").doc(uid).collection("events").doc(eventID).set({id:eventID});
  return;
}

export async function unfollowEvent(uid,eventID){
  await db.collection("EventsFollowing").doc(uid).collection("events").doc(eventID).delete();
  return;
}

export async function createEvent(eventData){
  //expected eventData Schema:
  /*{
    description: <string>,
    eventCoordinates: <geopoint>, (We can avoid using this one for now)
    eventLocation: <string>,
    eventTime: <timestamp>,
    image: <string>, (url)
    name: <string>,
    userId: <string>
  }*/
  await db.collection("Events").add(eventData);
  return;
}

export async function deleteEvent(eventID){
  //double check that the current user is authorized to delete the post
  const event = await db.collection("Events").doc(eventID).get();
  if(event.data().userID == firebase.auth().currentUser.uid){
    await db.collection("Events").doc(eventID).delete();
  }
  return;
}

export async function getEvents(pastEvents = false){
  var query = db.collection("Events");
  if(pastEvents){
    //Dig through events that already happened, newest to oldest
    query = query.where("eventTime","<",Date.now()).orderBy("eventTime","desc");
  }
  else{
    //Get upcoming events, soonest to farthest out
    query = query.where("eventTime",">",Date.now()).orderBy("eventTime","asc");
  }
  return query.get().then((snapshot) => {
    var events = [];
    snapshot.forEach((doc) => {
      //console.log(doc.data());
      events.push(doc.data());
      events[posts.length - 1].id = doc.id;
    });

    return events;
  });
}

export async function getFollowedEvents(follower,pastEvents = false){
  //grab the list of followed events
  const eventIDs = await db.collection("EventsFollowing")
                           .doc(follower)
                           .collection("events")
                           .get()
                           .then((docs) => {
                              var idList = []
                              docs.forEach(doc => {
                                idList.append(doc.id);
                              });
                              return idList;
                           });
  //use the event list to query for the related events (document id is in the list of event ids)
  var query = db.collection("Events").where(firebase.firestore.FieldPath.documentId(),'in',eventIDs);
  
  //execute
  return query.get().then((snapshot) => {
    var events = [];
    snapshot.forEach((doc) => {
      //console.log(doc.data());
      events.push(doc.data());
      events[posts.length - 1].id = doc.id;
    });

    return events;
  });
   
}

export default App;

const styles = StyleSheet.create({
  splash: {
    padding: 200,
    height: "100%",
    width: "100%",
  },
  post: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 5,
    height: 100,
  },
  postTitle: {
    fontWeight: "bold",
    fontSize: 24,
  },
});
