import React from "react";
import { createStackNavigator } from "react-navigation/stack";
import SplashScreen from "./SplashScreen";
import LoginScreen from "./Login";
import RegisterScreen from "./Register";

const RootStack = createStackNavigator();

const RootStackScreen = ({ navigation }) => {
  <RootStack.Navigator headerMode="none">
    <RootStack.Screen name="SplashScreen" component={SplashScreen} />
    <RootStack.Screen name="LoginScreen" component={LoginScreen} />
    <RootStack.Screen name="RegisterScreen" component={RegisterScreen} />
  </RootStack.Navigator>;
};

export default RootStackScreen;
