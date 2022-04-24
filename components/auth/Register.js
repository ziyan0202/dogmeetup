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
  KeyboardAvoidingView,
} from "react-native";
import firebase from "firebase";
import { Platform } from "react-native-web";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";
import FormButton from "../main/FormButton";
import * as Animatable from "react-native-animatable";
export class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      name: "",
      userAbout: "",
    };
    this.onSignUp = this.onSignUp.bind(this);
  }
  onSignUp() {
    const { email, password, name, userAbout } = this.state;
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        //save to firestore database
        firebase
          .firestore()
          .collection("users")
          .doc(firebase.auth().currentUser.uid)
          .set({
            name,
            email,
            userImg: null,
            userAbout,
          });
        console.log(result);
      })
      // firebase
      // .auth()
      // .createUserWithEmailAndPassword(email,password)
      // .then((authUser) => {
      //   return authUser.user.updateProfile({
      //     displayName: name
      //   })
      // })

      .catch((error) => alert(error.message));
  }
  render() {
    return (
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        <View style={styles.container}>
          <StatusBar backgroundColor="#009387" barStyle="light-content" />
          <View style={styles.header}>
            <Text style={styles.text_header}>Register Now!</Text>
          </View>
          <Animatable.View style={styles.footer} animation="fadeInUpBig">
            <Text style={styles.text_footer}>Name</Text>
            <View style={styles.action}>
              <FontAwesome name="user-o" color="#05375a" size={20} />
              <TextInput
                style={styles.textinput}
                placeholder="Name"
                autoCapitalize="none"
                onChangeText={(name) => this.setState({ name })}
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
              Email
            </Text>
            {/* <Text style={styles.text_footer}>Email</Text> */}
            <View style={styles.action}>
              <FontAwesome name="user-o" color="#05375a" size={20} />
              <TextInput
                style={styles.textinput}
                placeholder="Email"
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
                placeholder="Password"
                autoCapitalize="none"
                secureTextEntry={true}
                onChangeText={(password) => this.setState({ password })}
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
              Description
            </Text>
            <View style={styles.action}>
              <Feather name="lock" color="#05375a" size={20} />
              <TextInput
                style={styles.textinput}
                placeholder="Description"
                autoCapitalize="none"
                onChangeText={(userAbout) => this.setState({ userAbout })}
              />
            </View>
            <View style={styles.button}>
              <FormButton
                buttonTitle="Sign Up"
                onPress={() => this.onSignUp()}
              />
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate("Login")}
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
                  Sign In
                </Text>
              </TouchableOpacity>
            </View>
          </Animatable.View>
        </View>
      </KeyboardAvoidingView>
      // <View>
      //   <TextInput
      //     style={styles.input}
      //     placeholder="name"
      //     onChangeText={(name) => this.setState({ name })}
      //   />
      //   <TextInput
      //     style={styles.input}
      //     placeholder="email"
      //     onChangeText={(email) => this.setState({ email })}
      //   />
      //   <TextInput
      //     style={styles.input}
      //     placeholder="password"
      //     secureTextEntry={true}
      //     onChangeText={(password) => this.setState({ password })}
      //   />
      //   <Button onPress={() => this.onSignUp()} title="Sign Up" />
      // </View>
    );
  }
}

export default Register;

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
