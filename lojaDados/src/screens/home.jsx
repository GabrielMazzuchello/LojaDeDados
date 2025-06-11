import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import { useEffect, useState } from "react";

export default function Home({navigation}) {
    return (
        <View style = {styles.container}>
            <View style = {styles.topPage}>
                <View style = {styles.divisionTopPage1}>
                    <TouchableOpacity onPress={() => navigation.navigate("Home")}>
                        <Text style = {styles.button}>Agendar Sessões</Text> 
                                {/* esse botao so aparece se usar login de ADM */}
                    </TouchableOpacity>
                </View>
                <View style = {styles.divisionTopPage2}>
                    <Image style={styles.img} source={require("../../assets/imagens/sus.png")}></Image>
                </View>
                <View style = {styles.divisionTopPage1}>
                    <TouchableOpacity  onPress={() => navigation.navigate("Home")}>
                        <Image style = {styles.cart} source = {{uri: 'https://media.tenor.com/olk7lEobPJMAAAAM/minecraft-buff-steve.gif' }}/>
                    </TouchableOpacity>
                    <Text style={{ color: '#FF0068' }}>Sessões</Text>
                </View>
            </View> 



            <ScrollView showsVerticalScrollIndicator={false}> 
                <View style = {styles.middlePage}>
                    <Text style={{ color: '#FF0068' }}>meio da pagina</Text>
                </View>
            </ScrollView> 






            <View style = {styles.downPage}> 


                <TouchableOpacity>
                    <Text style = {styles.aboutButtons}>Alguma coisa não definida depois que a sora quebrou nosso projeto</Text>
                </TouchableOpacity>  

                <TouchableOpacity onPress={() => navigation.navigate("Feed")}>
                    <Text style = {styles.aboutButtons}>Sobre nós</Text>
                </TouchableOpacity>
            </View> 
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
        height: 170,
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
        height: 140,
        width: 150,
    },
    img: {
        width: 150,
        height: 140,  
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
        height: 480,
    },


    //Baixo da página

    downPage: {
        height: 145,
        alignItems: "center",
        justifyContent: "space-around",
        // backgroundColor: "#252"
    },
    aboutButtons: {
        width: 300,
        backgroundColor: "#121219",
        fontSize: 20,
        textAlign: "center",
        borderRadius: 7,
        color: "#FF0068"
    },
})