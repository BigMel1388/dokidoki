// === Imports Section ===
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Dimensions,
  ScrollView,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import * as NavigationBar from "expo-navigation-bar";
import { createClient } from "@supabase/supabase-js";
import HomeBar from "../components/HomeBar";

// === Global Constants ===
const screenWidth = Dimensions.get("window").width;

/* ✅ SUPABASE */
// === Database Client Setup ===
const supabase = createClient(
  "https://wjvjxxrgwipmarpwpebp.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indqdmp4eHJnd2lwbWFycHdwZWJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2NjExNjcsImV4cCI6MjA4OTIzNzE2N30.5z2fmWyVL5X8PImk4fLkn_M5J11YGYlGSMVOzHyqJPM"
);

// === Main Component ===
export default function IndicatorsScreen() {
  // === State Management ===
  const [temperature, setTemperature] = useState<number[]>([]);
  const [humidity, setHumidity] = useState<number[]>([]);
  const [pressure, setPressure] = useState<number[]>([]);
  const [co2, setCo2] = useState<number[]>([]);
  const [sleepScore, setSleepScore] = useState<number>(0);

  // === Helper Functions ===
  /* ✅ SAME FORMULA */
  function calculateSleepQuality(
    temp: number,
    hum: number,
    co: number,
    press: number
  ) {
    let score = 100;

    if (temp < 18 || temp > 24) score -= 25;
    if (hum < 40 || hum > 60) score -= 25;
    if (co > 800) score -= 25;
    if (press < 990 || press > 1030) score -= 10;

    return Math.max(score, 0);
  }

  // === Data Fetching ===
  const loadData = async () => {
    try {
      const { data, error } = await supabase
        .from("sensor_data")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(6);

      if (error) {
        console.log("❌ Supabase error:", error);
        return;
      }

      if (data && data.length > 0) {
        const reversed = data.reverse();

        const tempArr = reversed.map((d) => d.temperature);
        const humArr = reversed.map((d) => d.humidity);
        const presArr = reversed.map((d) => d.pressure);
        const coArr = reversed.map((d) => d.co2);

        setTemperature(tempArr);
        setHumidity(humArr);
        setPressure(presArr);
        setCo2(coArr);

        /* ✅ latest data for sleep score */
        const last = reversed[reversed.length - 1];

        const score = calculateSleepQuality(
          last.temperature,
          last.humidity,
          last.co2,
          last.pressure
        );

        setSleepScore(score);
      }
    } catch (err) {
      console.log("❌ Load error:", err);
    }
  };

  // === Effects ===
  useEffect(() => {
    // Hide navigation bar
    NavigationBar.setBehaviorAsync("overlay-swipe");
    NavigationBar.setVisibilityAsync("hidden");

    // Fetch initial data and start polling
    loadData();
    const interval = setInterval(loadData, 5000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

  // === Render / UI ===
  return (
    <ImageBackground
      source={{
        uri: "https://wallpapers.com/images/high/mixed-media-van-gogh-starry-night-window-uwyzlfcofsupmgw3.webp",
      }}
      resizeMode="cover"
      style={styles.background}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Indicators</Text>

        {/* ✅ Sleep Score */}
        <View style={styles.scoreCard}>
          <Text style={styles.scoreTitle}>Sleep Enviroment Quality</Text>
          <Text style={styles.scoreValue}>{sleepScore}%</Text>z
        </View>

        {/* Temperature */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Temperature</Text>
          <LineChart
            data={{
              labels: ["1","2","3","4","5","6"].slice(-temperature.length),
              datasets: [{ data: temperature.length ? temperature : [0] }],
            }}
            width={screenWidth - 80}
            height={150}
            withDots={false}
            chartConfig={chartConfig("#7CC4C2")}
            style={styles.chart}
          />
        </View>

        {/* Humidity */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Humidity</Text>
          <LineChart
            data={{
              labels: ["1","2","3","4","5","6"].slice(-humidity.length),
              datasets: [{ data: humidity.length ? humidity : [0] }],
            }}
            width={screenWidth - 80}
            height={150}
            withDots={false}
            chartConfig={chartConfig("#FF6B6B")}
            style={styles.chart}
          />
        </View>

        {/* Pressure */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Pressure</Text>
          <LineChart
            data={{
              labels: ["1","2","3","4","5","6"].slice(-pressure.length),
              datasets: [{ data: pressure.length ? pressure : [0] }],
            }}
            width={screenWidth - 80}
            height={150}
            withDots={false}
            chartConfig={chartConfig("#4ECDC4")}
            style={styles.chart}
          />
        </View>

        {/* CO2 */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>CO₂ level</Text>
          <LineChart
            data={{
              labels: ["1","2","3","4","5","6"].slice(-co2.length),
              datasets: [{ data: co2.length ? co2 : [0] }],
            }}
            width={screenWidth - 80}
            height={150}
            withDots={false}
            chartConfig={chartConfig("#8A78D6")}
            style={styles.chart}
          />
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <HomeBar />
    </ImageBackground>
  );
}

// === Chart Configuration ===
/* ✅ reusable chart config */
const chartConfig = (color: string) => ({
  backgroundGradientFrom: "#ffffff",
  backgroundGradientTo: "#ffffff",
  color: () => color,
  labelColor: () => "#555",
});

// === Styles Section ===
const styles = StyleSheet.create({
  background: { flex: 1 },

  container: {
    paddingTop: 80,
    paddingHorizontal: 20,
    paddingBottom: 100,
  },

  title: {
    fontSize: 38,
    fontWeight: "700",
    color: "white",
    marginBottom: 20,
  },

  scoreCard: {
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    marginBottom: 20,
  },

  scoreTitle: {
    fontSize: 16,
    fontWeight: "600",
  },

  scoreValue: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#7CC4C2",
  },

  card: {
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 18,
    padding: 15,
    marginBottom: 25,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },

  chart: {
    borderRadius: 16,
  },
});