import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  arrayUnion,
} from "firebase/firestore";
import { auth, db } from "../services/firebase";

export default function Home({ navigation }) {
  const [sessoes, setSessoes] = useState([]);
  const [uidAtual, setUidAtual] = useState(null);
  const adminUID = "W5grpvre76XJNRSISOAnKSky35j2";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          await user.reload();
          setUidAtual(user.uid);
        }

        const snapshot = await getDocs(collection(db, "sessoes"));
        const lista = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSessoes(lista);
      } catch (error) {
        console.error("Erro ao buscar sessões:", error);
      }
    };
    fetchData();
  }, []);

  const entrarNaSessao = async (idSessao, participantesAtuais) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Usuário não autenticado");
      if (participantesAtuais.includes(user.uid)) return; // já está participando

      const ref = doc(db, "sessoes", idSessao);

      await updateDoc(ref, {
        participantes: arrayUnion(user.uid),
      });

      alert("Você entrou na sessão!");
    } catch (error) {
      console.log("Erro ao entrar na sessão: ", error);
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.topPage}>
        <View style={styles.divisionTopPage1}>
          {uidAtual === adminUID && (
            <TouchableOpacity onPress={() => navigation.navigate("Adm")}>
              <Text style={styles.button}>Agendar Sessões</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.divisionTopPage2}>
          <Image
            style={styles.img}
            source={require("../../assets/imagens/sus.png")}
          />
        </View>
        <View style={styles.divisionTopPage1} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.middlePage}>
          {sessoes.map((sessao) => (
            <View key={sessao.id} style={styles.card}>
              <Text style={styles.cardTitle}>{sessao.nome}</Text>
              <Text style={styles.cardText}>Mestre: {sessao.mestre}</Text>
              <Text style={styles.cardText}>Cenário: {sessao.cenario}</Text>
              <Text style={styles.cardText}>Data: {sessao.data}</Text>
              <Text style={styles.cardText}>Hora: {sessao.hora}</Text>
              {sessao.imagem ? (
                <Image
                  source={{ uri: sessao.imagem }}
                  style={styles.cardImage}
                />
              ) : null}
              {uidAtual && !sessao.participantes?.includes(uidAtual) ? (
                <TouchableOpacity
                  style={styles.entrarButton}
                  onPress={() =>
                    entrarNaSessao(sessao.id, sessao.participantes || [])
                  }
                >
                  <Text style={styles.buttonText}>Entrar</Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.jaParticipa}>
                  Você já está participando
                </Text>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 10,
  },
  topPage: {
    height: 220,
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
  },
  divisionTopPage1: {
    height: 140,
    width: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  divisionTopPage2: {
    height: 140,
    width: 150,
  },
  img: {
    width: 220,
    height: 220,
    resizeMode: "contain",
  },
  button: {
    fontSize: 12,
    backgroundColor: "#555",
    borderRadius: 5,
    padding: 8,
    fontWeight: "bold",
    color: "#FF0068",
  },
  middlePage: {
    paddingBottom: 30,
  },
  card: {
    backgroundColor: "#111",
    marginBottom: 16,
    padding: 16,
    borderRadius: 10,
    borderColor: "#FF0068",
    borderWidth: 1,
  },
  cardTitle: {
    fontSize: 20,
    color: "#FF0068",
    fontWeight: "bold",
    marginBottom: 5,
  },
  cardText: {
    fontSize: 16,
    color: "#ccc",
    marginBottom: 2,
  },
  cardImage: {
    width: "100%",
    height: 150,
    marginTop: 10,
    borderRadius: 8,
  },
  entrarButton: {
    marginTop: 10,
    backgroundColor: "#FF0068",
    borderRadius: 6,
    padding: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  jaParticipa: {
    color: "#6f6",
    fontStyle: "italic",
    marginTop: 10,
    textAlign: "center",
  },
});
