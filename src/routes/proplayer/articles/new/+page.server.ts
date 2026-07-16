import { parseArticleForm, validateArticle } from '$lib/server/articles';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const sb = locals.supabase;
	if (!sb) return { allPlaces: [] };
	const { data: places } = await sb
		.from('places')
		.select('id, name, type')
		.order('name', { ascending: true });
	return { allPlaces: places ?? [] };
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		if (!locals.supabase) return fail(500, { error: 'Supabase belum dikonfigurasi.' });
		const form = await request.formData();
		const record = parseArticleForm(form);
		const invalid = validateArticle(record);
		if (invalid) return fail(400, { error: invalid });

		const { error } = await locals.supabase.from('articles').insert(record);
		if (error) return fail(500, { error: error.message });

		throw redirect(303, '/proplayer/articles');
	}
};
