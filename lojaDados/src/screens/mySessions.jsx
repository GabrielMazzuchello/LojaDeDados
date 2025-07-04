import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { useEffect, useState } from "react";
import {
  onSnapshot,
  collection,
  updateDoc,
  doc,
  arrayRemove,
} from "firebase/firestore";
import { db, auth } from "../services/firebase";

const MySessions = ({ navigation }) => {
  const [sessoes, setSessoes] = useState([]);
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;
    const unsubscribe = onSnapshot(collection(db, "sessoes"), (snapshot) => {
      const userSessions = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((sessao) => sessao.participantes?.includes(user.uid));
      setSessoes(userSessions);
    });

    return () => unsubscribe();
  }, [user]);

  const sairDaSessao = async (sessaoId) => {
    try {
      await updateDoc(doc(db, "sessoes", sessaoId), {
        participantes: arrayRemove(user.uid),
      });
      Alert.alert("Sucesso", "Você saiu da sessão.");
    } catch (error) {
      console.log("Erro ao sair da sessão:", error);
    }
  };

  return (
    <ScrollView style={styles.feed}>
      <View style={styles.box}>
        <Text style={styles.title}>MINHAS SESSÕES</Text>
        {sessoes.length === 0 ? (
          <Text style={styles.text}>
            Você não está participando de nenhuma sessão.
          </Text>
        ) : (
          sessoes.map((sessao) => (
            <View key={sessao.id} style={styles.card}>
              {sessao.imagem && (
                <Image style={styles.image} source={{ uri: sessao.imagem }} />
              )}
              <View style={{ flex: 1, padding: 8 }}>
                <Text style={styles.text}>Nome: {sessao.nome}</Text>
                <Text style={styles.text}>Mestre: {sessao.mestre}</Text>
                <Text style={styles.text}>Sistema: {sessao.cenario}</Text>
                <Text style={styles.text}>
                  Data: {sessao.data} - Hora: {sessao.hora}
                </Text>
                <Text style={styles.text}>Local: {sessao.local}</Text>
                <TouchableOpacity
                  onPress={() => sairDaSessao(sessao.id)}
                  style={styles.extra}
                >
                  <Text style={{ color: "#fff" }}>Sair da sessão</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
};

export default MySessions;

const styles = StyleSheet.create({
  feed: {
    flex: 1,
    backgroundColor: "#000",
  },
  box: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    color: "#FF0068",
    marginVertical: 20,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#111",
    flexDirection: "row",
    marginBottom: 20,
    marginHorizontal: 10,
    borderRadius: 10,
    borderColor: "#FF0068",
    borderWidth: 1,
    paddingInline: 15,
    marginInline: 15,
    overflow: "hidden",
  },
  image: {
    alignSelf: "center",
    width: 125,
    height: 125,
  },
  text: {
    color: "#fff",
    fontSize: 15,
    marginBottom: 4,
  },
  extra: {
    backgroundColor: "#FF0068",
    borderRadius: 8,
    padding: 8,
    marginTop: 8,
    alignSelf: "flex-start",
  },
});
