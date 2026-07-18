import { json, error } from '@sveltejs/kit';
import { createHmac, randomUUID } from 'crypto';
import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';

/**
 * GET /api/imagekit-auth
 *
 * Mengembalikan { token, expire, signature } yang dibutuhkan
 * untuk client-side upload ke ImageKit.
 *
 * Private key TIDAK pernah dikirim ke browser — hanya signature-nya.
 * Route ini hanya bisa dipanggil oleh user yang sudah login (admin).
 */
export const GET: RequestHandler = async ({ locals }) => {
	// Hanya izinkan user yang sudah terautentikasi (admin panel)
	const user = await locals.getUser();
	if (!user) {
		throw error(401, 'Unauthorized');
	}

	const privateKey = env.IMAGEKIT_PRIVATE_KEY ?? '';
	if (!privateKey) {
		throw error(500, 'ImageKit private key belum dikonfigurasi di server.');
	}

	const token = randomUUID();
	// Expire 30 menit dari sekarang — cukup untuk upload, hindari clock skew
	const expire = Math.floor(Date.now() / 1000) + 1800;
	const signature = createHmac('sha1', privateKey)
		.update(token + expire)
		.digest('hex');

	return json({ token, expire, signature });
};
