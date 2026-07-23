import { fail } from '@sveltejs/kit';
import { env as privateEnv } from '$env/dynamic/private';
import type { Actions } from './$types';

const RECAPTCHA_SECRET = privateEnv.RECAPTCHA_SECRET_KEY ?? '';
/** Skor minimum reCAPTCHA v3 yang diterima (0.0 = bot, 1.0 = manusia) */
const RECAPTCHA_MIN_SCORE = 0.5;

async function verifyRecaptcha(token: string): Promise<{ ok: boolean; score?: number }> {
	if (!RECAPTCHA_SECRET) {
		// Secret key belum dikonfigurasi — lewati verifikasi (mode dev)
		console.warn('[recaptcha] RECAPTCHA_SECRET_KEY belum diset, verifikasi dilewati.');
		return { ok: true };
	}

	const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: new URLSearchParams({ secret: RECAPTCHA_SECRET, response: token })
	});

	const data = await res.json();
	if (!data.success) return { ok: false };
	if (data.score < RECAPTCHA_MIN_SCORE) return { ok: false, score: data.score };
	return { ok: true, score: data.score };
}

export const actions: Actions = {
	default: async ({ request, locals, getClientAddress }) => {
		const ip = getClientAddress();
		const form = await request.formData();

		// Honeypot anti-spam: field tersembunyi, bot biasanya mengisi ini
		const honeypot = String(form.get('website') ?? '').trim();
		if (honeypot) {
			return { success: true }; // pura-pura sukses agar bot tidak tahu
		}

		const nama = String(form.get('nama') ?? '').trim();
		const pesan = String(form.get('pesan') ?? '').trim();
		const recaptchaToken = String(form.get('recaptcha_token') ?? '').trim();

		if (!nama || !pesan) {
			return fail(400, { nama, pesan, error: 'Nama dan pesan wajib diisi.' });
		}

		if (nama.length > 100) {
			return fail(400, { nama, pesan, error: 'Nama terlalu panjang (maks 100 karakter).' });
		}

		if (pesan.length > 2000) {
			return fail(400, { nama, pesan, error: 'Pesan terlalu panjang (maks 2000 karakter).' });
		}

		// Verifikasi reCAPTCHA v3
		if (!recaptchaToken) {
			return fail(400, { nama, pesan, error: 'Verifikasi gagal. Muat ulang halaman dan coba lagi.' });
		}

		const captcha = await verifyRecaptcha(recaptchaToken);
		if (!captcha.ok) {
			return fail(400, { nama, pesan, error: 'Verifikasi bot gagal. Coba lagi.' });
		}

		const sb = locals.supabase;
		if (!sb) {
			console.log('[contact_message] (demo):', { nama, pesan, ip });
			return { success: true };
		}

		const { error } = await sb.from('contact_messages').insert({
			nama,
			pesan,
			ip_address: ip,
			status: 'new'
		});

		if (error) {
			return fail(500, { nama, pesan, error: 'Gagal mengirim pesan. Silakan coba lagi.' });
		}

		return { success: true };
	}
};
