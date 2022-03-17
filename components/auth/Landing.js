import React from "react";
import { StyleSheet, Image, Text, View, Button } from "react-native";

const logo = require("../../images/logo.png");

export default function Landing({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <Image style={styles.splash} source={logo} />
      <Button
        title="Register"
        onPress={() => navigation.navigate("Register")}
      />
      <Button title="Login" onPress={() => navigation.navigate("Login")} />
    </View>
  );
}

const styles = StyleSheet.create({
  splash: {
    width: "100%",
    resizeMode: "contain",
    marginTop: 5,
  },
});
