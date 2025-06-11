import { useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { auth } from "../services/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

const Register = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    console.log("Botão Criar Conta pressionado");

    if (!email || !password) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert("Sucesso", "Usuário registrado com sucesso!");
      console.log("Sucesso", "Usuário registrado com sucesso!");
      navigation.navigate("Login");
    } catch (error) {
      Alert.alert("Erro ao registrar", error.message);
      console.log("Erro ao criar conta:", error.code, error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>REGISTRAR-SE</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#FF0068"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        placeholderTextColor="#FF0068"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Criar conta</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 35,
    fontWeight: "bold",
    marginBottom: 40,
    textAlign: "center",
    color: "#FF0068",
  },
  input: {
    height: 48,
    borderRadius: 8,
    backgroundColor: "#222",
    borderColor: "#FF0068",
    borderWidth: 1,
    paddingHorizontal: 15,
    marginBottom: 15,
    color: "#FF0068",
  },
  button: {
    backgroundColor: "#FF0068",
    borderRadius: 8,
    alignItems: "center",
    paddingVertical: 14,
    marginBottom: 15,
    color: "#FF0068"
  },
  buttonText: {
    fontWeight: "bold",
    color: "#FFFFFF",
    fontSize: 16,
  },
  link: {
    color: "#FF0068",
    textAlign: "center",
    fontSize: 15,
    textDecorationLine: "underline",
  },
});
