import { parseArticleForm, validateArticle } from '$lib/server/articles';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request, locals }) => {
		if (!locals.supabase) return fail(500, { error: 'Supabase belum dikonfigurasi.' });
		const form = await request.formData();
		const record = parseArticleForm(form);
		const invalid = validateArticle(record);
		if (invalid) return fail(400, { error: invalid });

		const { error } = await locals.supabase.from('articles').insert(record);
		if (error) return fail(500, { error: error.message });

		throw redirect(303, '/admin/articles');
	}
};
