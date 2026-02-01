import { assertConfig, SUPABASE_ANON_KEY, SUPABASE_URL } from "./config";

async function postRizz(payload) {
  assertConfig();
  const response = await fetch(`${SUPABASE_URL}/functions/v1/rizz`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      apikey: SUPABASE_ANON_KEY,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Request failed");
  }

  return response.json();
}

export async function generateReplies(payload) {
  return postRizz({ ...payload, mode: "generate" });
}

export async function rewriteReply(payload) {
  return postRizz({ ...payload, mode: "rewrite" });
}
