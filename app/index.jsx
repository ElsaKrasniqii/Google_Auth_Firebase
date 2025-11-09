import React, { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet, ActivityIndicator } from "react-native";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";
import { router } from "expo-router";

const PINK_LIGHT = "#ffe0ec";
const PINK_DARK = "#e94f8c";
const TEXT = "#3a3a3a";

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
      if (!u) router.replace("/(auth)/login");
    });
    return unsub;
  }, []);

  if (loading)
    return (
      <View style={styles.container}>
        <ActivityIndicator color={PINK_DARK} size="large" />
      </View>
    );

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Welcome 💗</Text>
        <Text style={styles.subtitle}>{user?.email}</Text>

        <Pressable onPress={() => signOut(auth)} style={styles.btn}>
          <Text style={styles.btnText}>Logout</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: PINK_LIGHT, justifyContent: "center", alignItems: "center" },
  card: { backgroundColor: "white", borderRadius: 20, padding: 24, alignItems: "center", elevation: 4 },
  title: { fontSize: 22, fontWeight: "800", color: PINK_DARK },
  subtitle: { color: TEXT, marginVertical: 8 },
  btn: { marginTop: 14, backgroundColor: PINK_DARK, padding: 10, borderRadius: 10 },
  btnText: { color: "white", fontWeight: "600" },
});
