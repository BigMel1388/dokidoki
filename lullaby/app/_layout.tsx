// === Imports Section ===
import * as NavigationBar from "expo-navigation-bar";
import { Stack } from "expo-router";
import { useEffect } from "react";

// === Main Component ===
export default function Layout() {

  // === Effects ===
  useEffect(() => {
    // Hide navigation bar
    NavigationBar.setBehaviorAsync("overlay-swipe");
    NavigationBar.setVisibilityAsync("hidden");
  }, []);

  // === Render / UI ===
  return <Stack screenOptions={{ headerShown: false }} />;
}