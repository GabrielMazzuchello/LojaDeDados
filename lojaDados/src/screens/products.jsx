import { View, Text, StyleSheet } from "react-native";
import { useEffect, useState } from "react";

export default function Product({navigation}) {
    return (
        <View style = {styles.container}>
            <View> //essa é a view do topo da pagina
                <Text>topo da pagina</Text>
            </View> 

            <View> //essa é a view do meio da pagina
                <Text>meio da pagina</Text>
            </View> 

            <View> //essa é a view de baixo da pagina
                <Text>baixo da pagina</Text>
            </View> 
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: "#890",
        justifyContent: "center",
        alignItems: "center"
    }

})