import React from "react";
import { deleteEvent } from "../../App.js";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import firebase from "firebase";

export default function Event(props) {
  const data = props.data;
  const profileImage = "../../images/defaultUserImg.png";

  const onDelete = async (docID) => {
    /*If we want a confirmation of delete, it goes here, then delete post can be in an onConfirmation event*/
    await deleteEvent(docID);
    _getPosts();
  };

  const toProfile = (uid) => {
    props.navigation.navigate("Profile", {
      uid: uid,
    });
  };

  const toPost = (eid) => {
    props.navigation.navigate("EventDetailsScreen", {
      eid: eid,
    });
  };

  const toChat = () => {
    props.navigation.navigate("ChatScreen", {
      userName: data.userName,
      id: data.userID,
      current: firebase.auth().currentUser.uid,
    });
  };

  const stringifyTimestamp = (timestamp) => {
    const date = timestamp.toDate().toLocaleDateString();
    const time = timestamp.toDate().toLocaleTimeString();
    return time + " on " + date;
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.userSection}
        onPress={() => toProfile(data.userID)}
      >
        <Image
          style={styles.profileImage}
          source={{
            uri: "https://m.media-amazon.com/images/I/61vexDQktqL._AC_SL1182_.jpg",
          }}
        />
        <View style={styles.userNameBox}>
          <Text style={styles.userName}>{data.userName}</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.remainingPost}
        onPress={() => toPost(data.id)}
      >
        <Image style={styles.mainImage} source={{ uri: data.image }} />
        <View style={styles.detailSection}>
          <Text style={styles.eventName}>{data.eventName}</Text>
          <View style={styles.dateLocationContainer}>
            <Text style={styles.boldGray}>
              {stringifyTimestamp(data.eventTime)}
            </Text>
            <Text style={styles.gray}> at </Text>
            <Text style={styles.boldGray}>{data.eventLocation}</Text>
          </View>
          <Text style={styles.eventDetails}>{data.description}</Text>
          <View style={styles.bottomBar}>
            <Text style={styles.attendeeCount}>
              {data.followers.length} attending
            </Text>
            {data.canDelete ? (
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => onDelete(data.id)}
              >
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.messageButton}
                onPress={() => toChat()}
              >
                <Text style={styles.buttonText}>Contact</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    //The whole box the post is in
    flexDirection: "column",
    width: "94%",
    height: 510,
    backgroundColor: "white",
    elevation: 5,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 5,
    shadowOpacity: 50,
    margin: 10,
    marginLeft: "3%",
    marginRight: "3%",
    paddingBottom: 10,
    borderRadius: 5,
  },
  userSection: {
    //The bit at the top with the poster and their pfp
    flex: 2,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
    marginRight: 10,
  },
  profileImage: {
    flex: 3,
    height: "80%",
    resizeMode: "contain",
  },
  userNameBox: {
    //Container with just the user name <Text> in it
    flex: 16,
  },
  userName: {
    fontWeight: "bold",
    fontSize: 18,
  },
  remainingPost: {
    flex: 15,
  },
  mainImage: {
    flex: 10,
  },
  detailSection: {
    //The part under the image with all the details
    flex: 5,
    paddingTop: 5,
    paddingLeft: 15,
    paddingRight: 15,
  },
  eventName: {
    fontWeight: "bold",
    fontSize: 20,
    flex: 3,
  },
  eventDetails: {
    paddingTop: 5,
    flex: 7,
  },
  dateLocationContainer: {
    flexDirection: "row",
    flex: 2,
  },
  gray: {
    color: "#AAAAAA",
  },
  boldGray: {
    color: "#AAAAAA",
    fontWeight: "bold",
  },
  bottomBar: {
    flex: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  attendeeCount: {
    color: "#AAAAAA",
    flex: 8,
  },
  deleteButton: {
    flex: 2,
    height: "100%",
    backgroundColor: "#DC3545",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  messageButton: {
    flex: 2,
    height: "80%",
    backgroundColor: "#2e64e5",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
});

const buttonColor = "#DC3545";
