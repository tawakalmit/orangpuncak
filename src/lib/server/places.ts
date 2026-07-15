import type { VillaFacilities } from '$lib/types';

const FACILITY_KEYS: (keyof VillaFacilities)[] = [
	'wifi',
	'kolam_renang',
	'billiard',
	'karaoke',
	'barbeque',
	'ac',
	'alat_dapur_dan_kitchen_set',
	'gas_dan_kompor',
	'rice_cooker',
	'dispenser',
	'smart_tv',
	'balkon',
	'teras',
	'halaman',
	'living_room',
	'car_port',
	'gazebo',
	'dapur',
	'tenis_meja'
];

function num(v: FormDataEntryValue | null): number | null {
	if (v === null || v === '') return null;
	const n = Number(v);
	return isNaN(n) ? null : n;
}

function str(v: FormDataEntryValue | null): string | null {
	const s = String(v ?? '').trim();
	return s === '' ? null : s;
}

/** Ekstrak src dari tag <iframe> Google Maps. Kalau sudah berupa URL langsung, kembalikan as-is. */
function extractEmbedSrc(val: string | null): string | null {
	if (!val) return null;
	// Kalau sudah berupa URL (bukan tag iframe)
	if (val.startsWith('http')) return val;
	// Ekstrak src="..." dari tag iframe
	const match = val.match(/src=["']([^"']+)["']/i);
	return match ? match[1] : val;
}

export function slugify(input: string): string {
	return input
		.toLowerCase()
		.replace(/[^a-z0-9\s-]/g, '')
		.trim()
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-');
}

/** Bangun record `places` dari FormData (dipakai create & update). */
export function parsePlaceForm(form: FormData) {
	const type = String(form.get('type') ?? 'wisata');
	const name = String(form.get('name') ?? '').trim();
	const slugInput = str(form.get('slug'));

	const facilities: Record<string, boolean> = {};
	for (const k of FACILITY_KEYS) {
		if (form.get(`facility_${k}`) === 'on') facilities[k] = true;
	}

	const gallery = form.getAll('gallery').map((g) => String(g)).filter(Boolean);

	const record: Record<string, unknown> = {
		type,
		name,
		slug: slugInput ? slugify(slugInput) : slugify(name),
		kode: str(form.get('kode')),
		meta_title: str(form.get('meta_title')),
		categories: form.getAll('categories').map((v) => String(v)).filter(Boolean),
		status: type === 'villa' ? str(form.get('status')) : null,
		description: str(form.get('description')),
		content: str(form.get('content')),
		lokasi: str(form.get('lokasi')),
		address: str(form.get('address')),
		lat: num(form.get('lat')),
		lng: num(form.get('lng')),
		cover_image: str(form.get('cover_image')),
		gallery,
		video: str(form.get('video')),
		whatsapp: str(form.get('whatsapp')),
		gmaps_url: str(form.get('gmaps_url')),
		gmaps_embed: extractEmbedSrc(str(form.get('gmaps_embed'))),
		is_promo: form.get('is_promo') === 'on',
		is_featured: form.get('is_featured') === 'on',
		published: form.getAll('published').includes('on'),
		jam_buka: str(form.get('jam_buka')),
		harga_tiket: str(form.get('harga_tiket')),
		harga_range: str(form.get('harga_range')),
		tips: str(form.get('tips')),
		nearby_villa_ids: form.getAll('nearby_villa_ids').map((v) => String(v)).filter(Boolean),
		nearby_wisata_ids: form.getAll('nearby_wisata_ids').map((v) => String(v)).filter(Boolean),
		nearby_kuliner_ids: form.getAll('nearby_kuliner_ids').map((v) => String(v)).filter(Boolean)
	};

	if (type === 'villa') {
		Object.assign(record, {
			harga_sewa_weekday: num(form.get('harga_sewa_weekday')),
			harga_sewa_weekend: num(form.get('harga_sewa_weekend')),
			promo_harga_sewa_weekday: num(form.get('promo_harga_sewa_weekday')),
			promo_harga_sewa_weekend: num(form.get('promo_harga_sewa_weekend')),
			harga_jual: num(form.get('harga_jual')),
			harga_promo: num(form.get('harga_promo')),
			jumlah_kamar_tidur: num(form.get('jumlah_kamar_tidur')),
			jumlah_kamar_mandi: num(form.get('jumlah_kamar_mandi')),
			jumlah_lantai: num(form.get('jumlah_lantai')),
			kapasitas: num(form.get('kapasitas')),
			luas_tanah: num(form.get('luas_tanah')),
			luas_bangunan: num(form.get('luas_bangunan')),
			kamar_art: num(form.get('kamar_art')),
			shm: form.get('shm') === 'on',
			facilities
		});
	}

	return record;
}

export function validatePlace(record: Record<string, unknown>): string | null {
	if (!record.name) return 'Nama wajib diisi.';
	if (!record.type) return 'Tipe wajib dipilih.';
	if (record.type === 'villa' && !record.kode) return 'Kode villa wajib diisi.';
	if (record.type === 'villa' && !record.status) return 'Status villa wajib dipilih.';
	return null;
}
