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
  deleteDoc,
  doc,
  arrayUnion,
} from "firebase/firestore";
import { auth, db } from "../services/firebase";

const ROOT_ADMIN_UID = "W5grpvre76XJNRSISOAnKSky35j2"; // <- coloque aqui o UID fixo do admin raiz

export default function Home({ navigation }) {
  const [sessoes, setSessoes] = useState([]);
  const [uidAtual, setUidAtual] = useState(null);
  const [mestres, setMestres] = useState([]);

  const fetchMestres = async () => {
    try {
      const snapshot = await getDocs(collection(db, "administradores")); // coleção de mestres
      const listaUIDs = snapshot.docs.map((doc) => doc.data().uid);
      setMestres(listaUIDs);
    } catch (error) {
      console.error("Erro ao buscar mestres:", error);
    }
  };

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

  useEffect(() => {
    const fetchAll = async () => {
      await fetchMestres();
      await fetchData();
    };
    fetchAll();
  }, []);

  const entrarNaSessao = async (idSessao, participantesAtuais) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Usuário não autenticado");
      if (participantesAtuais.includes(user.uid)) return;

      const ref = doc(db, "sessoes", idSessao);

      await updateDoc(ref, {
        participantes: arrayUnion(user.uid),
      });

      alert("Você entrou na sessão!");
      fetchData();
    } catch (error) {
      console.log("Erro ao entrar na sessão: ", error);
    }
  };

  const removerSessao = async (idSessao) => {
    try {
      await deleteDoc(doc(db, "sessoes", idSessao));
      alert("Sessão removida com sucesso.");
      fetchData();
    } catch (error) {
      console.error("Erro ao remover sessão:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topPage}>
        <View style={styles.divisionTopPage1}>
          {(mestres.includes(uidAtual) || uidAtual == ROOT_ADMIN_UID) && (
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

        <View style={styles.divisionTopPage1}>
          {uidAtual === ROOT_ADMIN_UID && (
            <TouchableOpacity
              onPress={() => navigation.navigate("GerenciarAdmins")}
            >
              <Text style={styles.button}>Cadastrar Mestre</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={fetchData} style={styles.refreshButton}>
          <Text style={styles.refreshText}>🔄 Recarregar</Text>
        </TouchableOpacity>

        <View style={styles.middlePage}>
          {sessoes.map((sessao) => (
            <View key={sessao.id} style={styles.card}>
              <Text style={styles.cardTitle}>{sessao.nome}</Text>
              <Text style={styles.cardText}>Mestre: {sessao.mestre}</Text>
              <Text style={styles.cardText}>Sistema: {sessao.cenario}</Text>
              <Text style={styles.cardText}>Data: {sessao.data}</Text>
              <Text style={styles.cardText}>Hora: {sessao.hora}</Text>
              <Text style={styles.cardText}>Local: {sessao.local}</Text>
              {sessao.imagem && (
                <Image
                  source={{ uri: sessao.imagem }}
                  style={styles.cardImage}
                />
              )}
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
              {(uidAtual == sessao.owner || uidAtual == ROOT_ADMIN_UID) && (
                <TouchableOpacity
                  style={styles.removerButton}
                  onPress={() => removerSessao(sessao.id)}
                >
                  <Text style={styles.buttonText}>Remover</Text>
                </TouchableOpacity>
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
    height: 200,
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
    alignItems: "center",
    justifyContent: "center",
  },
  img: {
    width: "100%",
    resizeMode: "contain",
  },
  button: {
    height: 60,
    width: 90,
    fontSize: 16,
    backgroundColor: "#121212",
    borderRadius: 5,
    padding: 8,
    fontWeight: "bold",
    color: "#FF0068",
    textAlign: "center",
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
    paddingInline: 15,
    marginInline: 15,
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
    height: 250,
    marginTop: 10,
    borderRadius: 8,
  },
  entrarButton: {
    marginTop: 10,
    backgroundColor: "#FF0068",
    borderRadius: 6,
    padding: 8,
  },
  removerButton: {
    marginTop: 10,
    backgroundColor: "#A00",
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
  refreshButton: {
    alignSelf: "center",
    backgroundColor: "#222",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  refreshText: {
    color: "#FF0068",
    fontWeight: "bold",
  },
});
