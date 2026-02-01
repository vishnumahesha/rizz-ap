import { useCallback, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import { useFocusEffect } from "@react-navigation/native";
import RiskTag from "../components/RiskTag";
import { getFavorites, removeFavorite } from "../lib/storage";

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState([]);

  useFocusEffect(
    useCallback(() => {
      getFavorites().then(setFavorites);
    }, [])
  );

  async function handleCopy(item) {
    await Clipboard.setStringAsync(item.text);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert("Copied", "Reply copied to clipboard.");
  }

  async function handleDelete(id) {
    const next = await removeFavorite(id);
    setFavorites(next);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favorites</Text>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.empty}>No favorites yet.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.header}>
              <Text style={styles.label}>{item.label}</Text>
              <RiskTag risk={item.risk} />
            </View>
            <Text style={styles.text}>{item.text}</Text>
            <Text style={styles.why}>{item.why}</Text>
            <View style={styles.actions}>
              <TouchableOpacity
                onPress={() => handleCopy(item)}
                style={styles.action}
              >
                <Text style={styles.actionText}>Copy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDelete(item.id)}
                style={styles.action}
              >
                <Text style={styles.actionText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0B12",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 12,
    color: "#F8FAFC",
  },
  empty: {
    color: "#9AA3B2",
    marginTop: 24,
  },
  card: {
    backgroundColor: "#12131B",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#2A2F3A",
    marginBottom: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#F8FAFC",
  },
  text: {
    fontSize: 16,
    color: "#E5E7EB",
    marginBottom: 6,
  },
  why: {
    fontSize: 12,
    color: "#9AA3B2",
    marginBottom: 12,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  action: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: "#1B1F2A",
  },
  actionText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#F8FAFC",
  },
});
