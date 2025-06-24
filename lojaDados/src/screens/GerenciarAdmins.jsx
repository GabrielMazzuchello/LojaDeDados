// Tela de gerenciamento de administradores usando Firestore

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import {
  getDocs,
  collection,
  setDoc,
  deleteDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../services/firebase";

export default function AdminPanel() {
  const [usuarios, setUsuarios] = useState([]);
  const [search, setSearch] = useState("");
  const [admins, setAdmins] = useState([]);

  const fetchUsuarios = async () => {
    const querySnapshot = await getDocs(collection(db, "users"));
    const lista = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setUsuarios(lista);
  };

  const fetchAdmins = async () => {
    const snapshot = await getDocs(collection(db, "administradores"));
    const lista = snapshot.docs.map((doc) => doc.id); // apenas os UIDs
    setAdmins(lista);
  };

  const tornarAdmin = async (uid) => {
    await setDoc(doc(db, "administradores", uid), { uid });
    fetchAdmins();
  };

  const removerAdmin = async (uid) => {
    await deleteDoc(doc(db, "administradores", uid));
    fetchAdmins();
  };

  useEffect(() => {
    fetchUsuarios();
    fetchAdmins();
  }, []);

  const usuariosFiltrados = usuarios.filter((user) =>
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Gerenciar Mestres</Text>

      <TextInput
        placeholder="Buscar por email"
        value={search}
        onChangeText={setSearch}
        style={styles.input}
        placeholderTextColor="#888"
      />

      {usuariosFiltrados.map((user) => (
        <View key={user.id} style={styles.userCard}>
          <Text style={styles.email}>{user.email}</Text>
          {admins.includes(user.id) ? (
            <TouchableOpacity
              style={styles.removerBtn}
              onPress={() => removerAdmin(user.id)}
            >
              <Text style={styles.btnText}>Remover ADM</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.tornarBtn}
              onPress={() => tornarAdmin(user.id)}
            >
              <Text style={styles.btnText}>Tornar ADM</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#000",
  },
  title: {
    color: "#FF0068",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#555",
    padding: 8,
    borderRadius: 6,
    color: "#fff",
    marginBottom: 16,
  },
  userCard: {
    backgroundColor: "#111",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#FF0068",
  },
  email: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 8,
  },
  tornarBtn: {
    backgroundColor: "#00c853",
    padding: 8,
    borderRadius: 5,
  },
  removerBtn: {
    backgroundColor: "#c62828",
    padding: 8,
    borderRadius: 5,
  },
  btnText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});
