import { submitAdLead } from '$lib/data';
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request }) => {
		const form = await request.formData();
		const business_name = String(form.get('business_name') ?? '').trim();
		const contact_name = String(form.get('contact_name') ?? '').trim();
		const phone = String(form.get('phone') ?? '').trim();
		const email = String(form.get('email') ?? '').trim();
		const paket = String(form.get('package') ?? '').trim();
		const message = String(form.get('message') ?? '').trim();

		const values = { business_name, contact_name, phone, email, package: paket, message };

		if (!business_name || !contact_name || !phone || !paket) {
			return fail(400, {
				...values,
				error: 'Mohon lengkapi nama bisnis, nama kontak, nomor telepon, dan paket.'
			});
		}

		const res = await submitAdLead({
			business_name,
			contact_name,
			phone,
			email: email || null,
			package: paket,
			message: message || null
		});

		if (!res.ok) {
			return fail(500, { ...values, error: res.error ?? 'Gagal mengirim. Coba lagi.' });
		}

		return { success: true };
	}
};
