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

const Stack = createStackNavigator();
const Tabs = createBottomTabNavigator();

function HomeTabs() {
  return (
    <Tabs.Navigator
      screenOptions={{
        tabBarActiveBackgroundColor: "#000",
        tabBarActiveTintColor: "#a11",
        tabBarInactiveTintColor: "#ffff",
        tabBarInactiveBackgroundColor: "#0005",
        headerShown: false,
        headerStyle: { backgroundColor: "#a11" },
        headerTitleAlign: "center",
        tabBarBadge: 6,
        tabBarStyle: {
          backgroundColor: "red", // Cor de fundo da barra de abas
          borderTopWidth: 0, // Remove a borda superior
          borderBottomWidth: 0, // Remove a borda inferior
          elevation: 0, // Remove qualquer sombra (Android)
          shadowOpacity: 0, // Remove sombra (iOS)
        },
      }}
    >
      <Tabs.Screen name="Home" component={Home} />
      <Tabs.Screen name="Feed" component={Feed} />
    </Tabs.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login}           options={{
            headerStyle: { 
              backgroundColor: "#000000",
              borderBottomColor: "#FF0068",
              borderBottomWidth: 1
            },
            headerTitle: ""
        }}/>
        <Stack.Screen name="register" component={Register} options={{
            headerStyle: { 
              backgroundColor: "#000000",
              borderBottomColor: "#FF0068",
              borderBottomWidth: 1
            },
            headerTintColor: "#FF0068",
            headerTitle: "Login"
        }}/>
        <Stack.Screen
          name="HomeTabs"
          component={HomeTabs}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
