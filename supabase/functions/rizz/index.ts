import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const DEFAULT_REPLIES = [
  {
    label: "Funny",
    text: "You really woke up and chose chaos today huh",
    risk: "low",
    why: "Keeps it playful without escalating.",
  },
  {
    label: "Confident",
    text: "Say that with your chest and see what happens",
    risk: "medium",
    why: "Shows confidence while staying casual.",
  },
  {
    label: "Boundary",
    text: "Not doing this today. Let’s reset later.",
    risk: "low",
    why: "Sets a boundary without being harsh.",
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
    why: "Flirty but still PG and light.",
  },
  {
    label: "Clapback",
    text: "Bold coming from the person who said that",
    risk: "high",
    why: "Witty comeback without going hateful.",
  },
];

const SAFE_BOUNDARY_REPLIES = [
  {
    label: "Boundary",
    text: "I’m not cool with this. Let’s switch it up.",
    risk: "low",
    why: "Clear boundary without escalating.",
  },
  {
    label: "Boundary",
    text: "Not going there. Keep it respectful.",
    risk: "low",
    why: "Direct and calm.",
  },
  {
    label: "Boundary",
    text: "I’m gonna pass on that. Let’s keep it chill.",
    risk: "low",
    why: "Shifts tone away from conflict.",
  },
  {
    label: "Boundary",
    text: "That’s not okay with me. Let’s move on.",
    risk: "low",
    why: "Sets the line and exits.",
  },
  {
    label: "Boundary",
    text: "I’m not engaging with that. Try again later.",
    risk: "low",
    why: "Protects you without clapping back.",
  },
  {
    label: "Boundary",
    text: "Nope. I’m good.",
    risk: "low",
    why: "Short and firm.",
  },
];

const UNSAFE_PATTERNS = [
  /kill/i,
  /suicide/i,
  /rape/i,
  /nude/i,
  /sex/i,
  /nazi/i,
  /faggot/i,
  /bitch/i,
  /whore/i,
  /slur/i,
  /threat/i,
];

function isUnsafe(text: string) {
  return UNSAFE_PATTERNS.some((pattern) => pattern.test(text));
}

function normalizeReplies(replies: any[]) {
  if (!Array.isArray(replies)) return DEFAULT_REPLIES;
  const next = replies
    .filter((reply) => reply && typeof reply === "object")
    .map((reply) => ({
      label: String(reply.label || "Reply").slice(0, 24),
      text: String(reply.text || "").slice(0, 240),
      risk: ["low", "medium", "high"].includes(reply.risk)
        ? reply.risk
        : "low",
      why: String(reply.why || "").slice(0, 140),
    }))
    .filter((reply) => reply.text && reply.why);

  return next.length >= 3 ? next.slice(0, 6) : DEFAULT_REPLIES;
}

async function callOpenAI(payload: Record<string, unknown>) {
  const apiKey = Deno.env.get("OPENAI_API_KEY");
  if (!apiKey) {
    return { replies: DEFAULT_REPLIES };
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    return { replies: DEFAULT_REPLIES };
  }

  return response.json();
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const {
      theySaid,
      context = "",
      relationship,
      goal,
      vibe,
      length,
      mode = "generate",
      text = "",
    } = body || {};

    if (!theySaid || typeof theySaid !== "string") {
      return new Response(
        JSON.stringify({ replies: DEFAULT_REPLIES }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const combined = `${theySaid} ${context} ${text}`;
    if (isUnsafe(combined)) {
      return new Response(
        JSON.stringify({
          blocked: true,
          reason: "unsafe_request",
          replies: SAFE_BOUNDARY_REPLIES,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const systemPrompt = [
      "You write short, human-sounding text replies for teens.",
      "No slurs, hate, threats, harassment, or sexual content.",
      "Keep it casual, not robotic. No emojis unless needed.",
      "Return ONLY strict JSON with this shape:",
      '{"replies":[{"label":"Funny","text":"...","risk":"low","why":"..."}]}',
      "Provide exactly 6 distinct replies.",
      "Each reply must include: label, text, risk (low|medium|high), why.",
      "Risk is about how likely it escalates the situation.",
    ].join(" ");

    const userPrompt = [
      `They said: "${theySaid}"`,
      context ? `Context: "${context}"` : "Context: (none)",
      `Relationship: ${relationship}`,
      `Goal: ${goal}`,
      `Vibe (0 chill → 1 savage): ${vibe}`,
      `Length: ${length}`,
      mode === "rewrite"
        ? `Rewrite this reply to be more natural and short: "${text}"`
        : "Generate replies.",
    ].join("\n");

    const completion = await callOpenAI({
      model: "gpt-4o-mini",
      temperature: 0.8,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
    });

    const content =
      completion?.choices?.[0]?.message?.content ?? JSON.stringify(completion);
    let parsed: any = null;
    try {
      parsed = JSON.parse(content);
    } catch (_error) {
      parsed = completion;
    }

    const replies = normalizeReplies(parsed?.replies || []);

    return new Response(JSON.stringify({ replies }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ replies: DEFAULT_REPLIES }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
