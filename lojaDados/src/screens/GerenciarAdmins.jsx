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
} from "firebase/firestore";
import { db, auth } from "../services/firebase";

const ROOT_ADMIN_UID = "W5grpvre76XJNRSISOAnKSky35j2"; // <- coloque aqui o UID fixo do admin raiz

export default function AdminPanel() {
  const [usuarios, setUsuarios] = useState([]);
  const [search, setSearch] = useState("");
  const [mestres, setMestres] = useState([]);
  const user = auth.currentUser;

  const fetchUsuarios = async () => {
    const querySnapshot = await getDocs(collection(db, "users"));
    const lista = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setUsuarios(lista);
  };

  const fetchMestres = async () => {
    const snapshot = await getDocs(collection(db, "administradores"));
    const lista = snapshot.docs.map((doc) => doc.id); // apenas os UIDs
    setMestres(lista);
  };

  const tornarMestre = async (uid) => {
    await setDoc(doc(db, "administradores", uid), { uid });
    fetchMestres();
  };

  const removerMestre = async (uid) => {
    await deleteDoc(doc(db, "administradores", uid));
    fetchMestres();
  };

  useEffect(() => {
    fetchUsuarios();
    fetchMestres();
  }, []);

  if (!user || user.uid !== ROOT_ADMIN_UID) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "#fff" }}>Acesso negado</Text>
      </View>
    );
  }

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
          {mestres.includes(user.id) ? (
            <TouchableOpacity
              style={styles.removerBtn}
              onPress={() => removerMestre(user.id)}
            >
              <Text style={styles.btnText}>Remover Mestre</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.tornarBtn}
              onPress={() => tornarMestre(user.id)}
            >
              <Text style={styles.btnText}>Tornar Mestre</Text>
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
