import React from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInputBase,
} from "react-native";

const Register = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Resgistrar-se</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#999"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        placeholderTextColor="#999"
        secureTextEntry={true}
      />

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Criar conta</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.linkButton}>
        <Text style={styles.linkText}>Ja tem uma conta?</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#333",
    justifyContent: "center",
    paddingHorizontal: 30,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 40,
    textAlign: "center",
    color: "#f4f4f4",
  },

  input: {
    height: 48,
    borderRadius: 8,
    backgroundColor: "#222",
    borderColor: "#ddd",
    borderWidth: 1,
    paddingHorizontal: 15,
    marginBottom: 15,
  },

  button: {
    backgroundColor: "#4A90E2",
    borderRadius: 8,
    alignItems: "center",
    paddingVertical: 14,
    marginBottom: 15,
  },
  buttonText: {
    fontWeight: "bold",
    color: "#333",
    fontSize: 16,
    margin: 5,
  },

  linkText: {
    color: "#4A90E2",
    textAlign: "center",
    fontSize: 15,
  },
});

export default Register;
