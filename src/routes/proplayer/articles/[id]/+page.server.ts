import { parseArticleForm, validateArticle } from '$lib/server/articles';
import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	if (!locals.supabase) throw error(500, 'Supabase belum dikonfigurasi.');
	const { data, error: err } = await locals.supabase
		.from('articles')
		.select('*')
		.eq('id', params.id)
		.maybeSingle();
	if (err || !data) throw error(404, 'Artikel tidak ditemukan');

	const { data: places } = await locals.supabase
		.from('places')
		.select('id, name, type')
		.order('name', { ascending: true });

	return { article: data, allPlaces: places ?? [] };
};

export const actions: Actions = {
	update: async ({ request, locals, params }) => {
		if (!locals.supabase) return fail(500, { error: 'Supabase belum dikonfigurasi.' });
		const form = await request.formData();
		const record = parseArticleForm(form);
		const invalid = validateArticle(record);
		if (invalid) return fail(400, { error: invalid });

		const { error: err } = await locals.supabase.from('articles').update(record).eq('id', params.id);
		if (err) return fail(500, { error: err.message });

		throw redirect(303, '/proplayer/articles');
	},
	delete: async ({ locals, params }) => {
		if (!locals.supabase) return fail(500, { error: 'Supabase belum dikonfigurasi.' });
		const { error: err } = await locals.supabase.from('articles').delete().eq('id', params.id);
		if (err) return fail(500, { error: err.message });
		throw redirect(303, '/proplayer/articles');
	}
};
