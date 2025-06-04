import React from 'react'
import { StyleSheet, View, Text, ScrollView } from "react-native";

const Feed = () => {
  return (
    <ScrollView style={styles.feed}>
        <View><Text style={styles.title}>SOBRE NÓS:</Text></View>
        <View><Text style={styles.text}>O app Báus Suspeitos (para os não geeks, um báu com dentes é chamado de mímico) permite com que você e seus amigos tenham uma maior facilidade para organizar seus encontros e sessões de RPG nos porões escuros das casas de suas avós. </Text></View>

    </ScrollView>
  )
}

export default Feed

const styles = StyleSheet.create ({
    feed: {
        flex: 1,
        backgroundColor: '#000',
        fontSize: 20,
    },
    title: {
        flex: 1,
        fontSize: 40,
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
        color: "#FF0068"
    },
    text: {
       color: "#FF0068",
       fontSize: 20
    }
})