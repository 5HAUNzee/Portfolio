create extension if not exists pgcrypto;

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

alter table public.contact_messages enable row level security;

drop policy if exists "Allow inserts for contact form" on public.contact_messages;
create policy "Allow inserts for contact form"
  on public.contact_messages
  for insert
  to anon, authenticated
  with check (true);
