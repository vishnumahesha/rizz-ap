import { Platform, StyleSheet, View } from "react-native";

export default function PhoneFrame({ children }) {
  if (Platform.OS !== "web") {
    return <View style={styles.native}>{children}</View>;
  }

  return (
    <View style={styles.webShell}>
      <View style={styles.webFrame}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  native: {
    flex: 1,
  },
  webShell: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#05060A",
    padding: 24,
  },
  webFrame: {
    width: 390,
    height: 844,
    backgroundColor: "#0B0B12",
    borderRadius: 32,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.12)",
    shadowColor: "#000000",
    shadowOpacity: 0.35,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
  },
});
