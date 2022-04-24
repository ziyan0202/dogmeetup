import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Button,
  TextInput,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  Text,
  StatusBar,
} from "react-native";
import firebase from "firebase";
import { Platform } from "react-native-web";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";
import FormButton from "../main/FormButton";
import * as Animatable from "react-native-animatable";

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
      <View style={styles.container}>
        <StatusBar backgroundColor="#009387" barStyle="light-content" />
        <View style={styles.header}>
          <Text style={styles.text_header}>Welcome</Text>
        </View>
        <Animatable.View style={styles.footer} animation="fadeInUpBig">
          <Text style={styles.text_footer}>Email</Text>
          <View style={styles.action}>
            <FontAwesome name="user-o" color="#05375a" size={20} />
            <TextInput
              style={styles.textinput}
              placeholder="Your Email"
              autoCapitalize="none"
              onChangeText={(email) => this.setState({ email })}
            />
          </View>
          <Text
            style={[
              styles.text_footer,
              {
                marginTop: 35,
              },
            ]}
          >
            Password
          </Text>
          <View style={styles.action}>
            <Feather name="lock" color="#05375a" size={20} />
            <TextInput
              style={styles.textinput}
              placeholder="Your Password"
              autoCapitalize="none"
              secureTextEntry={true}
              onChangeText={(password) => this.setState({ password })}
            />
          </View>
          <View style={styles.button}>
            <FormButton buttonTitle="Sign In" onPress={() => this.onSignUp()} />
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("Register")}
              style={[
                styles.signIn,
                {
                  borderColor: "#009387",
                  borderWidth: 1,
                  marginTop: 15,
                },
              ]}
            >
              <Text
                style={[
                  styles.textSign,
                  {
                    color: "#009387",
                  },
                ]}
              >
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </Animatable.View>
      </View>
      // <TextInput
      //       style={styles.input}
      //       placeholder="email"
      //       onChangeText={(email) => this.setState({ email })}
      //     />
      //     <TextInput
      //       style={styles.input}
      //       placeholder="password"
      //       secureTextEntry={true}
      //       onChangeText={(password) => this.setState({ password })}
      //     />
      //     <Button onPress={() => this.onSignUp()} title="Sign In" />
      //   </ImageBackground>
      // </View>
    );
  }
}

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#009387",
  },
  header: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  footer: {
    flex: 3,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  text_header: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 30,
  },
  text_footer: {
    color: "#05375a",
    fontSize: 18,
  },
  action: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
    paddingBottom: 5,
  },
  textinput: {
    flex: 1,
    paddingLeft: 10,
    color: "#05375a",
  },
  button: {
    alignItems: "center",
    marginTop: 50,
  },
  signIn: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  textSign: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
