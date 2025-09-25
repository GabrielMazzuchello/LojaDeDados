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
import Adm from "./src/screens/adm";
import MySessions from "./src/screens/mySessions";
import GerenciarAdmins from "./src/screens/GerenciarAdmins";
import ChatScreen from "./src/screens/ChatScreen"; // 🔹 importar a tela do chat

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

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
          backgroundColor: "red",
          borderTopWidth: 0,
          borderBottomWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
      }}
    >
      <Tabs.Screen
        name="Portal"
        component={Home}
        options={{
          tabBarIcon: () => (
            <MaterialIcons name="home" size={32} color={"#FF0068"} />
          ),
        }}
      />
      <Tabs.Screen
        name="Sessões"
        component={MySessions}
        options={{
          tabBarIcon: () => (
            <MaterialCommunityIcons
              name="dice-d20-outline"
              size={32}
              color={"#FF0068"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Sobre nós"
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
          name="Adm"
          component={Adm}
          options={{
            headerStyle: {
              backgroundColor: "#000000",
              borderBottomColor: "#FF0068",
              borderBottomWidth: 1,
              borderBottomWidth: 0,
            },
            headerTintColor: "#FF0068",
            headerTitle: "Mestre - Agendar Sessão",
          }}
        />
        <Stack.Screen
          name="GerenciarAdmins"
          component={GerenciarAdmins}
          options={{
            headerStyle: {
              backgroundColor: "#000000",
              borderBottomColor: "#FF0068",
              borderBottomWidth: 1,
              borderBottomWidth: 0,
            },
            headerTintColor: "#FF0068",
            headerTitle: "Portal",
          }}
        />
        <Stack.Screen
          name="HomeTabs"
          component={HomeTabs}
          options={{ headerShown: false }}
        />

        {/* 🔹 nova tela do chat */}
        <Stack.Screen
          name="ChatScreen"
          component={ChatScreen}
          options={{
            headerStyle: { backgroundColor: "#000" },
            headerTintColor: "#FF0068",
            headerTitle: "Chat da Sessão",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
