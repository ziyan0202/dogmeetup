import React, { useEffect, useState } from "react";
import { getEvents, getCreatedEvents, deleteEvent, getFollowedEvents, followEvent, unfollowEvent } from "../../App.js";
import {
  View,
  Text,
  Image,
  Button,
  StyleSheet,
  TextInput,
  Pressable,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import firebase from "firebase";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { MaskedViewComponent } from "@react-native-community/masked-view";
import { backgroundColor } from "react-native/Libraries/Components/View/ReactNativeStyleAttributes";
import AntDesign from "react-native-vector-icons/AntDesign";
export default function Feed(props) {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState("");
  const [like, setLike] = useState([]);

  const _getPosts = async () => {
    if (props.targetUser !== undefined) {
      // console.log(props.targetUser);
      const posts = await getCreatedEvents(props.targetUser);
      console.log("POSTS(c)", posts);
      setPosts(posts);
    } else {
      const posts = await getEvents();
      console.log("POSTS(g)", posts);
      setPosts(posts);
    }
  };

  useEffect(() => {
    _getPosts();
    //console.log(posts);
  }, []);

  //Haven't figured out how to use this yet. Pull-to-refresh is complicated.
  //We could use a button, but
  const onReload = async () => {
    _getPosts();
  };

  const onDelete = async (docID) => {
    /*If we want a confirmation of delete, it goes here, then delete post can be in an onConfirmation event*/
    await deleteEvent(docID);
    _getPosts();
  };

  const postcomment = (e) => {
    // db.collection('posts').doc(postId).collection('comments').add({
    //   text: comment,
    //   username: currentuser.displayName,
    //   timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    // })
    // setComment('')
    console.log("sss");
  };
  const photo = () => {
    console.log("come on");
  };

    //click likes num
    const funclike = (e) => {
      const p =firebase
        .firestore()
        .collection("posts")
        .doc(e);
        if(like){
           p.get()
        .then(()=>{
             p.update({like:firebase.firestore.FieldValue.increment(-1),heart:false})
            //  p.update({})
        })
        }else{
          p.get()
        .then(()=>{
             p.update({like:firebase.firestore.FieldValue.increment(1),heart:true})
        })
        }
       
        setLike(!like)
    };
  

  const postList = posts?.map((obj) => {
    //console.log(obj.userID);
    return (
      <View
        style={{
          paddingBottom: 10,
          borderBottomColor: "gray",
          borderBottomWidth: 0.1,
        }}
      >
        {/* View space between posts */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            padding: 15,
          }}
        >
          {/* View of user profile and username */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              onPress={() =>
                props.navigation.navigate("Profile", {
                  uid: obj.userID,
                })
              }
            >
              <Image
                source={require("../../images/defaultUserImg.png")}
                style={{ width: 40, height: 40, borderRadius: 100 }}
              />
            </TouchableOpacity>
            <View style={{ paddingLeft: 5 }}>
              <Text
                style={{ fontSize: 15, fontWeight: "bold" }}
                onPress={() =>
                  props.navigation.navigate("Profile", {
                    uid: obj.userID,
                  })
                }
              >
                {obj.userName}
              </Text>
            </View>
            {/* View of user profile and user name end */}
          </View>
        </View>
        <TouchableOpacity
          onPress={() =>
            props.navigation.navigate("EventDetailsScreen", {
              eid: obj.id,
            })
          }
        >
          <View
            style={{
              position: "relative",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              style={{
                height: 400,
                width: "100%",
                borderTopLeftRadius: 15,
                borderTopRightRadius: 15,
              }}
              source={{ uri: obj.image }}
              // props.navigation.navigate("Profile", {

              // })
            />
            <View style={styles.cardDetails}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View>
                  <Text style={{ fontWeight: "bold", fontSize: 17 }}>
                    {obj.description}
                  </Text>
                  <Text style={{ color: "grey", fontSize: 12 }}>{obj.eventLocation}</Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 10,
                }}
              >
                <Text style={{ fontSize: 10, color: "grey" }}>
                  {obj.followers.length} followers
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: 12,
              paddingVertical: 15,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity onPress={() => funclike(obj.id)}>
                <AntDesign
                  name={like ? "heart" : "hearto"}
                  style={{
                    paddingRight: 10,
                    fontSize: 20,
                    color: like ? "red" : "black",
                  }}
                />
              </TouchableOpacity>
              <Text>Likes {obj.like}+</Text>
            </View>
          </View>
          <View stype={{ paddingHorizontal: 15 }}>
            {/* <Text>
            Liked by {like ? "you and" : ""}{" "}
            {like ? data.likes + 1 : data.likes} others
          </Text> */}

            {props.targetUser == firebase.auth().currentUser.uid ? (
              <Button
                color={buttonColor}
                title="Delete"
                onPress={() => onDelete(obj.id)}
              />
            ) : (
              <></>
            )}
          </View>

          {/* User profile picture */}
          {/* <UserImg source={{uri: obj.userImg}} /> */}
          {/* <PostTime>{moment(obj.postTime.toDate()).fromNow()}</PostTime> */}

          <View style={styles.profile_post}></View>
        </TouchableOpacity>
      </View>
    );
  });

  return (
    <View style={{ flex: 1 }}>
      <ScrollView scrollEnabled>
        <View style={{ overflow: "scroll" }}>{postList}</View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  outerPostContainer: {
    flexGrow: 1,
  },
  postContainer: {
    flex: 1,
  },
  showcomment: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#a7e1f6bd",
  },
  profile_post: {
    marginLeft: 160,
    width: 170,
    height: 10,
  },

  post: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 5,
    height: 350,
    width: "95%",
    alignSelf: "center",
    marginBottom: 10,
    //backgroundColor: '#90f7cc'
  },
  postUser: {
    fontWeight: "bold",
    fontSize: 24,
  },
  image: {
    resizeMode: "contain",
    flex: 1,
    margin: 10,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "white",
    //maxWidth:'40%'
    // width: 100,
    // height:50
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "black",
    alignSelf: "center",
  },
  cardDetails: {
    height: 100,
    borderRadius: 15,
    backgroundColor: "white",
    position: "absolute",
    bottom: 0,
    padding: 20,
    width: "100%",
  },
});

const buttonColor = "#DC3545";
