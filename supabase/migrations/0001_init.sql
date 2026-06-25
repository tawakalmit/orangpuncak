-- ============================================================
-- orangpuncak.com — skema awal
-- ============================================================

create extension if not exists "pgcrypto";

-- ---------- categories ----------
create table if not exists public.categories (
	id uuid primary key default gen_random_uuid(),
	name text not null,
	slug text not null unique,
	type text not null check (type in ('wisata', 'villa', 'kuliner')),
	created_at timestamptz not null default now()
);

-- ---------- places (wisata, villa, kuliner) ----------
create table if not exists public.places (
	id uuid primary key default gen_random_uuid(),
	kode text unique,
	name text not null,
	slug text not null,
	category_id uuid references public.categories (id) on delete set null,
	category text,
	type text not null check (type in ('wisata', 'villa', 'kuliner')),
	status text check (status in ('disewakan', 'dijual')),
	description text,
	content text,
	lokasi text,
	address text,
	lat double precision,
	lng double precision,
	cover_image text,
	gallery text[] default '{}',
	video text,
	whatsapp text,
	is_promo boolean not null default false,
	is_featured boolean not null default false,
	published boolean not null default true,

	-- villa: harga
	harga_sewa_weekday numeric,
	harga_sewa_weekend numeric,
	promo_harga_sewa_weekday numeric,
	promo_harga_sewa_weekend numeric,
	harga_jual numeric,
	harga_promo numeric,

	-- villa: spesifikasi
	jumlah_kamar_tidur int,
	jumlah_kamar_mandi int,
	jumlah_lantai int,
	kapasitas int,
	luas_tanah numeric,
	luas_bangunan numeric,
	kamar_art int,
	shm boolean,

	-- villa: fasilitas (jsonb boolean)
	facilities jsonb default '{}'::jsonb,

	-- wisata / kuliner
	jam_buka text,
	harga_tiket text,
	harga_range text,
	tips text,

	created_at timestamptz not null default now()
);

create unique index if not exists places_type_slug_idx on public.places (type, slug);
create index if not exists places_type_idx on public.places (type);
create index if not exists places_featured_idx on public.places (is_featured);
create index if not exists places_lokasi_idx on public.places (lokasi);

-- ---------- articles ----------
create table if not exists public.articles (
	id uuid primary key default gen_random_uuid(),
	title text not null,
	slug text not null unique,
	excerpt text,
	content text,
	cover_image text,
	tags text[] default '{}',
	published boolean not null default true,
	published_at timestamptz default now(),
	created_at timestamptz not null default now()
);

-- ---------- ad_leads ----------
create table if not exists public.ad_leads (
	id uuid primary key default gen_random_uuid(),
	business_name text not null,
	contact_name text not null,
	phone text not null,
	email text,
	package text not null,
	message text,
	status text not null default 'new',
	created_at timestamptz not null default now()
);

-- ============================================================
-- Row Level Security
-- ============================================================
alter table public.categories enable row level security;
alter table public.places enable row level security;
alter table public.articles enable row level security;
alter table public.ad_leads enable row level security;

-- Public read untuk konten
drop policy if exists "categories_public_read" on public.categories;
create policy "categories_public_read" on public.categories
	for select using (true);

drop policy if exists "places_public_read" on public.places;
create policy "places_public_read" on public.places
	for select using (published = true);

drop policy if exists "articles_public_read" on public.articles;
create policy "articles_public_read" on public.articles
	for select using (published = true);

-- Insert publik untuk ad_leads (form Pasang Iklan)
drop policy if exists "ad_leads_public_insert" on public.ad_leads;
create policy "ad_leads_public_insert" on public.ad_leads
	for insert with check (true);

-- Write hanya untuk authenticated (admin)
drop policy if exists "categories_admin_write" on public.categories;
create policy "categories_admin_write" on public.categories
	for all to authenticated using (true) with check (true);

drop policy if exists "places_admin_write" on public.places;
create policy "places_admin_write" on public.places
	for all to authenticated using (true) with check (true);

drop policy if exists "articles_admin_write" on public.articles;
create policy "articles_admin_write" on public.articles
	for all to authenticated using (true) with check (true);

drop policy if exists "ad_leads_admin_read" on public.ad_leads;
create policy "ad_leads_admin_read" on public.ad_leads
	for select to authenticated using (true);

drop policy if exists "ad_leads_admin_update" on public.ad_leads;
create policy "ad_leads_admin_update" on public.ad_leads
	for update to authenticated using (true) with check (true);
