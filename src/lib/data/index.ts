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
		let query = supabase.from('places').select(CARD_SELECT).eq('type', type);
		if (opts.category) query = query.eq('category', opts.category);
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

export async function getRelatedVillas(kode: string, limit = 8): Promise<Place[]> {
	const all = await getVillas();
	return all.filter((p) => p.kode !== kode).slice(0, limit);
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

export async function getLocations(type: PlaceType): Promise<string[]> {
	const all = await getPlaces(type);
	return Array.from(new Set(all.map((p) => p.lokasi).filter(Boolean) as string[])).sort();
}

export async function getCategories(type: PlaceType): Promise<string[]> {
	const all = await getPlaces(type);
	return Array.from(new Set(all.map((p) => p.category).filter(Boolean) as string[])).sort();
}

export async function getArticles(limit?: number): Promise<Article[]> {
	if (supabase) {
		let query = supabase
			.from('articles')
			.select('id, title, slug, excerpt, cover_image, tags, published_at, created_at')
			.order('published_at', { ascending: false });
		if (limit) query = query.limit(limit);
		const { data, error } = await query;
		if (!error && data) return data as Article[];
	}
	const list = [...seedArticles].sort((a, b) =>
		(b.published_at ?? '').localeCompare(a.published_at ?? '')
	);
	return limit ? list.slice(0, limit) : list;
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
