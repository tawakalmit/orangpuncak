# Design Document — orangpuncak.com (Design System diadaptasi dari tema `misidiav2`)

Dokumen ini mendeskripsikan sistem desain UI front-end yang akan dipakai untuk
website **orangpuncak.com**. Design token (warna, layout, pola komponen)
diekstrak dari tema `themes/misidiav2` (proyek Misidia/Ambarwati Property) dan
dipakai sebagai acuan tampilan. Nama brand diabaikan — yang diambil hanya
desain tampilannya.

---

## 1. Tech Stack UI (target orangpuncak.com)

| Lapisan | Teknologi |
|---|---|
| Framework | SvelteKit (Svelte 5, TypeScript) |
| Styling | Tailwind CSS v3.4 |
| Slider | Swiper.js |
| Backend/DB | Supabase (Postgres + Auth + Storage) |
| Build/Deploy | pnpm, Vercel |

Bahasa antarmuka: **Bahasa Indonesia** (`<html lang="id">`).

---

## 2. Design Tokens

### 2.1 Palet Warna

| Token | Hex | Penggunaan |
|---|---|---|
| Primary / Teal | `#3E797C` | Navbar, footer, tombol utama, judul section, CTA, banner aksen |
| Background / Cream | `#FAECD9` | Background `body` di seluruh halaman |
| Accent / Kuning | `#F1C40F` | Badge "Promo", bar credit footer, hover CTA |
| Accent alt / Kuning | `#F9C74F` | Tombol filter ("Filter", "Terapkan Filter") |
| Surface / Putih | `#FFFFFF` | Kartu, input form, label box judul |
| Section abu muda | `#ecf0f1` | Background section CTA |
| Teks gelap | `#2c3e50` | Teks pada tombol kuning & bar credit |

Konvensi: aksi/branding = teal `#3E797C`; penanda promo & filter = kuning;
teks/hover kontras = kuning di atas teal.
Disarankan: definisikan warna di `tailwind.config.js` (`theme.extend.colors`),
bukan arbitrary values berulang.

### 2.2 Tipografi
- Disarankan tambah font kustom (Google Fonts) untuk perkuat identitas brand,
  mis. heading "Poppins"/"Plus Jakarta Sans", body "Inter".
- Heading section: `text-3xl text-[#3E797C] font-semibold`.
- Judul kartu: `font-bold` dengan `line-clamp-2`.
- Body: `text-xs/sm` di mobile naik ke `text-base/lg/xl` di desktop.

### 2.3 Layout & Spacing
- Lebar konten maksimum: `max-w-[1500px] mx-auto` (banner home `max-w-[1600px]`).
- Padding horizontal standar: `px-4`, dilepas (`2xl:px-0`) di layar sangat lebar.
- Spacing vertikal section: `py-10`, jarak antar elemen `mt-5` / `mt-10`.
- Radius: kartu `rounded-lg` (mobile) -> `rounded-2xl` (desktop); tombol CTA
  `rounded-full`; box/badge `rounded-xl`; tombol filter `rounded-md`.
- Shadow: `shadow-md` (navbar, CTA), `shadow-xl` (elemen menonjol di banner detail).

### 2.4 Breakpoint Responsif (Tailwind default)

| Prefix | Min width | Catatan pemakaian |
|---|---|---|
| (base) | 0 | Mobile-first |
| `sm` | 640px | Penyesuaian Swiper |
| `md` | 768px | Grid kartu 3 kolom, layout footer baris |
| `lg` | 1024px | Menu desktop muncul, sidebar filter muncul, grid 4 kolom |
| `xl` | 1280px | Pembesaran tipografi & navbar |
| `2xl` | 1536px | Lepas padding horizontal |

Tinggi navbar bertingkat: `h-14` (mobile) -> `md:h-16` -> `xl:h-20`.

---

## 3. Komponen UI

### 3.1 Navigation Bar
- Bar `fixed top-0 z-50`, background teal, logo kiri + link kanan.
- Link desktop (`hidden lg:flex`): Wisata, Villa, Kuliner, Artikel, Pasang Iklan.
- Mobile: hamburger membuka overlay full-screen teal dengan tombol close.
- Spacer element karena navbar fixed.
- Gunakan elemen `<button>` untuk kontrol (aksesibilitas).

### 3.2 Footer
- Background teal, logo + tagline, blok Kontak dengan link WhatsApp, sosial media.
- Bar credit kuning di paling bawah.

### 3.3 Kartu (pola berulang — buat partial tunggal)
- Kontainer putih, gambar `aspect-[4/3] object-cover`.
- Overlay status kanan-bawah gambar.
- Badge "Promo" kuning kiri-atas jika `is_promo`.
- Judul `line-clamp-2 font-bold`.
- Blok harga kondisional (lihat detail menu Villa di PROMPT.md).

### 3.4 Tombol / CTA
- Primary: `bg-[#3E797C] text-white rounded-full`.
- Aksi detail: `bg-[#3E797C]` hover `bg-[#F1C40F] hover:text-black`, `rounded-xl`.
- Filter: `bg-[#F9C74F] text-[#2c3e50] rounded-md`.

### 3.5 Slider/Carousel (Swiper)
- Home banner: rasio `aspect-[16/5]`, loop, autoplay 8s, pagination, lazy-load.
- Gallery detail: slidesPerView responsif 1->5, navigasi prev/next + pagination.
- "Lainnya": carousel kartu dengan tombol panah kustom.
- Override bullet aktif memakai warna teal.

### 3.6 Filter (menu Villa)
- Desktop: sidebar kiri (`lg:grid-cols-5`, sidebar 1 kolom + grid hasil 4 kolom):
  input pencarian, select Lokasi, select Jumlah Kamar, checkbox Fasilitas
  (Kolam Renang, Wifi, Billiard, AC, Tenis Meja), tombol "Terapkan Filter".
- Mobile: tombol "Filter" membuka panel full-screen teal slide-in dari kiri
  (`left: -100vw` -> `left: 0`).
- PENTING: logika filter HARUS benar-benar berfungsi (di tema asli Misidia
  belum diterapkan).

---

## 4. Catatan
- Spesifikasi flow lengkap menu Villa (replika penuh Misidia) ada di `PROMPT.md`.
- Aksesibilitas: gunakan `<button>`, `alt` gambar yang spesifik & benar,
  asosiasi label/id pada field filter, indikator fokus kustom.
