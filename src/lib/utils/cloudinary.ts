import { env } from '$env/dynamic/public';

export const CLOUDINARY_CLOUD_NAME = env.PUBLIC_CLOUDINARY_CLOUD_NAME ?? '';
export const CLOUDINARY_UPLOAD_PRESET = env.PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? '';
export const cloudinaryConfigured = !!CLOUDINARY_CLOUD_NAME && !!CLOUDINARY_UPLOAD_PRESET;

/** Placeholder SVG data-URI untuk item tanpa cover image. */
export const PLACEHOLDER_IMAGE =
	"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='450' viewBox='0 0 600 450'%3E%3Crect width='600' height='450' fill='%23e8f0f0'/%3E%3Crect x='240' y='160' width='120' height='90' rx='8' fill='%23b0cece'/%3E%3Ccircle cx='270' cy='185' r='14' fill='%23e8f0f0'/%3E%3Cpolygon points='240,250 300,190 360,250' fill='%23b0cece'/%3E%3Cpolygon points='280,250 330,210 380,250' fill='%2390b8b8'/%3E%3Ctext x='300' y='310' text-anchor='middle' font-family='sans-serif' font-size='18' fill='%2390b8b8'%3EBelum ada foto%3C%2Ftext%3E%3C%2Fsvg%3E";

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
	if (!url) return PLACEHOLDER_IMAGE;
	return cldTransform(url, 'c_fill,g_auto,w_600,h_450,f_auto,q_auto');
}

/** Thumbnail kecil (strip galeri). */
export function imgThumbSm(url: string | null | undefined): string {
	if (!url) return PLACEHOLDER_IMAGE;
	return cldTransform(url, 'c_fill,g_auto,w_500,h_375,f_auto,q_auto');
}

/** Gambar besar teroptimasi (banner/cover) tanpa crop paksa. */
export function imgCover(url: string | null | undefined): string {
	if (!url) return PLACEHOLDER_IMAGE;
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
