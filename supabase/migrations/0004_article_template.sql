-- Tambah kolom template ke tabel articles
-- Nilai: 'artikel' (default, tampilan biasa) atau 'hub' (tampilan lebar + direktori)
alter table public.articles
	add column if not exists template text not null default 'artikel'
		check (template in ('artikel', 'hub'));
