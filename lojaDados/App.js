import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import Login from "./src/screens/login";
import  Feed  from "./src/screens/feed";
import Register from "./src/screens/register";


export default function App() {
  // return <Register />;
  return <Feed/>//<Login />;
}