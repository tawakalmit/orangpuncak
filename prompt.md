# PROJECT BRIEF — orangpuncak.com

Bangun website media + direktori wisata bernama **orangpuncak.com** dalam
**Bahasa Indonesia** (`<html lang="id">`). Website membahas segala hal tentang
kawasan Puncak (Bogor/Cianjur): tempat wisata, villa & penginapan, kuliner,
event/peristiwa, dan tips perjalanan. Tujuan bisnis: menarik pemilik bisnis di
Puncak untuk beriklan, endorse, dan listing berbayar. Fokus konversi: arahkan
pengunjung ke WhatsApp (Booking/Konsultasi/Reservasi) dan form "Pasang Iklan".

---

## TECH STACK (WAJIB)
- Framework: **SvelteKit** (Svelte 5, TypeScript)
- Styling: **Tailwind CSS v3.4**
- Backend/DB: **Supabase** (Postgres + Auth + Storage)
- Slider/carousel: **Swiper.js** (atau embla-carousel-svelte)
- Package manager: pnpm; deployment-ready untuk Vercel
- Mobile-first, responsif penuh

---

## DESIGN SYSTEM (IKUTI PERSIS — diekstrak dari design.md Misidia)

### Palet Warna
| Token              | Hex       | Pemakaian |
|--------------------|-----------|-----------|
| Primary / Teal     | `#3E797C` | Navbar, footer, tombol utama, judul section, CTA, aksen banner |
| Background / Cream | `#FAECD9` | Background `body` seluruh halaman |
| Accent Kuning      | `#F1C40F` | Badge "Promo/Featured", bar credit footer, hover CTA |
| Accent Kuning alt  | `#F9C74F` | Tombol filter ("Filter", "Terapkan Filter") |
| Surface Putih      | `#FFFFFF` | Kartu, input form, label box judul |
| Section abu muda   | `#ecf0f1` | Background section CTA |
| Teks gelap         | `#2c3e50` | Teks pada tombol kuning & bar credit |

Konvensi: aksi/branding = teal; penanda promo/filter = kuning; hover kontras =
kuning di atas teal (`hover:bg-[#F1C40F] hover:text-black`).
Definisikan warna ini di `tailwind.config` (theme.extend.colors) sebagai token
bernama (mis. `brand`, `cream`, `accent`) — JANGAN sebar arbitrary values.

### Tipografi
- Pakai font kustom untuk perkuat identitas brand (mis. Google Fonts:
  heading "Poppins"/"Plus Jakarta Sans", body "Inter"). Muat via `@font-face`/link.
- Heading section: `text-3xl text-brand font-semibold`.
- Judul kartu: `font-bold line-clamp-2`.
- Skala responsif: `text-xs/sm` (mobile) -> `text-base/lg/xl` (desktop).

### Layout & Spacing
- Lebar konten maksimum: `max-w-[1500px] mx-auto` (banner home `max-w-[1600px]`).
- Padding horizontal: `px-4`, lepas di layar lebar (`2xl:px-0`).
- Spacing section: `py-10`; jarak antar elemen `mt-5`/`mt-10`.
- Radius: kartu `rounded-lg` (mobile) -> `rounded-2xl` (desktop);
  tombol CTA `rounded-full`; box/badge `rounded-xl`; tombol filter `rounded-md`.
- Shadow: `shadow-md` (navbar, CTA), `shadow-xl` (elemen menonjol).
- Navbar tinggi bertingkat: `h-14` -> `md:h-16` -> `xl:h-20`, `fixed top-0 z-50`,
  background teal, plus elemen spacer karena fixed.
- Breakpoint Tailwind default: grid kartu 3 kolom di `md`, 4 kolom + sidebar
  filter di `lg`.

---

## STRUKTUR HALAMAN
1. **Home (/)** — banner Swiper (rasio `aspect-[16/5]`, loop, autoplay 8s,
   pagination, lazy-load), sapaan + grid villa/wisata unggulan (8 item terbaru),
   ringkasan "Cara Booking/Reservasi", highlight artikel terbaru,
   section CTA "Eksplor" (bg `#ecf0f1`), CTA "Pasang Iklan".
2. **Wisata (/wisata)** — grid kartu + filter (kategori, lokasi) + search.
   Detail `/wisata/[slug]`: banner, breadcrumb teal, info (jam buka, HTM, lokasi),
   tips, fasilitas, gallery Swiper, embed Google Maps, "Wisata Lainnya" (carousel).
3. **Villa (/villa)** — REPLIKA PENUH FLOW MISIDIA (lihat bagian khusus di bawah).
4. **Kuliner (/kuliner)** — grid kartu + detail (sama pola, tombol WhatsApp).
5. **Artikel (/artikel)** — daftar artikel/event/berita Puncak (macet, cuaca,
   tips). Detail `/artikel/[slug]` konten rich text + share sosmed.
6. **Pasang Iklan (/iklan)** — paket kerjasama (banner, artikel sponsor, endorse
   sosmed, listing premium) + form pengajuan (simpan lead ke Supabase).
7. **Cara Booking (/cara-booking)** & **Cara Survey (/cara-survey)** — langkah-langkah.
8. **Tentang (/tentang)** & **Kontak (/kontak)**.

---

## KOMPONEN UI (reusable di src/lib/components)
- **Navbar** teal fixed: logo kiri, link kanan (Wisata, Villa, Kuliner, Artikel,
  Pasang Iklan). Mobile: hamburger -> overlay full-screen teal dengan tombol close.
  Gunakan `<button>` asli untuk kontrol (aksesibel, bukan `<img>` + onclick).
- **Footer** teal: logo + tagline, blok Kontak (link WhatsApp), sosial media,
  bar credit kuning di paling bawah.
- **Kartu (Card)** — partial TUNGGAL dipakai ulang di semua direktori
  (lihat detail di bagian Villa).
- **Button/CTA**: primary `bg-brand text-white rounded-full`; aksi detail
  `bg-brand hover:bg-[#F1C40F] hover:text-black rounded-xl`; filter
  `bg-[#F9C74F] text-[#2c3e50] rounded-md`.
- **Swiper**: banner home, gallery detail (slidesPerView 1->5 responsif, nav
  prev/next + pagination), carousel "lainnya". Override bullet aktif jadi teal.
- **SEO/Head** component: meta title/description dinamis, Open Graph.

---

## MENU VILLA — REPLIKA PENUH FLOW & FITUR MISIDIA (design.md)
Menu Villa WAJIB mereplikasi seluruh alur & fitur katalog villa Misidia.
Patuhi detail berikut persis.

### A. Halaman Eksplor Villa (/villa)
- Layout: filter + grid hasil. Desktop `lg:grid-cols-5` -> sidebar filter 1 kolom
  (kiri) + grid hasil 4 kolom. `md` = 3 kolom. Mobile = 1-2 kolom.
- **Sidebar Filter (desktop)** berisi:
  - Input pencarian (nama/kode villa)
  - Select **Lokasi**
  - Select **Jumlah Kamar**
  - Checkbox **Fasilitas**: Kolam Renang, Wifi, Billiard, AC, Tenis Meja
  - Tombol **"Terapkan Filter"** (`bg-[#F9C74F] text-[#2c3e50] rounded-md`)
- **Filter mobile**: tombol **"Filter"** membuka panel full-screen teal yang
  slide-in dari kiri (`left: -100vw` -> `left: 0`), dengan fungsi buka/tutup.
- Filtering pakai pendekatan reaktif (query Supabase ter-update saat kriteria
  berubah). CATATAN PENTING: di Misidia logika filter belum jalan — DI SINI
  filter HARUS BENAR-BENAR berfungsi (filter by lokasi, jumlah kamar, fasilitas,
  dan keyword pencarian).

### B. Kartu Villa (partial tunggal, dipakai di home, /villa, & "Villa Lainnya")
- Kontainer putih `rounded-lg`->`rounded-2xl`, gambar `aspect-[4/3] object-cover`.
- Overlay **status** kanan-bawah gambar: `disewakan` | `dijual`.
- Badge **"Promo"** kuning kiri-atas bila `is_promo`.
- Judul `line-clamp-2 font-bold`.
- **Blok harga kondisional**:
  - status `disewakan`: harga weekday & weekend (per malam). Bila promo ->
    harga normal `line-through` + harga promo.
  - status `dijual`: harga jual; bila promo -> harga coret + harga promo.

### C. Halaman Detail Villa (/villa/[kode]) — urutan section
1. **Banner**: rasio `aspect-square` (mobile) / `aspect-[10/3]` (desktop),
   overlay judul (box putih), badge Promo, baris **tombol aksi WhatsApp**:
   - status `disewakan` -> **Booking, Konsultasi, Survey**
   - status `dijual` -> **Konsultasi, Survey**
   Tombol: `bg-brand hover:bg-[#F1C40F] hover:text-black rounded-xl`.
2. **Breadcrumb** teal: Beranda -> Semua Villa -> kode villa.
3. **Harga** (kondisional sama seperti kartu, harga coret saat promo).
4. **Fasilitas Utama**: grid 2/3 kolom ikon+label, tampil kondisional per
   boolean fasilitas.
5. **Detail Villa**: list properti — kode, status, lokasi, jumlah kamar tidur,
   kamar mandi, jumlah lantai, kapasitas maksimal; khusus `dijual` tambah
   luas tanah, luas bangunan, kamar ART, SHM (pakai ikon centang/silang).
6. **Gallery**: Swiper multi-slide (slidesPerView 1->5 responsif, nav prev/next +
   pagination).
7. **Video** (opsional): embed YouTube bila field `video` tersedia.
8. **Lokasi**: embed Google Maps.
9. **Villa Lainnya**: carousel rekomendasi kartu villa (tombol panah kustom).

### D. Konversi WhatsApp
Semua aksi (Booking/Konsultasi/Survey) = deep link
`https://api.whatsapp.com/send?phone=<nomor>&text=<pesan>` dengan pesan terisi
otomatis menyertakan **kode villa**. Nomor WA dari env/config.

### E. Format Harga
Rupiah dengan pemisah ribuan titik -> contoh `Rp 1.500.000`.

### F. Field data villa (di tabel `places` type=villa, atau tabel khusus `villas`)
kode, title/name, slug, status (`disewakan`|`dijual`), lokasi, meta_title,
meta_description, video, banner, images[]/gallery[], is_promo,
harga_sewa_weekday, harga_sewa_weekend, promo_harga_sewa_weekday,
promo_harga_sewa_weekend, harga_jual, harga_promo, jumlah_kamar_tidur,
jumlah_kamar_mandi, jumlah_lantai, kapasitas_maksimal, luas_tanah,
luas_bangunan, kamar_art, shm, dan fasilitas boolean: wifi, kolam_renang,
billiard, karaoke, barbeque, ac, alat_dapur_dan_kitchen_set, gas_dan_kompor,
rice_cooker, dispenser, smart_tv, balkon, teras, halaman, living_room,
car_port, gazebo, dapur, tenis_meja.

### G. Halaman pendukung villa
- **Cara Booking (/cara-booking)** & **Cara Survey (/cara-survey)** —
  langkah-langkah, mengikuti pola Misidia.

---

## FORMAT & KONVERSI (GLOBAL)
- Harga format Rupiah: `Rp 1.500.000` (titik ribuan).
- Tombol aksi = deep link `https://api.whatsapp.com/send?phone=...&text=...`
  dengan pesan terisi otomatis menyertakan kode/nama item. Nomor WA dari env/config.
- Badge promo, harga coret saat promo, status overlay.

---

## SKEMA DATABASE SUPABASE (buat migrasi SQL + seed)
- `categories` (id, name, slug, type)  -- type: wisata|villa|kuliner
- `places` (id, kode, name, slug, category_id, type, status, description,
  content, lokasi, address, lat, lng, cover_image, gallery[], video,
  whatsapp, is_promo, is_featured,
  -- villa: harga_sewa_weekday, harga_sewa_weekend, promo_harga_sewa_weekday,
  --        promo_harga_sewa_weekend, harga_jual, harga_promo,
  --        jumlah_kamar_tidur, jumlah_kamar_mandi, jumlah_lantai, kapasitas,
  --        luas_tanah, luas_bangunan, kamar_art, shm,
  --        facilities[] (wifi, kolam_renang, ac, billiard, karaoke, bbq, dll)
  -- wisata/kuliner: jam_buka, harga_tiket/harga_range
  created_at)
- `articles` (id, title, slug, excerpt, content, cover_image, tags[],
  published_at, created_at)
- `ad_leads` (id, business_name, contact_name, phone, email, package,
  message, status, created_at)
- Aktifkan RLS: public read untuk konten published; insert publik untuk
  `ad_leads`; write hanya untuk authenticated admin.
- Seed data contoh: beberapa villa, wisata, kuliner, artikel.

---

## STRUKTUR PROYEK & DELIVERABLES
- Routing SvelteKit standar (src/routes); komponen di src/lib/components;
  supabase client di src/lib/supabaseClient.ts (env PUBLIC_SUPABASE_URL,
  PUBLIC_SUPABASE_ANON_KEY); sertakan .env.example.
- SEO: meta dinamis, sitemap.xml, schema.org (LocalBusiness untuk villa/wisata/
  kuliner, Article untuk blog), slug ramah SEO untuk keyword seperti
  "villa puncak murah", "wisata puncak", "tempat wisata di puncak".
- Aksesibilitas: pakai `<button>` untuk kontrol interaktif, `alt` gambar yang
  benar & spesifik, asosiasi label/id pada field filter, indikator fokus.
- README dengan langkah setup (install, env Supabase, migrasi/seed, dev, build).
- Hasil akhir: proyek jalan dengan `pnpm dev`, semua halaman tampil rapi dengan
  seed data.

Mulai dengan: scaffold SvelteKit + Tailwind (daftarkan token warna di config) +
muat font, buat layout (Navbar+Footer), komponen Card tunggal, lalu kerjakan
halaman per halaman. Untuk menu Villa, replikasi penuh flow Misidia sesuai
spesifikasi di atas. Konfirmasi struktur DB sebelum menulis seluruh kode.
