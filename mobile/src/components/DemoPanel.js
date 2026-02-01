import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const DEMO_PROMPTS = [
  {
    title: "Demo #1 — IG slide-in",
    scenario:
      "Story post. Bold opener, not cringe, moves toward a plan.",
    theySaid: "Story posted (no reply yet).",
    context:
      "She posted a story (outfit/food/travel). Open with a bold one-liner that moves toward a plan. One or two lines max. No emojis.",
    relationship: "crush",
    goal: "flirty_pg",
    vibe: 1,
  },
  {
    title: "Demo #2 — Ragebait a friend",
    scenario: "Playful, quotable, obviously joking. Short.",
    theySaid: "That take is trash.",
    context:
      "Close friend. Poke back hard and bait them into arguing for fun like TikTok comments. Short. No emojis.",
    relationship: "friend",
    goal: "funny",
    vibe: 1,
  },
  {
    title: "Demo #3 — Left on read",
    scenario: "Smooth, calm, slightly savage. Not bitter.",
    theySaid: "wyd",
    context:
      "They ignored me for 2 days and now act casual. Make it clear I'm not waiting around. Short.",
    relationship: "crush",
    goal: "confident",
    vibe: 1,
  },
  {
    title: "Demo #4 — Viral clapback",
    scenario: "Public comment. Embarrass them without looking pressed.",
    theySaid: "You thought you ate 💀",
    context: "One-liner preferred. No emojis. End it.",
    relationship: "stranger",
    goal: "clapback_clean",
    vibe: 1,
  },
];

export default function DemoPanel({ onSelectPrompt }) {
  return (
    <View style={styles.demoPanel}>
      <Text style={styles.demoTitle}>Demo prompts</Text>
      <Text style={styles.demoSubtitle}>
        Tap a scenario to prefill. Then hit Anti-Cringe for a shorter rewrite.
      </Text>
      {DEMO_PROMPTS.map((prompt) => (
        <TouchableOpacity
          key={prompt.title}
          style={styles.demoCard}
          onPress={() => onSelectPrompt({ ...prompt, _ts: Date.now() })}
        >
          <Text style={styles.demoCardTitle}>{prompt.title}</Text>
          <Text style={styles.demoCardScenario}>{prompt.scenario}</Text>
          <Text style={styles.demoCardTheySaid}>“{prompt.theySaid}”</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  demoPanel: {
    width: 320,
    borderLeftWidth: 1,
    borderLeftColor: "#1E2230",
    padding: 16,
    backgroundColor: "#0A0B12",
  },
  demoTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#F8FAFC",
  },
  demoSubtitle: {
    fontSize: 12,
    color: "#9AA3B2",
    marginTop: 4,
    marginBottom: 12,
  },
  demoCard: {
    backgroundColor: "#131521",
    borderWidth: 1,
    borderColor: "#2A2F3A",
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
  },
  demoCardTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#F97066",
    marginBottom: 4,
  },
  demoCardScenario: {
    fontSize: 12,
    color: "#C9D1E4",
    marginBottom: 6,
  },
  demoCardTheySaid: {
    fontSize: 12,
    color: "#9AA3B2",
    fontStyle: "italic",
  },
});
