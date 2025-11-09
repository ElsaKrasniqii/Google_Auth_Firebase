import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { auth, db } from "../../firebase";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import { setDoc, doc, getDoc } from "firebase/firestore";

import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";

WebBrowser.maybeCompleteAuthSession();

const PINK_DARK = "#e94f8c";
const PINK_LIGHT = "#ffe0ec";
const TEXT = "#3a3a3a";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: "859199550263-bcirlrrdlgi1q46bt72sicdib2qlkm4t.apps.googleusercontent.com",
    expoClientId: "859199550263-bcirlrrdlgi1q46bt72sicdib2qlkm4t.apps.googleusercontent.com",
    iosClientId: "859199550263-bcirlrrdlgi1q46bt72sicdib2qlkm4t.apps.googleusercontent.com",
    androidClientId: "859199550263-bcirlrrdlgi1q46bt72sicdib2qlkm4t.apps.googleusercontent.com",
    redirectUri: "https://auth.expo.io/@elsak/Myapp", 
  });

  useEffect(() => {
    const handleGoogleResponse = async () => {
      if (response?.type === "success") {
        const { authentication } = response;

        const credential = GoogleAuthProvider.credential(
          null,
          authentication.accessToken
        );

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
            console.log(" User added to Firestore");
          } else {
            console.log("ℹ User already exists in Firestore");
          }

          router.push("/home");
        } catch (err) {
          console.error(" Google Sign-In Error:", err.message);
          setError(err.message);
        }
      }
    };

    handleGoogleResponse();
  }, [response]);

  const handleEmailLogin = async () => {
    if (!email || !password) {
      setError("Please fill in both fields.");
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/home");
    } catch (e) {
      setError("Invalid email or password.");
      console.error("Email login error:", e.message);
    } finally {
      setLoading(false);
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

        <TouchableOpacity onPress={handleEmailLogin} style={styles.btn}>
          <Text style={styles.btnText}>
            {loading ? "Logging in..." : "Login"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, styles.googleBtn]}
          onPress={() => promptAsync()}
          disabled={!request}
        >
          <Text style={[styles.btnText, { color: PINK_DARK }]}>
            Continue with Google
          </Text>
        </TouchableOpacity>

        <Text style={styles.footer}>
          Don’t have an account?{" "}
          <Text
            onPress={() => router.push("/(auth)/register")}
            style={{ color: PINK_DARK, fontWeight: "600" }}
          >
            Register
          </Text>
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
