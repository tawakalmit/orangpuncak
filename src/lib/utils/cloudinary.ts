import { env } from '$env/dynamic/public';

export const CLOUDINARY_CLOUD_NAME = env.PUBLIC_CLOUDINARY_CLOUD_NAME ?? '';
export const CLOUDINARY_UPLOAD_PRESET = env.PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? '';
export const cloudinaryConfigured = !!CLOUDINARY_CLOUD_NAME && !!CLOUDINARY_UPLOAD_PRESET;

export interface CloudinaryResult {
	secure_url: string;
	public_id: string;
	width: number;
	height: number;
}

/**
 * Sisipkan transformasi Cloudinary ke dalam URL (setelah `/upload/`).
 * Mengembalikan URL apa adanya bila bukan URL Cloudinary (mis. seed picsum/eksternal).
 */
export function cldTransform(url: string | null | undefined, transform: string): string {
	if (!url) return '';
	const marker = '/upload/';
	const idx = url.indexOf(marker);
	if (idx === -1) return url; // bukan URL Cloudinary, biarkan apa adanya
	const start = idx + marker.length;
	const rest = url.slice(start);
	// hindari menumpuk transformasi yang identik
	if (rest.startsWith(transform + '/')) return url;
	return url.slice(0, start) + transform + '/' + rest;
}

/** Thumbnail untuk kartu/grid/daftar (rasio 4:3). */
export function imgThumb(url: string | null | undefined): string {
	return cldTransform(url, 'c_fill,g_auto,w_600,h_450,f_auto,q_auto');
}

/** Thumbnail kecil (strip galeri). */
export function imgThumbSm(url: string | null | undefined): string {
	return cldTransform(url, 'c_fill,g_auto,w_500,h_375,f_auto,q_auto');
}

/** Gambar besar teroptimasi (banner/cover) tanpa crop paksa. */
export function imgCover(url: string | null | undefined): string {
	return cldTransform(url, 'w_1600,f_auto,q_auto');
}

/**
 * Upload sebuah file ke Cloudinary memakai unsigned upload preset.
 * Mengembalikan secure_url yang siap disimpan ke database.
 */
export async function uploadToCloudinary(file: File): Promise<CloudinaryResult> {
	if (!cloudinaryConfigured) {
		throw new Error(
			'Cloudinary belum dikonfigurasi. Isi PUBLIC_CLOUDINARY_CLOUD_NAME & PUBLIC_CLOUDINARY_UPLOAD_PRESET di .env'
		);
	}

	const formData = new FormData();
	formData.append('file', file);
	formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

	const res = await fetch(
		`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
		{ method: 'POST', body: formData }
	);

	if (!res.ok) {
		const err = await res.json().catch(() => ({}));
		throw new Error(err?.error?.message ?? 'Upload ke Cloudinary gagal.');
	}

	return (await res.json()) as CloudinaryResult;
}
