import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useState } from "react";
import { auth, db } from "../services/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

const Adm = ({ navigation }) => {
  const [nome, setNome] = useState("");
  const [mestre, setMestre] = useState("");
  const [cenario, setCenario] = useState("");
  const [hora, setHora] = useState("");
  const [data, setData] = useState("");
  const [cidade, setCidade] = useState("");
  const [endereco, setEndereco] = useState("");
  const [local, setLocal] = useState("");
  const [imagem, setImagem] = useState("");

  const criarSessao = async () => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Usuário não autenticado");

      await addDoc(collection(db, "sessoes"), {
        nome,
        mestre,
        cenario,
        data,
        hora,
        cidade,
        endereco,
        local,
        imagem,
        owner: user.uid,
        participantes: [user.uid],
        createdAt: serverTimestamp(),
      });
      navigation.navigate("HomeTabs", { screen: "Portal" });
    } catch (error) {
      console.log("Erro, não foi possivel criar a sessão! " + error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CADASTRO SESSÕES</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome da sessão"
        placeholderTextColor={"#4a5e49"}
        value={nome}
        onChangeText={setNome}
      />

      <TextInput
        style={styles.input}
        placeholder="Nome do mestre"
        placeholderTextColor={"#4a5e49"}
        value={mestre}
        onChangeText={setMestre}
      />

      <TextInput
        style={styles.input}
        placeholder="Sistema"
        placeholderTextColor={"#4a5e49"}
        value={cenario}
        onChangeText={setCenario}
      />

      <View style={styles.spaceData}>
        <TextInput
          style={styles.inputData}
          placeholder="Hora (xx:yy)"
          placeholderTextColor={"#4a5e49"}
          value={hora}
          onChangeText={setHora}
        />
        <TextInput
          style={styles.inputData}
          placeholder="Dia e Mês (xx/yy)"
          placeholderTextColor={"#4a5e49"}
          value={data}
          onChangeText={setData}
        />
      </View>

      <TextInput
        style={styles.input}
        placeholder="Cidade"
        placeholderTextColor="#4a5e49"
        value={cidade}
        onChangeText={setCidade}
      />

      <TextInput
        style={styles.input}
        placeholder="Endereço"
        placeholderTextColor="#4a5e49"
        value={endereco}
        onChangeText={setEndereco}
      />

      <TextInput
        style={styles.input}
        placeholder="Local"
        placeholderTextColor="#4a5e49"
        value={local}
        onChangeText={setLocal}
      />

      <TextInput
        style={styles.input}
        placeholder="Imagem"
        placeholderTextColor={"#4a5e49"}
        value={imagem}
        onChangeText={setImagem}
      />

      <TouchableOpacity onPress={criarSessao} style={styles.button}>
        <Text style={styles.link}>Cadastrar sessão</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Adm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    alignItems: "center",
  },
  title: {
    fontSize: 40,
    color: "#FF0068",
    marginVertical: 20,
  },
  input: {
    width: 300,
    height: 38,
    fontSize: 20,
    textAlign: "center",
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#FF0068",
    color: "#FF0068",
    marginBottom: 12,
  },
  inputData: {
    width: 135,
    height: 38,
    fontSize: 20,
    textAlign: "center",
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#FF0068",
    color: "#FF0068",
  },
  link: {
    alignSelf: "center",
    fontSize: 25,
    color: "#FF0068",
    fontWeight: "bold",
  },
  spaceData: {
    flexDirection: "row",
    width: 350,
    justifyContent: "space-around",
    marginBottom: 12,
  },
  button: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#FF0068",
    backgroundColor: "#121212",
    width: 250,
    paddingVertical: 10,
    marginTop: 15,
  },
});
