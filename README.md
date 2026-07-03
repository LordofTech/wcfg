# WCFG — White-Glove Car Finder

Luxury vehicle sourcing website (Next.js App Router). Public inventory is static mock data; consultation leads are stored in Supabase and emailed to the team via Resend.

## Getting Started

```bash
npm install
cp .env.example .env.local
# Fill in Supabase + Resend values (see below)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Consultation leads (Supabase + Resend)

The multi-step form posts to `POST /api/consultation`, which:

1. Validates the payload
2. Inserts a row into `consultation_leads` (service role, RLS denies public access)
3. Emails lead details to `jamail@wcfgbizbrokers.com` (configurable via `LEADS_NOTIFY_EMAIL`)

If email delivery fails after a successful insert, the API still returns success so leads are never lost.

### 1. Create a Supabase project

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard) and create a project
2. Open **SQL Editor** → New query
3. Paste and run `supabase/migrations/001_consultation_leads.sql`
4. Open **Project Settings → API** and copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` `public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` `secret` key → `SUPABASE_SERVICE_ROLE_KEY` (**server only**)

### 2. Create a Resend API key

1. Go to [https://resend.com/api-keys](https://resend.com/api-keys) and create an API key
2. Set `RESEND_API_KEY`
3. For production, verify `wcfgbizbrokers.com` in Resend and set:
   - `RESEND_FROM_EMAIL=WCFG Consultations <leads@wcfgbizbrokers.com>` (or another verified address)
4. Until the domain is verified, you can test with `onboarding@resend.dev` (Resend may only deliver to your Resend account email in that mode)

### 3. Environment variables

Copy `.env.example` to `.env.local`:

| Variable | Required | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Recommended | Public anon key (not used for inserts) |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Server-only insert access |
| `RESEND_API_KEY` | Yes (for email) | Lead is still saved if missing |
| `RESEND_FROM_EMAIL` | Optional | Defaults to `WCFG Consultations <onboarding@resend.dev>` |
| `LEADS_NOTIFY_EMAIL` | Optional | Defaults to `jamail@wcfgbizbrokers.com` |

### 4. Vercel production env

In the Vercel project **wcfg** → **Settings → Environment Variables**, add the same keys for Production (and Preview if desired). Redeploy after saving.

Without Supabase env vars, the form shows a graceful error and does not lose the multi-step UX (user can retry).

## Table schema (`consultation_leads`)

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` | PK, `gen_random_uuid()` |
| `full_name` | `text` | not null |
| `phone` | `text` | not null |
| `marque` | `text` | not null |
| `budget_range` | `text` | not null |
| `delivery_location` | `text` | not null |
| `status` | `text` | default `'new'` |
| `source` | `text` | default `'website'` |
| `created_at` | `timestamptz` | default `now()` |

RLS is enabled with **no public policies**. Only the service role (API route) can read/write.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```
