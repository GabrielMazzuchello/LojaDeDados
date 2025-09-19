import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Modal, // Importar o Modal
  ActivityIndicator, // Para mostrar que está carregando
} from "react-native";
import { useEffect, useState } from "react";
import {
  onSnapshot,
  collection,
  updateDoc,
  doc,
  arrayRemove,
  getDoc, // Importar getDoc
} from "firebase/firestore";
import { db, auth } from "../services/firebase";

const MySessions = ({ navigation }) => {
  const [sessoes, setSessoes] = useState([]);
  const user = auth.currentUser;

  // Estados para controlar o Modal
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

  // --- NOVA FUNÇÃO PARA BUSCAR OS NOMES DOS PARTICIPANTES ---
  const buscarNomesParticipantes = async (uids) => {
    setCarregandoParticipantes(true);
    setParticipantesVisiveis([]); // Limpa a lista antiga
    setModalVisible(true);

    try {
      // Cria uma lista de promessas para buscar cada documento de usuário
      const promessasUsuarios = uids.map((uid) =>
        getDoc(doc(db, "users", uid))
      );

      // Espera todas as buscas terminarem
      const snapshotsUsuarios = await Promise.all(promessasUsuarios);

      // Mapeia os resultados para pegar o nome de cada usuário
      const nomes = snapshotsUsuarios.map((snapshot) => {
        if (snapshot.exists()) {
          return snapshot.data().nome || "Nome não encontrado"; // Usa o campo 'nome'
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

                {/* --- BOTÕES NA HORIZONTAL --- */}
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    onPress={() => sairDaSessao(sessao.id)}
                    style={styles.extra}
                  >
                    <Text style={{ color: "#fff" }}>Sair da sessão</Text>
                  </TouchableOpacity>

                  {/* --- NOVO BOTÃO PARA VER PARTICIPANTES --- */}
                  <TouchableOpacity
                    onPress={() =>
                      buscarNomesParticipantes(sessao.participantes)
                    }
                    style={[styles.extra, { backgroundColor: "#33A" }]} // Cor diferente
                  >
                    <Text style={{ color: "#fff" }}>Participantes</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        )}
      </View>

      {/* --- NOVO MODAL PARA EXIBIR A LISTA --- */}
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
              style={[styles.extra, { marginTop: 20 }]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={{ color: "#fff" }}>Fechar</Text>
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
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 8,
    alignSelf: "flex-start",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between", // Ou 'flex-start' com marginRight
    gap: 10, // Espaçamento entre os botões
  },
  // --- NOVOS ESTILOS PARA O MODAL ---
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)", // Fundo escurecido
  },
  modalView: {
    margin: 20,
    backgroundColor: "#222",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
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
