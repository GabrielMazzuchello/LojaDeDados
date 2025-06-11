import React from 'react'
import { StyleSheet, View, Text, ScrollView, Image} from "react-native";

const Feed = (navigation) => {
  return (
    <ScrollView style={styles.feed}>
        <View style={styles.box}>
            <View>
                <Text style={styles.title}>SOBRE NÓS:</Text>
            </View>
            <View>
                <Image style={styles.image} source={require("../../assets/imagens/sus.png")}></Image>
            </View>
            <View>
                <Text style={styles.text}>❓❓❓ - A origem do Báus Suspeitos vem de todo o estresse e dificuldade que é agendar e orgazinar sessões de RPG, que quase chega a ser tão irritante quanto quando o mestre deixa algo da história escapar sem querer.<br/><br/>🧙‍♂️🧝‍♂️🧑‍🎤 - Por isso, 3 debiloides resolveram criar um aplicativo que facilitasse todo esse processo, o chamando de Báus Suspeitos! <br/><br/>🪄✨🔮 - Nosso objetivo é simplificar ao máximo a organização de sessões e encontros, colocando-os em um só lugar, permitindo uma melhor visualização da agenda. <br/><br/>📅📜🗂️ - O app permite que você crie "eventos" e os armazene nele. Na hora de criar um evento, você pode escolher o lugar, o dia, o horário, até o mês se quiser!<br/><br/>🧍⚔️📦 - Então o que está esperando? Começe já a guardar suas sessões dentro do seu báu de RPG pessoal! Só cuidado pra ele não te morder...</Text>
                <br/>
                <Text style={styles.extra}>Nosso número: (48)99999-9999<br/>Nos mande feedbacks: baussuspeitos@rpgmail.com <br/>Siga nossas jornadas no insta: @baussuspeitos</Text>
            </View>
        </View>
    </ScrollView>
  )
}

export default Feed

const styles = StyleSheet.create ({
    feed: {
        flex: 1,
        backgroundColor: "#000",
        fontSize: 20,
    },
    box: {
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        flex: 1,
        fontSize: 60,
        display: "flex",
        color: "#FF0068",
        marginBottom: "20px"
    },
    image: {
        width: 280,
        height: 280,
        marginBottom: 20
    },
    text: {
        flex: 1,
        display: "flex",
        backgroundColor: "#121212", 
        color: "#FF0068",
        fontSize: 14,
        maxWidth: "340px",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "10px",
        padding: "6px",
        textAlign: "justify",
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