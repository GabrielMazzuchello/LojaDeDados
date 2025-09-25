import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import {
  collection,
  addDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db, auth } from "../services/firebase";

const ChatScreen = ({ route }) => {
  const { sessaoId } = route.params;
  const [mensagens, setMensagens] = useState([]);
  const [texto, setTexto] = useState("");
  const user = auth.currentUser;

  useEffect(() => {
    const mensagensRef = collection(db, "sessoes", sessaoId, "messages");
    const q = query(mensagensRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMensagens(msgs);
    });

    return () => unsubscribe();
  }, [sessaoId]);

  const enviarMensagem = async () => {
    const nomeUsuario =
      user.displayName || (user.email ? user.email.split("@")[0] : "Usuário");

    if (texto.trim() === "") return;
    await addDoc(collection(db, "sessoes", sessaoId, "messages"), {
      uid: user.uid,
      nome: nomeUsuario || "Anônimo",
      texto,
      createdAt: serverTimestamp(),
    });
    setTexto("");
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={mensagens}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={[
              styles.mensagem,
              item.uid === user.uid
                ? styles.minhaMensagem
                : styles.outraMensagem,
            ]}
          >
            <Text style={styles.nome}>{item.nome}</Text>
            <Text style={styles.texto}>{item.texto}</Text>
          </View>
        )}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={texto}
          onChangeText={setTexto}
          placeholder="Digite sua mensagem..."
          placeholderTextColor="#888"
        />
        <TouchableOpacity style={styles.botao} onPress={enviarMensagem}>
          <Text style={{ color: "#fff" }}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", padding: 10 },
  mensagem: { padding: 8, marginVertical: 4, borderRadius: 8, maxWidth: "80%" },
  minhaMensagem: { alignSelf: "flex-end", backgroundColor: "#FF0068" },
  outraMensagem: { alignSelf: "flex-start", backgroundColor: "#333" },
  nome: { fontWeight: "bold", color: "#fff" },
  texto: { color: "#fff" },
  inputContainer: {
    flexDirection: "row",
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: "#444",
  },
  input: {
    flex: 1,
    backgroundColor: "#111",
    color: "#fff",
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  botao: {
    backgroundColor: "#FF0068",
    paddingHorizontal: 15,
    justifyContent: "center",
    borderRadius: 8,
    marginLeft: 8,
  },
});
