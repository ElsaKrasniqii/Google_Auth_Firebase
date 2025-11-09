import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Platform } from "react-native";
import { Link, router } from "expo-router";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import { auth, db } from "../../firebase";
import { setDoc, doc, getDoc } from "firebase/firestore";

import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import * as AuthSession from "expo-auth-session";

WebBrowser.maybeCompleteAuthSession();

const PINK_DARK = "#e94f8c";
const PINK_LIGHT = "#ffe0ec";
const TEXT = "#3a3a3a";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const provider = new GoogleAuthProvider();

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: "859199550263-bcirlrrdlgi1q46bt72sicdib2qlkm4t.apps.googleusercontent.com",
    expoClientId: "859199550263-bcirlrrdlgi1q46bt72sicdib2qlkm4t.apps.googleusercontent.com",
    redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
  });

  useEffect(() => {
    const handleGoogleResponse = async () => {
      if (response?.type === "success" && Platform.OS !== "web") {
        const { authentication } = response;
        const credential = GoogleAuthProvider.credential(null, authentication.accessToken);
        try {
          const result = await signInWithCredential(auth, credential);
          const user = result.user;

          const ref = doc(db, "users", user.uid);
          const snapshot = await getDoc(ref);
          if (!snapshot.exists()) {
            await setDoc(ref, {
              uid: user.uid,
              email: user.email,
              name: user.displayName || "",
              photo: user.photoURL || "",
              provider: "google",
              createdAt: new Date(),
            });
          }

          router.replace("/");
        } catch (err) {
          setError(err.message);
        }
      }
    };
    handleGoogleResponse();
  }, [response]);

  const handleRegister = async () => {
    if (!email || !password) {
      setError("Please fill in both fields.");
      return;
    }

    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const user = result.user;

      const ref = doc(db, "users", user.uid);
      await setDoc(ref, {
        uid: user.uid,
        email: user.email,
        provider: "email",
        createdAt: new Date(),
      });

      router.replace("/");
    } catch (e) {

      if (e.code === "auth/email-already-in-use") {
        setError("This email is already registered.");
      } else if (e.code === "auth/invalid-email") {
        setError("Invalid email format.");
      } else if (e.code === "auth/weak-password") {
        setError("Password must be at least 6 characters.");
      } else {
        setError(e.message);
      }
    }
  };

  const handleGoogleWebRegister = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const ref = doc(db, "users", user.uid);
      const snapshot = await getDoc(ref);
      if (!snapshot.exists()) {
        await setDoc(ref, {
          uid: user.uid,
          email: user.email,
          name: user.displayName || "",
          photo: user.photoURL || "",
          provider: "google",
          createdAt: new Date(),
        });
      }

      router.replace("/");
    } catch (err) {
      console.error("Google Popup Register Error:", err.message);
      setError(err.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Create Account 💕</Text>

        <TextInput
          placeholder="Email"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Password"
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {!!error && <Text style={styles.error}>{error}</Text>}

        <Pressable onPress={handleRegister} style={styles.btn}>
          <Text style={styles.btnText}>Register</Text>
        </Pressable>

        <Pressable
          onPress={() =>
            Platform.OS === "web" ? handleGoogleWebRegister() : promptAsync()
          }
          style={[styles.btn, styles.googleBtn]}
        >
          <Text style={[styles.btnText, { color: PINK_DARK }]}>
            Sign up with Google
          </Text>
        </Pressable>

        <Text style={styles.footer}>
          Already have an account?{" "}
          <Link href="/(auth)/login" style={{ color: PINK_DARK, fontWeight: "600" }}>
            Login
          </Link>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: PINK_LIGHT, justifyContent: "center", padding: 24 },
  card: { backgroundColor: "white", borderRadius: 20, padding: 20, elevation: 3 },
  title: { fontSize: 24, fontWeight: "800", color: PINK_DARK, marginBottom: 10 },
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
