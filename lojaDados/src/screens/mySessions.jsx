import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState } from "react";
import {
  onSnapshot,
  collection,
  updateDoc,
  doc,
  arrayRemove,
  getDoc,
} from "firebase/firestore";
import { db, auth } from "../services/firebase";

const MySessions = ({ navigation }) => {
  const [sessoes, setSessoes] = useState([]);
  const user = auth.currentUser;

  const [modalVisible, setModalVisible] = useState(false);
  const [participantesVisiveis, setParticipantesVisiveis] = useState([]);
  const [carregandoParticipantes, setCarregandoParticipantes] = useState(false);

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

  const buscarNomesParticipantes = async (uids) => {
    setCarregandoParticipantes(true);
    setParticipantesVisiveis([]);
    setModalVisible(true);

    try {
      const promessasUsuarios = uids.map((uid) =>
        getDoc(doc(db, "users", uid))
      );
      const snapshotsUsuarios = await Promise.all(promessasUsuarios);
      const nomes = snapshotsUsuarios.map((snapshot) => {
        if (snapshot.exists()) {
          return snapshot.data().nome || "Nome não encontrado";
        }
        return "Usuário desconhecido";
      });
      setParticipantesVisiveis(nomes);
    } catch (error) {
      console.error("Erro ao buscar participantes:", error);
      Alert.alert(
        "Erro",
        "Não foi possível carregar a lista de participantes."
      );
    } finally {
      setCarregandoParticipantes(false);
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
              <View style={styles.topContainer}>
                {sessao.imagem && (
                  <Image style={styles.image} source={{ uri: sessao.imagem }} />
                )}
                <View style={styles.textContainer}>
                  {/* <<< CONTROLE DE LARGURA APLICADO A TODOS OS TEXTOS >>> */}
                  <Text
                    style={styles.sessionName}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    Nome: {sessao.nome}
                  </Text>
                  <Text
                    style={styles.text}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    Mestre: {sessao.mestre}
                  </Text>
                  <Text
                    style={styles.text}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    Sistema: {sessao.cenario}
                  </Text>
                  <Text
                    style={styles.text}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    Data: {sessao.data} - Hora: {sessao.hora}
                  </Text>
                  <Text
                    style={styles.text}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    Cidade: {sessao.cidade}
                  </Text>
                  <Text
                    style={styles.text}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    Endereço: {sessao.endereco}
                  </Text>
                  <Text
                    style={styles.text}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    Local: {sessao.local}
                  </Text>
                </View>
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  onPress={() => sairDaSessao(sessao.id)}
                  style={styles.extra}
                >
                  <Text style={styles.buttonText}>Sair da sessão</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => buscarNomesParticipantes(sessao.participantes)}
                  style={[styles.extra, { backgroundColor: "#33A" }]}
                >
                  <Text style={styles.buttonText}>Participantes</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("ChatScreen", { sessaoId: sessao.id })
                  }
                  style={[styles.extra, { backgroundColor: "#0A5" }]}
                >
                  <Text style={styles.buttonText}>Chat</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Participantes da Sessão</Text>
            {carregandoParticipantes ? (
              <ActivityIndicator size="large" color="#FF0068" />
            ) : (
              participantesVisiveis.map((nome, index) => (
                <Text key={index} style={styles.modalText}>
                  {nome}
                </Text>
              ))
            )}
            <TouchableOpacity
              style={[styles.extra, { marginTop: 20, alignSelf: "center" }]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.buttonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    paddingVertical: 10,
  },
  title: {
    fontSize: 32,
    color: "#FF0068",
    marginVertical: 20,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#111",
    marginBottom: 20,
    marginHorizontal: 15,
    borderRadius: 10,
    borderColor: "#FF0068",
    borderWidth: 1,
    overflow: "hidden",
    width: "360px",
  },
  topContainer: {
    flexDirection: "row",
    padding: 10,
  },
  image: {
    alignSelf: "center",
    width: 125,
    height: 125,
    borderRadius: 8,
  },
  textContainer: {
    flex: 1,
    paddingLeft: 10,
    justifyContent: "center",
  },
  text: {
    color: "#fff",
    fontSize: 15,
    marginBottom: 4,
  },
  sessionName: {
    fontSize: 16,
    color: "#FF0068",
    fontWeight: "bold",
    marginBottom: 5,
  },
  extra: {
    backgroundColor: "#FF0068",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    // Garante que o botão não encolha
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#222",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#FF0068",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "#222",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderColor: "#FF0068",
    borderWidth: 1,
  },
  modalTitle: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  modalText: {
    marginBottom: 10,
    textAlign: "center",
    fontSize: 16,
    color: "#ddd",
  },
});
