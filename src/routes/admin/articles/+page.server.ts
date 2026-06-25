import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.supabase) return { articles: [] };
	const { data } = await locals.supabase
		.from('articles')
		.select('id, title, slug, published_at')
		.order('published_at', { ascending: false });
	return { articles: data ?? [] };
};

export const actions: Actions = {
	delete: async ({ request, locals }) => {
		if (!locals.supabase) return fail(500, { error: 'Supabase belum dikonfigurasi.' });
		const form = await request.formData();
		const id = String(form.get('id') ?? '');
		const { data, error } = await locals.supabase
			.from('articles')
			.delete()
			.eq('id', id)
			.select('id');
		if (error) {
			console.error('[delete article] gagal:', error);
			return fail(500, { error: error.message });
		}
		if (!data || data.length === 0) {
			console.error('[delete article] 0 baris terhapus (kemungkinan RLS/permission) id=', id);
			return fail(403, {
				error: 'Tidak ada baris terhapus. Pastikan kamu login sebagai admin dan policy RLS untuk DELETE sudah aktif.'
			});
		}
		return { success: true };
	}
};
