import React from "react";
import {
  ScrollView,
  Text,
  StyleSheet,
  StatusBar,
  ImageBackground,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const EventDetailsScreen = () => {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        backgroundColor: "white",
        paddingBottom: 20,
      }}
    >
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="rgba(0,0,0,0)"
      />
      <ImageBackground
        style={style.headerImage}
        source={require("../../images/defaultUserImg.png")}
      ></ImageBackground>
      <View>
        {/* view foricon */}
        <View style={{ marginTop: 20, paddingHorizontal: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>Event Title</Text>
          <Text
            style={{
              fontSize: 12,
              fontWeight: "400",
              color: "grey",
              marginTop: 5,
            }}
          >
            Event Location
          </Text>
          <View
            style={{
              marginTop: 10,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ fontSize: 13, color: "grey" }}>365 reviews</Text>
          </View>
          <View
            style={{
              marginTop: 20,
            }}
          >
            <Text style={{ lineHeight: 20, color: "grey" }}>Details</Text>
          </View>
        </View>
        <View style={style.btn}>
          <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>
            Attend
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default EventDetailsScreen;

const style = StyleSheet.create({
  headerImage: {
    height: 400,
    borderBottomRightRadius: 40,
    borderBottomRightRadius: 40,
    overflow: "hidden",
  },
  btn: {
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
    backgroundColor: "blue",
    marginHorizontal: 20,
    borderRadius: 10,
  },
});
