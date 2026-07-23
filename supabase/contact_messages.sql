-- Tabel untuk menampung pesan dari form kontak di halaman /kontak
-- Jalankan query ini di Supabase SQL Editor

create table if not exists public.contact_messages (
  id          uuid primary key default gen_random_uuid(),
  nama        text not null,
  pesan       text not null,
  ip_address  text,
  status      text not null default 'new',  -- 'new' | 'read' | 'archived'
  created_at  timestamptz not null default now()
);

-- Index untuk query di dashboard (filter by status, sort by created_at)
create index if not exists contact_messages_status_idx on public.contact_messages (status);
create index if not exists contact_messages_created_at_idx on public.contact_messages (created_at desc);

-- RLS: aktifkan Row Level Security
alter table public.contact_messages enable row level security;

-- Policy INSERT: siapa saja bisa mengirim pesan (public)
create policy "Anyone can insert contact messages"
  on public.contact_messages
  for insert
  to anon, authenticated
  with check (true);

-- Policy SELECT: hanya authenticated user (admin) yang bisa membaca
create policy "Authenticated users can read contact messages"
  on public.contact_messages
  for select
  to authenticated
  using (true);

-- Policy UPDATE: hanya authenticated user (admin) yang bisa update status
create policy "Authenticated users can update contact messages"
  on public.contact_messages
  for update
  to authenticated
  using (true)
  with check (true);

-- Policy DELETE: hanya authenticated user (admin) yang bisa hapus
create policy "Authenticated users can delete contact messages"
  on public.contact_messages
  for delete
  to authenticated
  using (true);
