import React, { Component } from "react";
import { StyleSheet, View, Button, TextInput } from "react-native";
import firebase from "firebase";

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
      <View>
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
});
