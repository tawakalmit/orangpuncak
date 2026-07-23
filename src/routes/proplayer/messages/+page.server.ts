import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.supabase) return { messages: [] };

	const { data } = await locals.supabase
		.from('contact_messages')
		.select('*')
		.order('created_at', { ascending: false });

	return { messages: data ?? [] };
};

export const actions: Actions = {
	updateStatus: async ({ request, locals }) => {
		if (!locals.supabase) return fail(500, { error: 'Supabase belum dikonfigurasi.' });

		const form = await request.formData();
		const id = String(form.get('id') ?? '');
		const status = String(form.get('status') ?? 'new');

		const { error } = await locals.supabase
			.from('contact_messages')
			.update({ status })
			.eq('id', id);

		if (error) return fail(500, { error: error.message });
		return { success: true };
	},

	delete: async ({ request, locals }) => {
		if (!locals.supabase) return fail(500, { error: 'Supabase belum dikonfigurasi.' });

		const form = await request.formData();
		const id = String(form.get('id') ?? '');

		const { error } = await locals.supabase
			.from('contact_messages')
			.delete()
			.eq('id', id);

		if (error) return fail(500, { error: error.message });
		return { success: true };
	}
};
