import "react-native-gesture-handler";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// telas
import Login from "./src/screens/login";
import Feed from "./src/screens/feed";
import Register from "./src/screens/register";
import Home from "./src/screens/home";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Adm from "./src/screens/adm";
import Cart from "./src/screens/cart";

const Stack = createStackNavigator();
const Tabs = createBottomTabNavigator();

function HomeTabs() {
  return (
    <Tabs.Navigator
      screenOptions={{
        tabBarActiveBackgroundColor: "#a14",
        tabBarActiveTintColor: "#ffff",
        tabBarInactiveTintColor: "#FF0068",
        tabBarInactiveBackgroundColor: "#001",
        headerShown: false,
        headerStyle: { backgroundColor: "#a14" },
        headerTitleAlign: "center",
        tabBarStyle: {
          backgroundColor: "red", // Cor de fundo da barra de abas
          borderTopWidth: 0, // Remove a borda superior
          borderBottomWidth: 0, // Remove a borda inferior
          elevation: 0, // Remove qualquer sombra (Android)
          shadowOpacity: 0, // Remove sombra (iOS)
        },
      }}
    >
      <Tabs.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: () => (
            <MaterialIcons name="home" size={32} color={"#FF0068"} />
          ),
        }}
      />
      <Tabs.Screen
        name="ADM"
        component={Adm}
        options={{
          tabBarIcon: () => (
            <MaterialIcons name="home" size={32} color={"#FF0068"} />
          ),
        }}
      />
      <Tabs.Screen
        name="Carrinho"
        component={Cart}
        options={{
          tabBarIcon: () => (
            <MaterialIcons name="home" size={32} color={"#FF0068"} />
          ),
        }}
      />
      <Tabs.Screen
        name="Feed"
        component={Feed}
        options={{
          tabBarIcon: () => (
            <MaterialIcons name="feed" size={32} color={"#FF0068"} />
          ),
        }}
      />
    </Tabs.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            headerStyle: {
              backgroundColor: "#000000",
              borderBottomColor: "#FF0068",
              borderBottomWidth: 1,
              borderBottomWidth: 0,
            },
            headerTitle: "",
          }}
        />
        <Stack.Screen
          name="register"
          component={Register}
          options={{
            headerStyle: {
              backgroundColor: "#000000",
              borderBottomColor: "#FF0068",
              borderBottomWidth: 1,
              borderBottomWidth: 0,
            },
            headerTintColor: "#FF0068",
            headerTitle: "Login",
          }}
        />
        <Stack.Screen
          name="HomeTabs"
          component={HomeTabs}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
