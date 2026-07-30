-- ============================================================
-- Surgery Department Cases Tracker - Supabase Schema
-- Run this file once, from Supabase Dashboard -> SQL Editor
-- ============================================================

-- Cases table: one row per patient case, full data stored as JSON payload
create table if not exists cases (
  id bigint primary key,
  pt_name text not null,
  consultant text,
  status text not null default 'active', -- active = still in dept, archived = discharged
  payload jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists cases_status_idx on cases (status);
create index if not exists cases_name_idx on cases (pt_name);

-- Config table: stores the customizable lists (consultants, departments) as JSON
create table if not exists app_config (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

-- Seed default consultants (up to 8) and departments — edit anytime from the app's Settings page
insert into app_config (key, value) values
  ('consultants', '["Dr. Ahmed Hassan","Dr. Mohamed Ali","Dr. Sara Youssef","Dr. Khaled Mostafa","Dr. Omar Fathy","Dr. Nour ElDin","Dr. Amr Sami","Dr. Laila Adel"]')
on conflict (key) do nothing;

insert into app_config (key, value) values
  ('departments', '["Surgery A","Surgery B","ICU 6th Floor"]')
on conflict (key) do nothing;

-- Security: RLS is on, no public policies.
-- The only access path is via the service_role key used server-side by the
-- Cloudflare Functions (which bypasses RLS). The browser never talks to
-- Supabase directly.
alter table cases enable row level security;
alter table app_config enable row level security;
