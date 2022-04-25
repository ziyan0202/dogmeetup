//after landing login and logister
import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
//get connect to redux
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
//inside action
import {
  fetchUser,
  fetchUserPosts,
  fetchUserFollowing,
  clearData,
} from "../redux/actions/index";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

const Tab = createBottomTabNavigator();
import FeedScreen from "./main/Feed";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import ProfileScreen from "./main/Profile";
import SearchScreen from "./main/Search";
import SavedScreen from "./main/Savedevent";
import firebase from "firebase";
import MessageScreen from "./main/MessageScreen";
import Icon from "react-native-vector-icons/Ionicons";

//To make sure the tab Add can run
const EmptyScreen = () => {
  return null;
};

export class Main extends Component {
  componentDidMount() {
    this.props.clearData();
    this.props.fetchUser();
    this.props.fetchUserPosts();
    this.props.fetchUserFollowing();
  }
  render() {
    return (
      <Tab.Navigator initialRouteName="Feed">
        <Tab.Screen
          name="Explore Meetup"
          component={FeedScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="home" color={color} size={26} />
            ),
            headerRight: () => (
              <Icon.Button
                name="add-outline"
                size={25}
                backgroundColor="#fff"
                color="#000"
                onPress={() => this.props.navigation.navigate("Add")}
              />
            ),
            unmountOnBlur: true, //To make sure the page has to reload when we navigate around
          }}
        />
        <Tab.Screen
          name="Search"
          component={SearchScreen}
          navigation={this.props.navigation}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="magnify" color={color} size={26} />
            ),
          }}
        />
        <Tab.Screen
          name="Saved Events"
          component={SavedScreen}
          navigation={this.props.navigation}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="heart-outline"
                color={color}
                size={26}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Messages"
          component={MessageScreen}
          navigation={this.props.navigation}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="message-processing-outline"
                color={color}
                size={26}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          listeners={({ navigation }) => ({
            //A user press this tab
            tabPress: (event) => {
              event.preventDefault();
              navigation.navigate("Profile", {
                uid: firebase.auth().currentUser.uid,
              });
            },
          })}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="account-circle"
                color={color}
                size={26}
              />
            ),
            unmountOnBlur: true, //To make sure the page has to reload when we navigate around
          }}
        />
      </Tab.Navigator>
    );
  }
}
const mapStateToProps = (store) => ({
  //access the variable inside redux state
  currentUser: store.userState.currentUser,
});
const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    { fetchUser, fetchUserPosts, fetchUserFollowing, clearData },
    dispatch
  );
export default connect(mapStateToProps, mapDispatchProps)(Main);
