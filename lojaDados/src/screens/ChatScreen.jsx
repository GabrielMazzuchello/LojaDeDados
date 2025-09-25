import { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
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

// O componente para estilizar a scrollbar continua o mesmo
const ScrollbarStyle = () => {
  if (Platform.OS !== 'web') {
    return null;
  }
  const css = `
    ::-webkit-scrollbar { width: 8px; }
    ::-webkit-scrollbar-track { background: #111; }
    ::-webkit-scrollbar-thumb {
      background-color: #FF0068;
      border-radius: 10px;
      border: 2px solid #111;
    }
    ::-webkit-scrollbar-thumb:hover { background-color: #cc0052; }
  `;
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = css;
    document.head.appendChild(styleElement);
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);
  return null;
};

const ChatScreen = ({ route }) => {
  const { sessaoId } = route.params;
  const [mensagens, setMensagens] = useState([]);
  const [texto, setTexto] = useState("");
  const user = auth.currentUser;
  const scrollViewRef = useRef();

  // Seus useEffects e a função enviarMensagem continuam perfeitos
  useEffect(() => {
    const mensagensRef = collection(db, "sessoes", sessaoId, "messages");
    const q = query(mensagensRef, orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMensagens(msgs);
    });
    return () => unsubscribe();
  }, [sessaoId]);

  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [mensagens]);

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
      <ScrollbarStyle />
      
      {/* A ScrollView agora é o item flexível que cresce */}
      <ScrollView
        style={styles.messageList}
        ref={scrollViewRef}
        contentContainerStyle={{ paddingVertical: 10 }}
      >
        {mensagens.map((item) => (
          <View
            key={item.id}
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
        ))}
      </ScrollView>

      {/* O input container não é flexível, então tem sua altura natural */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={texto}
          onChangeText={setTexto}
          placeholder="Digite sua mensagem..."
          placeholderTextColor="#888"
          onSubmitEditing={enviarMensagem}
        />
        <TouchableOpacity style={styles.botao} onPress={enviarMensagem}>
          <Text style={styles.buttonText}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    height: "100vh",
    backgroundColor: "#000",
    // Configura o container como uma coluna Flexbox
    display: "flex",
    flexDirection: "column",
  },
  // <<< A MUDANÇA PRINCIPAL >>>
  messageList: {
    // A ScrollView vai crescer para ocupar todo o espaço disponível,
    // automaticamente "descontando" a altura do inputContainer.
    flex: 1, 
    overflowY: "auto",
  },
  // O resto dos estilos continua igual
  mensagem: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 12,
    maxWidth: "80%",
    marginHorizontal: 15,
  },
  minhaMensagem: {
    alignSelf: "flex-end",
    backgroundColor: "#FF0068",
  },
  outraMensagem: {
    alignSelf: "flex-start",
    backgroundColor: "#333",
  },
  nome: { fontWeight: "bold", color: "#fff", marginBottom: 3 },
  texto: { color: "#fff", fontSize: 16 },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#444",
    backgroundColor: "#111",
  },
  input: {
    flex: 1,
    backgroundColor: "#222",
    color: "#fff",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    outlineStyle: "none",
  },
  botao: {
    backgroundColor: "#FF0068",
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    marginLeft: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});