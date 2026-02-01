# Supabase Setup (rizz.ai)

## 1) Create project + table
1. Create a Supabase project.
2. In SQL Editor, run the SQL in `supabase/sql/favorites.sql`.

## 2) Set secrets
```bash
supabase secrets set OPENAI_API_KEY=your_key_here
```

## 3) Deploy the edge function
```bash
supabase functions deploy rizz
```

## 4) Test the function
Replace `PROJECT_REF` with your Supabase project ref.
```bash
curl -X POST https://PROJECT_REF.supabase.co/functions/v1/rizz \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "apikey: YOUR_ANON_KEY" \
  -d '{
    "theySaid": "you were kinda quiet today",
    "context": "first day back at school",
    "relationship": "classmate",
    "goal": "funny",
    "vibe": 0.4,
    "length": "short"
  }'
```

If the content is blocked, the response will include:
```json
{
  "blocked": true,
  "reason": "unsafe_request"
}
```
