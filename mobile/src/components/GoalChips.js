import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const GOAL_LABELS = {
  flirty_pg: "Flirty (PG)",
  funny: "Funny",
  confident: "Confident",
  clapback_clean: "Clapback",
  boundary: "Boundary",
  apology: "Apology",
};

export default function GoalChips({ goals, selectedGoal, onSelect }) {
  return (
    <View style={styles.container}>
      {goals.map((goal) => {
        const active = goal === selectedGoal;
        return (
          <TouchableOpacity
            key={goal}
            onPress={() => onSelect(goal)}
            style={[styles.chip, active && styles.chipActive]}
          >
            <Text style={[styles.text, active && styles.textActive]}>
              {GOAL_LABELS[goal] || goal}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    borderColor: "#2A2F3A",
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#151822",
  },
  chipActive: {
    borderColor: "#B42318",
    backgroundColor: "#2A0E12",
  },
  text: {
    fontSize: 13,
    fontWeight: "600",
    color: "#C9D1E4",
  },
  textActive: {
    color: "#F97066",
  },
});
