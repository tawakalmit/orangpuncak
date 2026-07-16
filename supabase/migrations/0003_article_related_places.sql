-- Tambah kolom relasi places ke tabel articles
alter table public.articles
	add column if not exists related_villa_ids   uuid[] default '{}',
	add column if not exists related_wisata_ids  uuid[] default '{}',
	add column if not exists related_kuliner_ids uuid[] default '{}';

-- Tambah kolom nearby ke tabel places (jika belum ada)
alter table public.places
	add column if not exists nearby_villa_ids   uuid[] default '{}',
	add column if not exists nearby_wisata_ids  uuid[] default '{}',
	add column if not exists nearby_kuliner_ids uuid[] default '{}',
	add column if not exists meta_title         text,
	add column if not exists categories         text[] default '{}',
	add column if not exists updated_at         timestamptz;
