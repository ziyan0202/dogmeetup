import {
  StyleSheet,
  Image,
  View,
  Text,
  Button,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React from "react";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FormButton from "../main/FormButton";
import * as Animatable from "react-native-animatable";

const SplashScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../../images/Logodog.png")}
          style={styles.logo}
          resizeMode="stretch"
        />
      </View>
      <Animatable.View animation="fadeInUpBig" style={styles.footer}>
        <Text style={styles.title}>Find a playdate!</Text>
        <Text style={styles.text}>Sign in with account</Text>

        <View style={styles.button}>
          <TouchableOpacity>
            <FormButton
              buttonTitle="Get Started"
              onPress={() => navigation.navigate("Login")}
            ></FormButton>
            {/* <Button color="#08d4c4" style={styles.signIn} title="Get Started">
            <Text style={styles.textSign}>Get Started</Text>
          </Button> */}
          </TouchableOpacity>
        </View>
      </Animatable.View>
    </View>
  );
};
export default SplashScreen;

const { height } = Dimensions.get("screen");
const height_logo = height * 0.5;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#009387",
  },
  header: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 50,
    paddingHorizontal: 30,
  },
  logo: {
    width: height_logo,
    height: height_logo,
  },
  title: {
    color: "#05375a",
    fontSize: 30,
    fontWeight: "bold",
  },
  text: {
    color: "grey",
    marginTop: 5,
  },
  button: {
    alignItems: "flex-end",
    marginTop: 30,
  },
  signIn: {
    width: 150,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    flexDirection: "row",
  },
  textSign: {
    color: "white",
    fontWeight: "bold",
  },
});
