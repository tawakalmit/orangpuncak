-- ============================================================
-- orangpuncak.com — seed data contoh
-- Jalankan setelah migrasi. Gambar memakai placeholder picsum.photos.
-- ============================================================

-- ---------- categories ----------
insert into public.categories (name, slug, type) values
	('Wisata Alam', 'wisata-alam', 'wisata'),
	('Wisata Keluarga', 'wisata-keluarga', 'wisata'),
	('Villa Keluarga', 'villa-keluarga', 'villa'),
	('Villa Rombongan', 'villa-rombongan', 'villa'),
	('Sunda', 'sunda', 'kuliner'),
	('Cafe & Resto', 'cafe-resto', 'kuliner')
on conflict (slug) do nothing;

-- ---------- places: VILLA ----------
insert into public.places
	(kode, name, slug, category, type, status, description, lokasi, address, lat, lng,
	 cover_image, gallery, video, is_promo, is_featured,
	 harga_sewa_weekday, harga_sewa_weekend, promo_harga_sewa_weekday, promo_harga_sewa_weekend,
	 harga_jual, harga_promo,
	 jumlah_kamar_tidur, jumlah_kamar_mandi, jumlah_lantai, kapasitas,
	 luas_tanah, luas_bangunan, kamar_art, shm, facilities)
values
	('VP-001', 'Villa Kabut Pagi Cisarua', 'villa-kabut-pagi-cisarua', 'Villa Keluarga', 'villa', 'disewakan',
	 'Villa asri berhawa sejuk dengan kolam renang pribadi dan pemandangan kebun teh.', 'Cisarua',
	 'Jl. Raya Puncak KM 78, Cisarua, Bogor', -6.70, 106.95,
	 'https://picsum.photos/seed/villa1/1200/800',
	 array['https://picsum.photos/seed/villa1a/1200/800','https://picsum.photos/seed/villa1b/1200/800','https://picsum.photos/seed/villa1c/1200/800'],
	 'https://www.youtube.com/watch?v=ScMzIvxBSi4', true, true,
	 2500000, 3500000, 1900000, 2900000, null, null,
	 4, 3, 2, 15, null, null, null, null,
	 '{"wifi":true,"kolam_renang":true,"ac":true,"billiard":true,"barbeque":true,"karaoke":true,"smart_tv":true,"dapur":true,"tenis_meja":true,"gazebo":true,"car_port":true}'::jsonb),

	('VP-002', 'Villa Pinus Megamendung', 'villa-pinus-megamendung', 'Villa Rombongan', 'villa', 'disewakan',
	 'Villa luas untuk rombongan dengan hutan pinus di sekitarnya.', 'Megamendung',
	 'Jl. Megamendung Indah, Megamendung, Bogor', -6.66, 106.91,
	 'https://picsum.photos/seed/villa2/1200/800',
	 array['https://picsum.photos/seed/villa2a/1200/800','https://picsum.photos/seed/villa2b/1200/800'],
	 null, false, true,
	 4000000, 5500000, null, null, null, null,
	 6, 4, 2, 30, null, null, null, null,
	 '{"wifi":true,"kolam_renang":true,"ac":true,"barbeque":true,"dapur":true,"tenis_meja":true,"gazebo":true,"car_port":true}'::jsonb),

	('VP-003', 'Villa Mawar Puncak', 'villa-mawar-puncak', 'Villa Keluarga', 'villa', 'disewakan',
	 'Villa mungil cozy untuk keluarga kecil dekat Taman Bunga Nusantara.', 'Cipanas',
	 'Jl. Raya Cipanas, Cianjur', -6.74, 107.04,
	 'https://picsum.photos/seed/villa3/1200/800',
	 array['https://picsum.photos/seed/villa3a/1200/800'],
	 null, false, false,
	 1500000, 2000000, null, null, null, null,
	 2, 1, 1, 8, null, null, null, null,
	 '{"wifi":true,"ac":true,"dapur":true,"teras":true,"halaman":true}'::jsonb),

	('VP-004', 'Villa Telaga Warna', 'villa-telaga-warna', 'Villa Rombongan', 'villa', 'disewakan',
	 'Villa dengan akses dekat Telaga Warna, kolam renang air hangat.', 'Cisarua',
	 'Jl. Telaga Warna, Cisarua, Bogor', -6.70, 106.99,
	 'https://picsum.photos/seed/villa4/1200/800',
	 array['https://picsum.photos/seed/villa4a/1200/800','https://picsum.photos/seed/villa4b/1200/800'],
	 null, true, true,
	 3000000, 4200000, 2500000, 3700000, null, null,
	 5, 3, 2, 20, null, null, null, null,
	 '{"wifi":true,"kolam_renang":true,"ac":true,"karaoke":true,"billiard":true,"barbeque":true,"dapur":true,"tenis_meja":true,"car_port":true}'::jsonb),

	('VJ-101', 'Villa Investasi Puncak Pass', 'villa-investasi-puncak-pass', 'Villa Keluarga', 'villa', 'dijual',
	 'Villa siap huni dengan SHM, cocok untuk investasi atau hunian.', 'Puncak Pass',
	 'Jl. Hanjawar, Puncak Pass, Cianjur', -6.71, 107.00,
	 'https://picsum.photos/seed/villa5/1200/800',
	 array['https://picsum.photos/seed/villa5a/1200/800','https://picsum.photos/seed/villa5b/1200/800'],
	 null, true, false,
	 null, null, null, null, 3500000000, 3200000000,
	 5, 4, 2, 18, 600, 350, 1, true,
	 '{"wifi":true,"kolam_renang":true,"ac":true,"dapur":true,"car_port":true,"gazebo":true,"living_room":true}'::jsonb),

	('VJ-102', 'Villa View Gunung Gede', 'villa-view-gunung-gede', 'Villa Rombongan', 'villa', 'dijual',
	 'Villa megah dengan pemandangan Gunung Gede-Pangrango, sertifikat SHM.', 'Cipanas',
	 'Jl. Raya Cipanas, Cianjur', -6.75, 107.05,
	 'https://picsum.photos/seed/villa6/1200/800',
	 array['https://picsum.photos/seed/villa6a/1200/800','https://picsum.photos/seed/villa6b/1200/800'],
	 null, false, true,
	 null, null, null, null, 5000000000, null,
	 7, 5, 3, 25, 900, 520, 2, true,
	 '{"wifi":true,"kolam_renang":true,"ac":true,"billiard":true,"karaoke":true,"dapur":true,"car_port":true,"gazebo":true,"balkon":true}'::jsonb)
on conflict (kode) do nothing;

-- ---------- places: WISATA ----------
insert into public.places
	(kode, name, slug, category, type, description, lokasi, address, lat, lng,
	 cover_image, gallery, is_featured, jam_buka, harga_tiket, tips)
values
	('WP-001', 'Taman Safari Indonesia', 'taman-safari-indonesia', 'Wisata Keluarga', 'wisata',
	 'Kebun binatang terbuka tempat satwa berkeliaran bebas, ikon wisata Puncak.', 'Cisarua',
	 'Jl. Kapten Harun Kabir No.724, Cibeureum, Cisarua', -6.726, 106.949,
	 'https://picsum.photos/seed/wisata1/1200/800',
	 array['https://picsum.photos/seed/wisata1a/1200/800','https://picsum.photos/seed/wisata1b/1200/800'],
	 true, '09.00 - 17.00 WIB', 'Rp 200.000 - Rp 250.000', 'Datang pagi hari untuk menghindari macet dan satwa lebih aktif.'),

	('WP-002', 'Telaga Warna', 'telaga-warna', 'Wisata Alam', 'wisata',
	 'Danau alami yang airnya tampak berubah warna, dikelilingi hutan tropis.', 'Puncak Pass',
	 'Tugu Selatan, Cisarua, Bogor', -6.701, 106.988,
	 'https://picsum.photos/seed/wisata2/1200/800',
	 array['https://picsum.photos/seed/wisata2a/1200/800'],
	 true, '08.00 - 16.00 WIB', 'Rp 25.000', 'Bawa jaket, udara cukup dingin terutama pagi dan sore.'),

	('WP-003', 'Kebun Raya Cibodas', 'kebun-raya-cibodas', 'Wisata Alam', 'wisata',
	 'Kebun raya dataran tinggi dengan koleksi tanaman pegunungan yang asri.', 'Cipanas',
	 'Jl. Kebun Raya Cibodas, Cianjur', -6.744, 107.006,
	 'https://picsum.photos/seed/wisata3/1200/800',
	 array['https://picsum.photos/seed/wisata3a/1200/800'],
	 false, '07.00 - 17.00 WIB', 'Rp 15.000', 'Pakai sepatu nyaman untuk menjelajah area yang luas.'),

	('WP-004', 'Taman Bunga Nusantara', 'taman-bunga-nusantara', 'Wisata Keluarga', 'wisata',
	 'Taman tematik bunga dari berbagai negara dengan taman bergaya internasional.', 'Cipanas',
	 'Desa Kawungluwuk, Sukaresmi, Cianjur', -6.738, 107.061,
	 'https://picsum.photos/seed/wisata4/1200/800',
	 array['https://picsum.photos/seed/wisata4a/1200/800'],
	 true, '08.00 - 17.00 WIB', 'Rp 50.000', 'Sewa mobil wisata untuk berkeliling taman yang luas.')
on conflict (kode) do nothing;

-- ---------- places: KULINER ----------
insert into public.places
	(kode, name, slug, category, type, description, lokasi, address, lat, lng,
	 cover_image, gallery, is_featured, jam_buka, harga_range)
values
	('KP-001', 'Rumah Makan Sunda Cibodas', 'rumah-makan-sunda-cibodas', 'Sunda', 'kuliner',
	 'Masakan Sunda autentik dengan saung lesehan menghadap sawah.', 'Cipanas',
	 'Jl. Raya Cibodas, Cianjur', -6.742, 107.00,
	 'https://picsum.photos/seed/kuliner1/1200/800',
	 array['https://picsum.photos/seed/kuliner1a/1200/800'],
	 true, '09.00 - 21.00 WIB', 'Rp 30.000 - Rp 100.000'),

	('KP-002', 'Cafe Kabut Puncak', 'cafe-kabut-puncak', 'Cafe & Resto', 'kuliner',
	 'Cafe instagramable dengan pemandangan kebun teh dan menu western-lokal.', 'Puncak Pass',
	 'Jl. Raya Puncak Pass, Cianjur', -6.711, 107.001,
	 'https://picsum.photos/seed/kuliner2/1200/800',
	 array['https://picsum.photos/seed/kuliner2a/1200/800'],
	 true, '10.00 - 22.00 WIB', 'Rp 25.000 - Rp 80.000'),

	('KP-003', 'Sate Maranggi Puncak', 'sate-maranggi-puncak', 'Sunda', 'kuliner',
	 'Sate maranggi empuk dengan bumbu khas, favorit pelancong Puncak.', 'Cisarua',
	 'Jl. Raya Puncak, Cisarua, Bogor', -6.70, 106.94,
	 'https://picsum.photos/seed/kuliner3/1200/800',
	 array['https://picsum.photos/seed/kuliner3a/1200/800'],
	 false, '08.00 - 20.00 WIB', 'Rp 20.000 - Rp 60.000')
on conflict (kode) do nothing;

-- ---------- articles ----------
insert into public.articles (title, slug, excerpt, content, cover_image, tags, published_at)
values
	('Tips Hindari Macet Saat Liburan ke Puncak', 'tips-hindari-macet-puncak',
	 'Sistem buka-tutup (one way) dan jam padat di jalur Puncak.',
	 '<p>Jalur Puncak menerapkan sistem satu arah (one way) pada akhir pekan. Berangkatlah sebelum pukul 06.00.</p>',
	 'https://picsum.photos/seed/artikel1/1200/800', array['tips','lalu lintas'], now()),

	('Prakiraan Cuaca Puncak Akhir Pekan Ini', 'prakiraan-cuaca-puncak-akhir-pekan',
	 'Cuaca kawasan Puncak cenderung berkabut di pagi hari dan hujan ringan di sore hari.',
	 '<p>Suhu di kawasan Puncak berkisar 18-24°C. Bawalah jaket dan payung.</p>',
	 'https://picsum.photos/seed/artikel2/1200/800', array['cuaca','info'], now()),

	('7 Spot Foto Terbaik di Kawasan Puncak', '7-spot-foto-terbaik-puncak',
	 'Dari kebun teh Gunung Mas hingga cafe estetik, ini daftar spot foto wajib di Puncak.',
	 '<p>Kebun Teh Gunung Mas, Telaga Warna, dan deretan cafe di Puncak Pass menawarkan latar foto memukau.</p>',
	 'https://picsum.photos/seed/artikel3/1200/800', array['wisata','foto'], now())
on conflict (slug) do nothing;
