import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

const PAGE_SIZE = 10;

export const load: PageServerLoad = async ({ locals, url }) => {
	const sb = locals.supabase;
	const type = url.searchParams.get('type') ?? '';
	const search = url.searchParams.get('q') ?? '';
	const page = Math.max(1, Number(url.searchParams.get('page') ?? '1'));
	const from = (page - 1) * PAGE_SIZE;
	const to = from + PAGE_SIZE - 1;

	if (!sb) return { places: [], type, search, page, total: 0, pageSize: PAGE_SIZE };

	let query = sb
		.from('places')
		.select('id, kode, name, type, status, lokasi, is_promo, is_featured, cover_image', { count: 'exact' })
		.order('created_at', { ascending: false })
		.range(from, to);

	if (type) query = query.eq('type', type);
	if (search) query = query.or(`name.ilike.%${search}%,kode.ilike.%${search}%,lokasi.ilike.%${search}%`);

	const { data, count } = await query;
	return {
		places: data ?? [],
		type,
		search,
		page,
		total: count ?? 0,
		pageSize: PAGE_SIZE
	};
};

export const actions: Actions = {
	delete: async ({ request, locals }) => {
		if (!locals.supabase) return fail(500, { error: 'Supabase belum dikonfigurasi.' });
		const form = await request.formData();
		const id = String(form.get('id') ?? '');
		const { data, error } = await locals.supabase
			.from('places')
			.delete()
			.eq('id', id)
			.select('id');
		if (error) {
			console.error('[delete place] gagal:', error);
			return fail(500, { error: error.message });
		}
		if (!data || data.length === 0) {
			console.error('[delete place] 0 baris terhapus (kemungkinan RLS/permission) id=', id);
			return fail(403, {
				error: 'Tidak ada baris terhapus. Pastikan kamu login sebagai admin dan policy RLS untuk DELETE sudah aktif.'
			});
		}
		return { success: true };
	}
};
