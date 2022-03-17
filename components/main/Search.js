import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
} from "react-native";
import firebase from "firebase";
require("firebase/firestore");

export default function Search(props) {
  const [users, setUsers] = useState([]);
  //search string
  //find name is equal or equal at first
  const fetchUsers = (search) => {
    firebase
      .firestore()
      .collection("users")
      .where("name", ">=", search)
      .get()
      .then((snapshot) => {
        let users = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data };
        });
        setUsers(users);
      });
  };
  return (
    <View>
      {/* whenever the user type a letter fetchUsers will be called */}
      <TextInput
        style={styles.input}
        placeholder="Type Here..."
        onChangeText={(search) => fetchUsers(search)}
      />
      <FlatList
        numColumns={1}
        horizontal={false}
        data={users}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.horizontal}
            onPress={() =>
              props.navigation.navigate("Profile", { uid: item.id })
            }
          >
            <Text>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
  },
  horizontal: {
    flexDirection: "row",
    display: "flex",
    paddingRight: 10,
    paddingLeft: 10,
    paddingTop: 10,
  },
});
