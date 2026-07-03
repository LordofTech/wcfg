-- Consultation leads from the public website form.
-- Run this in the Supabase SQL Editor (Dashboard → SQL → New query).

create extension if not exists "pgcrypto";

create table if not exists public.consultation_leads (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  marque text not null,
  budget_range text not null,
  delivery_location text not null,
  status text not null default 'new',
  source text not null default 'website',
  created_at timestamptz not null default now()
);

comment on table public.consultation_leads is
  'Inbound white-glove consultation requests from the WCFG website.';

-- Deny all direct client access. Inserts go through the Next.js API route
-- using the service role key (bypasses RLS).
alter table public.consultation_leads enable row level security;

-- No policies for anon/authenticated: public cannot SELECT or INSERT directly.
-- Service role (server-side only) retains full access.

create index if not exists consultation_leads_created_at_idx
  on public.consultation_leads (created_at desc);

create index if not exists consultation_leads_status_idx
  on public.consultation_leads (status);
