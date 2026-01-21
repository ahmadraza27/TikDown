import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { connect } from "react-redux";
import { Drawer } from "expo-router/drawer";
import { Stack } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import * as NavigationBar from "expo-navigation-bar";

// Redux action
import { ADD_TRUE } from "../../assets/redux/actions/addReducer";

const Layout = ({ ADD_TRUE }: { ADD_TRUE: () => void }) => {
  useEffect(() => {
    NavigationBar.setBackgroundColorAsync("black");
  }, []);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <Drawer
        screenOptions={{
          headerStyle: {
            backgroundColor: "black",
          },
          headerShadowVisible: false,
          drawerStyle: {
            backgroundColor: "#020617",
          },
        }}
      >
        <Drawer.Screen
          name="index"
          options={{
            swipeEnabled: false,
            headerTitleAlign: "center",

            headerTitle: () => (
              <MaskedView
                maskElement={
                  <Text style={styles.titleText}>TikDown</Text>
                }
              >
                <LinearGradient
                  colors={["#EE1D52", "#FFFFFF", "#69C9D0"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={[styles.titleText, styles.hidden]}>
                    TikDown
                  </Text>
                </LinearGradient>
              </MaskedView>
            ),

            headerLeft: () => (
              <TouchableOpacity
                onPress={ADD_TRUE}
                style={styles.iconBtn}
                activeOpacity={0.7}
              >
                <MaterialIcons
                  name="history"
                  size={24}
                  color="#69C9D0"
                />
              </TouchableOpacity>
            ),

            headerBackground: () => (
              <View style={styles.headerBg} />
            ),
          }}
        />
      </Drawer>
    </>
  );
};

export default connect(null, { ADD_TRUE })(Layout);

const styles = StyleSheet.create({
  headerBg: {
    flex: 1,
    backgroundColor: "black",
  },
  titleText: {
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: 1,
  },
  hidden: {
    opacity: 0,
  },
  iconBtn: {
    marginLeft: 12,
    padding: 6,
    borderRadius: 10,
    backgroundColor: "#0f172a",
  },
});
