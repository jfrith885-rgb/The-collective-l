# The Hive Mind — Show ID filter + auto-sync + spectator letter-by-letter echo + PWA

## What’s implemented
- **Show ID filter**: Operator sees only entries for the active Show ID.
- **Auto-sync**: no session code typing.
- **Operator console auto-listens**: newest entry is shown as “Latest”.
- **Spectator branding**: “The Hive Mind”.
- **Spectator reveal**: once the operator taps “Arm Spectator Reveal”, the spectator’s phone echoes the phrase **letter-by-letter** with cooldowns.
- **Web app**: PWA (Add to Home Screen).

## Show ID (how it stays invisible)
Operator uses a spectator link like:
`https://yoursite.netlify.app/?h=XXXXXXXXXX`

The spectator UI never displays the ID — it’s only used for filtering.

## Supabase table
Run this in Supabase SQL Editor:

```sql
create table if not exists public.entries (
  id uuid primary key default gen_random_uuid(),
  show_id text not null,
  entry_text text not null,
  client_token text not null,
  reveal_ready boolean default false,
  created_at timestamp with time zone default now()
);

alter table public.entries enable row level security;

create policy "allow insert"
on public.entries for insert
to anon
with check (true);
```

Do **NOT** create a SELECT policy for anon users.

## Netlify env vars
Frontend:
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY
Optional:
- VITE_PERFORMER_PIN

Functions:
- SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY
