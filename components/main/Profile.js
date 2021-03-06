import React, { useState, useEffect } from "react";
import {
  ImageBackground,
  StyleSheet,
  View,
  Button,
  Text,
  Image,
  FlatList,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { connect } from "react-redux";
import Feed from "./Feed.js";
import { getCreatedEvents } from "../../App.js";
import firebase from "firebase";
import { TouchableOpacity } from "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { set } from "react-native-reanimated";
require("firebase/firestore");
// import {db} from './MessageScreen'
const bk = require("../../images/bk1.png");
function Profile(props) {
  //In order to display current user and other user
  const [userPosts, setUserPosts] = useState([]);
  const [user, setUser] = useState(null);
  //Whether or not the current user is following the profile viewing
  const [following, setFollowing] = useState(false);
  const [post_num, SetPostNum] = useState([]);
  const [allfollow, SetAllfollow] = useState([]);
  const [allfollower, SetAllfollower] = useState([]);
  const [currentname, SetCurrentname] = useState();

  const db = firebase.firestore();

  const getPostCount = async () => {
    var posts = await getCreatedEvents(props.route.params.uid);
    console.log(posts);
    SetPostNum(posts.length);
  };

  useEffect(() => {
    getPostCount();
  }, []);

  //get current user name
  useEffect(() => {
    const sub = db
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .onSnapshot((snapshot) => {
        SetCurrentname(snapshot.data().name);
      });
    return () => sub();
  }, []);
  //console.log(firebase.auth().currentUser)
  useEffect(() => {
    const { currentUser, posts } = props;

    //Trying to access our own profile

    db.collection("following")
      .doc(props.route.params.uid)
      .collection("userFollowing")
      .onSnapshot((snapshot) => {
        SetAllfollow(
          snapshot.docs.map((doc) => ({
            follow: doc,
          }))
        );
      });

    db.collection("follower")
      .doc(props.route.params.uid)
      .collection("userFollower")
      .onSnapshot((snapshot) => {
        SetAllfollower(
          snapshot.docs.map((doc) => ({
            follower: doc,
          }))
        );
      });
    //follow

    if (props.route.params.uid === firebase.auth().currentUser.uid) {
      // setUser(currentUser);
      firebase
        .firestore()
        .collection("users")
        .doc(firebase.auth().currentUser.uid)
        .get()
        .then((snapshot) => {
          setUser(snapshot.data());
        });
      setUserPosts(posts);
    }
    //firebase call, fetch user and userPosts
    else {
      firebase
        .firestore()
        .collection("users")
        .doc(props.route.params.uid)
        .get()
        .then((snapshot) => {
          if (snapshot.exists) {
            setUser(snapshot.data());
          } else {
            console.log("does not exist");
          }
        });
    }
    if (props.following.indexOf(props.route.params.uid) > -1) {
      setFollowing(true);
    } else {
      setFollowing(false);
    }
  }, [props.route.params.uid, props.following, userPosts]); //only when this variable update will do the useEffect
  if (user === null) {
    return <View />;
  }

  const Follower = () => {
    firebase
      .firestore()
      .collection("follower")
      .doc(props.route.params.uid)
      .collection("userFollower")
      .doc(firebase.auth().currentUser.uid)
      .set({
        name: currentname,
      });
  };

  const UnFollower = () => {
    firebase
      .firestore()
      .collection("follower")
      .doc(props.route.params.uid)
      .collection("userFollower")
      .doc(firebase.auth().currentUser.uid)
      .delete();
  };

  //Follow and Unfollow functions
  const onFollow = () => {
    //Following the firebase firestore structure
    firebase
      .firestore()
      .collection("following")
      .doc(firebase.auth().currentUser.uid)
      .collection("userFollowing")
      .doc(props.route.params.uid)
      .set({
        name: user.name,
      });
    Follower();
  };

  const onUnfollow = () => {
    //Following the firebase firestore structure
    firebase
      .firestore()
      .collection("following")
      .doc(firebase.auth().currentUser.uid)
      .collection("userFollowing")
      .doc(props.route.params.uid)
      .delete();

    UnFollower();
  };

  const onLogout = () => {
    firebase.auth().signOut();
  };
  const { navigation } = props;
  const image = { uri: "https://reactjs.org/logo-og.png" };
  return (
    //style
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.containerInfo}
        contentContainerStyle={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          style={styles.userImg}
          source={{
            uri: "https://m.media-amazon.com/images/I/61vexDQktqL._AC_SL1182_.jpg",
          }}
        />
        <Text style={styles.userName}>{user.name}</Text>
        <Text>{user.email}</Text>
        <Text style={styles.aboutUser}>{user.userAbout}</Text>
        {props.route.params.uid !== firebase.auth().currentUser.uid ? (
          <View style={styles.userBtnWrapper}>
            <TouchableOpacity
              style={styles.userBtn}
              onPress={() =>
                props.navigation.navigate("ChatScreen", {
                  userName: user.name,
                  id: props.route.params.uid,
                  current: firebase.auth().currentUser.uid,
                })
              }
            >
              <Text style={styles.userbtnTxt}>Message</Text>
            </TouchableOpacity>
            {/* To check if the user is following the profile viewing */}
            {following ? (
              <TouchableOpacity
                style={styles.followingBtn}
                onPress={() => onUnfollow()}
              >
                <Text style={styles.followingTxt}>Following</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.userBtn}
                onPress={() => onFollow()}
              >
                <Text style={styles.userbtnTxt}>Follow</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View style={styles.userBtnWrapper}>
            <TouchableOpacity
              style={styles.userBtn}
              onPress={() =>
                navigation.navigate("EditProfile", {
                  userName: user.name,
                  id: props.route.params.uid,
                  current: firebase.auth().currentUser.uid,
                })
              }
            >
              <Text style={styles.userbtnTxt}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.userBtn} onPress={() => onLogout()}>
              <Text style={styles.userbtnTxt}>Logout</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.userInfoWrapper}>
          <View style={styles.userInfoItem}>
            <Text style={styles.userInfoTitle}>{post_num}</Text>

            <Text style={styles.userInfoSubTitle}>Posts</Text>
          </View>

          <View style={styles.userInfoItem}>
            <Text style={styles.userInfoTitle}>{allfollower.length}</Text>
            <Text
              style={styles.userInfoSubTitle}
              onPress={() =>
                navigation.navigate("Followerscreen", {
                  id: props.route.params.uid,
                })
              }
            >
              Followers
            </Text>
          </View>
          <View style={styles.userInfoItem}>
            <Text style={styles.userInfoTitle}>{allfollow.length}</Text>
            <View>
              <Text
                style={styles.userInfoSubTitle}
                onPress={() =>
                  navigation.navigate("Followingscreen", {
                    id: props.route.params.uid,
                  })
                }
              >
                Following
              </Text>
            </View>
          </View>
        </View>
        {/* Next is posts */}

        {/* Old gallery view for user posts (this may be preferable but it wasn't working at the time of comment)
      <View style={styles.containerGallery}>
        <FlatList
          numColumns={3}
          horizontal={false}
          data={userPosts}
          renderItem={({ item }) => (
            <View style={styles.containerImage}>
              <Image style={styles.image} source={{ uri: item.downloadURL }} />
            </View>
          )}
        />
      </View>
          */}

        <Feed
          key={props.route.params.uid}
          targetUser={props.route.params.uid}
          style={{ width: "100%" }}
        ></Feed>
        <View style={styles.bottomSpacer}></View>
      </ScrollView>
    </SafeAreaView>
  );
}

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  posts: store.userState.posts,
  following: store.userState.following,
});

const styles = StyleSheet.create({
  //Conflix
  container: {
    flex: 1,
  },
  containerInfo: {
    // backgroundColor: "#fff",
    //backgroundColor: '#dbfbed',
    padding: 10,
    flex: 1,
  },
  containerGallery: {
    flex: 1,
  },
  userImg: {
    height: 150,
    width: 150,
    borderRadius: 75,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 10,
  },
  aboutUser: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
    textAlign: "center",
    marginBottom: 10,
  },
  userBtnWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    marginBottom: 10,
  },
  userBtn: {
    borderColor: "#2e64e5",
    borderWidth: 2,
    borderRadius: 3,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 5,
  },
  followingBtn: {
    borderColor: "#2e64e5",
    borderWidth: 2,
    borderRadius: 3,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 5,
    backgroundColor: "#2e64e5",
  },
  userbtnTxt: {
    color: "#2e64e5",
  },
  followingTxt: {
    color: "#FFFFFF",
  },
  userInfoWrapper: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginVertical: 20,
  },
  userInfoItem: {
    justifyContent: "center",
  },
  userInfoTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
  imagebackground: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  bottomSpacer: {
    height: 20,
  },
});
export default connect(mapStateToProps, null)(Profile);
