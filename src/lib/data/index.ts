import { supabase } from '$lib/supabaseClient';
import type {
	AdLead,
	Article,
	Place,
	PlaceType,
	VillaFilter
} from '$lib/types';
import { articles as seedArticles, places as seedPlaces } from './seed';

/**
 * Field minimum untuk menampilkan Card — hindari kolom berat seperti
 * content, harga_tiket, tips, jam_buka (HTML panjang), gallery, dsb.
 */
const CARD_SELECT = [
	'id', 'type', 'name', 'slug', 'kode',
	'cover_image', 'lokasi', 'is_promo', 'is_featured',
	'status', 'categories',
	// villa pricing (dipakai Card)
	'harga_sewa_weekday', 'harga_sewa_weekend',
	'promo_harga_sewa_weekday', 'promo_harga_sewa_weekend',
	'harga_jual', 'harga_promo',
	// wisata / kuliner info ringkas
	'harga_tiket', 'jam_buka', 'harga_range',
	'created_at'
].join(', ');

/** Terapkan filter villa pada array Place (dipakai untuk seed & sebagai pengaman). */
function applyVillaFilter(list: Place[], filter: VillaFilter): Place[] {
	return list.filter((p) => {
		if (filter.q) {
			const q = filter.q.toLowerCase();
			const hay = `${p.name} ${p.kode}`.toLowerCase();
			if (!hay.includes(q)) return false;
		}
		if (filter.lokasi && p.lokasi !== filter.lokasi) return false;
		if (filter.status && p.status !== filter.status) return false;
		if (filter.jumlah_kamar && (p.jumlah_kamar_tidur ?? 0) < filter.jumlah_kamar)
			return false;
		if (filter.facilities && filter.facilities.length) {
			for (const f of filter.facilities) {
				if (!p.facilities?.[f]) return false;
			}
		}
		return true;
	});
}

export async function getFeaturedPlaces(type?: PlaceType, limit = 8): Promise<Place[]> {
	if (supabase) {
		let query = supabase
			.from('places')
			.select(CARD_SELECT)
			.eq('is_featured', true)
			.order('created_at', { ascending: false })
			.limit(limit);
		if (type) query = query.eq('type', type);
		const { data, error } = await query;
		if (!error && data) return data as Place[];
	}
	let list = seedPlaces.filter((p) => p.is_featured);
	if (type) list = list.filter((p) => p.type === type);
	return list
		.sort((a, b) => (b.created_at ?? '').localeCompare(a.created_at ?? ''))
		.slice(0, limit);
}

export async function getLatestPlaces(type: PlaceType, limit = 8): Promise<Place[]> {
	if (supabase) {
		const { data, error } = await supabase
			.from('places')
			.select(CARD_SELECT)
			.eq('type', type)
			.order('created_at', { ascending: false })
			.limit(limit);
		if (!error && data) return data as Place[];
	}
	return seedPlaces
		.filter((p) => p.type === type)
		.sort((a, b) => (b.created_at ?? '').localeCompare(a.created_at ?? ''))
		.slice(0, limit);
}

export async function getPlaces(
	type: PlaceType,
	opts: { q?: string; category?: string; lokasi?: string } = {}
): Promise<Place[]> {
	if (supabase) {
		let query = supabase.from('places').select(CARD_SELECT).eq('type', type).eq('published', true);
		if (opts.category) query = query.contains('categories', [opts.category]);
		if (opts.lokasi) query = query.eq('lokasi', opts.lokasi);
		if (opts.q) query = query.ilike('name', `%${opts.q}%`);
		const { data, error } = await query.order('created_at', { ascending: false });
		if (!error && data) return data as Place[];
	}
	let list = seedPlaces.filter((p) => p.type === type);
	if (opts.category) list = list.filter((p) => p.category === opts.category);
	if (opts.lokasi) list = list.filter((p) => p.lokasi === opts.lokasi);
	if (opts.q) {
		const q = opts.q.toLowerCase();
		list = list.filter((p) => p.name.toLowerCase().includes(q));
	}
	return list.sort((a, b) => (b.created_at ?? '').localeCompare(a.created_at ?? ''));
}

export async function getPlacesPaginated(
	type: PlaceType,
	opts: { q?: string; category?: string; lokasi?: string; status?: string; kamar?: number; facilities?: string[]; page?: number; limit?: number } = {}
): Promise<{ places: Place[]; hasMore: boolean; total: number }> {
	const limit = opts.limit ?? 8;
	const page = opts.page ?? 0;
	const from = page * limit;
	const to = from + limit - 1;

	if (supabase) {
		let query = supabase
			.from('places')
			.select(CARD_SELECT + ', jumlah_kamar_tidur, facilities', { count: 'exact' })
			.eq('type', type)
			.eq('published', true);
		if (opts.category) query = query.contains('categories', [opts.category]);
		if (opts.lokasi) query = query.eq('lokasi', opts.lokasi);
		if (opts.q) query = query.ilike('name', `%${opts.q}%`);
		if (opts.status) query = query.eq('status', opts.status);
		if (opts.kamar) query = query.gte('jumlah_kamar_tidur', opts.kamar);
		if (opts.facilities?.length) {
			for (const f of opts.facilities) {
				query = query.eq(`facilities->>${f}`, 'true');
			}
		}
		const { data, error, count } = await query
			.order('created_at', { ascending: false })
			.range(from, to);
		if (!error && data) {
			const total = count ?? 0;
			return { places: data as Place[], hasMore: to < total - 1, total };
		}
	}

	// Fallback seed
	let list = seedPlaces.filter((p) => p.type === type);
	if (opts.category) list = list.filter((p) => p.category === opts.category);
	if (opts.lokasi) list = list.filter((p) => p.lokasi === opts.lokasi);
	if (opts.q) {
		const q = opts.q.toLowerCase();
		list = list.filter((p) => p.name.toLowerCase().includes(q));
	}
	if (opts.status) list = list.filter((p) => p.status === opts.status);
	if (opts.kamar) list = list.filter((p) => (p.jumlah_kamar_tidur ?? 0) >= opts.kamar!);
	list = list.sort((a, b) => (b.created_at ?? '').localeCompare(a.created_at ?? ''));
	const sliced = list.slice(from, to + 1);
	return { places: sliced, hasMore: to + 1 < list.length, total: list.length };
}

export async function getVillas(filter: VillaFilter = {}): Promise<Place[]> {
	if (supabase) {
		const { data, error } = await supabase
			.from('places')
			.select(CARD_SELECT)
			.eq('type', 'villa')
			.order('created_at', { ascending: false });
		if (!error && data) return applyVillaFilter(data as Place[], filter);
	}
	const list = seedPlaces
		.filter((p) => p.type === 'villa')
		.sort((a, b) => (b.created_at ?? '').localeCompare(a.created_at ?? ''));
	return applyVillaFilter(list, filter);
}

export async function getPlaceBySlug(type: PlaceType, slug: string): Promise<Place | null> {
	if (supabase) {
		const { data, error } = await supabase
			.from('places')
			.select('*')
			.eq('type', type)
			.eq('slug', slug)
			.maybeSingle();
		if (!error && data) return data as Place;
	}
	return seedPlaces.find((p) => p.type === type && p.slug === slug) ?? null;
}

export async function getVillaByKode(kode: string): Promise<Place | null> {
	if (supabase) {
		const { data, error } = await supabase
			.from('places')
			.select('*')
			.eq('type', 'villa')
			.eq('kode', kode)
			.maybeSingle();
		if (!error && data) return data as Place;
	}
	return seedPlaces.find((p) => p.type === 'villa' && p.kode === kode) ?? null;
}

export async function getRelatedVillas(slug: string, limit = 8): Promise<Place[]> {
	const all = await getVillas();
	return all.filter((p) => p.slug !== slug).slice(0, limit);
}

export async function getRelated(type: PlaceType, slug: string, limit = 8): Promise<Place[]> {
	const all = await getPlaces(type);
	return all.filter((p) => p.slug !== slug).slice(0, limit);
}

export async function getPlacesByIds(ids: string[]): Promise<Place[]> {
	if (!ids || ids.length === 0) return [];
	if (supabase) {
		const { data, error } = await supabase
			.from('places')
			.select(CARD_SELECT)
			.in('id', ids);
		if (!error && data) return data as Place[];
	}
	return seedPlaces.filter((p) => ids.includes(p.id));
}

/**
 * Ambil nearby places dengan fallback otomatis berdasarkan lokasi.
 * - Jika ids ada → pakai ids tersebut sebagai prioritas
 * - Jika ids kosong atau kurang dari `limit` → tambal dengan places
 *   bertipe sama, lokasi sama, bukan diri sendiri (excludeId)
 */
export async function getNearbyWithFallback(
	type: PlaceType,
	ids: string[] | null | undefined,
	lokasi: string | null | undefined,
	excludeId: string,
	limit = 6
): Promise<Place[]> {
	const pickedIds = ids ?? [];
	const pinned = await getPlacesByIds(pickedIds);

	// Sudah cukup dari ids
	if (pinned.length >= limit) return pinned.slice(0, limit);

	// Butuh fallback — ambil dari lokasi yang sama
	const needed = limit - pinned.length;
	const pinnedIds = new Set(pickedIds);

	if (lokasi) {
		if (supabase) {
			const { data, error } = await supabase
				.from('places')
				.select(CARD_SELECT)
				.eq('type', type)
				.eq('lokasi', lokasi)
				.eq('published', true)
				.neq('id', excludeId)
				.order('created_at', { ascending: false })
				.limit(limit + pinnedIds.size); // ambil lebih, filter duplikat di bawah
			if (!error && data) {
				const extras = (data as Place[])
					.filter((p) => !pinnedIds.has(p.id))
					.slice(0, needed);
				return [...pinned, ...extras];
			}
		}
		// Fallback seed
		const extras = seedPlaces
			.filter(
				(p) =>
					p.type === type &&
					p.lokasi === lokasi &&
					p.id !== excludeId &&
					!pinnedIds.has(p.id)
			)
			.sort((a, b) => (b.created_at ?? '').localeCompare(a.created_at ?? ''))
			.slice(0, needed);
		return [...pinned, ...extras];
	}

	return pinned;
}

/**
 * Ambil places secara acak (Fisher-Yates shuffle di server).
 * Setiap pemanggilan menghasilkan urutan berbeda → tiap reload berbeda.
 */
export async function getRandomPlaces(type: PlaceType, limit = 6): Promise<Place[]> {
	if (supabase) {
		// Ambil lebih banyak lalu acak di server, hindari ORDER BY RANDOM() yang lambat
		const { data, error } = await supabase
			.from('places')
			.select(CARD_SELECT)
			.eq('type', type)
			.eq('published', true)
			.order('created_at', { ascending: false })
			.limit(40);
		if (!error && data) {
			const arr = data as Place[];
			for (let i = arr.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				[arr[i], arr[j]] = [arr[j], arr[i]];
			}
			return arr.slice(0, limit);
		}
	}
	const arr = [...seedPlaces.filter((p) => p.type === type)];
	for (let i = arr.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[arr[i], arr[j]] = [arr[j], arr[i]];
	}
	return arr.slice(0, limit);
}

export async function getLocations(type: PlaceType): Promise<string[]> {
	const all = await getPlaces(type);
	return Array.from(new Set(all.map((p) => p.lokasi).filter(Boolean) as string[])).sort();
}

export async function getCategories(type: PlaceType): Promise<string[]> {
	const all = await getPlaces(type);
	return Array.from(new Set(all.map((p) => p.category).filter(Boolean) as string[])).sort();
}

/**
 * Ambil categories dan locations dalam satu query.
 * Menggantikan getCategories() + getLocations() secara terpisah.
 */
export async function getFilterOptions(type: PlaceType): Promise<{ categories: string[]; locations: string[] }> {
	if (supabase) {
		const { data, error } = await supabase
			.from('places')
			.select('category, lokasi')
			.eq('type', type)
			.eq('published', true);
		if (!error && data) {
			const categories = Array.from(new Set(data.map((p) => p.category).filter(Boolean) as string[])).sort();
			const locations = Array.from(new Set(data.map((p) => p.lokasi).filter(Boolean) as string[])).sort();
			return { categories, locations };
		}
	}
	const list = seedPlaces.filter((p) => p.type === type);
	const categories = Array.from(new Set(list.map((p) => p.category).filter(Boolean) as string[])).sort();
	const locations = Array.from(new Set(list.map((p) => p.lokasi).filter(Boolean) as string[])).sort();
	return { categories, locations };
}

export async function getArticles(opts: { limit?: number; page?: number; q?: string; tag?: string } = {}): Promise<{ articles: Article[]; hasMore: boolean }> {
	const limit = opts.limit ?? 6;
	const pageNum = opts.page ?? 0;
	const from = pageNum * limit;
	const to = from + limit - 1;

	if (supabase) {
		let query = supabase
			.from('articles')
			.select('id, title, slug, excerpt, cover_image, tags, published_at, created_at', { count: 'exact' })
			.order('published_at', { ascending: false });
		if (opts.q) query = query.ilike('title', `%${opts.q}%`);
		if (opts.tag) query = query.contains('tags', [opts.tag]);
		const { data, error, count } = await query.range(from, to);
		if (!error && data) {
			return { articles: data as Article[], hasMore: to < (count ?? 0) - 1 };
		}
	}
	let list = [...seedArticles].sort((a, b) =>
		(b.published_at ?? '').localeCompare(a.published_at ?? '')
	);
	if (opts.q) {
		const q = opts.q.toLowerCase();
		list = list.filter((a) => a.title.toLowerCase().includes(q) || a.excerpt?.toLowerCase().includes(q));
	}
	if (opts.tag) list = list.filter((a) => a.tags?.includes(opts.tag!));
	const sliced = list.slice(from, to + 1);
	return { articles: sliced, hasMore: to + 1 < list.length };
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
	if (supabase) {
		const { data, error } = await supabase
			.from('articles')
			.select('*')
			.eq('slug', slug)
			.maybeSingle();
		if (!error && data) return data as Article;
	}
	return seedArticles.find((a) => a.slug === slug) ?? null;
}

export async function submitAdLead(
	lead: AdLead
): Promise<{ ok: boolean; error?: string }> {
	if (supabase) {
		const { error } = await supabase.from('ad_leads').insert({
			business_name: lead.business_name,
			contact_name: lead.contact_name,
			phone: lead.phone,
			email: lead.email,
			package: lead.package,
			message: lead.message,
			status: 'new'
		});
		if (error) return { ok: false, error: error.message };
		return { ok: true };
	}
	// Tanpa Supabase: anggap sukses (mode demo). Lead di-log di server.
	console.log('[ad_lead] (mode demo, Supabase belum dikonfigurasi):', lead);
	return { ok: true };
}
