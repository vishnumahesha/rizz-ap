# rizz.ai — Project Basis + Full Build Plan (Hackathon-Ready)

## 1) What rizz.ai is
rizz.ai is a mobile app that helps you reply to any text message when you don’t know what to say. You paste what someone sent you, choose the situation (friend/crush/classmate/stranger), pick your goal (flirty, funny, confident, clapback, boundary, apology), and set a “vibe” slider (chill → savage). The app generates 6 reply options that sound like real texts, not AI. Each reply includes:

- Label (Funny / Confident / etc.)
- Risk meter (low/medium/high) to prevent accidental escalation
- One-line “why this works” explanation to teach communication skills

Teen-friendly and safe by default: avoids slurs, hate, threats, and sexual content.

## 2) Why it wins a teen-vote hackathon
- Instant wow: paste message → 6 usable replies in seconds
- Social + viral: screenshot-style reply bubble + share/copy
- “Not cringe” focus: short, realistic phrasing with an Anti-Cringe rewrite button
- Responsible/friendly vibe: clapbacks are witty, not hateful

## 3) Features

### Core (MVP)
1. Generate replies
   - Input: “They said” (paste message)
   - Optional: “Context” (1 line)
   - Relationship: friend / crush / classmate / stranger
   - Goal chips: flirty (PG), funny, confident, clapback (clean), boundary, apology
   - Vibe slider: chill ↔ savage
   - Output: 6 reply cards with copy button

2. Anti-Cringe button
   - Rewrite a selected reply to sound more natural/short/real
   - Preserves meaning, removes AI vibe, avoids try-hard tone

3. Screenshot mode (shareable)
   - iMessage-style bubble preview for chosen reply
   - One tap to share or save

4. Favorites
   - Save favorite replies
   - View favorites list and copy again

### Optional (only if time remains)
- “Daily top replies” or “trending styles” (local-only)
- Style presets: dry / energetic / minimal / no emojis
- Light haptics + sound toggle

## 4) Safety + boundaries (non-negotiable)
- PG-13 by default
- No slurs, hate, threats, harassment, sexual content
- If user tries unsafe content: refuse and provide safe boundary options instead
- Disclaimer: “rizz.ai helps with communication. Don’t use it to harass people.”

## 5) Product scope rules (avoid overbuilding)

We will NOT build:
- Real-time chat
- Dating profiles
- Image generation
- Identity verification
- Complex moderation dashboards
- Long onboarding

We WILL build:
- One main screen that works perfectly
- Clean UI + fast generation + copy/share loops

## 6) Architecture
- Mobile UI built in Expo
- Backend + database in Supabase
- AI requests go through a Supabase Edge Function (no API keys in app)
- Favorites stored in Supabase or local storage if time is tight

Key principle: the mobile app never calls an AI provider directly.
Calls: `POST /functions/v1/rizz` and receives strict JSON.

## 7) Data model (minimal)

### Table: `favorites`
- `id` (uuid)
- `created_at` (timestamp)
- `user_id` (text) — for hackathon can be device id; later can be auth uid
- `label` (text)
- `text` (text)
- `risk` (text: low|medium|high)
- `why` (text)

Optional later:
- `runs` (analytics / leaderboard)
- `profiles` (style presets)

## 8) API contract

### Request payload (app → edge function)
```json
{
  "theySaid": "string",
  "context": "string | empty",
  "relationship": "friend|crush|classmate|stranger",
  "goal": "flirty_pg|funny|confident|clapback_clean|boundary|apology",
  "vibe": 0.0-1.0,
  "length": "short|medium"
}
```

### Response payload (edge function → app)
```json
{
  "replies": [
    { "label": "Funny", "text": "...", "risk": "low", "why": "..." }
  ]
}
```

If unsafe input:
```json
{
  "blocked": true,
  "reason": "unsafe_request",
  "replies": [
    { "label": "Boundary", "text": "...", "risk": "low", "why": "..." }
  ]
}
```

## 9) UI plan (screens)

### Screen 1: Generator (main)
Top:
- App name: rizz.ai
- Input box: “They said…”
- Context (optional): “Context…”

Controls:
- Relationship segmented control
- Goal chips
- Vibe slider (chill ↔ savage)

Buttons:
- Generate (primary)
- Anti-Cringe (secondary; enabled only when a reply is selected)

Results:
- 6 reply cards:
  - Label
  - Reply text
  - Risk tag
  - Why line
  - Copy button
  - Favorite star

Bottom:
- Screenshot Mode button when a reply is selected

### Screen 2: Favorites
- List of saved replies
- Tap to copy
- Delete option

## 10) Implementation plan (step-by-step)

### Step A — Project setup (mobile)
1. Create Expo app project
2. Install dependencies:
   - Navigation
   - Clipboard + haptics
   - View-shot + sharing
   - Supabase client
3. Create folder structure:
   - `/src/screens` (Generator, Favorites)
   - `/src/components` (ReplyCard, GoalChips, RiskTag, BubblePreview)
   - `/src/lib` (supabase.ts, api.ts, validators.ts)

### Step B — Supabase setup
1. Create Supabase project
2. Copy Project URL + anon key
3. Create favorites table (SQL Editor)
4. Create Edge Function `rizz`
5. Add secret env var for AI provider key
6. Deploy function and test with sample input

### Step C — Edge Function logic
1. Validate payload
2. Run safety filter on user input (basic)
3. Build strict prompt that forces:
   - Short, human texting style
   - No hateful/sexual/threat content
   - 6 distinct replies
   - Risk + why fields
4. Return JSON only (no markdown)

### Step D — Mobile app core loop
1. Build Generator screen UI
2. Implement `generateReplies()` call to edge function
3. Display loading + error state + fallback sample replies
4. Implement copy-to-clipboard + toast
5. Implement favorite save/remove

### Step E — “Make it win” polish
1. Anti-Cringe rewrite endpoint (same function with `mode="rewrite"`)
2. Screenshot Mode bubble preview + share
3. Haptics on generate success, copy, error

### Step F — Demo readiness checklist
- Works with no account
- Works with no favorites (still wins)
- Always returns something (fallback)
- Demo script:
  1. Paste awkward text
  2. Pick Crush + Flirty PG
  3. Generate, copy, screenshot
  4. Switch to Boundary, generate again

## 11) Success criteria
- Replies sound like real teens: short, not formal, not robotic
- 6 outputs are genuinely different
- UI feels clean + fast + satisfying
- Safety is visible but not annoying
- Sharing is one tap, screenshot-ready

## 12) Notes for building fast in Cursor
- Build Generator screen first, even if backend returns hardcoded sample JSON
- Replace with real Edge Function call
- Only after that add Favorites + Screenshot Mode
