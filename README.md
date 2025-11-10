# Café & Stories — Aesthetic Café + Fiction Books (Auth + Cart + Optional Reservations)
Pages:
- Home (`index.html`) with animated mascots, pastel UI, emojis
- Registration, Login, Profile, Settings
- Cart (user-specific via Supabase table with RLS)
- Optional Vercel serverless `/api/reserve` for table bookings

Setup Supabase:
- Fill `js/config.js` with your Project URL and anon key.
- In Supabase SQL editor, run:
```
create table if not exists cart_items (
  id bigserial primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  item_name text not null,
  price numeric not null,
  qty integer not null default 1,
  created_at timestamptz not null default now()
);
alter table cart_items enable row level security;
create policy "Users can manage own cart"
on cart_items for all to authenticated
using (user_id = auth.uid()) with check (user_id = auth.uid());
```
Optional reservations (Postgres):
- Add Vercel env var `POSTGRES_URL`, create table `reservations` (see earlier messages).
Deploy: push to GitHub → Vercel (Framework: Other, Build: empty, Output: /).
