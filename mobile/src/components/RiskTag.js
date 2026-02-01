import { StyleSheet, Text, View } from "react-native";

const COLORS = {
  low: "#F97066",
  medium: "#FDB022",
  high: "#B42318",
};

export default function RiskTag({ risk }) {
  const color = COLORS[risk] || COLORS.low;
  return (
    <View style={[styles.tag, { borderColor: color }]}>
      <Text style={[styles.text, { color }]}>{risk}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    borderWidth: 1,
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  text: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "capitalize",
  },
});
