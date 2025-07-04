import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import { useEffect, useState } from "react";
import { auth } from "../services/firebase";
import { db } from "../services/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

const Adm = ({ navigation }) => {
  const [nome, setNome] = useState("");
  const [mestre, setMestre] = useState("");
  const [cenario, setCenario] = useState("");
  const [hora, setHora] = useState("");
  const [data, setData] = useState("");
  const [local, setLocal] = useState("");
  const [imagem, setImagem] = useState("");

  const criarSessao = async ({ nome, mestre, cenario, data, hora, imagem }) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Usuário não autenticado");
      await addDoc(collection(db, "sessoes"), {
        nome,
        mestre,
        cenario,
        data,
        hora,
        local,
        imagem,
        owner: user.uid,
        participantes: [user.uid],
        CreateAt: serverTimestamp(),
      });
      navigation.navigate("HomeTabs", { screen: "Portal" });
    } catch (error) {
      console.log("Erro, não foi possivel criar a sessão! " + error);
    }
  };

  return (
    <View style={styles.container}>
      <br />
      <Text style={styles.title}>CADASTRO SESSÕES</Text>
      <br />
      <br />
      <br />
      <TextInput
        style={styles.input}
        placeholder="Nome da sessão"
        placeholderTextColor={"#4a5e49"}
        value={nome}
        onChangeText={setNome}
      />
      <br />
      <br />
      <br />
      <TextInput
        style={styles.input}
        placeholder="Nome do mestre"
        placeholderTextColor={"#4a5e49"}
        value={mestre}
        onChangeText={setMestre}
      />
      <br />
      <br />
      <br />
      <TextInput
        style={styles.input}
        placeholder="Sistema"
        placeholderTextColor={"#4a5e49"}
        value={cenario}
        onChangeText={setCenario}
      />
      <br />
      <br />
      <br />
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
      <br />
      <br />
      <br />
      <TextInput
        style={styles.input}
        placeholder="Local"
        placeholderTextColor="#4a5e49"
        value={local}
        onChangeText={setLocal}
      />
      <br />
      <br />
      <br />

      <TextInput
        style={styles.input}
        placeholder="Imagem"
        placeholderTextColor={"#4a5e49"}
        value={imagem}
        onChangeText={setImagem}
      />
      <br />
      <br />
      <br />

      <TouchableOpacity
        onPress={() =>
          criarSessao({ nome, mestre, cenario, data, hora, imagem })
        }
        style={styles.button}
      >
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
    display: "flex",
    flexDirection: "row",
    width: 350,
    justifyContent: "space-around",
    alignItems: "center",
  },
  button: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#FF0068",
    backgroundColor: "#121212",
    width: 250,
  },
});
