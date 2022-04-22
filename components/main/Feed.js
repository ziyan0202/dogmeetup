import React, { useEffect, useState } from "react";
import { getPosts, deletePost, getUserName } from "../../App.js";
import { View, Text, Image, Button, StyleSheet,TextInput,Pressable } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import firebase from "firebase";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { MaskedViewComponent } from "@react-native-community/masked-view";
import { backgroundColor } from "react-native/Libraries/Components/View/ReactNativeStyleAttributes";

export default function Feed(props) {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState('');
  
  const _getPosts = async () => {
    if (props.targetUser !== undefined) {
     // console.log(props.targetUser);
      const posts = await getPosts(props.targetUser);
      //console.log("POSTS", posts);
      setPosts(posts);
    } else {
      const posts = await getPosts();
      //console.log("POSTS", posts);
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
    await deletePost(docID);
    const posts = await getPosts(props.targetUser);
    setPosts(posts);
  };

  const postcomment =(e)=> {
   
    // db.collection('posts').doc(postId).collection('comments').add({
    //   text: comment,
    //   username: currentuser.displayName,
    //   timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    // })
    // setComment('')
    console.log('sss')
  }
  const photo=()=>{
    console.log('come on')
  }

  const postList = posts?.map((obj) => {
    //console.log(obj.userID);
    return (
      <View style={styles.post}>
        <Text
          style={styles.postUser}
          onPress={() =>
            props.navigation.navigate("Profile", {
              uid: obj.userID,
            })
          }
        >
          {obj.userName}
        </Text>
        {/* User profile picture */}
        {/* <UserImg source={{uri: obj.userImg}} /> */}
        {/* <PostTime>{moment(obj.postTime.toDate()).fromNow()}</PostTime> */}
        <Text>{obj.caption}</Text>
        <Image style={styles.image} source={{ uri: obj.contentURL }}   
            // props.navigation.navigate("Profile", {
             
            // })
           
          />     
         <View style={styles.profile_post}>
         </View>
                   
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
    display:'flex', 
    flexDirection: 'row',
    backgroundColor: '#a7e1f6bd'
  },
  profile_post:{
    marginLeft: 160,
    width:170,
    height:10
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'white',
    //maxWidth:'40%'
    // width: 100,
    // height:50
    
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'black',
    alignSelf:'center'
    
  }
});

const buttonColor = "#DC3545";
