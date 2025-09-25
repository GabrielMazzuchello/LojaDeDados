import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
} from "react-native";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  arrayUnion,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { auth, db } from "../services/firebase";

const ROOT_ADMIN_UID = "DIPyWdpxiHcS7tZXgOZXWABN5o72";

export default function Home({ navigation }) {
  const [sessoesOriginais, setSessoesOriginais] = useState([]);
  const [sessoesFiltradas, setSessoesFiltradas] = useState([]);
  const [busca, setBusca] = useState("");
  const [uidAtual, setUidAtual] = useState(null);
  const [mestres, setMestres] = useState([]);
  const [solicitacaoStatus, setSolicitacaoStatus] = useState(null);

  useEffect(() => {
    if (busca === "") {
      setSessoesFiltradas(sessoesOriginais);
    } else {
      const termoBusca = busca.toLowerCase();
      const sessoesFiltradas = sessoesOriginais.filter((sessao) => {
        const nomeSessao = sessao.nome ? sessao.nome.toLowerCase() : "";
        const cidadeSessao = sessao.cidade ? sessao.cidade.toLowerCase() : "";

        return (
          nomeSessao.includes(termoBusca) || cidadeSessao.includes(termoBusca)
        );
      });
      setSessoesFiltradas(sessoesFiltradas);
    }
  }, [busca, sessoesOriginais]);

  const verificarSolicitacao = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;
      const ref = doc(db, "solicitacoesMestre", user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setSolicitacaoStatus(snap.data().status);
      } else {
        setSolicitacaoStatus(null);
      }
    } catch (err) {
      console.error("Erro ao verificar solicitação:", err);
    }
  };

  const solicitarMestre = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      await setDoc(doc(db, "solicitacoesMestre", user.uid), {
        uid: user.uid,
        email: user.email,
        status: "pendente",
        criadoEm: new Date(),
      });

      setSolicitacaoStatus("pendente");
      Alert.alert("Sucesso", "Solicitação enviada! Aguarde aprovação.");
    } catch (err) {
      console.error("Erro ao solicitar mestre:", err);
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      await fetchMestres();
      await fetchData();
      await verificarSolicitacao();
    };
    fetchAll();
  }, []);

  const fetchMestres = async () => {
    try {
      const snapshot = await getDocs(collection(db, "administradores"));
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
      setSessoesOriginais(lista);
      setSessoesFiltradas(lista);
    } catch (error) {
      console.error("Erro ao buscar sessões:", error);
    }
  };

  const entrarNaSessao = async (idSessao, participantesAtuais) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Usuário não autenticado");
      if (participantesAtuais.includes(user.uid)) return;

      const ref = doc(db, "sessoes", idSessao);
      await updateDoc(ref, { participantes: arrayUnion(user.uid) });

      Alert.alert("Sucesso", "Você entrou na sessão!");
      fetchData();
    } catch (error) {
      console.log("Erro ao entrar na sessão: ", error);
    }
  };

  const removerSessao = async (idSessao) => {
    try {
      await deleteDoc(doc(db, "sessoes", idSessao));
      Alert.alert("Sucesso", "Sessão removida com sucesso.");
      fetchData();
    } catch (error) {
      console.error("Erro ao remover sessão:", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* ===== INÍCIO DO CABEÇALHO COMPLETO ===== */}
      <View style={styles.topPage}>
        <View style={styles.divisionTopPage1}>
          {(mestres.includes(uidAtual) || uidAtual === ROOT_ADMIN_UID) && (
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

      <View style={styles.TopPage}>
        {!mestres.includes(uidAtual) &&
          uidAtual !== ROOT_ADMIN_UID &&
          solicitacaoStatus !== "pendente" && (
            <TouchableOpacity
              onPress={solicitarMestre}
              style={{
                backgroundColor: "#333",
                padding: 10,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: "#FF0068",
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#FF0068", fontWeight: "bold" }}>
                {solicitacaoStatus === "recusado"
                  ? "Solicitar novamente para ser Mestre"
                  : "Solicitar para ser Mestre"}
              </Text>
            </TouchableOpacity>
          )}
      </View>
      {/* ===== FIM DO CABEÇALHO COMPLETO ===== */}

      <ScrollView showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={fetchData} style={styles.refreshButton}>
          <Text style={styles.refreshText}>🔄 Recarregar Sessões</Text>
        </TouchableOpacity>

        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nome ou cidade..."
          placeholderTextColor="#888"
          value={busca}
          onChangeText={setBusca}
        />

        <View style={styles.middlePage}>
          {sessoesFiltradas.length === 0 && busca.length > 0 && (
            <Text style={styles.nenhumResultado}>
              Nenhuma sessão encontrada.
            </Text>
          )}

          {sessoesFiltradas.map((sessao) => (
            <View key={sessao.id} style={styles.card}>
              <Text style={styles.cardTitle}>{sessao.nome}</Text>
              <Text style={styles.cardText}>Mestre: {sessao.mestre}</Text>
              <Text style={styles.cardText}>Sistema: {sessao.cenario}</Text>
              <Text style={styles.cardText}>Data: {sessao.data}</Text>
              <Text style={styles.cardText}>Hora: {sessao.hora}</Text>
              <Text style={styles.cardText}>Cidade: {sessao.cidade}</Text>
              <Text style={styles.cardText}>Endereço: {sessao.endereco}</Text>
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
              {(uidAtual === sessao.owner || uidAtual === ROOT_ADMIN_UID) && (
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
  TopPage: {
    // Estilo para o container do botão "Solicitar Mestre"
    marginVertical: 10,
    marginHorizontal: 15,
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
    textAlignVertical: "center",
  },
  refreshButton: {
    alignSelf: "center",
    backgroundColor: "#222",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
  },
  refreshText: {
    color: "#FF0068",
    fontWeight: "bold",
  },
  searchInput: {
    height: 50,
    backgroundColor: "#111",
    borderColor: "#FF0068",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    color: "#fff",
    fontSize: 16,
    marginBottom: 20,
    marginHorizontal: 15,
  },
  nenhumResultado: {
    color: "#888",
    textAlign: "center",
    fontSize: 16,
    marginTop: 30,
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
    marginHorizontal: 15,
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
});
