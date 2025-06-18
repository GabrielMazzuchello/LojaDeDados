import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { useEffect, useState } from "react";

const Cart = ({ navigation }) => {
  return (
    <ScrollView style={styles.feed}>
      <View style={styles.box}>
        <View>
            <Text style={styles.title}>MINHAS SESSÕES</Text>
        </View>
        <View style={styles.card}>
          <View>
            <Image style={styles.image} source={require("../../assets/imagens/bombardiroCrocodilo.png")}></Image>
          </View>
          <View>
            <Text style={styles.text}>Informações aqui</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default Cart;

const styles = StyleSheet.create ({
  feed: {
    flex: 1,
    backgroundColor: "#000",
    fontSize: 20,
  },
  box: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    flex: 1,
    fontSize: 45,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#FF0068",
    marginBottom: "20px",
  },
  card: {
    display: "flex",
    flexDirection: "row",
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 20
  },
  text: {
    flex: 1,
    display: "flex",
    color: "#000000",
    fontSize: 14,
    maxWidth: "300px",
    padding: "6px",
    textAlign: "justify",
    backgroundColor: "#FF0068",
    maxHeight: 150,
    width: 200,
    height: "auto",
  },
  extra: {
    flex: 1,
    display: "flex",
    backgroundColor: "#FF0068", 
    color: "#121212",
    fontSize: 14,
    maxWidth: "340px",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "10px",
    padding: "6px",
    marginBottom: 30
  }
})