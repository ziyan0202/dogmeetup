import React, { useState, useEffect } from "react";
import { StyleSheet, View, Button, Text, Image, FlatList } from "react-native";
import { connect } from "react-redux";
import firebase from "firebase";
require("firebase/firestore");

function Profile(props) {
  //In order to display current user and other user
  const [userPosts, setUserPosts] = useState([]);
  const [user, setUser] = useState(null);
  //Whether or not the current user is following the profile viewing
  const [following, setFollowing] = useState(false);

  useEffect(() => {
    const { currentUser, posts } = props;
    console.log({ currentUser, posts });
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
        .where("userID","==",props.route.params.uid)
        .orderBy("creation", "asc") //oldest date to most recent date
        .get()
        .then((snapshot) => {
          //iterate through all the docs then build an array the way we want it
          let posts = snapshot.docs.map((doc) => {
            const data = doc.data();
            const id = doc.id;
            return { id, ...data };
          });
          console.log(posts);
          setUserPosts(posts);
        });
    }
    if (props.following.indexOf(props.route.params.uid) > -1) {
      setFollowing(true);
    } else {
      setFollowing(false);
    }
  }, [props.route.params.uid, props.following]); //only when this variable update will do the useEffect

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

  return (
    //style
    <View style={styles.container}>
      <View style={styles.containerInfo}>
        <Text>{user.name}</Text>
        <Text>{user.email}</Text>

        {/* Conditional render: If the user is viewing their own profile, don't render the button */}
        {props.route.params.uid !== firebase.auth().currentUser.uid ? (
          <View>
            {/* To check if the user is following the profile viewing */}
            {following ? (
              <Button title="Following" onPress={() => onUnfollow()} />
            ) : (
              <Button title="Follow" onPress={() => onFollow()} />
            )}
          </View>
        ) : (
          <Button title="Logout" onPress={() => onLogout()} />
        )}
      </View>
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
    </View>
  );
}

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  posts: store.userState.posts,
  following: store.userState.following,
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerInfo: {
    margin: 20,
  },
  containerGallery: {
    flex: 1,
  },
  image: {
    flex: 1,
    aspectRatio: 1 / 1,
  },
  containerImage: {
    //even only one image in the row it will retain the size
    flex: 1 / 3,
  },
});
export default connect(mapStateToProps, null)(Profile);
