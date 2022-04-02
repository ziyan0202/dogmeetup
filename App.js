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
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    );
  }

}

export async function getPosts(){
  return db.collection("posts").orderBy("timePosted","desc").limit(20).get().then(snapshot =>{
    var posts = [];
    snapshot.forEach(doc =>{
      console.log(doc.data());
      posts.push(doc.data());
    });

    return posts;
  });
  
}

export async function getUserName(uid){
  return db.collection("users")
  .doc(uid)
  .get()
  .then(snapshot =>{
    return snapshot.data().name;
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
  }
});