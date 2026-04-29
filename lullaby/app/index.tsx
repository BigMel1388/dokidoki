// === Imports Section ===
import { BlurView } from "expo-blur";
import * as NavigationBar from "expo-navigation-bar";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { loadName, saveName } from "../utils/userStore";

// === Main Component ===
export default function Index() {
  // === State & Refs ===
  const [name, setName] = useState("");
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // === Effects ===
  useEffect(() => {
    // Hide navigation bar on Android
    NavigationBar.setBehaviorAsync("overlay-swipe");
    NavigationBar.setVisibilityAsync("hidden");

    // Kalau nama sudah disimpan sebelumnya, langsung ke home
    loadName().then((savedName) => {
      if (savedName) {
        router.replace("/home");
      }
    });
  }, []);

  // === Event Handlers ===
  const handleSubmit = async () => {
    if (!name.trim()) return;
    await saveName(name.trim());

    // Fade out animation before navigating
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 800,
      useNativeDriver: true,
    }).start(() => {
      router.replace("/home");
    });
  };

  // === Render / UI ===
  return (
    <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
      <ImageBackground
        source={{
          uri: "https://wallpapers.com/images/high/mixed-media-van-gogh-starry-night-window-uwyzlfcofsupmgw3.webp",
        }}
        style={styles.background}
        resizeMode="cover"
      >
        {/* Blur Layer */}
        <BlurView intensity={100} tint="dark" style={StyleSheet.absoluteFill} />

        {/* Input Container */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.container}
        >
          <View style={styles.content}>
            <Text style={styles.title}>Welcome to Lullaby,</Text>

            <TextInput
              placeholder="Enter your name"
              placeholderTextColor="rgba(232,222,248,0.5)"
              value={name}
              onChangeText={setName}
              style={styles.input}
            />

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Let's get started</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </ImageBackground>
    </Animated.View>
  );
}

// === Styles Section ===
const styles = StyleSheet.create({
  background: {
    flex: 1,
  },

  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  content: {
    width: "80%",
    alignItems: "center",
  },

  title: {
    color: "white",
    fontSize: 40,
    marginBottom: 40,
    textAlign: "center",
  },

  input: {
    borderBottomWidth: 4,
    borderBottomColor: "#E8DEF8",
    color: "white",
    textAlign: "center",
    paddingVertical: 10,
    fontSize: 16,
    width: "100%",
    marginBottom: 50,
  },

  button: {
    backgroundColor: "#E4C0F7",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 20,
  },

  buttonText: {
    color: "#3F3041",
    fontSize: 14,
  },
});