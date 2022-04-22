import React from "react";
import { ImageBackground,StyleSheet, Image, Text, View, Button } from "react-native";

const logo = require("../../images/logo3.png");

export default function Landing({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
       <ImageBackground source={logo} resizeMode="cover" style={styles.imagebackground}>
      {/* <Image style={styles.splash} source={logo} /> */}
      <Button
        title="Register"
        onPress={() => navigation.navigate("Register")}
      />
      <Button title="Login" onPress={() => navigation.navigate("Login")} />
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  splash: {
    width: "100%",
    // resizeMode: "contain",
    marginTop: 0,
    maxHeight:300
  },
  imagebackground:{
    flex:1,
    alignItems:'center',
    justifyContent: 'center',
  }
});
