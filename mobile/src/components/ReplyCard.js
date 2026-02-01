import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import RiskTag from "./RiskTag";

export default function ReplyCard({
  reply,
  selected,
  onSelect,
  onCopy,
  onToggleFavorite,
  isFavorite,
}) {
  return (
    <TouchableOpacity onPress={() => onSelect(reply)} style={styles.wrapper}>
      <View style={[styles.card, selected && styles.cardSelected]}>
        <View style={styles.header}>
          <Text style={styles.label}>{reply.label}</Text>
          <RiskTag risk={reply.risk} />
        </View>
        <Text style={styles.text}>{reply.text}</Text>
        <Text style={styles.why}>{reply.why}</Text>
        <View style={styles.actions}>
          <TouchableOpacity onPress={() => onCopy(reply)} style={styles.action}>
            <Text style={styles.actionText}>Copy</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onToggleFavorite(reply)}
            style={styles.action}
          >
            <Text style={styles.actionText}>
              {isFavorite ? "Saved" : "Save"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#12131B",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#2A2F3A",
  },
  cardSelected: {
    borderColor: "#B42318",
    shadowColor: "#B42318",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
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
