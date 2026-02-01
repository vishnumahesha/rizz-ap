import { StyleSheet, Text, View } from "react-native";

export default function BubblePreview({ text }) {
  return (
    <View style={styles.container}>
      <View style={styles.bubble}>
        <Text style={styles.text}>{text}</Text>
      </View>
      <View style={styles.tail} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-end",
    padding: 12,
    backgroundColor: "#10121A",
    borderRadius: 16,
  },
  bubble: {
    backgroundColor: "#B42318",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    maxWidth: "85%",
  },
  text: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  tail: {
    width: 0,
    height: 0,
    borderTopWidth: 8,
    borderTopColor: "#B42318",
    borderRightWidth: 8,
    borderRightColor: "transparent",
    marginRight: 8,
  },
});
