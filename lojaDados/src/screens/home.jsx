import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import { useEffect, useState } from "react";

export default function Home({navigation}) {
    return (
        <View style = {styles.container}>
            <View style = {styles.topPage}>
                <View style = {styles.divisionTopPage1}>
                    <TouchableOpacity onPress={() => navigation.navigate(" ")}>
                        <Text style = {styles.button}>Agendar Sessões</Text> 
                                {/* esse botao so aparece se usar login de ADM */}
                    </TouchableOpacity>
                </View>
                <View style = {styles.divisionTopPage2}>
                    <Image style={styles.img} source={require("../../assets/imagens/sus.png")}></Image>
                </View>
                <View style = {styles.divisionTopPage1}></View>
            </View> 

            <ScrollView showsVerticalScrollIndicator={false}> 
                <View style = {styles.middlePage}>
                    <Text style={{ color: '#FF0068' }}>meio da pagina</Text>
                </View>
            </ScrollView> 

        </View>
    )
}

const styles = StyleSheet.create({

    // Topo da pagina
    container: {
        flex:1,
        backgroundColor: "#000",
    },
    topPage: {
        height: 190,
        justifyContent: "space-around",
        alignItems: "center",
        display: "flex",
        flexDirection: "row"
    },
    divisionTopPage1: {
        height: 140,
        width: 100,
        justifyContent: "center",
        alignItems: "center"
    },
    divisionTopPage2: {
        height: 150,
        width: 160,
    },
    img: {
        width: 170,
        height: 160,  
    },
    cart: {
        width: 70,
        height: 90,  
    },
    button: {
        fontSize: 12,
        backgroundColor: "#555",
        borderRadius: 5,
        fontWeight: "bold",
        color: "#FF0068"
    },

    //Meio da página

    middlePage: {
        height: "auto",
    },

})