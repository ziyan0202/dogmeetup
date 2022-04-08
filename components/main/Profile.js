import React, { useState, useEffect } from "react";
import {
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
import firebase from "firebase";
import { TouchableOpacity } from "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
require("firebase/firestore");

function Profile(props) {
  //In order to display current user and other user
  const [userPosts, setUserPosts] = useState([]);
  const [user, setUser] = useState(null);
  //Whether or not the current user is following the profile viewing
  const [following, setFollowing] = useState(false);

  useEffect(() => {
    const { currentUser, posts } = props;
    //console.log({ currentUser, posts });
    //Trying to access our own profile
    if (props.route.params.uid === firebase.auth().currentUser.uid) {
      setUser(currentUser);
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
      firebase
        .firestore()
        .collection("posts")
        .where("userID", "==", props.route.params.uid)
        .orderBy("timePosted", "asc") //oldest date to most recent date
        .get()
        .then((snapshot) => {
          //iterate through all the docs then build an array the way we want it
          let posts = snapshot.docs.map((doc) => {
            const data = doc.data();
            const id = doc.id;
            return { id, ...data };
          });
          //console.log(posts);
          setUserPosts(posts);
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
  //Follow and Unfollow functions
  const onFollow = () => {
    //Following the firebase firestore structure
    firebase
      .firestore()
      .collection("following")
      .doc(firebase.auth().currentUser.uid)
      .collection("userFollowing")
      .doc(props.route.params.uid)
      .set({});
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
  };

  const onLogout = () => {
    firebase.auth().signOut();
  };
  const { navigation } = props;

  return (
    //style
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.containerInfo}
        contentContainerStyle={{
          justifyContent: "center",
        }}
      >
        <Image
          style={styles.userImg}
          source={require("../../images/defaultUserImg.png")}
        />
        <Text style={styles.userName}>{user.name}</Text>
        <Text>{user.email}</Text>
        <Text style={styles.aboutUser}>
          I'm a WashU student. I like dogs. I have two dogs.
        </Text>
        <View style={styles.userBtnWrapper}>
          {props.route.params.uid !== firebase.auth().currentUser.uid ? (
            <>
              <TouchableOpacity style={styles.userBtn} onPress={() => props.navigation.navigate('ChatScreen',{userName: user.name,id:props.route.params.uid,current:firebase.auth().currentUser.uid})}>
                <Text style={styles.userbtnTxt} >Message</Text>
              </TouchableOpacity>
              {/* To check if the user is following the profile viewing */}
              {following ? (
                <TouchableOpacity style={styles.followingBtn} onPress={() => onUnfollow()}>
                  <Text style={styles.followingTxt}>Following</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.userBtn} onPress={() => onFollow()}>
                  <Text style={styles.userbtnTxt}>Follow</Text>
                </TouchableOpacity>
              )}
              
            </>
          ) : (
            <>
              <TouchableOpacity
                style={styles.userBtn}
                onPress={() => navigation.navigate("EditProfile")}
              >
                <Text style={styles.userbtnTxt}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.userBtn}
                onPress={() => onLogout()}
              >
                <Text style={styles.userbtnTxt}>Logout</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        <View style={styles.userInfoWrapper}>
          <View style={styles.userInfoItem}>
            <Text style={styles.userInfoTitle}>22</Text>
            <Text style={styles.userInfoSubTitle}>Posts</Text>
          </View>
          <View style={styles.userInfoItem}>
            <Text style={styles.userInfoTitle}>10,000</Text>
            <Text style={styles.userInfoSubTitle}>Followers</Text>
          </View>
          <View style={styles.userInfoItem}>
            <Text style={styles.userInfoTitle}>100</Text>
            <Text style={styles.userInfoSubTitle}>Following</Text>
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
        ></Feed>
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
    backgroundColor: "#fff",
    padding: 20,
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
    backgroundColor: "#2e64e5"
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
});
export default connect(mapStateToProps, null)(Profile);
