export const RELATIONSHIPS = ["friend", "crush", "classmate", "stranger"];
export const GOALS = [
  "flirty_pg",
  "funny",
  "confident",
  "clapback_clean",
  "boundary",
  "apology",
];
export const RISKS = ["low", "medium", "high"];

export function clampVibe(value) {
  if (Number.isNaN(value)) return 0.5;
  return Math.min(1, Math.max(0, value));
}

export function buildPayload({
  theySaid,
  context,
  relationship,
  goal,
  vibe,
  length,
}) {
  return {
    theySaid: String(theySaid || "").trim(),
    context: String(context || "").trim(),
    relationship: RELATIONSHIPS.includes(relationship)
      ? relationship
      : "friend",
    goal: GOALS.includes(goal) ? goal : "funny",
    vibe: clampVibe(vibe ?? 0.5),
    length: length === "short" || length === "medium" ? length : "short",
  };
}
