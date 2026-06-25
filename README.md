# orangpuncak.com

Media & direktori wisata kawasan **Puncak** (Bogor & Cianjur): tempat wisata,
villa & penginapan, kuliner, artikel/event, dan tips perjalanan. Fokus konversi
ke WhatsApp (Booking / Konsultasi / Survey / Reservasi) dan form **Pasang Iklan**.

Dibangun dengan **SvelteKit (Svelte 5 + TypeScript)**, **Tailwind CSS v3.4**,
**Supabase**, dan **Swiper.js**. Mobile-first, responsif penuh, siap deploy ke Vercel.

## Fitur

- **Home** — banner Swiper (autoplay 8s, loop), grid unggulan, ringkasan cara booking, highlight artikel, CTA eksplor & pasang iklan.
- **Wisata / Kuliner** — grid + filter (kategori, lokasi, search) + halaman detail (info, tips, galeri Swiper, Google Maps, "lainnya").
- **Villa** — replika penuh flow katalog: sidebar filter desktop + panel filter mobile slide-in, **filter benar-benar berfungsi** (lokasi, jumlah kamar, fasilitas, keyword, status). Detail villa lengkap: banner + tombol WA kondisional (Booking/Konsultasi/Survey), harga kondisional (sewa weekday/weekend, jual, harga coret saat promo), fasilitas, spesifikasi, galeri, video YouTube, peta, villa lainnya.
- **Artikel** — daftar + detail rich text + tombol share sosial media.
- **Pasang Iklan** — paket kerjasama + form lead (disimpan ke Supabase `ad_leads`).
- **Halaman pendukung** — Cara Booking, Cara Survey, Tentang, Kontak.
- **SEO** — meta title/description dinamis + Open Graph (`og:locale=id_ID`) & Twitter Card, `sitemap.xml` (dengan `lastmod`, `changefreq`, `priority`), `robots.txt` (admin di-`Disallow`), schema.org JSON-LD (LodgingBusiness/TouristAttraction/Restaurant/Article + BreadcrumbList), judul list dinamis (menyertakan jumlah item), dan OG image fallback global. Halaman `/admin` di-`noindex`.

> **OG image:** fallback default ada di `static/og-default.svg`. Untuk kompatibilitas maksimal di Facebook/LinkedIn, ganti dengan PNG/JPG berukuran 1200×630 lalu sesuaikan `DEFAULT_OG_IMAGE` di `src/lib/config.ts`.

> **Mode demo:** bila env Supabase belum diisi, aplikasi otomatis memakai seed
> lokal di `src/lib/data/seed.ts` sehingga semua halaman langsung tampil.

## Prasyarat

- Node.js 18+ (direkomendasikan 20/22)
- pnpm (`corepack enable && corepack prepare pnpm@latest --activate`)

## Setup

```bash
# 1. Install dependencies
pnpm install

# 2. Salin env & isi nilai (opsional untuk mode demo)
cp .env.example .env
```

Variabel di `.env`:

| Variabel | Keterangan |
|---|---|
| `PUBLIC_SUPABASE_URL` | URL project Supabase |
| `PUBLIC_SUPABASE_ANON_KEY` | Anon key Supabase |
| `PUBLIC_WHATSAPP_NUMBER` | Nomor WA tujuan, format internasional (mis. `6281234567890`) |
| `PUBLIC_SITE_URL` | Base URL situs (untuk sitemap & Open Graph) |

## Panel Admin

Panel admin tersedia di **`/admin`** (CRUD direktori & artikel, kelola leads, upload gambar via Cloudinary). Memerlukan Supabase aktif.

### Aktifkan
1. Isi `.env`: `PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`.
2. Jalankan `supabase/migrations/0001_init.sql` + `supabase/seed.sql`.
3. Buat user admin di Supabase: **Authentication → Users → Add user** (isi email & password, centang auto-confirm).
4. (Upload gambar) Isi `PUBLIC_CLOUDINARY_CLOUD_NAME` & `PUBLIC_CLOUDINARY_UPLOAD_PRESET`.
5. Restart `pnpm dev`, buka **`/admin/login`**.

> Tanpa Supabase, `/admin` otomatis diarahkan ke `/admin/setup` berisi panduan ini.

### Cloudinary (upload gambar)
- Buat akun di [cloudinary.com](https://cloudinary.com).
- Dashboard → **Settings → Upload → Upload presets** → tambah preset baru, set **Signing Mode = Unsigned**, simpan nama preset.
- Catat **Cloud name** (di dashboard utama) dan **nama preset** unsigned tadi, lalu isi ke `.env`.
- Komponen upload mengirim file langsung dari browser ke Cloudinary (unsigned) dan menyimpan `secure_url` ke database. Bila Cloudinary belum diisi, tersedia fallback tempel-URL manual.

### Fitur admin
- **Dashboard** — ringkasan jumlah villa/wisata/kuliner/artikel/leads.
- **Direktori** — CRUD `places` (form adaptif: field villa muncul saat tipe = villa, termasuk harga sewa/jual, spesifikasi, dan fasilitas).
- **Artikel** — CRUD artikel + tags + cover. Field **konten memakai editor WYSIWYG** (Tiptap: bold, italic, heading, list, quote, link) yang menghasilkan HTML, dirender dengan styling `@tailwindcss/typography` (`prose`).
- **Leads Iklan** — lihat pengajuan dari form Pasang Iklan, ubah status (new/contacted/deal/rejected), tombol balas WhatsApp.

Keamanan: route `/admin/**` diproteksi di `src/hooks.server.ts` (sesi cookie Supabase via `@supabase/ssr`); operasi tulis lewat policy RLS `authenticated`.

## Database (Supabase)

Jalankan migrasi & seed di SQL Editor Supabase, atau via Supabase CLI:

```bash
# Via SQL Editor: tempel isi file berikut secara berurutan
supabase/migrations/0001_init.sql
supabase/seed.sql

# Atau via Supabase CLI (jika project sudah di-link)
supabase db push
psql "$DATABASE_URL" -f supabase/seed.sql
```

Skema mengaktifkan **RLS**: public read untuk konten published, insert publik
untuk `ad_leads`, dan write penuh hanya untuk user `authenticated` (admin).

## Menjalankan

```bash
pnpm dev          # development di http://localhost:5173
pnpm build        # build produksi
pnpm preview      # preview hasil build
pnpm check        # type-check svelte-check
```

## Deploy ke Vercel

Proyek memakai `@sveltejs/adapter-vercel` (runtime `nodejs20.x`), jalan sebagai
serverless function — SSR penuh aktif (penting untuk SEO & panel admin).

### Langkah
1. Push repo ke GitHub/GitLab, lalu **Import Project** di Vercel.
2. Vercel otomatis mendeteksi SvelteKit (build: `vite build`, package manager: pnpm via `pnpm-lock.yaml`).
3. Tambahkan **Environment Variables** (Settings → Environment Variables) untuk environment Production (dan Preview bila perlu):

   | Variabel | Contoh nilai |
   |---|---|
   | `PUBLIC_SUPABASE_URL` | `https://xxxx.supabase.co` |
   | `PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGci...` (anon key) |
   | `PUBLIC_WHATSAPP_NUMBER` | `6281234567890` |
   | `PUBLIC_CLOUDINARY_CLOUD_NAME` | `nama-cloud` |
   | `PUBLIC_CLOUDINARY_UPLOAD_PRESET` | `preset-unsigned` |
   | `PUBLIC_SITE_URL` | `https://orangpuncak.com` |

4. **Deploy.**
5. Setelah live, tambahkan domain `orangpuncak.com` di Settings → Domains dan arahkan DNS sesuai instruksi Vercel.

### Setelah deploy
- Pastikan `supabase/migrations/0001_init.sql` + `seed.sql` sudah dijalankan di project Supabase, dan user admin sudah dibuat (Authentication → Users).
- Di **Supabase → Authentication → URL Configuration**, tambahkan domain produksi (`https://orangpuncak.com`) ke Site URL / Redirect URLs.
- Di **Cloudinary**, pastikan upload preset berstatus *unsigned*.
- Cek `https://orangpuncak.com/sitemap.xml` dan `robots.txt` dapat diakses, lalu daftarkan sitemap di Google Search Console.

> **Catatan:** saat build mungkin muncul warning `@opentelemetry/api` (peer dependency opsional Supabase) — aman diabaikan, tidak memengaruhi aplikasi.

## Struktur Proyek

```
src/
  lib/
    components/      Navbar, Footer, Card, Banner, Gallery, Carousel, Breadcrumb, Seo
    data/            seed.ts (data contoh) + index.ts (akses data Supabase/seed)
    utils/           format.ts (Rupiah, maps, youtube), whatsapp.ts (deep link)
    config.ts        konstanta situs & nomor WA
    types.ts         tipe data
    supabaseClient.ts
  routes/
    +layout.svelte   Navbar + Footer
    +page.svelte     Home
    wisata/          list + [slug] detail
    villa/           list (filter) + [kode] detail
    kuliner/         list + [slug] detail
    artikel/         list + [slug] detail
    iklan/           paket + form lead
    cara-booking/, cara-survey/, tentang/, kontak/
    sitemap.xml/     endpoint sitemap
supabase/
  migrations/0001_init.sql
  seed.sql
```

## Design System

Token warna terdaftar di `tailwind.config.js` (`theme.extend.colors`):

| Token | Hex | Pemakaian |
|---|---|---|
| `brand` | `#3E797C` | Navbar, footer, tombol utama, judul section |
| `cream` | `#FAECD9` | Background body |
| `accent` | `#F1C40F` | Badge promo, bar credit, hover CTA |
| `accent-alt` | `#F9C74F` | Tombol filter |
| `muted` | `#ecf0f1` | Background section CTA |
| `ink` | `#2c3e50` | Teks gelap |

Font: heading **Poppins**, body **Inter** (Google Fonts).
