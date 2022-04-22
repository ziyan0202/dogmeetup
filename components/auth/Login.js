import React, { Component } from "react";
import { StyleSheet, View, Button, TextInput,ImageBackground } from "react-native";
import firebase from "firebase";

const background = require("../../images/bk.png");
export class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
    };
    this.onSignUp = this.onSignUp.bind(this);
  }
  
  onSignUp() {
    const { email, password } = this.state;
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        console.log(result);
      })
      .catch((error) => alert(error.message));
  }


  render() {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ImageBackground source={background} resizeMode="cover" style={styles.imagebackground}>
        <TextInput
          style={styles.input}
          placeholder="email"
          onChangeText={(email) => this.setState({ email })}
        />
        <TextInput
          style={styles.input}
          placeholder="password"
          secureTextEntry={true}
          onChangeText={(password) => this.setState({ password })}
        />
        <Button onPress={() => this.onSignUp()} title="Sign In" />
        </ImageBackground>
      </View>
    );
  }
}

export default Login;

const styles = StyleSheet.create({
  input: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
  },
  imagebackground:{
    flex:1,
    alignItems:'center',
    justifyContent: 'center',
  }
});
