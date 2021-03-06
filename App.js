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
import SplashScreen from "./components/auth/SplashScreen";
//import redux
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import rootReducer from "./redux/reducers";
//use fetch function
import thunk from "redux-thunk";

import MainScreen from "./components/Main";
import AddScreen from "./components/main/Add";
import Savedevent from "./components/main/Savedevent";
import SaveScreen from "./components/main/Save";
import EditProfileScreen from "./components/main/EditProfileScreen";
import ChatScreen from "./components/main/ChatScreen";
import EventDetailsScreen from "./components/main/EventDetailsScreen";
import Following from "./components/main/Following";
import Follower from "./components/main/Follower";

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
              component={SplashScreen}
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
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="Add"
              component={AddScreen}
              navigation={this.props.navigation}
            />
            <Stack.Screen
              name="Savedevent"
              component={Savedevent}
              navigation={this.props.navigation}
            />

            <Stack.Screen
              name="Save"
              component={SaveScreen}
              navigation={this.props.navigation}
            />
            <Stack.Screen
              name="EventDetailsScreen"
              component={EventDetailsScreen}
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
              options={({ route }) => ({
                headerTitle: route.params.userName,
                headerBackTitleVisible: false,
              })}
            />

            <Stack.Screen
              name="Followingscreen"
              component={Following}
              options={({ route }) => ({
                headerTitle: "Your Following list",
                headerBackTitleVisible: false,
              })}
            />

            <Stack.Screen
              name="Followerscreen"
              component={Follower}
              options={({ route }) => ({
                headerTitle: "Your Follower list",
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
  if (postdata.data().userID == firebase.auth().currentUser.uid) {
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

///////////////////////////////////////////////
//
//    Event Backend Functions:   <"search code">
//        -followEvent (string userID, string eventID) <eb1>
//        -unfollowEvent (string userID, string eventID) <eb2>
//        -createEvent(object eventData) <eb3>
//            -expected object schema commented in the function
//        -deleteEvent(string eventID) <eb4>
//        -getEvents(bool pastEvents) <eb5>
//        -getFollowedEvents(string followerID, bool pastEvents) <eb6>
//        -getEvent(string eventID) <eb7>
//
////////////////////////////////////////////////

//Sets a user to follow an event by ID <eb1>
export async function followEvent(uid, eventID) {
  //Set it in user-first Event's Following collection
  await db
    .collection("EventsFollowing")
    .doc(uid)
    .collection("events")
    .doc(eventID)
    .set({ id: eventID });
  //Set it in the Event's followers array
  await db
    .collection("Events")
    .doc(eventID)
    .update({
      followers: firebase.firestore.FieldValue.arrayUnion(uid),
    });
  return;
}

//Takes a user off an event's follow list and vice versa <eb2>
export async function unfollowEvent(uid, eventID) {
  //Remove it from user-first Events Following collection
  await db
    .collection("EventsFollowing")
    .doc(uid)
    .collection("events")
    .doc(eventID)
    .delete();
  // Remove from event's Followers collection
  await db
    .collection("Events")
    .doc(eventID)
    .update({
      followers: firebase.firestore.FieldValue.arrayRemove(uid),
    });
  return;
}

//Takes an object of event data (presumably from a form) and puts it in the database <eb3>
//   the event's creator follows it by default
export async function createEvent(eventData) {
  console.log("function reached");
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
  //Make sure the followers array is there
  eventData.followers = [eventData.userID];

  //Create the event
  const newEvent = await db.collection("Events").add(eventData);
  //Officially have the creator follow the event
  await followEvent(firebase.auth().currentUser.uid, newEvent);
  return true;
}

//Delete an event by ID <eb4>
export async function deleteEvent(eventID) {
  //double check that the current user is authorized to delete the post
  const event = await db.collection("Events").doc(eventID).get();
  if (event.data().userID == firebase.auth().currentUser.uid) {
    await db.collection("Events").doc(eventID).delete();
  }
  return;
}

//Get a list of events either from the past or the future <eb5>
export async function getEvents(pastEvents = false) {
  var query = db.collection("Events");
  if (pastEvents) {
    //Dig through events that already happened, newest to oldest
    query = query
      .where("eventTime", "<", firebase.firestore.Timestamp.now())
      .orderBy("eventTime", "desc");
  } else {
    //Get upcoming events, soonest to farthest out
    query = query
      .where("eventTime", ">", firebase.firestore.Timestamp.now())
      .orderBy("eventTime", "asc");
  }
  return query.get().then((snapshot) => {
    var events = [];
    snapshot.forEach((doc) => {
      //console.log(doc.data());
      events.push(doc.data());
      events[events.length - 1].id = doc.id;
      if (firebase.auth().currentUser.uid in doc.data().followers) {
        events[events.length - 1].isFollowing = true;
      }
    });

    return events;
  });
}

//Same as getEvents, but only pull events that a certain user is following <eb6>
export async function getFollowedEvents(follower, pastEvents = false) {
  //use the event list to query for the related events (document id is in the list of event ids)
  var query = db
    .collection("Events")
    .where("followers", "array-contains", follower);

  if (pastEvents) {
    //Dig through events that already happened, newest to oldest
    query = query
      .where("eventTime", "<", firebase.firestore.Timestamp.now())
      .orderBy("eventTime", "desc");
  } else {
    //Get upcoming events, soonest to farthest out
    query = query
      .where("eventTime", ">", firebase.firestore.Timestamp.now())
      .orderBy("eventTime", "asc");
  }
  //execute
  return query.get().then((snapshot) => {
    var events = [];
    snapshot.forEach((doc) => {
      //console.log(doc.data());
      events.push(doc.data());
      events[events.length - 1].id = doc.id;
      if (firebase.auth().currentUser.uid in doc.data().followers) {
        events[events.length - 1].isFollowing = true;
      }
    });

    return events;
  });
}

//Same as getEvents, but only pull events that a certain user is created <eb6>
export async function getCreatedEvents(creator) {
  //grab the list of events
  const query = await db
    .collection("Events")
    .where("userID", "==", creator)
    .orderBy("eventTime", "desc");

  //execute
  return query.get().then((snapshot) => {
    var events = [];
    snapshot.forEach((doc) => {
      //console.log(doc.data());
      events.push(doc.data());
      events[events.length - 1].id = doc.id;
      if (firebase.auth().currentUser.uid in doc.data().followers) {
        events[events.length - 1].isFollowing = true;
      }
    });

    return events;
  });
}

//Get data of a single event by ID <eb7>
export async function getEvent(eventID) {
  return db
    .collection("Events")
    .doc(eventID)
    .get()
    .then((doc) => {
      return doc.data();
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
