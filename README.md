# Brado Training Center

Marketing site, member booking, and admin desk for Brado Training Center (Piraeus).

## Stack

- Next.js 16 (App Router) + TypeScript + Tailwind
- [next-intl](https://next-intl.dev) — Greek (default) + English
- [Supabase](https://supabase.com) — Auth, Postgres, Storage (EU region recommended)
- [Resend](https://resend.com) — transactional email (optional locally)

## Local development

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000/el](http://localhost:3000/el).

## Supabase setup

1. Create a project in **Frankfurt (eu-central-1)**.
2. Run SQL migrations in order from [`supabase/migrations/`](supabase/migrations/) in the SQL editor (or use the Supabase CLI).
3. **Storage**: create buckets `medical-docs` (private) and `avatars` (public). Policies:
   - `medical-docs`: users can upload to `{user_id}/*`; admins read via service role.
   - `avatars`: public read; users upload to `{user_id}/*`.
4. **Auth**: enable email/password sign-up.
5. Copy project URL, anon key, and service role key into `.env.local`.
6. Set `ADMIN_EMAILS` to the gym owner’s email (first signup with that email gets `admin` + auto-approval).

## Booking rules

- 1-hour sessions; starts every 30 minutes (`:00` and `:30`).
- Max **8 people in the room at once** (30-minute bucket occupancy).
- Weekday hours 08:00–23:00; Saturday 09:00–18:00; Sunday closed (configurable via `closed_days`).

## Deploy (budget-friendly)

1. Push to GitHub.
2. Import on [Vercel](https://vercel.com) (Hobby tier).
3. Add the same env vars in Vercel.
4. Point your domain via Cloudflare (Registrar + DNS + optional Email Routing).

## Phase 2

Mobile app (Expo) can reuse the same Supabase project and Auth.
