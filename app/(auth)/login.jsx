import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { Link, router } from "expo-router";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
} from "firebase/auth";
import { auth, db } from "../../firebase";
import { setDoc, doc, getDoc } from "firebase/firestore"; 

const PINK_DARK = "#e94f8c";
const PINK_LIGHT = "#ffe0ec";
const TEXT = "#3a3a3a";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    getRedirectResult(auth)
      .then(async (result) => {
        console.log(" Redirect result:", result);

        if (result?.user) {
          const user = result.user;
          console.log("User logged in:", user.email);

          const ref = doc(db, "users", user.uid);
          const snapshot = await getDoc(ref);

          if (!snapshot.exists()) {
            console.log("Creating new user in Firestore...");
            await setDoc(ref, {
              uid: user.uid,
              email: user.email,
              name: user.displayName || "",
              photo: user.photoURL || "",
              provider: "google",
              createdAt: new Date(),
            });
          } else {
            console.log(" User already exists in Firestore.");
          }

          router.replace("/");
        }
      })
      .catch((err) => {
        console.error(" Google Redirect Error:", err.message);
      });
  }, []);

  const handleEmailLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/");
    } catch (e) {
      setError(e.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" }); 
      await signInWithRedirect(auth, provider);
    } catch (e) {
      setError(e.message);
      console.error(" Google Sign-In Error:", e.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Welcome Back 💗</Text>

        <TextInput
          placeholder="Email"
          style={styles.input}
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          placeholder="Password"
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {!!error && <Text style={styles.error}>{error}</Text>}

        <Pressable onPress={handleEmailLogin} style={styles.btn}>
          <Text style={styles.btnText}>Login</Text>
        </Pressable>

        <Pressable onPress={handleGoogleLogin} style={[styles.btn, styles.googleBtn]}>
          <Text style={[styles.btnText, { color: PINK_DARK }]}>Sign in with Google</Text>
        </Pressable>

        <Text style={styles.footer}>
          Don’t have an account? <Link href="/(auth)/register">Register</Link>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: PINK_LIGHT, justifyContent: "center", padding: 24 },
  card: { backgroundColor: "white", borderRadius: 20, padding: 20, elevation: 3 },
  title: { fontSize: 24, fontWeight: "800", color: PINK_DARK, marginBottom: 10, textAlign: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#f3c1d6",
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  btn: { backgroundColor: PINK_DARK, padding: 12, borderRadius: 10, alignItems: "center", marginTop: 6 },
  googleBtn: { backgroundColor: "white", borderColor: PINK_DARK, borderWidth: 1 },
  btnText: { color: "white", fontWeight: "700" },
  footer: { marginTop: 12, textAlign: "center", color: TEXT },
  error: { color: "red", textAlign: "center", marginBottom: 10 },
});
