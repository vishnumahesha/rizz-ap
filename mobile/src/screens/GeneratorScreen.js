import { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Slider from "@react-native-community/slider";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import * as Sharing from "expo-sharing";
import ViewShot, { captureRef } from "react-native-view-shot";
import BubblePreview from "../components/BubblePreview";
import GoalChips from "../components/GoalChips";
import ReplyCard from "../components/ReplyCard";
import { useNavigation } from "@react-navigation/native";
import { generateReplies, rewriteReply } from "../lib/api";
import { buildPayload, GOALS, RELATIONSHIPS } from "../lib/validators";
import { getFavorites, toggleFavorite } from "../lib/storage";

const SAMPLE_REPLIES = [
  {
    label: "Funny",
    text: "You really woke up and chose chaos today huh",
    risk: "low",
    why: "Keeps it light and playful without escalating.",
  },
  {
    label: "Confident",
    text: "Say that with your chest and see what happens",
    risk: "medium",
    why: "Shows confidence while keeping it casual.",
  },
  {
    label: "Boundary",
    text: "Not doing this today. Let’s reset later.",
    risk: "low",
    why: "Sets a clear boundary without being harsh.",
  },
  {
    label: "Apology",
    text: "My bad. I was off earlier—can we redo that?",
    risk: "low",
    why: "Owns it and opens the door to move on.",
  },
  {
    label: "Flirty",
    text: "Okay but you’re kinda cute when you’re dramatic",
    risk: "medium",
    why: "Flirty but still PG and playful.",
  },
  {
    label: "Clapback",
    text: "Bold coming from the person who said that",
    risk: "high",
    why: "Witty comeback without going hateful.",
  },
];

function makeReplyId(reply) {
  return `${reply.label}-${reply.text}`.toLowerCase();
}

function normalizeReplies(replies) {
  return replies.map((reply) => ({
    ...reply,
    id: reply.id || makeReplyId(reply),
  }));
}

export default function GeneratorScreen({ demoPrompt }) {
  const navigation = useNavigation();
  const [theySaid, setTheySaid] = useState("");
  const [context, setContext] = useState("");
  const [relationship, setRelationship] = useState("friend");
  const [goal, setGoal] = useState("funny");
  const [vibe, setVibe] = useState(0.4);
  const [length, setLength] = useState("short");
  const [replies, setReplies] = useState(normalizeReplies(SAMPLE_REPLIES));
  const [selectedReply, setSelectedReply] = useState(null);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [blockedReason, setBlockedReason] = useState("");
  const shotRef = useRef(null);

  useEffect(() => {
    getFavorites().then(setFavorites);
  }, []);

  useEffect(() => {
    if (demoPrompt?.theySaid) {
      applyDemoPrompt(demoPrompt);
    }
  }, [demoPrompt]);

  const favoriteIds = useMemo(
    () => new Set(favorites.map((item) => item.id)),
    [favorites]
  );

  async function requestReplies(payload) {
    setLoading(true);
    setBlockedReason("");
    try {
      const result = await generateReplies(payload);
      if (result.blocked) {
        setBlockedReason(result.reason || "unsafe_request");
      }
      const nextReplies = normalizeReplies(result.replies || SAMPLE_REPLIES);
      setReplies(nextReplies);
      setSelectedReply(nextReplies[0]);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      setReplies(normalizeReplies(SAMPLE_REPLIES));
      Alert.alert("Using sample replies", "Could not reach the server.");
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } finally {
      setLoading(false);
    }
  }

  async function handleGenerate() {
    if (!theySaid.trim()) {
      Alert.alert("Add the message", "Paste what they said first.");
      return;
    }

    const payload = buildPayload({
      theySaid,
      context,
      relationship,
      goal,
      vibe,
      length,
    });
    await requestReplies(payload);
  }

  async function handleCopy(reply) {
    await Clipboard.setStringAsync(reply.text);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert("Copied", "Reply copied to clipboard.");
  }

  async function handleToggleFavorite(reply) {
    const entry = {
      id: reply.id || makeReplyId(reply),
      label: reply.label,
      text: reply.text,
      risk: reply.risk,
      why: reply.why,
    };
    const next = await toggleFavorite(entry);
    setFavorites(next);
  }

  async function handleRewrite() {
    if (!selectedReply) return;
    setLoading(true);
    try {
      const payload = buildPayload({
        theySaid,
        context,
        relationship,
        goal,
        vibe,
        length,
      });
      const result = await rewriteReply({
        ...payload,
        text: selectedReply.text,
      });
      const nextReplies = normalizeReplies(result.replies || SAMPLE_REPLIES);
      setReplies(nextReplies);
      setSelectedReply(nextReplies[0]);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      Alert.alert("Rewrite failed", "Try again in a moment.");
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setLoading(false);
    }
  }

  async function handleShare() {
    if (!shotRef.current || !selectedReply) return;
    const available = await Sharing.isAvailableAsync();
    if (!available) {
      Alert.alert("Sharing unavailable", "Your device does not support sharing.");
      return;
    }
    try {
      const uri = await captureRef(shotRef, { format: "png", quality: 0.9 });
      await Sharing.shareAsync(uri);
    } catch (error) {
      Alert.alert("Share failed", "Try again in a moment.");
    }
  }

  function applyDemoPrompt(prompt) {
    setTheySaid(prompt.theySaid);
    setContext(prompt.context);
    setRelationship(prompt.relationship);
    setGoal(prompt.goal);
    setVibe(prompt.vibe);
    setSelectedReply(null);
    const payload = buildPayload({
      theySaid: prompt.theySaid,
      context: prompt.context,
      relationship: prompt.relationship,
      goal: prompt.goal,
      vibe: prompt.vibe,
      length,
    });
    requestReplies(payload);
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.titleRow}>
        <View>
          <Text style={styles.title}>rizz.ai 😈</Text>
          <Text style={styles.subtitle}>scheming replies, zero cringe 🔥</Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate("Favorites")}
          style={styles.secondaryButton}
        >
          <Text style={styles.secondaryText}>Favorites</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>They said</Text>
      <TextInput
        value={theySaid}
        onChangeText={setTheySaid}
        placeholder="Paste the message..."
        style={styles.input}
        multiline
      />

      <Text style={styles.label}>Context (optional)</Text>
      <TextInput
        value={context}
        onChangeText={setContext}
        placeholder="Anything we should know?"
        style={styles.input}
      />

      <Text style={styles.label}>Relationship</Text>
      <View style={styles.segmented}>
        {RELATIONSHIPS.map((item) => {
          const active = relationship === item;
          return (
            <TouchableOpacity
              key={item}
              onPress={() => setRelationship(item)}
              style={[styles.segment, active && styles.segmentActive]}
            >
              <Text
                style={[
                  styles.segmentText,
                  active && styles.segmentTextActive,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.label}>Goal</Text>
      <GoalChips goals={GOALS} selectedGoal={goal} onSelect={setGoal} />

      <View style={styles.sliderRow}>
        <Text style={styles.label}>Vibe</Text>
        <Text style={styles.sliderHint}>chill → savage</Text>
      </View>
      <Slider
        value={vibe}
        onValueChange={setVibe}
        minimumValue={0}
        maximumValue={1}
        step={0.01}
        minimumTrackTintColor="#B42318"
      />

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.primaryButton, loading && styles.buttonDisabled]}
          onPress={handleGenerate}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.primaryText}>Generate</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.secondaryButton,
            (!selectedReply || loading) && styles.buttonDisabled,
          ]}
          onPress={handleRewrite}
          disabled={!selectedReply || loading}
        >
          <Text style={styles.secondaryText}>Anti-Cringe</Text>
        </TouchableOpacity>
      </View>

      {blockedReason ? (
        <Text style={styles.blockedText}>
          Safety check triggered ({blockedReason}). Showing safe replies.
        </Text>
      ) : null}

      <Text style={styles.sectionTitle}>Replies</Text>
      {replies.map((reply) => (
        <ReplyCard
          key={reply.id}
          reply={reply}
          selected={selectedReply?.id === reply.id}
          onSelect={setSelectedReply}
          onCopy={handleCopy}
          onToggleFavorite={handleToggleFavorite}
          isFavorite={favoriteIds.has(reply.id)}
        />
      ))}

      {selectedReply ? (
        <View style={styles.shareSection}>
          <Text style={styles.label}>Screenshot mode</Text>
          <ViewShot ref={shotRef} style={styles.preview}>
            <BubblePreview text={selectedReply.text} />
          </ViewShot>
          <TouchableOpacity style={styles.secondaryButton} onPress={handleShare}>
            <Text style={styles.secondaryText}>Share / Save</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#0B0B12",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#F8FAFC",
  },
  subtitle: {
    color: "#B0B7C3",
    marginBottom: 18,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#C9D1E4",
    marginTop: 14,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#2A2F3A",
    backgroundColor: "#12131B",
    borderRadius: 12,
    padding: 12,
    minHeight: 44,
    color: "#F8FAFC",
  },
  segmented: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  segment: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#2A2F3A",
    backgroundColor: "#151822",
  },
  segmentActive: {
    borderColor: "#B42318",
    backgroundColor: "#2A0E12",
  },
  segmentText: {
    fontSize: 12,
    color: "#C9D1E4",
    textTransform: "capitalize",
    fontWeight: "600",
  },
  segmentTextActive: {
    color: "#F97066",
  },
  sliderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 14,
  },
  sliderHint: {
    fontSize: 12,
    color: "#9AA3B2",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: "#B42318",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  primaryText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  secondaryButton: {
    backgroundColor: "#1B1F2A",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  secondaryText: {
    color: "#F8FAFC",
    fontWeight: "700",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  sectionTitle: {
    marginTop: 22,
    marginBottom: 12,
    fontSize: 16,
    fontWeight: "700",
    color: "#F8FAFC",
  },
  blockedText: {
    marginTop: 12,
    color: "#F97066",
    fontSize: 12,
  },
  shareSection: {
    marginTop: 16,
  },
  preview: {
    marginBottom: 10,
    borderRadius: 16,
    overflow: "hidden",
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
});
