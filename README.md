# Mindreader Netlify (React + Supabase + Netlify Function)

## What this is
- `/` Spectator page: type anything, "Lock it in" (inserts into Supabase)
- `/performer` Performer console: enter session code, see the latest entry (reads via Netlify Function)
- Netlify Function uses a Supabase **Service Role Key** so the audience cannot read entries directly.

## Required Supabase table
Create `entries` with:
- id uuid pk default gen_random_uuid()
- session_code text
- entry_text text
- created_at timestamp default now()

Enable RLS. Create INSERT policy for anon. Do NOT create SELECT policy for anon.

## Environment variables (Netlify Site settings -> Environment variables)
Frontend (build-time):
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY

Functions (server-side):
- SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY

## Deploying on Netlify
### Recommended (functions supported)
1. Drag this folder into GitHub (or upload as a repo)
2. In Netlify: "Add new site" -> "Import from Git"
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Functions directory: `netlify/functions` (also set in netlify.toml)

### About Drag & Drop deploy
Netlify's manual drag-and-drop deploy is for **static sites only**.
Serverless functions generally require a proper build/deploy pipeline.
So use the Git-based deploy (recommended) if you want `/performer` to work.

## Local dev
1. `npm install`
2. `npm run dev`
