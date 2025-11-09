import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Animated,
  Image,
} from "react-native";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";
import { router } from "expo-router";

const PINK_LIGHT = "#ffe0ec";
const PINK_DARK = "#e94f8c";
const TEXT = "#3a3a3a";

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
      if (!u) router.replace("/(auth)/login");
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (!loading) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    }
  }, [loading]);

  if (loading)
    return (
      <View style={styles.container}>
        <ActivityIndicator color={PINK_DARK} size="large" />
      </View>
    );

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
        {/* 🖼️ FOTO E MIRESEARDHJES */}
        <Image
          source={require("../assets/images/welcome.png")}
          style={{ width: 220, height: 220, marginBottom: 20 }}
          resizeMode="contain"
        />

        <Text style={styles.title}>Welcome dear 💖</Text>
        <Text style={styles.subtitle}>
          {user?.displayName ? user.displayName : user?.email}
        </Text>

        <Pressable
          onPress={() => {
            signOut(auth);
            router.replace("/(auth)/login");
          }}
          style={styles.btn}
        >
          <Text style={styles.btnText}>Logout</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PINK_LIGHT,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 28,
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: "900",
    color: PINK_DARK,
  },
  subtitle: {
    color: TEXT,
    marginVertical: 12,
    fontSize: 16,
    textAlign: "center",
  },
  btn: {
    marginTop: 14,
    backgroundColor: PINK_DARK,
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 12,
  },
  btnText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
});
